import { cyMockDefault, cyMockOpenAiCall, toPromptEditing } from "../helpers/functions";
import { UserRole } from "../helpers/types";



describe('Prompt Editing', () => {

    it("Can visit prompt editing", ()=>{
      cyMockDefault(cy, {
        userRole: UserRole.ADMIN
      });
      cyMockOpenAiCall(cy, {response: {data:{error:"Error Message"}}, statusCode: 500})
      toPromptEditing(cy);
      cy.get("[data-cy=run-prompt-button]").click();
      cy.get("[data-cy=error-dialog]").should("contain.text", "Error Message")
    })

    it("shows activities prompts")

    it("prompts that are linked to an activity are not displayed separately")
  });