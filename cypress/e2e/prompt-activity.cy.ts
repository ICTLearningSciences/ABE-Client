/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { analyzeHookResponse } from '../fixtures/stronger-hook-activity/analyze-hook-response';
import {
  cyMockDefault,
  cyMockOpenAiCall,
  roleSwitch,
  toPromptActivity,
} from '../helpers/functions';
import { ACCESS_TOKEN_KEY } from '../helpers/local-storage';
import { JobStatus, UserRole } from '../helpers/types';

describe('Prompt Activities', () => {
  it('can visit prompt activity', () => {
    cyMockDefault(cy);
    cyMockOpenAiCall(cy, {
      response: analyzeHookResponse(2, 2, JobStatus.COMPLETE),
    });
    toPromptActivity(cy);
    cy.get('[data-cy=chat-box]').should('contain.text', 'Army Style Checklist');
    cy.get('[data-cy=messages-container]').should(
      'contain.text',
      "Feel free to edit your paper. Let me know when you're ready for me to analyze it."
    );
  });

  it('can swap between all activities safely', () => {
    cyMockDefault(cy);
    cyMockOpenAiCall(cy, { response: analyzeHookResponse(2, 2) });
    toPromptActivity(cy);
    cy.get('[data-cy=messages-container]').should(
      'contain.text',
      "Feel free to edit your paper. Let me know when you're ready for me to analyze it."
    );
    cy.get('[data-cy=mcq-choice-Ready]').click();
    cy.get('[data-cy=messages-container]').should(
      'contain.text',
      'he ethical considerations surrounding the '
    );

    cy.get('[data-cy=edit-goal-button]').click();
    cy.get('[data-cy=goal-display-6580e5640ac7bcb42fc8d27f]').click();

    cy.get('[data-cy=activity-display-65a8592b26523c7ce5acacsa]').click();
    cy.get('[data-cy=doc-goal-modal-next-button]').click();
    cy.get('[data-cy=messages-container]').should(
      'contain.text',
      "Feel free to edit your paper. Let me know when you're ready for me to analyze it."
    );
    cy.get('[data-cy=messages-container]').should(
      'not.contain.text',
      'he ethical considerations surrounding the '
    );

    cy.get('[data-cy=mcq-choice-Ready]').click();
    cy.get('[data-cy=messages-container]').should(
      'contain.text',
      'he ethical considerations surrounding the '
    );
    cy.get('[data-cy=messages-container]').should(
      'contain.text',
      "Feel free to edit your paper. Let me know when you're ready for me to analyze it."
    );

    cy.get('[data-cy=edit-goal-button]').click();
    cy.get('[data-cy=goal-display-65823a8799045156193339b2]').click();

    cy.get('[data-cy=messages-container]').should(
      'contain.text',
      'Feel free to ask me any questions about your essay.'
    );
    cy.get('[data-cy=messages-container]').should(
      'not.contain.text',
      'he ethical considerations surrounding the '
    );

    cy.get('[data-cy=edit-goal-button]').click();
    cy.get('[data-cy=goal-display-6580e5640ac7bcb42fc8d27f]').click();

    cy.get('[data-cy=activity-display-658230f699045156193339ac]').click();
    cy.get('[data-cy=doc-goal-modal-next-button]').click();

    cy.get('[data-cy=messages-container]').should(
      'not.contain.text',
      'Feel free to ask me any questions about your essay.'
    );
    cy.get('[data-cy=messages-container]').should(
      'contain.text',
      'This activity is to work on the hook that gets the readers interest at the start of the paper.'
    );
    cy.get('[data-cy=messages-container]').should(
      'contain.text',
      "Feel free to edit the intro to your paper, and tell me when it's ready for me to review."
    );

    cy.get('[data-cy=edit-goal-button]').click();
    cy.get('[data-cy=goal-display-6580e5640ac7bcb42fc8d27f]').click();

    cy.get('[data-cy=activity-display-65a8592b26523c7ce5acacsa]').click();
    cy.get('[data-cy=doc-goal-modal-next-button]').click();
    cy.get('[data-cy=messages-container]').should(
      'contain.text',
      "Feel free to edit your paper. Let me know when you're ready for me to analyze it."
    );
    cy.get('[data-cy=messages-container]').should(
      'not.contain.text',
      "Feel free to edit the intro to your paper, and tell me when it's ready for me to review."
    );
  });

  it('walk through prompt activity', () => {
    cyMockDefault(cy);
    cyMockOpenAiCall(cy, { response: analyzeHookResponse(2, 2) });
    toPromptActivity(cy);
    cy.get('[data-cy=messages-container]').should(
      'contain.text',
      "Feel free to edit your paper. Let me know when you're ready for me to analyze it."
    );
    cy.get('[data-cy=mcq-choice-Ready]').click();
    cy.get('[data-cy=messages-container]').should(
      'contain.text',
      'The ethical considerations surrounding the design and use '
    );
    cy.get('[data-cy=mcq-choice-Analyze]').should('exist');
  });

  it('swapping prompts clears chat', () => {
    cyMockDefault(cy);
    cyMockOpenAiCall(cy, { response: analyzeHookResponse(2, 2) });
    toPromptActivity(cy);
    cy.get('[data-cy=messages-container]').should(
      'contain.text',
      "Feel free to edit your paper. Let me know when you're ready for me to analyze it."
    );
    cy.get('[data-cy=mcq-choice-Ready]').click();
    cy.get('[data-cy=messages-container]').should(
      'contain.text',
      'The ethical considerations surrounding the design and use '
    );
    cy.get('[data-cy=mcq-choice-Analyze]').should('exist');

    cy.get('[data-cy=edit-goal-button]').click();
    cy.get('[data-cy=goal-display-6580e5640ac7bcb42fc8d27f]').click();

    cy.get('[data-cy=activity-display-65a8592b26523c7ce5acacsa]').click();
    cy.get('[data-cy=doc-goal-modal-next-button]').click();

    cy.get('[data-cy=messages-container]').should(
      'contain.text',
      "Feel free to edit your paper. Let me know when you're ready for me to analyze it."
    );
    cy.get('[data-cy=messages-container]').should(
      'not.contain.text',
      'The ethical considerations surrounding the design and use '
    );
  });

  it('swapping activities does not cause api calls to retry', () => {
    cyMockDefault(cy);
    cyMockOpenAiCall(cy, { response: analyzeHookResponse(2, 2), delay: 3000 });
    toPromptActivity(cy);
    cy.get('[data-cy=messages-container]').should(
      'contain.text',
      "Feel free to edit your paper. Let me know when you're ready for me to analyze it."
    );
    cy.get('[data-cy=mcq-choice-Ready]').click();
    cy.get('[data-cy=messages-container]').should('contain.text', 'Reading...');

    cy.get('[data-cy=edit-goal-button]').click();
    cy.get('[data-cy=goal-display-6580e5640ac7bcb42fc8d27f]').click();

    cy.get('[data-cy=activity-display-65a8592b26523c7ce5acacsa]').click();
    cy.get('[data-cy=doc-goal-modal-next-button]').click();

    cy.get('[data-cy=messages-container]').should(
      'not.contain.text',
      'retrying'
    );
  });

  it('can preview prompt activities', () => {
    cyMockDefault(cy, { userRole: UserRole.ADMIN });
    cy.visit('/');
    roleSwitch(cy, UserRole.ADMIN)
    cy.get('[data-cy=doc-list-item-Aliens]').eq(0).click();
    cy.get("[data-cy=go-to-old-activity-editor]").click();
    cy.get('[data-cy=preview-button-Army-Style-Review]').click();
    cyMockOpenAiCall(cy, { response: analyzeHookResponse(2, 2) });
    cy.get('[data-cy=chat-header]').should('have.text', 'Army Style Checklist');
    cy.get('[data-cy=mcq-choice-Ready]').click();
    cy.get('[data-cy=messages-container]').should(
      'contain.text',
      'The ethical considerations surrounding'
    );
    cy.get('[data-cy=edit-goal-button]').click();
    cy.get('[data-cy=doc-goal-modal]').should('exist');
  });

  it('prompts without activities can still be previewed', () => {
    cyMockDefault(cy, { userRole: UserRole.ADMIN });
    cyMockOpenAiCall(cy, { response: analyzeHookResponse(2, 2) });
    cy.visit('/');
    roleSwitch(cy, UserRole.ADMIN)
    cy.get('[data-cy=doc-list-item-Aliens]').eq(0).click();
    cy.get("[data-cy=go-to-old-activity-editor]").click();
    cy.get('[data-cy=preview-button-N-3-Compare-Story-to-Hook]').click();
    cy.get('[data-cy=chat-header]').should(
      'have.text',
      'N-3 Compare Story to Hook'
    );
    cy.get('[data-cy=mcq-choice-Ready]').click();
    cy.get('[data-cy=messages-container]').should(
      'contain.text',
      'The ethical considerations surrounding'
    );
  });
});
