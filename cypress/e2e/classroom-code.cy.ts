/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { UserRole } from "../helpers/types";
import { cyGetQueryVariables, cyMockDefault, mockGQL } from "../helpers/functions";
import { updateUserInfoResponse } from "../fixtures/update-user-info";


describe("classroom code", ()=>{
  it("classroom code is submitted from the url on login", ()=>{
      cyMockDefault(cy, {
        userRole: UserRole.ADMIN
      });
      cy.visit("/?classroomCode=123456&test=true");
      cy.url().should('include', 'classroomCode=123456');
      cy.wait("@UpdateUserInfo").then((query)=>{
        const variables = cyGetQueryVariables(query);
        assert.equal(variables.userInfo.classroomCode, "123456");
      })
      cy.url().should('not.include', 'classroomCode=123456');
      cy.url().should('include', 'test=true');
    })

    it("classroom code is viewable in settings UI", ()=>{
      cyMockDefault(cy, {
        userRole: UserRole.ADMIN,
        gqlQueries: [
          mockGQL("UpdateUserInfo", updateUserInfoResponse("1234123412341234123")),
        ]
      });
      cy.visit("/?classroomCode=123");
      cy.get("[data-cy=profile-button]").click();
      cy.get("[data-cy=current-classroom-code]").should('contain', "1234123412341234123");
    })

    it("previous classroom codes are viewable in settings UI", ()=>{
      cyMockDefault(cy, {
        userRole: UserRole.ADMIN,
        gqlQueries: [
          mockGQL("UpdateUserInfo", updateUserInfoResponse("1234123412341234123")),
        ]
      });
      cy.visit("/?classroomCode=123");
      cy.get("[data-cy=profile-button]").click();
      cy.get("[data-cy=current-classroom-code]").should('contain', "1234123412341234123");
      cy.get("[data-cy=previous-classroom-codes]").click()
      cy.get("[role=tooltip]").should('contain.text', "1234432112344321")
      cy.get("[role=tooltip]").should('contain.text', "5467765445677654")
      cy.get("[role=tooltip]").should('contain.text', "8765567887655678")
    })

})