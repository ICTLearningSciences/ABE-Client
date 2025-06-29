/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { fetchConfigResponse } from "../fixtures/fetch-config";
import { FetchPromptsResponse, fetchPromptTemplates } from "../fixtures/fetch-prompt-templates";
import { openAiTextResponse } from "../fixtures/stronger-hook-activity/basic-text-response";
import { cyMockDefault, cyMockOpenAiCall, CypressGlobal, mockGQL, roleSwitch } from "../helpers/functions";
import { AiPromptStep, AiServiceModel, AiServiceNames, testGoogleDocId, UserRole } from "../helpers/types";

function confirmModelInAiRequest(model: AiServiceModel){
    cy.wait("@openAiStartCall").then((xhr)=>{
        const data = xhr.request.body;
        const aiPromptSteps: AiPromptStep[] = data.aiPromptSteps;
        aiPromptSteps.forEach((step)=>{
            expect(step.targetAiServiceModel).to.deep.equal(model)
        })
    })
}

function setPromptsTargetModel(model?: AiServiceModel): FetchPromptsResponse{
    return {
        fetchPrompts: fetchPromptTemplates.fetchPrompts.map((prompt)=>{
            return {
                ...prompt,
                aiPromptSteps: prompt.aiPromptSteps.map((step)=>{
                    return {
                        ...step,
                        targetAiServiceModel: model
                    }
                })
            }
        })
    }
}

function toPromptEditing(cy: CypressGlobal){
    cy.visit(`/docs/${testGoogleDocId}`);
    cy.get('[data-cy=goal-display-6580e5640ac7bcb42fc8d27f]').click();
    cy.get('[data-cy=activity-display-my-editable-activity]').click();
    cy.get('[data-cy=doc-goal-modal-next-button]').click();
    roleSwitch(cy, UserRole.ADMIN);
}

function runFirstAvailablePrompt(cy: CypressGlobal){
    cy.get("[data-cy=activity-item-my-editable-activity]").within(()=>{
        cy.get("[data-cy=activity-item-edit-my-editable-activity]").click();
    })
    cy.get("[data-cy=prompt-step-builder]").within(()=>{
        cy.get("[data-cy=preview-prompt-button]").click();
    })
    cy.get("[data-cy=run-prompt-button]").click();
}

describe("prompt requests use proper model execution", ()=>{
    describe("prompt has no target model", ()=>{
    it("uses config override model if available", ()=>{
        cyMockDefault(cy, {
            userRole: UserRole.ADMIN,
            gqlQueries:[
                mockGQL("FetchConfig", {
                    fetchConfig: {
                        ...fetchConfigResponse.fetchConfig,
                        overrideAiModel: {
                            serviceName: "OPEN_AI",
                            model: "gpt-4"
                        }
                    }
                }),
                mockGQL('FetchPrompts', setPromptsTargetModel(undefined)),
            ]
        });
        cyMockOpenAiCall(cy, {response: openAiTextResponse("Hello"), statusCode: 200})
        toPromptEditing(cy);
        runFirstAvailablePrompt(cy);
        confirmModelInAiRequest({
            serviceName: AiServiceNames.OPEN_AI,
            model: "gpt-4"
        });
    });
                                      

        it("uses configs default model if available", ()=>{
            cyMockDefault(cy, {
                userRole: UserRole.ADMIN,
                gqlQueries:[
                    mockGQL("FetchConfig", {
                        fetchConfig: {
                            ...fetchConfigResponse.fetchConfig,
                            overrideAiModel: undefined,
                            defaultAiModel: {
                                serviceName: "OPEN_AI",
                                model: "test-model"
                            }
                        }
                    }),
                    mockGQL('FetchPrompts', setPromptsTargetModel(undefined)),
                ]
            });
            cyMockOpenAiCall(cy, {response: openAiTextResponse("Hello"), statusCode: 200})
            toPromptEditing(cy);
            runFirstAvailablePrompt(cy);
            confirmModelInAiRequest({
                serviceName: AiServiceNames.OPEN_AI,
                model: "test-model"
            });
        })

        it("uses the first available model as default model if no default provided", ()=>{
                        cyMockDefault(cy, {
                            userRole: UserRole.ADMIN,
                            gqlQueries:[
                                mockGQL("FetchConfig", {
                                    fetchConfig: {
                                        ...fetchConfigResponse.fetchConfig,
                                        overrideAiModel: undefined,
                                        defaultAiModel: undefined
                                    }
                                }),
                                mockGQL('FetchPrompts', setPromptsTargetModel(undefined)),
                            ]
                        });
            cyMockOpenAiCall(cy, {response: openAiTextResponse("Hello"), statusCode: 200})
                        toPromptEditing(cy);
                        runFirstAvailablePrompt(cy);
                        confirmModelInAiRequest({
                            serviceName: AiServiceNames.OPEN_AI,
                            model: fetchConfigResponse.fetchConfig.aiServiceModelConfigs![0].modelList![0].name
                        });
                    })
            
                    it("uses the override model over default if both available", ()=>{
                        cyMockDefault(cy, {
                            userRole: UserRole.ADMIN,
                            gqlQueries:[
                                mockGQL("FetchConfig", {
                                    fetchConfig: {
                                        ...fetchConfigResponse.fetchConfig,
                                        overrideAiModel: {
                                            serviceName: "OPEN_AI",
                                            model: "gpt-4"
                                        },
                                        defaultAiModel: {
                                            serviceName: "OPEN_AI",
                                            model: "test-model"
                                        }
                                    }
                                }),
                                mockGQL('FetchPrompts', setPromptsTargetModel(undefined)),
                            ]
                        });
                        cyMockOpenAiCall(cy, {response: openAiTextResponse("Hello"), statusCode: 200})
                        toPromptEditing(cy);
                        runFirstAvailablePrompt(cy);
                        confirmModelInAiRequest({
                            serviceName: AiServiceNames.OPEN_AI,
                            model: "gpt-4"
                        });
                    })
                    

        it("throws an error if no default model and no available models", ()=>{
            cyMockDefault(cy, {
                userRole: UserRole.ADMIN,
                gqlQueries:[
                    mockGQL("FetchConfig", {
                        fetchConfig: {
                            ...fetchConfigResponse.fetchConfig,
                            overrideAiModel: undefined,
                            defaultAiModel: undefined,
                            aiServiceModelConfigs: []
                        }
                    }),
                    mockGQL('FetchPrompts', setPromptsTargetModel(undefined)),
                ]
            });
            toPromptEditing(cy);
            runFirstAvailablePrompt(cy);
            cy.contains("Target AI Service Model is not available.")
        })
    })

    describe("prompt has a target model", ()=>{
        it("uses the override model if available", ()=>{
            cyMockDefault(cy, {
                userRole: UserRole.ADMIN,
                gqlQueries:[
                    mockGQL("FetchConfig", {
                        fetchConfig: {
                            ...fetchConfigResponse.fetchConfig,
                            overrideAiModel: {
                                serviceName: "OPEN_AI",
                                model: "gpt-4"
                            }
                        }
                    }),
                    mockGQL('FetchPrompts', setPromptsTargetModel({
                        serviceName: AiServiceNames.OPEN_AI,
                        model: "test-model"
                    })),
                ]
            });
            cyMockOpenAiCall(cy, {response: openAiTextResponse("Hello"), statusCode: 200})
            toPromptEditing(cy);
            runFirstAvailablePrompt(cy);
            confirmModelInAiRequest({
                serviceName: AiServiceNames.OPEN_AI,
                model: "gpt-4"
            });
        })
    })

})