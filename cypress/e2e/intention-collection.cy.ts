/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { cyMockDefault, testGoogleDocId } from "../helpers/functions"


describe("collectin user intentions", ()=>{
    beforeEach(()=>{
        cyMockDefault(cy);
    })

    describe("document intention", ()=>{
        it.only("collects and saves document intention on first visit for document", ()=>{
            cy.visit(`/docs/${testGoogleDocId}`);
        })

        it("does not ask for document intention again if provided", ()=>{

        })

        it("when re-visiting document, does not ask for document intention again if provided", ()=>{

        })
    })

    describe("day intention", ()=>{
        it("does not collect day intention for new document within 8 hours of creation", ()=>{
        })

        it("collects and saves day intention for new document after 8 hours of creation", ()=>{
        })

        it("collects and saves day intention if 8 hours after last collection", ()=>{
        })

        it("does not recollect day intention if already provided", ()=>{
        })
    })

    describe("session intention", ()=>{
        describe("stronger hook activity", ()=>{
            it("collects session intention if ")
        })
    })

    describe("document assignment", ()=>{
        it("collects and saves document assignment on first visit for document", ()=>{
        })

        it("does not ask for document assignment again if provided", ()=>{
        })
    })

    describe("clobbering prevention", ()=>{
        it("if asks for just day intention, does not overwrite other intentions", ()=>{
        })
    })
})