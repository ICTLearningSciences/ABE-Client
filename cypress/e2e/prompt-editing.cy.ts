/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
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
      cy.get("[data-cy=error-dialog]").should("contain.text", "Failed to execute prompt steps")
    })

    it("shows activities prompts")

    it("prompts that are linked to an activity are not displayed separately")
  });