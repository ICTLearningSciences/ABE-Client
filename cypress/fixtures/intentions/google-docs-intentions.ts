/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { DocService, testGoogleDocId, UserDoc } from "../../helpers/types"
import { testUser } from "../user-data"

export const gDocWithNoIntentions: UserDoc = {
    "googleDocId": testGoogleDocId, 
    "user": testUser._id,
    "title": "Aliens",
    "documentIntention": undefined,
    currentDayIntention: undefined,
    assignmentDescription: undefined,
    "createdAt": new Date().toISOString(),
    "admin": false,
    "updatedAt": new Date().toISOString(),
    "archived": false,
    "service": DocService.GOOGLE_DOCS
}

export const gDocWithoutDocumentIntention: UserDoc = {
    googleDocId: testGoogleDocId,
    user: testUser._id,
    title: "Aliens",
    documentIntention: undefined,
    currentDayIntention: {
        description: "Aliens day intention",
        createdAt: new Date().toISOString(),
    },
    assignmentDescription: "Aliens assignment description",
    createdAt: new Date().toISOString(),
    admin: false,
    updatedAt: new Date().toISOString(),
    archived: false,
    service: DocService.GOOGLE_DOCS
}

export const gDocWithoutCurrentDayIntentionAndExpiredDocumentIntention: UserDoc = {
    "googleDocId": testGoogleDocId,
    "user": testUser._id,
    "title": "Aliens",
    "documentIntention": {
        description: "Aliens document intention",
        createdAt: "2021-06-01T00:00:00.000Z",
    },
    currentDayIntention: undefined,
    assignmentDescription: "Aliens assignment description",
    "createdAt": "2021-06-01T00:00:00.000Z",
    "admin": false,
    "updatedAt": new Date().toISOString(),
    "archived": false,
    "service": DocService.GOOGLE_DOCS
}

export const gDocWithoutAssignmentDescription: UserDoc = {
    "googleDocId": testGoogleDocId,
    "user": testUser._id,
    "title": "Aliens",
    "documentIntention": {
        description: "Aliens document intention",
        createdAt: new Date().toISOString(),
    },
    currentDayIntention: {
        description: "Aliens day intention",
        createdAt: new Date().toISOString(),
    },
    assignmentDescription: undefined,
    "createdAt": new Date().toISOString(),
    "admin": false,
    "updatedAt": new Date().toISOString(),
    "archived": false,
    "service": DocService.GOOGLE_DOCS
}

export const gDocWithAllIntentions: UserDoc = {
    "googleDocId": testGoogleDocId,
    "user": testUser._id,
    "title": "Aliens",
    "documentIntention": {
        description: "Aliens document intention",
        createdAt: new Date().toISOString(),
    },
    currentDayIntention: {
        description: "Aliens day intention",
        createdAt: new Date().toISOString(),
    },
    assignmentDescription: "Aliens assignment description",
    "createdAt": new Date().toISOString(),
    "admin": false,
    "updatedAt": new Date().toISOString(),
    "archived": false,
    "service": DocService.GOOGLE_DOCS
}

export const gDocWithExpiredDayIntention: UserDoc = {
    "googleDocId": testGoogleDocId,
    "user": testUser._id,
    "title": "Aliens",
    "documentIntention": {
        description: "Aliens document intention",
        createdAt: new Date().toISOString(),
    },
    currentDayIntention: {
        description: "Aliens day intention",
        createdAt: "2021-06-01T00:00:00.000Z",
    },
    assignmentDescription: "Aliens assignment description",
    "createdAt": new Date().toISOString(),
    "admin": false,
    "updatedAt": new Date().toISOString(),
    "archived": false,
    "service": DocService.GOOGLE_DOCS
}

export function storeUserDocResponse(gDoc: UserDoc): {storeGoogleDoc: UserDoc} {
    return {
        storeGoogleDoc: gDoc
    }
}