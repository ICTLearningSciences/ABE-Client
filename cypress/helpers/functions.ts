/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { asyncStartRequestRes } from '../fixtures/async-start-request';
import { eightHoursBetweenSessions } from '../fixtures/document-timeline/eight-hours-difference';
import { fetchActivitiesResponse } from '../fixtures/fetch-activities';
import { fetchConfigResponse } from '../fixtures/fetch-config';
import { fetchDocGoalsResponse } from '../fixtures/fetch-doc-goals';
import { fetchGoogleDocsResponse } from '../fixtures/fetch-google-docs';
import { fetchPromptTemplates } from '../fixtures/fetch-prompt-templates';
import { fetchUserActivityStatesResponse } from '../fixtures/fetch-user-activity-states';
import {
  gDocWithAllIntentions,
  storeGoogleDocResponse,
} from '../fixtures/intentions/google-docs-intentions';
import { refreshAccessTokenResponse } from '../fixtures/refresh-access-token';
import { analyzeHookResponse } from '../fixtures/stronger-hook-activity/analyze-hook-response';
import { audienceEmotionsResponse } from '../fixtures/stronger-hook-activity/audience-emotion-response';
import { openAiTextResponse } from '../fixtures/stronger-hook-activity/basic-text-response';
import { entityFoundResponse } from '../fixtures/stronger-hook-activity/entity-found-response';
import { updateUserActivityStatesResponse } from '../fixtures/update-user-activity-states';
import { ACCESS_TOKEN_KEY } from './local-storage';
import {
  DocData,
  GQLDocumentTimeline,
  IGDocVersion,
  JobStatus,
  UserRole,
  MockDefaultType,
} from './types';

export const testGoogleDocId = '1LqProM_kIFbMbMfZKzvlgaFNl5ii6z5xwyAsQZ0U87Y';

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

interface MockGraphQLQuery {
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
  cyMockGetDocTimeline(cy, {
    response: eightHoursBetweenSessions,
  });
  switch (args.mockType) {
    case MockDefaultType.VERSION:
      cyMockGetDocTimeline(cy, {
        response: {
          ...eightHoursBetweenSessions,
          timelinePoints: eightHoursBetweenSessions.timelinePoints.map(
            (point) => ({
              ...point,
              version: args.version || ({} as IGDocVersion),
            })
          ),
        },
      });
      break;
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
      break;
    case MockDefaultType.CUSTOM_FILE_DATA:
      cyMockGetDocTimeline(cy, {
        response: args.customDocumentTimeline,
      });
      break;
    default:
      cyMockGetDocTimeline(cy, {
        response: eightHoursBetweenSessions,
      });
  }

  cyInterceptGraphQL(cy, [
    ...gqlQueries,
    //Defaults
    mockGQL(
      'RefreshAccessToken',
      refreshAccessTokenResponse(args.userRole || UserRole.USER)
    ),
    mockGQL('FetchGoogleDocs', fetchGoogleDocsResponse),
    mockGQL('FetchPrompts', fetchPromptTemplates),
    mockGQL('FetchUserActivityStates', fetchUserActivityStatesResponse),
    mockGQL('FetchConfig', fetchConfigResponse),
    mockGQL('FetchDocGoals', fetchDocGoalsResponse),
    mockGQL('FetchSystemPrompts', fetchConfigResponse),
    mockGQL('UpdateUserActivityState', updateUserActivityStatesResponse),
    mockGQL('StoreGoogleDoc', storeGoogleDocResponse(gDocWithAllIntentions)),
    mockGQL('FetchActivities', fetchActivitiesResponse),
    mockGQL('SubmitGoogleDocVersion', {}),
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

export enum StepNames {
  'Improve_Narrativity',
  'Improve_Emotions',
  'Narrativity_Brainstorm',
  'Narrativity_Story_In_Mind',
  'Narrativity_Outro',
  'Complete_Emotions',
}
export function toStrongerHookActivity(cy: CypressGlobal, step?: StepNames) {
  cy.visit(`/docs/${testGoogleDocId}`);
  cy.get('[data-cy=goal-display-6580e5640ac7bcb42fc8d27f]').click();
  cy.get('[data-cy=activity-display-658230f699045156193339ac]').click();
  cy.get('[data-cy=doc-goal-modal-next-button]').click();

  if (
    step === StepNames.Improve_Narrativity ||
    step === StepNames.Narrativity_Brainstorm ||
    step === StepNames.Narrativity_Story_In_Mind ||
    step === StepNames.Narrativity_Outro
  ) {
    cyMockOpenAiCall(cy, { response: analyzeHookResponse(2, 2) });
    cy.get('[data-cy=mcq-choice-Ready]').click();
    cy.get('[data-cy=mcq-choice-Improve-narrativity]').should('exist');
    cy.get('[data-cy=mcq-choice-Improve-emotion]').should('exist');
    cy.get('[data-cy=mcq-choice-Ask-my-own-question]').should('exist');
    cy.get('[data-cy=mcq-choice-Improve-narrativity]').click();
    cy.get('[data-cy=messages-container]').should(
      'contain.text',
      'Would you like to brainstorm some stories or do you already have a story in mind?'
    );
    cy.get('[data-cy=mcq-choice-Brainstorm-stories]').should('exist');
    cy.get('[data-cy=mcq-choice-Story-in-mind]').should('exist');

    if (step === StepNames.Narrativity_Brainstorm) {
      cy.get('[data-cy=mcq-choice-Brainstorm-stories]').click();
    }
    if (step === StepNames.Narrativity_Story_In_Mind) {
      cy.get('[data-cy=mcq-choice-Story-in-mind]').click();
    }

    if (step === StepNames.Narrativity_Outro) {
      cy.get('[data-cy=mcq-choice-Brainstorm-stories]').click();
      cyMockOpenAiCall(cy, {
        response: entityFoundResponse([
          {
            experience: 'my brother',
            interest: 4,
            justification: '',
            question: '',
          },
        ]),
      });
      cy.get('[data-cy=chat-input]').type(
        'My boss, Hector, and my brother. Also my dog.'
      );
      cy.get('[data-cy=send-input-button]').click();

      cy.get('[data-cy=messages-container]').should(
        'contain.text',
        'This is the entity found response.'
      );
      cy.get('[data-cy=mcq-choice-Brainstorm-More]').should('exist');
      cy.get('[data-cy=mcq-choice-Work-with-what-I-have]').click();

      // analyze story stage
      cyMockOpenAiCall(cy, {
        response: openAiTextResponse(
          'Here are my thoughts on your story:\n1.adaptation\n2.foreshadowing\n3.character development'
        ),
      });

      cy.get('[data-cy=chat-input]').type(
        'I think my dog Clifford is an Alien.'
      );
      cy.get('[data-cy=send-input-button]').click();
      cy.get('[data-cy=messages-container]').should(
        'contain.text',
        'Here are my thoughts on your story'
      );

      // revision stage
      cyMockOpenAiCall(cy, {
        response: openAiTextResponse('You revised your paper well.'),
      });
      cy.get('[data-cy=messages-container]').should(
        'contain.text',
        'Here are my thoughts on your story'
      );
      cy.get('[data-cy=messages-container]').should(
        'contain.text',
        'What kind of revision are you thinking of doing now?'
      );
      cy.get('[data-cy=chat-input]').type('I would like to revise my story by');
      cy.get('[data-cy=send-input-button]').click();
      cy.get('[data-cy=messages-container]').should(
        'contain.text',
        'Please revise your paper'
      );
      cy.get('[data-cy=mcq-choice-Ready]').click();

      cy.get('[data-cy=messages-container]').should(
        'contain.text',
        'You revised your paper well.'
      );
      cy.get('[data-cy=messages-container]').should(
        'contain.text',
        'What would you like to do next?'
      );
      cy.get('[data-cy=mcq-choice-Improve-emotion]').should('exist');
      cy.get('[data-cy=mcq-choice-Improve-narrativity]').should('exist');

      // to outro
      cy.get('[data-cy=mcq-choice-Something-else]').click();
    }
  }

  if (
    step === StepNames.Improve_Emotions ||
    step === StepNames.Complete_Emotions
  ) {
    cyMockOpenAiCall(cy, { response: analyzeHookResponse(2, 2) });
    cy.get('[data-cy=mcq-choice-Ready]').click();
    cy.get('[data-cy=mcq-choice-Improve-emotion]').click();

    if (step === StepNames.Complete_Emotions) {
      cyMockOpenAiCall(cy, {
        response: audienceEmotionsResponse([
          { name: 'students', emotions: ['anger', 'sadness'] },
          { name: 'president of the united states', emotions: ['hopefulness'] },
        ]),
      });
      cy.get('[data-cy=chat-input]').type(
        'I want to speak to students and convey anger and sadness.'
      );
      cy.get('[data-cy=send-input-button]').click();

      // what revision stage
      cy.get('[data-cy=messages-container]').should(
        'contain.text',
        'What kind of revision are you thinking of doing now?'
      );
      cy.get('[data-cy=chat-input]').type(
        'I want to talk about the president.'
      );
      cy.get('[data-cy=send-input-button]').click();

      // re-analyze after revision stage
      cy.get('[data-cy=messages-container]').should(
        'contain.text',
        "Let me know when you're done revising"
      );
      cyMockOpenAiCall(cy, {
        response: openAiTextResponse('You revised your paper well.'),
      });
      cy.get('[data-cy=mcq-choice-Ready]').click();
    }
  }
}

export function toPromptEditing(cy: CypressGlobal) {
  cy.visit(`/docs/${testGoogleDocId}`);
  cy.get('[data-cy=doc-goal-cancel-button]').click();
  cy.get('[data-cy=role-switch]').click();
  cy.get('[data-cy=prompt-item-Review-Sources]').click();
}

export function toPromptActivity(cy: CypressGlobal) {
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
  cy.get('[data-cy=activity-display-65a8592b26523c7ce5acac9e]').click();
  cy.get('[data-cy=doc-goal-modal-next-button]').click();
}
