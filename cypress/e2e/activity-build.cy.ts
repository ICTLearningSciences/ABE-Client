/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { cyMockDefault, cyMockOpenAiCall, CypressGlobal, toPromptEditing } from "../helpers/functions";
import { UserRole } from "../helpers/types";

export function stepsAreEditable(cy: CypressGlobal){
    cy.get("[data-cy=activity-builder-step-type]").should("exist")
}

export function flowTitleIsEditable(cy: CypressGlobal){
    cy.get("[data-cy=input-field-Flow-Title]").should("exist")
    cy.get("[data-cy=input-field-Flow-Title]").should("contain.text", "")
    cy.get("[data-cy=input-field-Flow-Title]").type("New Flow Title")
    cy.get("[data-cy=input-field-Flow-Title]").should("contain.text", "New Flow Title")
}

export function flowTitleIsNotEditable(cy: CypressGlobal){
    cy.get("[data-cy=input-field-Flow-Title]").should("exist")
    cy.get("[data-cy=input-field-Flow-Title]").should("contain.text", "")

}

describe('activity builder', () => {
    describe("admins", ()=>{
        it("can edit all activities, despite ownership", ()=>{
            cyMockDefault(cy, {
              userRole: UserRole.ADMIN
            });
            cy.visit("/")
            cy.get("[data-cy=role-switch]").should("contain.text", "User")
            cy.get("[data-cy=role-switch]").click();
            cy.get("[data-cy=role-switch]").should("contain.text", "Admin")
            cy.get("[data-cy=doc-list-item-Aliens").click()
            cy.get("[data-cy=activity-item-my-editable-activity]").should("exist")
            cy.get("[data-cy=activity-item-edit-my-editable-activity]").click()
            flowTitleIsEditable(cy)
            cy.get("[data-cy=return-to-activity-list]").click()
            cy.get("[data-cy=activity-item-my-private-activity]").should("exist")
            cy.get("[data-cy=activity-item-edit-my-private-activity]").click()
            flowTitleIsEditable(cy)
            cy.get("[data-cy=return-to-activity-list]").click()
            cy.get("[data-cy=activity-item-my-read-only-activity]").should("exist")
            cy.get("[data-cy=activity-item-edit-my-read-only-activity]").click()
            flowTitleIsEditable(cy)
            cy.get("[data-cy=return-to-activity-list]").click()
            cy.get("[data-cy=activity-item-other-user-editable-activity]").should("exist")
            cy.get("[data-cy=activity-item-edit-other-user-editable-activity]").click()
            flowTitleIsEditable(cy)
            cy.get("[data-cy=return-to-activity-list]").click()
            cy.get("[data-cy=activity-item-other-user-read-only-activity]").should("exist")
            cy.get("[data-cy=activity-item-edit-other-user-read-only-activity]").click()
            flowTitleIsEditable(cy)
          })
    })

    describe("content managers", ()=>{
        it("can see all activities", ()=>{
            cyMockDefault(cy, {
                userRole: UserRole.ADMIN
              });
              cy.visit("/")
              cy.get("[data-cy=role-switch]").should("contain.text", "User")
              cy.get("[data-cy=role-switch]").click();
              cy.get("[data-cy=role-switch]").should("contain.text", "Content Manager")
        })
        
        it("can edit their own activities", ()=>{

        })

        it("can edit other users 'editable' set activities", ()=>{

        })

        it.only("cannot edit other users read-only activities", ()=>{
            cyMockDefault(cy, {
                userRole: UserRole.CONTENT_MANAGER
              });
              cy.visit("/")
              cy.get("[data-cy=role-switch]").should("contain.text", "User")
              cy.get("[data-cy=role-switch]").click();
              cy.get("[data-cy=role-switch]").should("contain.text", "Content Manager")
              cy.get("[data-cy=doc-list-item-Aliens").click()
              cy.get("[data-cy=activity-item-my-editable-activity]").should("exist")
              cy.get("[data-cy=activity-item-edit-my-editable-activity]").click()
        })
    })

  });