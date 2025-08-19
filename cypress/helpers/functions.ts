/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { Interception } from 'cypress/types/net-stubbing';
import { asyncStartRequestRes } from '../fixtures/async-start-request';
import { eightHoursBetweenSessions, eightHoursBetweenSessionsDocVersions } from '../fixtures/document-timeline/eight-hours-difference';
import { fetchActivitiesResponse } from '../fixtures/fetch-activities';
import { createActivityBuilder, fetchBuiltActivitiesResponse } from '../fixtures/fetch-built-activities';
import { fetchConfigResponse } from '../fixtures/fetch-config';
import { fetchDocGoalsResponse } from '../fixtures/fetch-doc-goals';
import { fetchGoogleDocsResponse } from '../fixtures/fetch-google-docs';
import { fetchPromptTemplates } from '../fixtures/fetch-prompt-templates';
import {
  gDocWithAllIntentions,
  storeUserDocResponse,
} from '../fixtures/intentions/google-docs-intentions';
import { refreshAccessTokenResponse } from '../fixtures/refresh-access-token';
import { updateUserInfoResponse } from '../fixtures/update-user-info';
import { testUser } from '../fixtures/user-data';
import { ACCESS_TOKEN_KEY } from './local-storage';
import {
  DocData,
  GQLDocumentTimeline,
  IGDocVersion,
  JobStatus,
  UserRole,
  MockDefaultType,
  ActivityBuilderVisibility,
  DocService,
  LoginService,
  testGoogleDocId,
} from './types';
import { fetchDocVersionsBuilder } from '../fixtures/fetch-doc-versions-builder';
import { createNewInstructorResponse, createNewStudentResponse, fetchAssignmentsResponseEmpty, fetchCoursesResponseEmpty, fetchSectionsResponseEmpty, fetchStudentsResponseEmpty } from '../fixtures/educational-management';

export type CypressGlobal = Cypress.cy & CyEventEmitter;

interface StaticResponse {
  /**
   * Serve a fixture as the response body.
   */
  fixture?: string;
  /**
   * Serve a static string/JSON object as the response body.
   */
  body?: string | object | object[];
  /**
   * HTTP headers to accompany the response.
   * @default {}
   */
  headers?: { [key: string]: string };
  /**
   * The HTTP status code to send.
   * @default 200
   */
  statusCode?: number;
  /**
   * If 'forceNetworkError' is truthy, Cypress will destroy the browser connection
   * and send no response. Useful for simulating a server that is not reachable.
   * Must not be set in combination with other options.
   */
  forceNetworkError?: boolean;
  /**
   * Milliseconds to delay before the response is sent.
   */
  delayMs?: number;
  /**
   * Kilobits per second to send 'body'.
   */
  throttleKbps?: number;
}

export interface MockGraphQLQuery {
  query: string;
  data: any | any[];
  params?: { statusCode?: number, delayMs?: number };
}

function staticResponse(s: StaticResponse): StaticResponse {
  return {
    ...{
      headers: {
        'access-control-allow-origin': window.location.origin,
        'Access-Control-Allow-Credentials': 'true',
      },
      ...s,
    },
  };
}

export function cySetup(cy: CypressGlobal) {
  cy.viewport(1280, 720);
  cy.clearLocalStorage();
}

export function cyInterceptGraphQL(
  cy: CypressGlobal,
  mocks: MockGraphQLQuery[]
): void {
  const queryCalls: any = {};
  for (const mock of mocks) {
    queryCalls[mock.query] = 0;
  }
  cy.intercept('**/graphql', (req) => {
    const { body } = req;
    const queryBody = body.query.replace(/\s+/g, ' ').replace('\n', '').trim();
    let handled = false;
    for (const mock of mocks) {
      if (
        queryBody.match(new RegExp(`^(mutation|query) ${mock.query}[{(\\s]`))
      ) {
        const data = Array.isArray(mock.data) ? mock.data : [mock.data];
        const val = data[Math.min(queryCalls[mock.query], data.length - 1)];
        let body = val;
        req.alias = mock.query;
        req.reply(
          staticResponse({
            statusCode: mock.params?.statusCode || 200,
            body: {
              data: body,
              errors: null,
            },
            delayMs: mock.params?.delayMs || 0,
          })
        );
        queryCalls[mock.query] += 1;
        handled = true;
        break;
      }
    }
    if (!handled) {
      console.error(`failed to handle query for...`);
      console.error(req);
    }
  });
}

export function mockGQL(
  query: string,
  data: any | any[],
  params?: { statusCode?: number, delayMs?: number }
): MockGraphQLQuery {
  return {
    query,
    data,
    params,
  };
}

export function cyMockLogin(cy: CypressGlobal): void {
  cy.setLocalStorage(ACCESS_TOKEN_KEY, 'fake-access-token');
  cy.setCookie('refreshTokenDev', 'fake-refresh-token', { secure: true });
}

export function cyMockDefault(
  cy: CypressGlobal,
  args: {
    gqlQueries?: MockGraphQLQuery[];
    userRole?: UserRole;
    mockType?: MockDefaultType;
    version?: IGDocVersion;
    reverseOutline?: string;
    customDocumentTimeline?: GQLDocumentTimeline;
  } = {}
) {
  const gqlQueries = args?.gqlQueries || [];
  cySetup(cy);
  cyMockLogin(cy);
  cyMockGetDocData(cy);
  let docTimelineVersions: IGDocVersion[] = [];
  cyMockGetDocTimeline(cy, {
    response: eightHoursBetweenSessions,
  });
  docTimelineVersions = eightHoursBetweenSessionsDocVersions;
  cyMockGoogleDoc(cy);
  switch (args.mockType) {
    case MockDefaultType.REVERSE_OUTLINE:
      cyMockGetDocTimeline(cy, {
        response: {
          ...eightHoursBetweenSessions,
          timelinePoints: eightHoursBetweenSessions.timelinePoints.map(
            (point) => ({
              ...point,
              reverseOutline: args.reverseOutline || '',
            })
          ),
        },
      });
      docTimelineVersions = eightHoursBetweenSessionsDocVersions
      break;
    default:
      cyMockGetDocTimeline(cy, {
        response: eightHoursBetweenSessions,
      });
      docTimelineVersions = eightHoursBetweenSessionsDocVersions
  }

  cyInterceptGraphQL(cy, [
    ...gqlQueries,
    //Defaults
    mockGQL(
      'RefreshAccessToken',
      refreshAccessTokenResponse(args.userRole || UserRole.USER)
    ),
    mockGQL('FetchVersionsById', fetchDocVersionsBuilder(docTimelineVersions)),
    mockGQL('FetchGoogleDocs', fetchGoogleDocsResponse(DocService.GOOGLE_DOCS)),
    mockGQL('FetchPrompts', fetchPromptTemplates),
    mockGQL('FetchConfig', fetchConfigResponse),
    mockGQL('FetchDocGoals', fetchDocGoalsResponse),
    mockGQL('FetchSystemPrompts', fetchConfigResponse),
    mockGQL('StoreUserDoc', storeUserDocResponse(gDocWithAllIntentions)),
    mockGQL('FetchActivities', fetchActivitiesResponse),
    mockGQL('FetchBuiltActivities', fetchBuiltActivitiesResponse),
    mockGQL('FetchBuiltActivityVersions', {fetchBuiltActivityVersions: {
      edges: []
    }}),
    mockGQL('AddOrUpdateBuiltActivity', {}),
    mockGQL('StoreBuiltActivityVersion', {storeBuiltActivityVersion:{activity:{}}}),
    mockGQL('SubmitDocVersion', {}),
    mockGQL('CopyBuiltActivity', {copyBuiltActivity:createActivityBuilder(testUser._id, 'Copied Activity', 'copied-activity', ActivityBuilderVisibility.EDITABLE)}, {delayMs:1000}),
    mockGQL('DeleteBuiltActivity', {deleteBuiltActivity: ""}),
    mockGQL('UpdateUserInfo', updateUserInfoResponse("123")),
        // Educational Management - Fetch Operations
        mockGQL('FetchCourses', fetchCoursesResponseEmpty),
        mockGQL('FetchSections', fetchSectionsResponseEmpty),
        mockGQL('FetchAssignments', fetchAssignmentsResponseEmpty),
        mockGQL('FetchStudentsInMyCourses', fetchStudentsResponseEmpty),
        
        // User Data
        mockGQL('CreateNewInstructor', createNewInstructorResponse),
        mockGQL('CreateNewStudent', createNewStudentResponse),
  ]);
}

export function cyMockGetDocTimeline(
  cy: CypressGlobal,
  params: {
    statusCode?: number;
    jobStatus?: JobStatus;
    response?: GQLDocumentTimeline;
    delay?: number;
  } = {}
) {
  cy.intercept('**/async_get_document_timeline/**', (req) => {
    req.alias = 'openAiStartCall';
    req.reply(
      staticResponse({
        statusCode: 200,
        body: {
          data: asyncStartRequestRes,
        },
        headers: {
          'Content-Type': 'application/json',
        },
        delayMs: 0,
      })
    );
  });
  cy.intercept('**/async_document_timeline_status/**', (req) => {
    req.alias='FetchDocumentTimelineStatus';
    req.reply(
      staticResponse({
        statusCode: params.statusCode || 200,
        body: {
          data: {
            response: {
              documentTimeline: params.response || '',
              jobStatus: params.jobStatus || JobStatus.COMPLETE,
            },
          },
        },
        headers: {
          'Content-Type': 'application/json',
        },
        delayMs: params.delay || 0,
      })
    );
  });

}

export function cyMockGetDocData(
  cy: CypressGlobal,
  params: Partial<DocData> = {}
) {
  const defaultDocData: DocData = {
    plainText: 'This is a test doc',
    markdownText: 'This is a test doc',
    lastChangedId: '123',
    title: 'Test Doc',
    lastModifyingUser: '',
    modifiedTime: '',
  };

  const docData = {
    ...defaultDocData,
    ...params,
  };

  cy.intercept('**/get_doc_data/**', (req) => {
    req.reply(
      staticResponse({
        statusCode: 200,
        body: docData,
        headers: {
          'Content-Type': 'application/json',
        },
        delayMs: 0,
      })
    );
  });
}

export function cyMockCreateNewDoc(
  cy: CypressGlobal,
  params: {
    statusCode?: number;
    response?: any;
  } = {}
) {
  cy.intercept('**/create_google_doc**', (req) => {
    req.alias = 'createNewDoc';
    req.reply(
      staticResponse({
        statusCode: params.statusCode || 200,
        body: params.response || {},
      })
    );
  });
}

export function cyMockGoogleDoc(
  cy: CypressGlobal,
) {

  cy.intercept('**/docs.google.com/**', (req) => {
    req.reply(
      staticResponse({
        statusCode: 200,
        body: {},
        headers: {
          'Content-Type': 'application/json',
        },
        delayMs: 0,
      })
    );
  });
}

export function cyMockOpenAiCall(
  cy: CypressGlobal,
  params: {
    statusCode?: number;
    response?: any;
    delay?: number;
  } = {}
) {
  cy.intercept('**/async_open_ai_doc_question/**', (req) => {
    req.alias = 'openAiStartCall';
    req.reply(
      staticResponse({
        statusCode: 200,
        body: {
          data: asyncStartRequestRes,
        },
        headers: {
          'Content-Type': 'application/json',
        },
        delayMs: 0,
      })
    );
  });
  cy.intercept('**/async_open_ai_doc_question_status/**', (req) => {
    req.alias = 'aiServiceResponse';
    req.reply(
      staticResponse({
        statusCode: params.statusCode || 200,
        body: {
          data: params.response || {},
        },
        headers: {
          'Content-Type': 'application/json',
        },
        delayMs: params.delay || 0,
      })
    );
  });
}
export function sendChatMessage(cy: CypressGlobal, message: string) {
  cy.get('[data-cy=chat-input]').type(message, { delay: 0 });
  cy.get('[data-cy=send-input-button]').click();
}



export function toMyEditableActivity(cy: CypressGlobal) {
  const key = cy
    .getLocalStorage(ACCESS_TOKEN_KEY)
    .should('exist')
    .should('equal', 'fake-access-token');
  const cookie = cy
    .getCookie('refreshTokenDev')
    .should('exist')
    .should('have.property', 'value', 'fake-refresh-token');
  cy.visit(`/docs/${testGoogleDocId}`);
  cy.get('[data-cy=goal-display-6580e5640ac7bcb42fc8d27f]').click();
  cy.get('[data-cy=activity-display-my-editable-activity]').click();
  cy.get('[data-cy=doc-goal-modal-next-button]').click();
}

export function cyGetQueryVariables(query: Interception) {
  const variables = query.request.body.variables;
  return variables;
}

function roleDisplayText(userRole: UserRole) {
  switch (userRole) {
    case UserRole.ADMIN:
      return 'Admin';
    case UserRole.CONTENT_MANAGER:
      return 'Content Manager';
    default:
      return 'User';
  }
}

export function visitMainPageSettled(cy: CypressGlobal){
  cy.visit("/")
  cy.get("[data-cy=toggle-view-archived]").should("be.visible")
}

export function roleSwitch(cy: CypressGlobal, targetNewRole: UserRole){
  cy.get("[data-cy=profile-button]").click();
  cy.get("[data-cy=role-switch]").should("contain.text", roleDisplayText(UserRole.USER))
  cy.get("[data-cy=role-switch]").click();
  cy.get("[data-cy=role-switch]").should("contain.text", roleDisplayText(targetNewRole))
  // click center of screen to close drawer
  cy.get("body").click(0, 0);
}

export function getDocServiceFromLoginService(
  loginService?: LoginService
): DocService {
  switch (loginService) {
    case LoginService.GOOGLE:
      return DocService.GOOGLE_DOCS;
    case LoginService.MICROSOFT:
      return DocService.MICROSOFT_WORD;
    case LoginService.AMAZON_COGNITO:
    default:
      return DocService.RAW_TEXT;
  }
}