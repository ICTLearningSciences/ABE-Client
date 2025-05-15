/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { archiveDocResponse } from "../fixtures/archive-doc";
import { fetchGoogleDocsDated } from "../fixtures/fetch-google-docs";
import { testUser } from "../fixtures/user-data";
import { cyMockDefault, mockGQL } from "../helpers/functions";
import { UserRole } from "../helpers/types";

describe('Doc Viewing', () => {

    it("Can visit prompt editing", ()=>{
      cyMockDefault(cy, {
        userRole: UserRole.ADMIN,
        gqlQueries: [
          mockGQL('FetchGoogleDocs', fetchGoogleDocsDated)
        ]
      });
      cy.visit(`/`);
      cy.get("[data-cy='doc-list-item-0']").within(()=>{
        cy.contains("Aliens 2")
      })
      cy.get("[data-cy='doc-list-item-1']").within(()=>{
        cy.contains("Aliens")
      })
      cy.get("[data-cy='updated-at-header']").click();
      cy.get("[data-cy='doc-list-item-0']").within(()=>{
        cy.contains("Aliens")
      })
      cy.get("[data-cy='doc-list-item-1']").within(()=>{
        cy.contains("Aliens 2")
      })
    })

    it('can archive and unarchive a doc', ()=>{
      cyMockDefault(cy, {
        userRole: UserRole.ADMIN,
        gqlQueries: [
            mockGQL('AddOrUpdateDoc', [
              archiveDocResponse('1LqProM_kIFbMbMfZKzvlgaFNl5ii6z5xwyAsQZ0U87Y', testUser._id, true),
              archiveDocResponse('1LqProM_kIFbMbMfZKzvlgaFNl5ii6z5xwyAsQZ0U87Y', testUser._id, false)
            ]),
        ]
      });
      cy.visit(`/`);
      cy.get("[data-cy='doc-list-item-0']").within(()=>{
        cy.contains("Aliens")
      })
      cy.get("[data-cy='archive-doc-Aliens']").click();
      cy.get("[data-cy='doc-list-item-0']").within(()=>{
        cy.contains("Aliens 2")
      })
      cy.get("[data-cy='toggle-view-archived']").click();
      cy.get("[data-cy='doc-list-item-0']").within(()=>{
        cy.contains("Aliens")
      })
      cy.get("[data-cy='unarchive-doc-Aliens']").click();
      cy.get("[data-cy='toggle-view-archived']").click();
      cy.get("[data-cy='doc-list-item-0']").within(()=>{
        cy.contains("Aliens")
      })
      
    })
  });
