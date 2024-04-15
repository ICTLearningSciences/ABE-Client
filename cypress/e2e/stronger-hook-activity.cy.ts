/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { entityFoundResponse } from '../fixtures/stronger-hook-activity/entity-found-response';
import { analyzeHookResponse } from '../fixtures/stronger-hook-activity/analyze-hook-response';
import {
  StepNames,
  cyMockDefault,
  cyMockOpenAiCall,
  mockGQL,
  testGoogleDocId,
  toStrongerHookActivity,
} from '../helpers/functions';
import { helpBrainstormResponse } from '../fixtures/stronger-hook-activity/help-brainstorm-response';
import { audienceEmotionsResponse } from '../fixtures/stronger-hook-activity/audience-emotion-response';
import { openAiTextResponse } from '../fixtures/stronger-hook-activity/basic-text-response';

describe('Stronger Hook Activity', () => {
  it('Should show introduction text and ask if ready', () => {
    cyMockDefault(cy);
    cyMockOpenAiCall(cy, { response: analyzeHookResponse(2, 2) });
    toStrongerHookActivity(cy);

    cy.get('[data-cy=messages-container]').should(
      'contain.text',
      'This activity is to work on the hook'
    );
    cy.get('[data-cy=messages-container]').should(
      'contain.text',
      'Feel free to edit the intro to your paper'
    );
    cy.get('[data-cy=mcq-choice-Ready]').should('exist');
  });

  it('activity should reset when going to another activity', () => {
    cyMockDefault(cy);
    cyMockOpenAiCall(cy, { response: analyzeHookResponse(2, 2) });
    toStrongerHookActivity(cy);

    cy.get('[data-cy=mcq-choice-Ready]').click();
    cy.get('[data-cy=messages-container]').should(
      'contain.text',
      'Your hook lacks any narrativity.'
    );

    cy.get('[data-cy=edit-goal-button]').click();
    cy.get('[data-cy=goal-display-65823a8799045156193339b2]').click();

    cy.get('[data-cy=messages-container]').should(
      'not.contain.text',
      'Your hook lacks any narrativity.'
    );

    cy.get('[data-cy=edit-goal-button]').click();
    cy.get('[data-cy=goal-display-6580e5640ac7bcb42fc8d27f]').click();

    cy.get('[data-cy=activity-display-658230f699045156193339ac]').click();
    cy.get('[data-cy=doc-goal-modal-next-button]').click();
    cy.get('[data-cy=messages-container]').should(
      'not.contain.text',
      'Your hook lacks any narrativity.'
    );
  });

  it('openai request fails retries 3 times before giving up', () => {
    cyMockDefault(cy);
    cyMockOpenAiCall(cy, { statusCode: 500 });
    toStrongerHookActivity(cy);

    cy.get('[data-cy=mcq-choice-Ready]').click();
    cy.wait(3000);
    cy.get('[data-cy=messages-container]').should(
      'contain.text',
      'Request failed, please try again later.'
    );
  });

  it('openai request retries and safely continues activity', () => {
    cyMockDefault(cy);
    cyMockOpenAiCall(cy, { statusCode: 500 });
    toStrongerHookActivity(cy);

    cy.get('[data-cy=mcq-choice-Ready]').click();
    cy.wait(3000);
    cy.get('[data-cy=messages-container]').should(
      'contain.text',
      'Request failed, please try again later.'
    );
    cyMockOpenAiCall(cy, { response: analyzeHookResponse(2, 2) });
    cy.get('[data-cy=mcq-choice-Retry]').click();
    cy.get('[data-cy=messages-container]').should(
      'contain.text',
      'Your hook lacks any narrativity.'
    );
    cy.get('[data-cy=messages-container]').should(
      'contain.text',
      'What would you like to work on?'
    );
    cy.get('[data-cy=mcq-choice-Improve-narrativity]').should('exist');
    cy.get('[data-cy=mcq-choice-Improve-emotion]').should('exist');
    cy.get('[data-cy=mcq-choice-Ask-my-own-question]').should('exist');
    cy.get('[data-cy=mcq-choice-Improve-narrativity]').click();
    cy.get('[data-cy=messages-container]').should(
      'contain.text',
      'Would you like to brainstorm some stories or do you already have a story in mind?'
    );
  });

  it('Something Else button opens up activity selection', () => {
    cyMockDefault(cy);
    cyMockOpenAiCall(cy, { response: analyzeHookResponse(2, 2) });
    toStrongerHookActivity(cy, StepNames.Narrativity_Outro);
    // activity complete, so should now ask to revise or do something else.
    cy.get('[data-cy=mcq-choice-Analyze-again]').should('exist');
    cy.get('[data-cy=mcq-choice-Another-activity]').should('exist');
    cy.get('[data-cy=mcq-choice-Another-activity]').click();

    // go to free input activity
    cy.get('[data-cy=goal-display-65823a8799045156193339b2]').click();

    cy.get('[data-cy=chat-box]').should('contain.text', 'Free Input');
  });

  describe('low narrativity and low emotion', () => {
    it('walk through narrative brainstorm', () => {
      cyMockDefault(cy);
      toStrongerHookActivity(cy, StepNames.Narrativity_Brainstorm);
      // // extract and select entity stage
      cyMockOpenAiCall(cy, {
        response: entityFoundResponse([
          {
            experience: 'my brother',
            interest: 4,
            justification: 'justification',
            question: 'question',
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
      cy.get('[data-cy=messages-container]').should(
        'contain.text',
        "Would you like to brainstorm more examples or work with what you've got?"
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
      cy.get('[data-cy=mcq-choice-Something-else]').should('exist');
    });

    it('walk thorugh narrative story in mind', () => {
      cyMockDefault(cy);
      toStrongerHookActivity(cy, StepNames.Narrativity_Story_In_Mind);
      // input and analyze story stage
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
      cy.get('[data-cy=mcq-choice-Something-else]').should('exist');
    });

    it('outro analyze again restarts activity', () => {
      cyMockDefault(cy);
      toStrongerHookActivity(cy, StepNames.Complete_Emotions);
      // outro
      cy.get('[data-cy=messages-container]').should(
        'contain.text',
        'Okay, would you like to revise and then have me analyze it again?'
      );

      // restart activity
      cy.get('[data-cy=mcq-choice-Analyze-again]').should('exist');
      cy.get('[data-cy=mcq-choice-Analyze-again]').click();
      cy.get('[data-cy=messages-container]').should(
        'contain.text',
        "Feel free to edit the intro to your paper, and tell me when it's ready for me to review."
      );
      cyMockOpenAiCall(cy, { response: analyzeHookResponse(2, 2) });
      cy.get('[data-cy=mcq-choice-Ready]').click();
      cy.get('[data-cy=messages-container]').should(
        'contain.text',
        'Your hook lacks any narrativity.'
      );
      cy.get('[data-cy=messages-container]').should(
        'contain.text',
        'What would you like to work on?'
      );
    });

    it('outro continue as open dialogue goes to free input', () => {
      cyMockDefault(cy);
      toStrongerHookActivity(cy, StepNames.Complete_Emotions);
      // outro
      cy.get('[data-cy=messages-container]').should(
        'contain.text',
        'Okay, would you like to revise and then have me analyze it again?'
      );
      cy.get('[data-cy=mcq-choice-Analyze-again]').should('exist');
      cy.get('[data-cy=mcq-choice-Another-activity]').should('exist');
      cy.get('[data-cy=mcq-choice-Continue-as-Open-Dialogue]').should('exist');
      cy.get('[data-cy=mcq-choice-Continue-as-Open-Dialogue]').click();
      cy.get('[data-cy=messages-container]').should(
        'contain.text',
        "Okay, feel free to ask me anything you'd like"
      );
      cy.get('[data-cy=chat-input]').type('I would');
    });

    it('outro another activity opens activity selector', () => {
      cyMockDefault(cy);
      toStrongerHookActivity(cy, StepNames.Complete_Emotions);
      // outro
      cy.get('[data-cy=messages-container]').should(
        'contain.text',
        'Okay, would you like to revise and then have me analyze it again?'
      );
      cy.get('[data-cy=mcq-choice-Analyze-again]').should('exist');
      cy.get('[data-cy=mcq-choice-Another-activity]').should('exist');
      cy.get('[data-cy=mcq-choice-Another-activity]').click();

      cy.get('[data-cy=doc-goal-modal]').should('be.visible');
    });

    it("'ask my own question' goes to free chat", () => {
      cyMockDefault(cy);
      cyMockOpenAiCall(cy, { response: analyzeHookResponse(2, 2) });
      toStrongerHookActivity(cy);
      // analyze thesis stage
      cy.get('[data-cy=mcq-choice-Ready]').click();
      cy.get('[data-cy=messages-container]').should(
        'contain.text',
        'What would you like to work on?'
      );
      cy.get('[data-cy=mcq-choice-Improve-narrativity]').should('exist');
      cy.get('[data-cy=mcq-choice-Improve-emotion]').should('exist');
      cy.get('[data-cy=mcq-choice-Ask-my-own-question]').should('exist');
      cy.get('[data-cy=mcq-choice-Ask-my-own-question]').click();
      cy.get('[data-cy=messages-container]').should(
        'contain.text',
        "Okay, feel free to ask me anything you'd like"
      );
      cy.get('[data-cy=chat-input]').type('I would');
    });

    it('if no entities found, then ask to try again', () => {
      cyMockDefault(cy);
      toStrongerHookActivity(cy, StepNames.Narrativity_Brainstorm);
      cyMockOpenAiCall(cy, { response: entityFoundResponse([]) });

      cyMockOpenAiCall(cy, { response: entityFoundResponse([]) });
      cy.get('[data-cy=chat-input]').type('hi');
      cy.get('[data-cy=send-input-button]').click();
      cy.get('[data-cy=messages-container]').should(
        'contain.text',
        "I didn't find any people or places in your responses. Please try again."
      );
      cy.get('[data-cy=chat-input]').type('i would');
    });

    it('Help me brainstorm button', () => {
      cyMockDefault(cy);
      toStrongerHookActivity(cy, StepNames.Narrativity_Brainstorm);
      cyMockOpenAiCall(cy, { response: helpBrainstormResponse() });
      cy.get('[data-cy=mcq-choice-Help-me-brainstorm]').click();
      cy.get('[data-cy=messages-container]').should(
        'contain.text',
        'Example help brainstorm response.'
      );
      cy.get('[data-cy=messages-container]').should(
        'contain.text',
        'If these helped at all, please brainstorm some people '
      );

      cyMockOpenAiCall(cy, {
        response: entityFoundResponse([
          {
            experience: 'Barack Obama',
            interest: 4,
            justification: '',
            question: '',
          },
        ]),
      });
      cy.get('[data-cy=chat-input]').type(
        'My brother, my mom. Barack Obama and Trump.'
      );
      cy.get('[data-cy=send-input-button]').click();

      cy.get('[data-cy=messages-container]').should(
        'contain.text',
        "Would you like to brainstorm more examples or work with what you've got?"
      );
      cy.get('[data-cy=mcq-choice-Brainstorm-More]').should('exist');
      cy.get('[data-cy=mcq-choice-Work-with-what-I-have]').should('exist');
    });

    it('walk through emotion', () => {
      cyMockDefault(cy);
      toStrongerHookActivity(cy, StepNames.Complete_Emotions);
      // outro
      cy.get('[data-cy=messages-container]').should(
        'contain.text',
        'Okay, would you like to revise and then have me analyze it again?'
      );
      cy.get('[data-cy=mcq-choice-Analyze-again]').should('exist');
      cy.get('[data-cy=mcq-choice-Another-activity]').should('exist');
    });

    it('emotion pumps for at least 2 audience members', () => {
      cyMockDefault(cy);
      toStrongerHookActivity(cy, StepNames.Improve_Emotions);
      // extract audience and emotions stage
      cy.get('[data-cy=messages-container]').should(
        'contain.text',
        'Great. Consider who this piece is speaking to.'
      );
      cyMockOpenAiCall(cy, {
        response: audienceEmotionsResponse([
          { name: 'students', emotions: ['anger', 'sadness'] },
        ]),
      });
      cy.get('[data-cy=chat-input]').type(
        'I want to speak to students and convey anger and sadness.'
      );
      cy.get('[data-cy=send-input-button]').click();

      // asking for more audience members
      cy.get('[data-cy=messages-container]').should(
        'contain.text',
        'Okay. Are there any other audiences or stakeholders who are important to this? How should they feel?'
      );
      cyMockOpenAiCall(cy, {
        response: audienceEmotionsResponse([
          { name: 'president of the united states', emotions: ['hopefulness'] },
        ]),
      });
      cy.get('[data-cy=chat-input]').type(
        'I would also like to speak to the president of the united states and convey hopefulness.'
      );
      cy.get('[data-cy=send-input-button]').click();

      // what revision stage
      cy.get('[data-cy=messages-container]').should(
        'contain.text',
        'What kind of revision are you thinking of doing now?'
      );
    });

    it('pending openai calls does not botch swapping activities', () => {
      cyMockDefault(cy);
      cyMockOpenAiCall(cy, {
        response: analyzeHookResponse(2, 5),
        delay: 3000,
      });
      toStrongerHookActivity(cy);

      // analyze thesis stage
      cy.get('[data-cy=mcq-choice-Ready]').click();

      // go to free input activity
      cy.get('[data-cy=edit-goal-button]').click();
      cy.get('[data-cy=goal-display-65823a8799045156193339b2]').click();

      cy.wait(4000);
      cy.get('[data-cy=messages-container]').should(
        'not.contain.text',
        'Would you like to make this a more narrative hook?'
      );
      cy.get('[data-cy=messages-container]').should(
        'contain.text',
        'Feel free to ask me any questions about your essay.'
      );
      cy.get('[data-cy=chat-input]').type('I would');
      cy.get('[data-cy=send-input-button]').click();

      cy.get('[data-cy=edit-goal-button]').click();
      cy.get('[data-cy=goal-display-6580e5640ac7bcb42fc8d27f]').click();

      cy.get('[data-cy=activity-display-658230f699045156193339ac]').click();
      cy.get('[data-cy=doc-goal-modal-next-button]').click();
      cy.wait(4000);
      cy.get('[data-cy=messages-container]').should(
        'not.contain.text',
        'Feel free to ask me any questions about your essay.'
      );
      cy.get('[data-cy=messages-container]').should(
        'contain.text',
        'This activity is to work on the hook'
      );

      cy.get('[data-cy=mcq-choice-Ready]').click();
      cy.get('[data-cy=messages-container]').should(
        'contain.text',
        'What would you like to work on?'
      );
      cy.get('[data-cy=mcq-choice-Improve-emotion]').should('exist');
    });

    it('can visit goal without activity via url params', () => {
      cyMockDefault(cy);
      cy.visit(`/docs/${testGoogleDocId}?goalId=65823a8799045156193339b2`);
      cy.get('[data-cy=chat-box]').should('contain.text', 'Free Input');
      cy.get('[data-cy=doc-goal-modal]').should('not.exist');
    });

    it('can visit activity without goal via url params', () => {
      cyMockDefault(cy);
      cy.visit(`/docs/${testGoogleDocId}?activityId=658230f699045156193339ac`);
      cy.get('[data-cy=chat-header]').should('have.text', 'Stronger Hook');
      cy.get('[data-cy=chat-box]').should(
        'contain.text',
        'This activity is to work on the hook that gets'
      );
    });

    it('can visit goal and activity via url params', () => {
      cyMockDefault(cy);
      cy.visit(
        `/docs/${testGoogleDocId}?goalId=6580e5640ac7bcb42fc8d27f&activityId=658230f699045156193339ac`
      );
      cy.get('[data-cy=chat-box]').should('contain.text', 'Hook');
      cy.get('[data-cy=doc-goal-modal]').should('not.exist');
      cy.get('[data-cy=chat-box]').should(
        'contain.text',
        'This activity is to work on the hook that gets'
      );
    });

    it('can reset activity', () => {
      cyMockDefault(cy);
      toStrongerHookActivity(cy, StepNames.Improve_Emotions);
      cy.get('[data-cy=chat-box]').should(
        'contain.text',
        'Great. Consider who this piece is speaking to.'
      );
      cy.get('[data-cy=reset-activity-button]').click();
      cy.get('[data-cy=chat-box]').should(
        'not.contain.text',
        'Great. Consider who this piece is speaking to.'
      );
      cy.get('[data-cy=chat-box]').should(
        'contain.text',
        "Feel free to edit the intro to your paper, and tell me when it's ready for me to review."
      );
      cy.get('[data-cy=mcq-choice-Ready]').click();
      cy.get('[data-cy=messages-container]').should(
        'contain.text',
        'Your hook lacks any narrativity.'
      );
    });

    it("'Another activity' selection buttons remain if cancelled", () => {
      cyMockDefault(cy);
      toStrongerHookActivity(cy, StepNames.Narrativity_Outro);
      cy.get('[data-cy=mcq-choice-Another-activity]').click();
      cy.get('[data-cy=doc-goal-modal]').should('be.visible');
      cy.get('[data-cy=doc-goal-cancel-button]').click();
      cy.get('[data-cy=mcq-choice-Another-activity]').should('exist');
    });
  });
});
