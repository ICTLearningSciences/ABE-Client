/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { fetchGoogleDocsResponse } from "../fixtures/fetch-google-docs";
import { refreshAccessTokenResponse } from "../fixtures/refresh-access-token";
import { analyzeHookResponse } from "../fixtures/stronger-hook-activity/analyze-hook-response";
import { myEditableActivityResponse } from "../fixtures/stronger-hook-activity/basic-text-response";
import { cyMockDefault, cyMockOpenAiCall, CypressGlobal, mockGQL, toMyEditableActivity } from "../helpers/functions";
import { DocService, JobStatus, LoginService, UserRole, testGoogleDocId } from "../helpers/types";

export function runInEditor(cy: CypressGlobal, callback: () => void) {
    return cy
      .log('runInEditor')
      .get(`[data-cy=hugerte-container] > iframe`, { log: false })
      .should(iframe => expect(iframe.contents().find('ef-app-root')).to.exist)
      .then(iframe => cy.wrap(iframe.contents().find('ef-app-root'), { log: false }))
      .within({ log: false }, callback);
  }

describe("User Doc Versioning", () => {
    const gqlQueries = [
        mockGQL('FetchGoogleDocs', fetchGoogleDocsResponse(DocService.RAW_TEXT)),
        mockGQL(
            'RefreshAccessToken',
            refreshAccessTokenResponse(UserRole.USER, LoginService.AMAZON_COGNITO)
            ),
    ]
    describe(`Saves a version for raw text document when`, ()=>{
        it("On first load", ()=>{
            cyMockDefault(cy, {
                gqlQueries
            });
            toMyEditableActivity(cy);
            // polls for changes every 5 seconds
            cy.wait("@SubmitDocVersion", {timeout: 8000})
        })


        it("If chat log changed", ()=>{
            cyMockDefault(cy, {gqlQueries});
            cyMockOpenAiCall(cy, {response: myEditableActivityResponse()});
            toMyEditableActivity(cy);
            // polls for changes every 5 seconds
            cy.wait("@SubmitDocVersion", {timeout: 8000});
            cy.get("[data-cy=chat-input]").type("Hello");
            cy.get("[data-cy=send-input-button]").click();
            cy.wait("@SubmitDocVersion", {timeout: 8000});
        })
    })

    it("Does not store if no changes made", ()=>{
        cyMockDefault(cy, {gqlQueries});
        cyMockOpenAiCall(cy, {response: analyzeHookResponse(2,2, JobStatus.COMPLETE)});
        toMyEditableActivity(cy);
        // stores on first load
        cy.wait("@SubmitDocVersion", {timeout: 8000});
        // make sure it doesn't get stored again
        cy.wait(8000);
        cy.get("@SubmitDocVersion.all").should("have.length", 1);
    })

    it("Sends proper data for saving", ()=>{
        cyMockDefault(cy, {gqlQueries});
        cyMockOpenAiCall(cy, {response: myEditableActivityResponse()});
        toMyEditableActivity(cy);
        cy.wait("@SubmitDocVersion", {timeout: 8000}).then((xhr)=>{
            const data = xhr.request.body.variables;
            expect(data.googleDocData.docId).to.be.eql(testGoogleDocId);
            expect(data.googleDocData.activity).to.be.eql("my-editable-activity");
            expect(data.googleDocData.chatLog).to.have.length(1);
        })
        cy.get("[data-cy=chat-input]").type("Hello");
        cy.get("[data-cy=send-input-button]").click();
        cy.wait("@SubmitDocVersion", {timeout: 8000}).then((xhr)=>{
            const data = xhr.request.body.variables;
            expect(data.googleDocData.docId).to.be.eql(testGoogleDocId);
            expect(data.googleDocData.activity).to.be.eql("my-editable-activity");
            expect(data.googleDocData.chatLog).to.have.length(4);
        })
    })

    it("properly saves activity id on activity change", ()=>{
        cyMockDefault(cy, {gqlQueries});
        cyMockOpenAiCall(cy, {response: analyzeHookResponse(2,2, JobStatus.COMPLETE)});
        toMyEditableActivity(cy);
        cy.wait("@SubmitDocVersion", {timeout: 8000}).then((xhr)=>{
            const data = xhr.request.body.variables;
            expect(data.googleDocData.docId).to.be.eql(testGoogleDocId);
            expect(data.googleDocData.activity).to.be.eql("my-editable-activity");
        })
        cy.get("[data-cy=edit-goal-button]").click();
        cy.get("[data-cy=goal-display-6580e5640ac7bcb42fc8d27f]").click();
        cy.get("[data-cy=activity-display-my-read-only-activity]").click();
        cy.get("[data-cy=doc-goal-modal-next-button]").click();
        cy.wait("@SubmitDocVersion", {timeout: 8000}).then((xhr)=>{
            const data = xhr.request.body.variables;
            expect(data.googleDocData.docId).to.be.eql(testGoogleDocId);
            expect(data.googleDocData.activity).to.be.eql("my-read-only-activity");
        })
    })
})


