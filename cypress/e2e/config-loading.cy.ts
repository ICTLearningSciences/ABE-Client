/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { fetchConfigResponse } from "../fixtures/fetch-config";
import { cyMockDefault, mockGQL } from "../helpers/functions";


describe("Config Loading Screen", ()=>{
    it("loading screen not visible on successfull load", ()=>{
        cyMockDefault(cy,
            {
                gqlQueries: [
                    mockGQL('FetchConfig', fetchConfigResponse, {statusCode: 200})
                ]
            });
        cy.visit("/");
        cy.get("[data-cy=header]").should("exist")
        cy.get("[data-cy=config-loading-screen]").should("not.exist");
    })

    it("displays spinner on config load", ()=>{
        cyMockDefault(cy,
            {
                gqlQueries: [
                    mockGQL('FetchConfig', fetchConfigResponse, {statusCode: 200, delayMs: 50000})
                ]
            }
        );
        cy.visit("/");
        cy.get("[data-cy=config-loading-screen]").should("exist");
        cy.get("[data-cy=config-loading-spinner]").should("exist");
    })

    it("displays retry button on config load failure", ()=>{
        cyMockDefault(cy,
            {
                gqlQueries: [
                    mockGQL('FetchConfig', fetchConfigResponse, {statusCode: 500})
                ]
            }
        );
        cy.visit("/");
        cy.get("[data-cy=config-loading-screen]").should("exist");
        cy.get("[data-cy=config-load-retry-button]").should("exist");
    })

    it("retries config load on retry button click", ()=>{
        cyMockDefault(cy,
            {
                gqlQueries: [
                    mockGQL('FetchConfig', [
                        {error: ""},
                        fetchConfigResponse
                    ], {delayMs: 1000, statusCode: 500}),
                ]
            }
        );
        cy.visit("/");
        cy.get("[data-cy=config-loading-screen]").should("exist");
        cy.get("[data-cy=config-load-retry-button]").click();
        cy.get("[data-cy=config-loading-screen]").should("exist");
        cy.get("[data-cy=config-loading-spinner]").should("exist");
    })

    it("gets banner from config", ()=>{
        cyMockDefault(cy,
            {
                gqlQueries: [
                    mockGQL('FetchConfig', {
                        fetchConfig: {
                            ...fetchConfigResponse.fetchConfig,
                            banner:{
                                bannerText: "THIS AWE SYSTEM IS UNCLASSIFIED - DO NOT USE WITH CUI OR RESTRICTED MATERIALS",
                                bannerTextColor: "#ffffff",
                                bannerBgColor: "#067a35"
                            }
                        }
                    }, {statusCode: 200})
                ]
            }
        );
        cy.visit("/");
        cy.get("[data-cy=cui-banner]").should("exist");
    })

})