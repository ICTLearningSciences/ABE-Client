/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { getDocServiceFromLoginService } from '../helpers/functions';
import {
  gDocWithAllIntentions,
  gDocWithExpiredDayIntention,
  gDocWithoutAssignmentDescription,
  gDocWithoutCurrentDayIntentionAndExpiredDocumentIntention,
  gDocWithoutDocumentIntention,
  storeUserDocResponse,
} from '../fixtures/intentions/google-docs-intentions';
import { refreshAccessTokenResponse } from '../fixtures/refresh-access-token';
import {
  CypressGlobal,
  StepNames,
  cyMockDefault,
  mockGQL,
  sendChatMessage,
  toStrongerHookActivity,
} from '../helpers/functions';
import { DocService, DocVersion, LoginService, UserRole, testGoogleDocId } from '../helpers/types';

function writeDocumentIntention(cy: CypressGlobal, input: string) {
  cy.get('[data-cy=input-document-intention]')
    .clear()
    .type(input, { delay: 0 });
}

function writeDocumentAssignment(cy: CypressGlobal, input: string) {
  cy.get('[data-cy=input-document-assignment]').type(input, { delay: 0 });
}

function writeDayIntention(cy: CypressGlobal, input: string) {
  cy.get('[data-cy=input-day-intention]').clear().type(input, { delay: 0 });
}

function isBackButtonDisabled(cy: CypressGlobal) {
  cy.get('[data-cy=doc-goal-modal-back-button]').should('be.disabled');
}

function isOnSelectGoalScreen(cy: CypressGlobal) {
  cy.get('[data-cy=doc-goal-modal]').should(
    'contain.text',
    'What is your current goal?'
  );
}

function reOpenModal(cy: CypressGlobal) {
  cy.get('[data-cy=edit-goal-button]').click();
}

function clickNextIntentionModal(cy: CypressGlobal) {
  cy.get('[data-cy=doc-goal-modal-next-button]').click();
}

function goToStrongerHookActivity(cy: CypressGlobal) {
  cy.get('[data-cy=goal-display-6580e5640ac7bcb42fc8d27f]').click();
  cy.get('[data-cy=activity-display-658230f699045156193339ac]').click();
  cy.get('[data-cy=doc-goal-modal-next-button]').click();
}

function didDocDataGetSaved(
  cy: CypressGlobal,
  docIntention?: string,
  docAssignment?: string,
  dayIntention?: string
) {
  cy.wait('@StoreUserDoc').then((xhr) => {
    const variablesSent = xhr.request.body.variables;
    if (docIntention) {
      expect(variablesSent.googleDoc.documentIntention.description).to.eql(
        docIntention
      );
    } else {
      expect(variablesSent.googleDoc.documentIntention).to.eql(undefined);
    }

    if (docAssignment) {
      expect(variablesSent.googleDoc.assignmentDescription).to.eql(
        docAssignment
      );
    } else {
      expect(variablesSent.googleDoc.assignmentDescription).to.eql(undefined);
    }

    if (dayIntention) {
      expect(variablesSent.googleDoc.currentDayIntention.description).to.eql(
        dayIntention
      );
    } else {
      expect(variablesSent.googleDoc.currentDayIntention).to.eql(undefined);
    }
  });
}

function didDocVersionDataGetSaved(
  cy: CypressGlobal,
  sessionIntention?: string,
  docIntention?: string,
  dayIntention?: string
) {
  cy.wait(6000); //to allow next version to be submitted
  cy.get('@SubmitDocVersion.all').then((xhr) => {
    const lastRequest: any = xhr[xhr.length - 1];
    const variablesSent: Partial<DocVersion> =
      lastRequest.request.body.variables.googleDocData;
    if (docIntention) {
      expect(variablesSent.documentIntention?.description).to.eql(docIntention);
    } else {
      expect(variablesSent.documentIntention).to.eql(undefined);
    }
    if (sessionIntention) {
      expect(variablesSent.sessionIntention?.description).to.eql(
        sessionIntention
      );
    } else {
      expect(variablesSent.sessionIntention).to.eql(undefined);
    }
    if (dayIntention) {
      expect(variablesSent.dayIntention?.description).to.eql(dayIntention);
    } else {
      expect(variablesSent.dayIntention).to.eql(undefined);
    }
  });
}

function checkNumberSessionIds(cy: CypressGlobal, num: number) {
  cy.wait(6000); //to allow next version to be submitted
  cy.get('@SubmitDocVersion.all').then((xhr) => {
    const sessionIds = xhr.map(
      (x: any) => x.request.body.variables.googleDocData.sessionId
    );
    expect(new Set(sessionIds).size).to.eql(num);
  });
}

describe('collectin user intentions', () => {
  describe('document intention', () => {
    it('collects and saves document intention on first visit for document', () => {
      cyMockDefault(cy, {
        gqlQueries: [
          mockGQL('FetchGoogleDocs', {
            fetchGoogleDocs: [gDocWithoutDocumentIntention],
          }),
          mockGQL(
            'StoreUserDoc',
            storeUserDocResponse(gDocWithAllIntentions)
          ),
        ],
      });
      cy.visit(`/docs/${testGoogleDocId}`);
      writeDocumentIntention(cy, 'test');
      clickNextIntentionModal(cy);
      didDocDataGetSaved(cy, 'test');
    });

    it('does not ask for document intention again if provided', () => {
      cyMockDefault(cy, {
        gqlQueries: [
          mockGQL('FetchGoogleDocs', {
            fetchGoogleDocs: [gDocWithoutDocumentIntention],
          }),
          mockGQL(
            'StoreUserDoc',
            storeUserDocResponse(gDocWithAllIntentions)
          ),
        ],
      });
      cy.visit(`/docs/${testGoogleDocId}`);
      writeDocumentIntention(cy, 'test');
      clickNextIntentionModal(cy);
      didDocDataGetSaved(cy, 'test');
      goToStrongerHookActivity(cy);
      reOpenModal(cy);
      isOnSelectGoalScreen(cy);
      isBackButtonDisabled(cy);
    });

    it('when re-visiting document, does not ask for document intention again if provided', () => {
      cyMockDefault(cy, {
        gqlQueries: [
          mockGQL('FetchGoogleDocs', {
            fetchGoogleDocs: [gDocWithoutDocumentIntention],
          }),
          mockGQL(
            'StoreUserDoc',
            storeUserDocResponse(gDocWithAllIntentions)
          ),
        ],
      });
      cy.visit(`/docs/${testGoogleDocId}`);
      writeDocumentIntention(cy, 'test');
      clickNextIntentionModal(cy);
      didDocDataGetSaved(cy, 'test');
      goToStrongerHookActivity(cy);
      cy.get('[data-cy=home-button]').click();
      cy.get('[data-cy=doc-list-item-Aliens]').click();
      isOnSelectGoalScreen(cy);
      isBackButtonDisabled(cy);
    });
  });

  describe('day intention', () => {
    it('does not collect day intention for new document within 8 hours of creation', () => {
      cyMockDefault(cy, {
        gqlQueries: [
          mockGQL('FetchGoogleDocs', {
            fetchGoogleDocs: [gDocWithAllIntentions],
          }),
          mockGQL(
            'StoreUserDoc',
            storeUserDocResponse(gDocWithAllIntentions)
          ),
        ],
      });
      cy.visit(`/docs/${testGoogleDocId}`);
      isOnSelectGoalScreen(cy);
      isBackButtonDisabled(cy);
    });

    it('collects and saves day intention for new document after 8 hours of creation', () => {
      cyMockDefault(cy, {
        gqlQueries: [
          mockGQL('FetchGoogleDocs', {
            fetchGoogleDocs: [
              gDocWithoutCurrentDayIntentionAndExpiredDocumentIntention,
            ],
          }),
          mockGQL(
            'StoreUserDoc',
            storeUserDocResponse(gDocWithAllIntentions)
          ),
        ],
      });
      cy.visit(`/docs/${testGoogleDocId}`);
      writeDayIntention(cy, 'test');
      clickNextIntentionModal(cy);
      didDocDataGetSaved(cy, undefined, undefined, 'test');
    });

    it('collects and saves day intention if 8 hours after last collection', () => {
      cyMockDefault(cy, {
        gqlQueries: [
          mockGQL('FetchGoogleDocs', {
            fetchGoogleDocs: [gDocWithExpiredDayIntention],
          }),
          mockGQL(
            'StoreUserDoc',
            storeUserDocResponse(gDocWithAllIntentions)
          ),
        ],
      });
      cy.visit(`/docs/${testGoogleDocId}`);
      writeDayIntention(cy, 'test');
      clickNextIntentionModal(cy);
      didDocDataGetSaved(cy, undefined, undefined, 'test');
    });

    it('does not recollect day intention if already provided', () => {
      cyMockDefault(cy, {
        gqlQueries: [
          mockGQL('FetchGoogleDocs', {
            fetchGoogleDocs: [gDocWithExpiredDayIntention],
          }),
          mockGQL(
            'StoreUserDoc',
            storeUserDocResponse(gDocWithAllIntentions)
          ),
        ],
      });
      cy.visit(`/docs/${testGoogleDocId}`);
      writeDayIntention(cy, 'test');
      clickNextIntentionModal(cy);
      didDocDataGetSaved(cy, undefined, undefined, 'test');
      goToStrongerHookActivity(cy);
      reOpenModal(cy);
      isOnSelectGoalScreen(cy);
      isBackButtonDisabled(cy);
    });
  });

  describe('document assignment', () => {
    it('collects and saves document assignment on first visit for document', () => {
      cyMockDefault(cy, {
        gqlQueries: [
          mockGQL('FetchGoogleDocs', {
            fetchGoogleDocs: [gDocWithoutAssignmentDescription],
          }),
          mockGQL(
            'StoreUserDoc',
            storeUserDocResponse(gDocWithAllIntentions)
          ),
        ],
      });
      cy.visit(`/docs/${testGoogleDocId}`);
      writeDocumentAssignment(cy, 'test');
      clickNextIntentionModal(cy);
      didDocDataGetSaved(cy, undefined, 'test');
    });

    it('does not ask for document assignment again if provided', () => {
      cyMockDefault(cy, {
        gqlQueries: [
          mockGQL('FetchGoogleDocs', {
            fetchGoogleDocs: [gDocWithoutAssignmentDescription],
          }),
          mockGQL(
            'StoreUserDoc',
            storeUserDocResponse(gDocWithAllIntentions)
          ),
        ],
      });
      cy.visit(`/docs/${testGoogleDocId}`);
      writeDocumentAssignment(cy, 'test');
      clickNextIntentionModal(cy);
      didDocDataGetSaved(cy, undefined, 'test');
      goToStrongerHookActivity(cy);
      reOpenModal(cy);
      isOnSelectGoalScreen(cy);
      isBackButtonDisabled(cy);
    });
  });

  describe('session intention (in memory only)', () => {
    describe('stronger hook activity', () => {
      it("collects and saves session intention when asked what they'd like to revise", () => {
        cyMockDefault(cy);
        toStrongerHookActivity(cy, StepNames.Narrativity_Story_In_Mind);
        sendChatMessage(cy, 'I want to revise my introduction');
        cy.get('[data-cy=messages-container]').should(
          'contain.text',
          'What kind of revision are you thinking of doing now?'
        );
        sendChatMessage(cy, 'This is my session intention.');
        didDocVersionDataGetSaved(
          cy,
          'This is my session intention.',
          'Aliens document intention',
          'Aliens day intention'
        );
      });
    });

    it('resetting activity clears session intention', () => {
      cyMockDefault(cy);
      toStrongerHookActivity(cy, StepNames.Narrativity_Story_In_Mind);
      didDocVersionDataGetSaved(
        cy,
        undefined,
        'Aliens document intention',
        'Aliens day intention'
      );
      sendChatMessage(cy, 'I want to revise my introduction');
      cy.get('[data-cy=messages-container]').should(
        'contain.text',
        'What kind of revision are you thinking of doing now?'
      );
      sendChatMessage(cy, 'This is my session intention.');
      didDocVersionDataGetSaved(
        cy,
        'This is my session intention.',
        'Aliens document intention',
        'Aliens day intention'
      );
      cy.get('[data-cy=reset-activity-button]').click();
      didDocVersionDataGetSaved(
        cy,
        undefined,
        'Aliens document intention',
        'Aliens day intention'
      );
    });
  });
[LoginService.AMAZON_COGNITO, LoginService.GOOGLE].forEach((loginService) => {
  const extraGqlQueries = [
      mockGQL(
          'RefreshAccessToken',
          refreshAccessTokenResponse(UserRole.USER, loginService)
          ),
  ]
  const docService = getDocServiceFromLoginService(loginService)
  describe(`intentions are saved with doc versions for ${loginService}`, () => {
    it('saves most up to date session intentions with doc versions', () => {
      cyMockDefault(cy, {gqlQueries: extraGqlQueries});
      toStrongerHookActivity(cy, StepNames.Narrativity_Story_In_Mind);
      sendChatMessage(cy, 'I want to revise my introduction');
      cy.get('[data-cy=messages-container]').should(
        'contain.text',
        'What kind of revision are you thinking of doing now?'
      );
      sendChatMessage(cy, 'This is my session intention.');
      didDocVersionDataGetSaved(
        cy,
        'This is my session intention.',
        'Aliens document intention',
        'Aliens day intention'
      );
    });

    it('saves day intentions with doc versions', () => {
      cyMockDefault(cy, {
        gqlQueries: [
          ...extraGqlQueries,
          mockGQL('FetchGoogleDocs', {
            fetchGoogleDocs: [
              {
                ...gDocWithoutCurrentDayIntentionAndExpiredDocumentIntention,
                service: docService
              },
            ],
          }),
          mockGQL(
            'StoreUserDoc',
            storeUserDocResponse({
              ...gDocWithAllIntentions,
              service: docService
            })
          ),
        ],
      });
      cy.visit(`/docs/${testGoogleDocId}`);
      writeDayIntention(cy, 'Aliens day intention');
      clickNextIntentionModal(cy);
      didDocDataGetSaved(cy, undefined, undefined, 'Aliens day intention');
      goToStrongerHookActivity(cy);
      didDocVersionDataGetSaved(
        cy,
        undefined,
        'Aliens document intention',
        'Aliens day intention'
      );
    });

    it('save document intentions with doc versions', () => {
      cyMockDefault(cy, {
        gqlQueries: [
          ...extraGqlQueries,
          mockGQL('FetchGoogleDocs', {
            fetchGoogleDocs: [
              {
                ...gDocWithoutDocumentIntention,
                service: docService
              },
            ],
          }),
          mockGQL(
            'StoreUserDoc',
            storeUserDocResponse({
              ...gDocWithAllIntentions,
              service: docService
            })
          ),
        ],
      });
      cy.visit(`/docs/${testGoogleDocId}`);
      writeDocumentIntention(cy, 'Aliens document intention');
      clickNextIntentionModal(cy);
      didDocDataGetSaved(cy, 'Aliens document intention');
      goToStrongerHookActivity(cy);
      didDocVersionDataGetSaved(
        cy,
        undefined,
        'Aliens document intention',
        'Aliens day intention'
      );
    });
  });
});

  describe('sessionId changes', () => {
    it('sessionId exists when user visits a new document', () => {
      cyMockDefault(cy);
      cy.visit(`/docs/${testGoogleDocId}`);
      goToStrongerHookActivity(cy);
      checkNumberSessionIds(cy, 1);
    });

    it('sessionId changes when user revisits a document', () => {
      cyMockDefault(cy);
      cy.visit(`/docs/${testGoogleDocId}`);
      goToStrongerHookActivity(cy);
      checkNumberSessionIds(cy, 1);
      cy.get('[data-cy=home-button]').click();
      cy.get('[data-cy=doc-list-item-Aliens-2]').click();
      goToStrongerHookActivity(cy);
      checkNumberSessionIds(cy, 2);
    });

    it('sessionId changes when resetting activity', () => {
      cyMockDefault(cy);
      cy.visit(`/docs/${testGoogleDocId}`);
      goToStrongerHookActivity(cy);
      checkNumberSessionIds(cy, 1);
      cy.get('[data-cy=reset-activity-button]').click();
      checkNumberSessionIds(cy, 2);
      cy.get('[data-cy=reset-activity-button]').click();
      checkNumberSessionIds(cy, 3);
    });
  });
});
