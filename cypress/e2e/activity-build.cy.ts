/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { cyMockDefault, CypressGlobal, mockGQL, roleSwitch } from "../helpers/functions";
import { UserRole } from "../helpers/types";

export function stepsAreEditable(cy: CypressGlobal){
    cy.get("[data-cy=activity-builder-step-type]").should("exist")
}

export function flowIsEditable(cy: CypressGlobal){
    cy.get("[data-cy=input-field-Flow-Title]").should("exist")
    cy.get("[data-cy=input-field-Flow-Title]").should("contain.text", "")
    cy.get("[data-cy=input-field-Flow-Title]").type("New Flow Title")
    cy.get("[data-cy=input-field-Flow-Title]").should("contain.text", "New Flow Title")
}

export function flowIsNotEditable(cy: CypressGlobal){
    cy.get("[data-cy=input-field-Flow-Title]").should("exist")
    cy.get("[data-cy=input-field-Flow-Title]").should("contain.text", "")
    cy.get("[data-cy=input-field-Flow-Title]").should("have.css", "pointer-events", "none")
    cy.get('[data-cy=input-field-Activity-Name]').within(()=>{
        cy.get("textarea").should("be.disabled")
    })
    cy.get('[data-cy=save-activity]').should("be.disabled")
    cy.get('[data-cy=add-flow]').should("be.disabled")
    cy.get('[data-cy=select-field-Visibility]').within(()=>{
        cy.get("input").should("be.disabled")
    })
}

describe('activity builder', () => {
    describe("admins", ()=>{

        it("can edit all activities, despite ownership", ()=>{
            cyMockDefault(cy, {
              userRole: UserRole.ADMIN
            });
            cy.visit("/")
            roleSwitch(cy, UserRole.ADMIN)
            cy.get("[data-cy=doc-list-item-Aliens").click()
            cy.get("[data-cy=activity-item-my-editable-activity]").should("exist")
            cy.get("[data-cy=activity-item-edit-my-editable-activity]").click()
            flowIsEditable(cy)
            cy.get("[data-cy=return-to-activity-list]").click()
            cy.get("[data-cy=activity-item-my-private-activity]").should("exist")
            cy.get("[data-cy=activity-item-edit-my-private-activity]").click()
            flowIsEditable(cy)
            cy.get("[data-cy=return-to-activity-list]").click()
            cy.get("[data-cy=activity-item-my-read-only-activity]").should("exist")
            cy.get("[data-cy=activity-item-edit-my-read-only-activity]").click()
            flowIsEditable(cy)
            cy.get("[data-cy=return-to-activity-list]").click()
            cy.get("[data-cy=activity-item-other-user-editable-activity]").should("exist")
            cy.get("[data-cy=activity-item-edit-other-user-editable-activity]").click()
            flowIsEditable(cy)
            cy.get("[data-cy=return-to-activity-list]").click()
            cy.get("[data-cy=activity-item-other-user-read-only-activity]").should("exist")
            cy.get("[data-cy=activity-item-edit-other-user-read-only-activity]").click()
            flowIsEditable(cy)
          })

          it("can delete any activity", ()=>{
            cyMockDefault(cy, {
                userRole: UserRole.ADMIN,
                gqlQueries: [
                    mockGQL('DeleteBuiltActivity', [
                        {deleteBuiltActivity: "my-editable-activity"},
                        {deleteBuiltActivity: "other-user-editable-activity"},
                        {deleteBuiltActivity: "other-user-read-only-activity"},
                    ]),
                ]
              });
              cy.visit("/")
              roleSwitch(cy, UserRole.ADMIN)
              cy.get("[data-cy=doc-list-item-Aliens").click()
              cy.get("[data-cy=activity-item-my-editable-activity]").should("exist")
              cy.get("[data-cy=activity-item-delete-my-editable-activity]").click()
              cy.get("[data-cy=two-option-dialog]").should("exist")
              cy.get("[data-cy=option-2]").click()
              cy.get("[data-cy=activity-item-my-editable-activity]").should("not.exist")

              cy.get("[data-cy=activity-item-other-user-editable-activity]").should("exist")
              cy.get("[data-cy=activity-item-delete-other-user-editable-activity]").click()
              cy.get("[data-cy=two-option-dialog]").should("exist")
              cy.get("[data-cy=option-2]").click()
              cy.get("[data-cy=activity-item-other-user-editable-activity]").should("not.exist")

              cy.get("[data-cy=activity-item-other-user-read-only-activity]").should("exist")
              cy.get("[data-cy=activity-item-delete-other-user-read-only-activity]").click()
              cy.get("[data-cy=two-option-dialog]").should("exist")
              cy.get("[data-cy=option-2]").click()
              cy.get("[data-cy=activity-item-other-user-read-only-activity]").should("not.exist")
          })
    })

    describe("content managers", ()=>{
        it.only("can see all activities", ()=>{
            cyMockDefault(cy, {
                userRole: UserRole.CONTENT_MANAGER
              });
              cy.visit("/")
              roleSwitch(cy, UserRole.CONTENT_MANAGER)
        })
        
        it("can edit their own activities", ()=>{
            cyMockDefault(cy, {
                userRole: UserRole.CONTENT_MANAGER
              });
              cy.visit("/")
              roleSwitch(cy, UserRole.CONTENT_MANAGER)
              cy.get("[data-cy=doc-list-item-Aliens").click()
              cy.get("[data-cy=activity-item-my-editable-activity]").should("exist")
              cy.get("[data-cy=activity-item-edit-my-editable-activity]").click()
              flowIsEditable(cy)
              cy.get("[data-cy=return-to-activity-list]").click()
              cy.get("[data-cy=activity-item-my-read-only-activity]").should("exist")
              cy.get("[data-cy=activity-item-edit-my-read-only-activity]").should("exist").click()
              flowIsEditable(cy)
              cy.get("[data-cy=return-to-activity-list]").click()
              cy.get("[data-cy=activity-item-my-private-activity]").should("exist")
              cy.get("[data-cy=activity-item-edit-my-private-activity]").should("exist").click()
              flowIsEditable(cy)
              cy.get("[data-cy=return-to-activity-list]").click()
        })

        it("can edit other users 'editable' set activities", ()=>{
            cyMockDefault(cy, {
                userRole: UserRole.CONTENT_MANAGER
              });
              cy.visit("/")
              roleSwitch(cy, UserRole.CONTENT_MANAGER)
              cy.get("[data-cy=doc-list-item-Aliens").click()
              cy.get("[data-cy=activity-item-other-user-editable-activity]").should("exist")
              cy.get("[data-cy=activity-item-edit-other-user-editable-activity]").should("exist").click()
              flowIsEditable(cy)
              cy.get("[data-cy=return-to-activity-list]").click()
        })

        it("cannot edit other users read-only activities", ()=>{
            cyMockDefault(cy, {
                userRole: UserRole.CONTENT_MANAGER
              });
              cy.visit("/")
              roleSwitch(cy, UserRole.CONTENT_MANAGER)
              cy.get("[data-cy=doc-list-item-Aliens").click()
              cy.get("[data-cy=activity-item-my-editable-activity]").should("exist")
              cy.get("[data-cy=activity-item-edit-my-editable-activity]").click()
              flowIsEditable(cy)
              cy.get("[data-cy=return-to-activity-list]").click()
              cy.get("[data-cy=activity-item-other-user-read-only-activity]").should("exist")
              cy.get("[data-cy=activity-item-edit-other-user-read-only-activity]").should("exist").click()
              flowIsNotEditable(cy)
              cy.get("[data-cy=return-to-activity-list]").click()
        })

        it("can only delete their own activities", ()=>{
            cyMockDefault(cy, {
                userRole: UserRole.CONTENT_MANAGER,
                gqlQueries: [
                    mockGQL('DeleteBuiltActivity', [
                        {deleteBuiltActivity: "my-editable-activity"},
                    ]),
                ]
              });
              cy.visit("/")
              roleSwitch(cy, UserRole.CONTENT_MANAGER)
              cy.get("[data-cy=doc-list-item-Aliens").click()
              cy.get("[data-cy=activity-item-my-editable-activity]").should("exist")
              cy.get("[data-cy=activity-item-delete-my-editable-activity]").click()
              cy.get("[data-cy=option-2]").click()
              cy.get("[data-cy=activity-item-my-editable-activity]").should("not.exist")

              cy.get("[data-cy=activity-item-other-user-editable-activity]").should("exist")
              cy.get("[data-cy=activity-item-delete-other-user-editable-activity]").should("be.disabled")

              cy.get("[data-cy=activity-item-other-user-read-only-activity]").should("exist")
              cy.get("[data-cy=activity-item-delete-other-user-read-only-activity]").should("be.disabled")
        })
    })


    describe("admins and content managers", ()=>{
        it("can copy activities", ()=>{
            cyMockDefault(cy, {
                userRole: UserRole.CONTENT_MANAGER
            });
            cy.visit("/");
            roleSwitch(cy, UserRole.CONTENT_MANAGER)
            cy.get("[data-cy=doc-list-item-Aliens").click();
            cy.get("[data-cy=activity-item-copied-activity]").should("not.exist");
            cy.get("[data-cy=activity-item-other-user-read-only-activity]").should("exist");
            cy.get("[data-cy=activity-item-copy-other-user-read-only-activity]").click();
            cy.get("[data-cy=activity-item-copied-activity]").should("exist");
        })
    })
  });
