import { analyzeHookResponse } from "../fixtures/stronger-hook-activity/analyze-hook-response";
import { cyMockDefault, cyMockOpenAiCall, mockGQL, toPromptActivity, toStrongerHookActivity } from "../helpers/functions";
import { JobStatus, UserRole } from "../helpers/types";



describe('Prompt Activities', () => {
    it('can visit prompt activity', () => {
      cyMockDefault(cy);
      cyMockOpenAiCall(cy, {response: analyzeHookResponse(2,2, JobStatus.COMPLETE)})
      toPromptActivity(cy)
      cy.get("[data-cy=chat-box]").should("contain.text", "Army Style Checklist")
      cy.get("[data-cy=messages-container]").should("contain.text", "Feel free to edit your paper. Let me know when you're ready for me to analyze it.")
    });

    it("can swap between all activities safely", ()=>{
      cyMockDefault(cy);
      cyMockOpenAiCall(cy, {response: analyzeHookResponse(2,2)})
      toPromptActivity(cy)
      cy.get("[data-cy=messages-container]").should("contain.text", "Feel free to edit your paper. Let me know when you're ready for me to analyze it.")
      cy.get("[data-cy=mcq-choice-Ready]").click();
      cy.get("[data-cy=messages-container]").should("contain.text", "he ethical considerations surrounding the ")
    
      cy.get("[data-cy=edit-goal-button]").click()
      cy.get("[data-cy=goal-display-6580e5640ac7bcb42fc8d27f]").click();
      
      cy.get("[data-cy=activity-display-65a8592b26523c7ce5acacsa]").click();
      cy.get("[data-cy=activity-select-start-button]").click();
      cy.get("[data-cy=messages-container]").should("contain.text", "Feel free to edit your paper. Let me know when you're ready for me to analyze it.")
      cy.get("[data-cy=messages-container]").should("not.contain.text", "he ethical considerations surrounding the ")

      cy.get("[data-cy=mcq-choice-Ready]").click();
      cy.get("[data-cy=messages-container]").should("contain.text", "he ethical considerations surrounding the ")
      cy.get("[data-cy=messages-container]").should("contain.text", "Feel free to edit your paper. Let me know when you're ready for me to analyze it.")

      cy.get("[data-cy=edit-goal-button]").click()
      cy.get("[data-cy=goal-display-65823a8799045156193339b2]").click();
     
      cy.get("[data-cy=messages-container]").should("contain.text", "Feel free to ask me any questions about your essay.")
      cy.get("[data-cy=messages-container]").should("not.contain.text", "he ethical considerations surrounding the ")

      cy.get("[data-cy=edit-goal-button]").click()
      cy.get("[data-cy=goal-display-6580e5640ac7bcb42fc8d27f]").click();
      
      cy.get("[data-cy=activity-display-658230f699045156193339ac]").click();
      cy.get("[data-cy=activity-select-start-button]").click();

      cy.get("[data-cy=messages-container]").should("not.contain.text", "Feel free to ask me any questions about your essay.")
      cy.get("[data-cy=messages-container]").should("contain.text", "This activity is to work on the hook that gets the readers interest at the start of the paper.")
      cy.get("[data-cy=messages-container]").should("contain.text", "Feel free to edit the intro to your paper, and tell me when it's ready for me to review.")
    
      cy.get("[data-cy=edit-goal-button]").click()
      cy.get("[data-cy=goal-display-6580e5640ac7bcb42fc8d27f]").click();
      
      cy.get("[data-cy=activity-display-65a8592b26523c7ce5acacsa]").click();
      cy.get("[data-cy=activity-select-start-button]").click();
      cy.get("[data-cy=messages-container]").should("contain.text", "Feel free to edit your paper. Let me know when you're ready for me to analyze it.")
      cy.get("[data-cy=messages-container]").should("not.contain.text", "Feel free to edit the intro to your paper, and tell me when it's ready for me to review.")
    })

    it('walk through prompt activity', () => {
      cyMockDefault(cy);
      cyMockOpenAiCall(cy, {response: analyzeHookResponse(2,2)})
      toPromptActivity(cy)
      cy.get("[data-cy=messages-container]").should("contain.text", "Feel free to edit your paper. Let me know when you're ready for me to analyze it.")
      cy.get("[data-cy=mcq-choice-Ready]").click();
      cy.get("[data-cy=messages-container]").should("contain.text", "The ethical considerations surrounding the design and use ")
      cy.get("[data-cy=mcq-choice-Analyze]").should("exist")
    });

    it("swapping prompts clears chat", ()=>{
      cyMockDefault(cy);
      cyMockOpenAiCall(cy, {response: analyzeHookResponse(2,2)})
      toPromptActivity(cy)
      cy.get("[data-cy=messages-container]").should("contain.text", "Feel free to edit your paper. Let me know when you're ready for me to analyze it.")
      cy.get("[data-cy=mcq-choice-Ready]").click();
      cy.get("[data-cy=messages-container]").should("contain.text", "The ethical considerations surrounding the design and use ")
      cy.get("[data-cy=mcq-choice-Analyze]").should("exist")


      cy.get("[data-cy=edit-goal-button]").click()
      cy.get("[data-cy=goal-display-6580e5640ac7bcb42fc8d27f]").click();
      
      cy.get("[data-cy=activity-display-65a8592b26523c7ce5acacsa]").click();
      cy.get("[data-cy=activity-select-start-button]").click();

      cy.get("[data-cy=messages-container]").should("contain.text", "Feel free to edit your paper. Let me know when you're ready for me to analyze it.")
      cy.get("[data-cy=messages-container]").should("not.contain.text", "The ethical considerations surrounding the design and use ")
    })

    it("swapping activities does not cause api calls to retry", ()=>{
      cyMockDefault(cy);
      cyMockOpenAiCall(cy, {response: analyzeHookResponse(2,2), delay: 3000})
      toPromptActivity(cy)
      cy.get("[data-cy=messages-container]").should("contain.text", "Feel free to edit your paper. Let me know when you're ready for me to analyze it.")
      cy.get("[data-cy=mcq-choice-Ready]").click();
      cy.get("[data-cy=messages-container]").should("contain.text", "Reading...")

      cy.get("[data-cy=edit-goal-button]").click()
      cy.get("[data-cy=goal-display-6580e5640ac7bcb42fc8d27f]").click();
      
      cy.get("[data-cy=activity-display-65a8592b26523c7ce5acacsa]").click();
      cy.get("[data-cy=activity-select-start-button]").click();

      cy.get("[data-cy=messages-container]").should("not.contain.text", "retrying")
    })

    it("can preview prompt activities", ()=>{
      cyMockDefault(cy, {userRole: UserRole.ADMIN});
      cy.visit("/")
      cy.get("[data-cy=role-switch]").click();
      cy.get("[data-cy=doc-list-item-Aliens]").click();
      cy.get("[data-cy=preview-button-Army-Style-Review]").click();
      cyMockOpenAiCall(cy, {response: analyzeHookResponse(2,2)})
      cy.get("[data-cy=chat-header]").should("have.text", "Army Style Checklist")
      cy.get("[data-cy=mcq-choice-Ready]").click();
      cy.get("[data-cy=messages-container]").should("contain.text", "The ethical considerations surrounding")
      cy.get("[data-cy=edit-goal-button]").click();
      cy.get("[data-cy=doc-goal-modal]").should("exist")
    })

    it("prompts without activities can still be previewed", ()=>{
      cyMockDefault(cy, {userRole: UserRole.ADMIN});
      cyMockOpenAiCall(cy, {response: analyzeHookResponse(2,2)})
      cy.visit("/")
      cy.get("[data-cy=role-switch]").click();
      cy.get("[data-cy=doc-list-item-Aliens]").click();
      cy.get("[data-cy=preview-button-N-3-Compare-Story-to-Hook]").click();
      cy.get("[data-cy=chat-header]").should("have.text", "N-3 Compare Story to Hook")
      cy.get("[data-cy=mcq-choice-Ready]").click();
      cy.get("[data-cy=messages-container]").should("contain.text", "The ethical considerations surrounding")
    })
  });