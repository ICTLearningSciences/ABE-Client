/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import axios, {
  AxiosRequestConfig,
  Method,
  AxiosResponse,
  CancelToken,
} from 'axios';
import {
  CreateGoogleDocResponse,
  DocData,
  DocVersion,
  UserDoc,
  GoogleDocTextModifyActions,
  NewDocData,
  UserAccessToken,
  UserActions,
  GQLPrompt,
  GQLResPrompts,
  Config,
  Connection,
  AiPromptStep,
  GQLDocumentTimeline,
  DocumentTimelineJobStatus,
  StoreUserDoc,
  ActivityGQL,
  AiServiceModel,
  DocGoalGQl,
  User,
  UpdateUserInfo,
  IGDocVersion,
  DocService,
} from '../types';
import { AxiosMiddleware } from './axios-middlewares';
import { ACCESS_TOKEN_KEY, localStorageGet } from '../store/local-storage';
import { addQueryParam } from '../helpers';
import { isBulletPointMessage } from '../store/slices/chat/helpers';
import { activityQueryData, promptQueryData } from './api-helpers';
import { omit } from 'lodash';
import { OpenAiServiceJobStatusResponseType } from '../ai-services/open-ai-service';

const API_ENDPOINT = process.env.REACT_APP_GOOGLE_API_ENDPOINT || '/docs';
const GRAPHQL_ENDPOINT =
  process.env.REACT_APP_GRAPHQL_ENDPOINT || '/graphql/graphql';

const REQUEST_TIMEOUT_GRAPHQL_DEFAULT = 30000;

// https://github.com/axios/axios/issues/4193#issuecomment-1158137489
interface MyAxiosRequestConfig extends Omit<AxiosRequestConfig, 'headers'> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  headers?: any; // this was "any" at v0.21.1 but now broken between 0.21.4 >= 0.27.2
}

interface GQLQuery {
  query: string; // the query string passed to graphql, which should be a static query
  variables?: Record<string, unknown>; // variables (if any) for the static query
}

interface HttpRequestConfig {
  accessToken?: string; // bearer-token http auth
  axiosConfig?: MyAxiosRequestConfig; // any axios config for the request
  axiosMiddleware?: AxiosMiddleware; // used (for example) to extract accessToken from response headers
  /**
   * When set, will use this prop (or array of props) to extract return data from a json response, e.g.
   *
   * dataPath: ["foo", "bar"]
   *
   * // will extract "barvalue" for the return
   * { "foo": { "bar": "barvalue" } }
   */
  dataPath?: string | string[];
}

async function execHttp<T>(
  method: Method,
  query: string,
  opts?: HttpRequestConfig
): Promise<T> {
  const optsEffective: HttpRequestConfig = opts || {};
  const axiosConfig = opts?.axiosConfig || {};
  const axiosInst = axios.create();
  if (optsEffective.axiosMiddleware) {
    optsEffective.axiosMiddleware(axiosInst);
  }
  const result = await axiosInst.request({
    url: query,
    method: method,
    ...axiosConfig,
    headers: {
      ...(axiosConfig.headers || {}), // if any headers passed in opts, include them
      ...(optsEffective && optsEffective.accessToken // if accessToken passed in opts, add auth to headers
        ? { Authorization: `bearer ${optsEffective.accessToken}` }
        : {}),
    },
  });
  return getDataFromAxiosResponse(result, optsEffective.dataPath || []);
}

export function throwErrorsInAxiosResponse(res: AxiosResponse): void {
  if (!(res.status >= 200 && res.status <= 299)) {
    throw new Error(`http request failed: ${res.data}`);
  }
  if (res.data.errors) {
    throw new Error(`errors in response: ${JSON.stringify(res.data.errors)}`);
  }
}

function getDataFromAxiosResponse(res: AxiosResponse, path: string | string[]) {
  throwErrorsInAxiosResponse(res);
  let data = res.data.data;
  if (!data) {
    throw new Error(`no data in reponse: ${JSON.stringify(res.data)}`);
  }
  const dataPath = Array.isArray(path)
    ? path
    : typeof path === 'string'
    ? [path]
    : [];
  dataPath.forEach((pathPart) => {
    if (!data) {
      throw new Error(
        `unexpected response data shape for dataPath ${JSON.stringify(
          dataPath
        )} and request ${res.request} : ${res.data}`
      );
    }
    data = data[pathPart];
  });
  return data;
}

export async function execGql<T>(
  query: GQLQuery,
  opts?: HttpRequestConfig
): Promise<T> {
  return execHttp<T>('POST', GRAPHQL_ENDPOINT, {
    // axiosMiddleware: applyAppTokenRefreshInterceptor,
    ...(opts || {}),
    axiosConfig: {
      timeout: REQUEST_TIMEOUT_GRAPHQL_DEFAULT, // default timeout can be overriden by passed-in config
      ...(opts?.axiosConfig || {}),
      data: query,
    },
  });
}

/**
 * Create a new google doc
 * @returns {string} docId of the new google doc
 */
export async function createNewDoc(
  userId: string,
  userEmail?: string,
  docId?: string,
  title?: string,
  isAdminDoc?: boolean
): Promise<NewDocData> {
  const accessToken = localStorageGet(ACCESS_TOKEN_KEY) || '';
  if (!accessToken) throw new Error('No access token');
  let url = `${API_ENDPOINT}/create_google_doc`;
  url = addQueryParam(url, 'userId', userId);
  if (userEmail) {
    url = addQueryParam(url, 'emails', userEmail);
  }
  if (docId) {
    url = addQueryParam(url, 'copyFromDocId', docId);
  }
  if (title) {
    url = addQueryParam(url, 'newDocTitle', title);
  }
  if (isAdminDoc) {
    url = addQueryParam(url, 'isAdminDoc', isAdminDoc ? 'true' : 'false');
  }

  const res = await axios.post<CreateGoogleDocResponse>(
    url,
    {},
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return res.data.data;
}

export async function docTextAction(
  docId: string,
  textToHighlight: string,
  action: GoogleDocTextModifyActions,
  insertAfterText?: string
): Promise<void> {
  const accessToken = localStorageGet(ACCESS_TOKEN_KEY);
  await axios.get<void>(
    `${API_ENDPOINT}/google_doc_text_modify/?docId=${docId}&text=${textToHighlight}&action=${action}&insertAfterText=${insertAfterText}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return;
}

export async function getDocData(
  docId: string,
  docService: DocService
): Promise<DocData> {
  const accessToken = localStorageGet(ACCESS_TOKEN_KEY);
  const res = await axios.get<DocData>(
    `${API_ENDPOINT}/get_doc_data/${docId}/${docService}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return res.data;
}

export async function submitDocVersion(docVersion: DocVersion): Promise<void> {
  const accessToken = localStorageGet(ACCESS_TOKEN_KEY) || '';
  return await execGql<void>(
    {
      query: `
        mutation SubmitDocVersion($googleDocData: GDocVersionInputType!) {
          submitGoogleDocVersion(googleDocData: $googleDocData) {
            docId
            plainText
            markdownText
            lastChangedId
            chatLog {
              sender
              message
              displayType
              bulletPoints
            }
            activity
            intent
            title
            lastModifyingUser
            modifiedTime
          }
        }
      `,
      variables: {
        googleDocData: {
          ...docVersion,
          dayIntention: docVersion.dayIntention
            ? {
                description: docVersion.dayIntention.description,
              }
            : undefined,
          sessionIntention: docVersion.sessionIntention
            ? {
                description: docVersion.sessionIntention.description,
              }
            : undefined,
          documentIntention: docVersion.documentIntention
            ? {
                description: docVersion.documentIntention.description,
              }
            : undefined,
          chatLog: docVersion.chatLog.map((chatItem) => ({
            message: chatItem.message,
            sender: chatItem.sender,
            displayType: chatItem.displayType,
            bulletPoints: isBulletPointMessage(chatItem)
              ? chatItem.bulletPoints
              : [],
          })),
        },
      },
    },
    {
      accessToken,
    }
  );
}

export async function fetchDocs(userId: string): Promise<UserDoc[]> {
  const res = await axios.post(GRAPHQL_ENDPOINT, {
    query: `
        query FetchGoogleDocs($userId: ID!) {
          fetchGoogleDocs(userId: $userId) {
            googleDocId
            wordDocId
            user
            title
            documentIntention {
              description
              createdAt
            }
            currentDayIntention{
              description
              createdAt
            }
            assignmentDescription
            createdAt
            updatedAt
            admin
            service
            archived
          }
        }
      `,
    variables: {
      userId: userId,
    },
  });
  return res.data.data.fetchGoogleDocs;
}

export async function fetchPrompts(): Promise<GQLResPrompts> {
  const data = await execGql<GQLPrompt[]>(
    {
      query: `
      query FetchPrompts {
        fetchPrompts {
                  ${promptQueryData}
                }
            }
    `,
    },
    // login responds with set-cookie, w/o withCredentials it doesnt get stored
    {
      dataPath: 'fetchPrompts',
    }
  );
  return { prompts: data };
}

export async function deleteUserDoc(
  docId: string,
  userId: string
): Promise<UserDoc> {
  const accessToken = localStorageGet(ACCESS_TOKEN_KEY) || '';
  if (!accessToken) throw new Error('No access token');
  const data = await execGql<UserDoc>(
    {
      query: `
      mutation DeleteGoogleDoc($googleDocId: String!, $userId: String!) {
        deleteUserDoc(googleDocId: $googleDocId, userId: $userId) {
            googleDocId
            user
                }
            }
    `,
      variables: {
        googleDocId: docId,
        userId: userId,
      },
    },
    {
      dataPath: 'deleteUserDoc',
      accessToken,
    }
  );
  return data;
}

export async function storePrompts(
  prompts: GQLResPrompts
): Promise<GQLResPrompts> {
  const accessToken = localStorageGet(ACCESS_TOKEN_KEY) || '';
  if (!accessToken) throw new Error('No access token');
  const data = await execGql<GQLPrompt[]>(
    {
      query: `
      mutation StorePrompts($prompts: [PromptInputType]!) {
        storePrompts(prompts: $prompts) {
            ${promptQueryData}
          }
     }
    `,
      variables: {
        prompts: prompts.prompts,
      },
    },
    // login responds with set-cookie, w/o withCredentials it doesnt get stored
    {
      dataPath: 'storePrompts',
    }
  );
  return { prompts: data };
}

export async function storePrompt(prompt: GQLPrompt): Promise<GQLPrompt> {
  const accessToken = localStorageGet(ACCESS_TOKEN_KEY) || '';
  if (!accessToken) throw new Error('No access token');
  const savedPrompt = await execGql<GQLPrompt>(
    {
      query: `
      mutation StorePrompt($prompt: PromptInputType!) {
        storePrompt(prompt: $prompt) {
            ${promptQueryData}
          }
     }
    `,
      variables: {
        prompt: prompt,
      },
    },
    // login responds with set-cookie, w/o withCredentials it doesnt get stored
    {
      dataPath: 'storePrompt',
    }
  );
  return savedPrompt;
}

export async function updateDocStorage(
  userDoc: StoreUserDoc
): Promise<UserDoc> {
  // remove createdAt from storeData
  const storeData: StoreUserDoc = {
    ...userDoc,
    documentIntention: userDoc.documentIntention
      ? {
          description: userDoc.documentIntention.description,
        }
      : undefined,
    currentDayIntention: userDoc.currentDayIntention
      ? {
          description: userDoc.currentDayIntention.description,
        }
      : undefined,
  };
  const data = await execGql<UserDoc>(
    {
      query: `
        mutation StoreUserDoc($googleDoc: GoogleDocInputType!) {
          storeGoogleDoc(googleDoc: $googleDoc) {
            googleDocId
            wordDocId
            user
            title
            documentIntention {
              description
              createdAt
            }
            currentDayIntention{
              description
              createdAt
            }
            assignmentDescription
            createdAt
            updatedAt
            admin
            service
            archived
          }
        }
    `,
      variables: {
        googleDoc: storeData,
      },
    },
    {
      dataPath: 'storeGoogleDoc',
    }
  );
  return data;
}

export async function loginGoogle(
  accessToken: string
): Promise<UserAccessToken> {
  return await execGql<UserAccessToken>(
    {
      query: `
      mutation LoginGoogle($accessToken: String!) {
        loginGoogle(accessToken: $accessToken) {
          user {
            ${userDataQuery}
          }
          accessToken
        }
      }
    `,
      variables: {
        accessToken: accessToken,
      },
    },
    // login responds with set-cookie, w/o withCredentials it doesnt get stored
    {
      dataPath: 'loginGoogle',
      axiosConfig: {
        withCredentials: true,
      },
    }
  );
}

export async function fetchConfig(subdomain?: string): Promise<Config> {
  return await execGql<Config>(
    {
      query: `
        query FetchConfig($subdomain: String){
          fetchConfig(subdomain: $subdomain) {
            aiSystemPrompt
            displayedGoalActivities{
              goal
              activities{
                activity
                disabled
              }
              builtActivities{
                activity
                disabled
              }
            }
            colorTheme{
              headerColor
              headerButtonsColor
              chatSystemBubbleColor
              chatSystemTextColor
              chatUserBubbleColor
              chatUserTextColor
            }
            exampleGoogleDocs
            overrideAiModel{
              serviceName
              model
            }
            defaultAiModel{
              serviceName
              model
            }
            approvedEmailsForAiModels
            headerTitle
            orgName
            loginScreenTitle
            surveyConfig{
              surveyLink
              surveyQueryParam
              surveyClassroomParam
            }
            bannerConfig{
              bannerText
              bannerTextColor
              bannerBgColor
            }
            aiServiceModelConfigs{
              serviceName
              modelList{
                name
                maxTokens
                supportsWebSearch
                onlyAdminUse
              }
            }
          }
        }
      `,
      variables: {
        subdomain: subdomain,
      },
    },
    {
      dataPath: 'fetchConfig',
    }
  );
}

export async function fetchSystemPrompts(): Promise<string[]> {
  return await execGql<string[]>(
    {
      query: `
          query FetchSystemPrompts{
            fetchConfig {
              aiSystemPrompt
            }
          }
        `,
    },
    {
      dataPath: ['fetchConfig', 'aiSystemPrompt'],
    }
  );
}

/**
 * @param accessToken
 * @param key string key of the config to update
 * @param value Must be a JSON serializable type (string, list, object, etc.)
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function updateConfigByKey(key: string, value: any): Promise<any> {
  const accessToken = localStorageGet(ACCESS_TOKEN_KEY) || '';
  if (!accessToken) throw new Error('No access token');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return execGql<any>(
    {
      query: `
      mutation ConfigUpdateByKey($key: String!, $value: AnythingScalarType!) {
        configUpdateByKey(key: $key, value: $value) {
          aiSystemPrompt
      }
  }
    `,
      variables: {
        key: key,
        value: value,
      },
    },
    {
      dataPath: ['configUpdateByKey', key],
      accessToken: accessToken,
    }
  );
}

export const userDataQuery = `
  _id
  googleId
  name
  email
  userRole
  loginService
  lastLoginAt
  classroomCode{
    code
    createdAt
  }
  previousClassroomCodes{
    code
    createdAt
  }
`;
export async function refreshAccessToken(): Promise<UserAccessToken> {
  return execGql<UserAccessToken>(
    {
      query: `
      mutation RefreshAccessToken{
        refreshAccessToken{
          user {
            ${userDataQuery}
          }
          accessToken
        }
        }
    `,
    },
    // login responds with set-cookie, w/o withCredentials it doesnt get stored
    {
      dataPath: 'refreshAccessToken',
      axiosConfig: {
        withCredentials: true,
      },
    }
  );
}

export async function updateUserInfo(userInfo: UpdateUserInfo): Promise<User> {
  const accessToken = localStorageGet(ACCESS_TOKEN_KEY) || '';
  if (!accessToken) throw new Error('No access token');
  return execGql<User>(
    {
      query: `
mutation UpdateUserInfo($userInfo: UserInputType!) {
          updateUserInfo(userInfo: $userInfo) {
                ${userDataQuery}
              }
         }
    `,
      variables: {
        userInfo: userInfo,
      },
    },
    {
      dataPath: 'updateUserInfo',
      accessToken: accessToken,
    }
  );
}

export async function fetchDocGoals(): Promise<DocGoalGQl[]> {
  const res = await execGql<Connection<DocGoalGQl>>(
    {
      query: `
        query FetchDocGoals{
          fetchDocGoals {
            edges{
              node{
                _id
                title
                description
                displayIcon
                introduction
                newDocRecommend
              }
            }
          }
        }
      `,
    },
    {
      dataPath: 'fetchDocGoals',
    }
  );
  return res.edges.map((edge) => edge.node);
}

export async function fetchActivities(): Promise<ActivityGQL[]> {
  const res = await execGql<Connection<ActivityGQL>>(
    {
      query: `
      query FetchActivities($limit: Int){
        fetchActivities(limit: $limit) {
        edges {
            node{
              ${activityQueryData}
            }
            }
        }
    }
      `,
      variables: {
        limit: 9999,
      },
    },
    {
      dataPath: 'fetchActivities',
    }
  );
  return res.edges.map((edge) => edge.node);
}

export type OpenAiJobId = string;

export async function asyncOpenAiRequest(
  docsId: string,
  aiPromptSteps: AiPromptStep[],
  userId: string,
  docService: DocService,
  cancelToken?: CancelToken
): Promise<OpenAiJobId> {
  const accessToken = localStorageGet(ACCESS_TOKEN_KEY) || '';
  if (!accessToken) throw new Error('No access token');
  const res = await execHttp<OpenAiJobId>(
    'POST',
    `${API_ENDPOINT}/async_open_ai_doc_question/?docId=${docsId}&userAction=${UserActions.MULTISTEP_PROMPTS}&userId=${userId}&docService=${docService}`,
    {
      accessToken: accessToken,
      dataPath: ['response', 'jobId'],
      axiosConfig: {
        data: {
          aiPromptSteps: aiPromptSteps,
        },
        cancelToken: cancelToken,
      },
    }
  );
  return res;
}

export async function asyncOpenAiJobStatus(
  jobId: string,
  cancelToken?: CancelToken
): Promise<OpenAiServiceJobStatusResponseType> {
  const accessToken = localStorageGet(ACCESS_TOKEN_KEY) || '';
  if (!accessToken) throw new Error('No access token');
  const res = await execHttp<OpenAiServiceJobStatusResponseType>(
    'POST',
    `${API_ENDPOINT}/async_open_ai_doc_question_status/?jobId=${jobId}`,
    {
      accessToken: accessToken,
      dataPath: ['response'],
      axiosConfig: {
        cancelToken: cancelToken,
      },
    }
  );
  return res;
}

export type DocumentTimelineJobId = string;

export async function asyncRequestDocTimeline(
  userId: string,
  docId: string,
  targetAiService: AiServiceModel,
  docService: DocService,
  cancelToken?: CancelToken
): Promise<DocumentTimelineJobId> {
  const accessToken = localStorageGet(ACCESS_TOKEN_KEY) || '';
  if (!accessToken) throw new Error('No access token');
  const res = await execHttp<DocumentTimelineJobId>(
    'POST',
    `${API_ENDPOINT}/async_get_document_timeline/?docId=${docId}&userId=${userId}&docService=${docService}`,
    {
      accessToken: accessToken,
      dataPath: ['response', 'jobId'],
      axiosConfig: {
        cancelToken: cancelToken,
        data: {
          targetAiService: targetAiService,
        },
      },
    }
  );
  return res;
}

export async function asyncRequestDocTimelineStatus(
  jobId: string,
  cancelToken?: CancelToken
): Promise<DocumentTimelineJobStatus> {
  const accessToken = localStorageGet(ACCESS_TOKEN_KEY) || '';
  if (!accessToken) throw new Error('No access token');
  const res = await execHttp<DocumentTimelineJobStatus>(
    'POST',
    `${API_ENDPOINT}/async_document_timeline_status/?jobId=${jobId}`,
    {
      accessToken: accessToken,
      dataPath: ['response'],
      axiosConfig: {
        cancelToken: cancelToken,
      },
    }
  );
  return res;
}

const storeDocTimelineMutation = `mutation StoreDocTimeline($docTimeline: DocTimelineInputType!) {
  storeDocTimeline(docTimeline: $docTimeline) {
      docId
      user
      timelinePoints{
          type
          versionTime
          version{
            docId
            plainText
            markdownText
            lastChangedId
            sessionId
            sessionIntention{
              description
              createdAt
            }
            documentIntention{
              description
              createdAt
            }
            dayIntention{
              description
              createdAt
            }
            chatLog{
                sender
                message
            }
            activity
            intent
            title
            lastModifyingUser
          }
          intent
          changeSummary
          userInputSummary
          reverseOutline
          relatedFeedback
      }
      }
  }`;

export async function storeDocTimeline(
  docTimeline: GQLDocumentTimeline
): Promise<GQLDocumentTimeline> {
  const accessToken = localStorageGet(ACCESS_TOKEN_KEY) || '';
  if (!accessToken) throw new Error('No access token');
  const inputDocs = docTimeline.timelinePoints.map((timelinePoint) => {
    const omittedTimestamps = omit(timelinePoint.version, [
      'createdAt',
      'updatedAt',
    ]);
    return {
      ...timelinePoint,
      version: {
        ...omittedTimestamps,
        dayIntention: timelinePoint.version.dayIntention
          ? omit(timelinePoint.version.dayIntention, ['createdAt'])
          : undefined,
        sessionIntention: timelinePoint.version.sessionIntention
          ? omit(timelinePoint.version.sessionIntention, ['createdAt'])
          : undefined,
        documentIntention: timelinePoint.version.documentIntention
          ? omit(timelinePoint.version.documentIntention, ['createdAt'])
          : undefined,
      },
    };
  });
  const res = await execGql<GQLDocumentTimeline>(
    {
      query: storeDocTimelineMutation,
      variables: {
        docTimeline: {
          ...docTimeline,
          timelinePoints: inputDocs,
        },
      },
    },
    {
      dataPath: 'storeDocTimeline',
      accessToken: accessToken,
    }
  );
  return res;
}

export const versionQueryData = `
 query DocVersions($limit: Int, $filterObject: Object, $sortAscending: Boolean, $sortBy: String) {
                docVersions(limit: $limit, filterObject: $filterObject, sortAscending: $sortAscending, sortBy: $sortBy) {
                      edges {
                        node{
          _id
          docId
          plainText
          markdownText
          lastChangedId
          sessionId
          sessionIntention{
            description
            createdAt
          }
          dayIntention{
            description
            createdAt
          }
          documentIntention{
            description
            createdAt
          }
          chatLog {
            sender
            message
          }
          activity
          intent
          title
          lastModifyingUser
          modifiedTime
          createdAt
          updatedAt
                        }
                    }
                    }
                }`;

export async function fetchDocVersions(
  versionIds: string[]
): Promise<IGDocVersion[]> {
  const res = await execGql<Connection<IGDocVersion>>(
    {
      query: versionQueryData,
      variables: {
        limit: 9999,
        filterObject: {
          _id: {
            $in: versionIds,
          },
        },
      },
    },
    {
      dataPath: 'docVersions',
    }
  );
  return res.edges.map((edge) => edge.node);
}

export async function archiveDoc(
  googleDocId: string,
  userId: string,
  archive: boolean
): Promise<UserDoc> {
  const accessToken = localStorageGet(ACCESS_TOKEN_KEY) || '';
  if (!accessToken) throw new Error('No access token');
  const data = await execGql<UserDoc>(
    {
      query: `
      mutation AddOrUpdateDoc($googleDoc: GoogleDocInputType!) {
          addOrUpdateDoc(googleDoc: $googleDoc) {
            googleDocId
            user
            archived
          }
     }
    `,
      variables: {
        googleDoc: {
          googleDocId: googleDocId,
          user: userId,
          archived: archive,
        },
      },
    },
    {
      dataPath: 'addOrUpdateDoc',
    }
  );
  return data;
}
