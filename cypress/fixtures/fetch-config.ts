/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/

import { AiServiceNames, Config } from "../helpers/types"

interface FetchConfigResponse {
    fetchConfig: Config;
}

export const fetchConfigResponse: FetchConfigResponse = {
    "fetchConfig": {
        "aiSystemPrompt": [
            "You are ChatGPT, a large language model trained by OpenAI, based on the GPT-3.5 architecture. Knowledge cutoff: 2021-09.",
            "You are a professor that speaks very eloquently and in short sentences."
        ],
        "displayedGoalActivities":[
            {
                "goal": "65823a8799045156193339b2",
                "activities": [],
                "builtActivities": []
              },
            {
                "goal": "6580e5640ac7bcb42fc8d27f",
                activities: [
                ],
                builtActivities: [
                    {
                        activity: 'my-editable-activity',
                        disabled: false
                    },
                    {
                        activity: 'my-read-only-activity',
                        disabled: false
                    }
                ]
              },
        ],
        "colorTheme": {
            "headerColor": "#1B6A9C",
            "headerButtonsColor": "#ffffff",
            "chatSystemBubbleColor": "#42A5F5",
            "chatSystemTextColor": "#ffffff",
            "chatUserBubbleColor": "#a6e3ff",
            "chatUserTextColor": "#000000",
        },
        "exampleGoogleDocs": [
            "1LqProM_kIFbMbMfZKzvlgaFNl5ii6z5xwyAsQZ0U87Y"
        ],
        "overrideAiModel": undefined,
        "defaultAiModel": {
            "serviceName": AiServiceNames.OPEN_AI,
            "model": "gpt-3.5-turbo-16k"
        },
        "aiServiceModelConfigs": [
            {
                "serviceName": AiServiceNames.OPEN_AI,
                "modelList": [
                    {
                        "name": "gpt-3.5-turbo-16k",
                        "maxTokens": 16384,
                        "supportsWebSearch": true,
                        "onlyAdminUse": false
                    },
                    {
                        "name": "gpt-4",
                        "maxTokens": 8192,
                        "supportsWebSearch": true,
                        "onlyAdminUse": false
                    },
                    {
                        "name": "gpt-4-turbo-preview",
                        "maxTokens": 16384,
                        "supportsWebSearch": true,
                        "onlyAdminUse": false
                    }
                ]
            },
            {
                "serviceName": AiServiceNames.AZURE,
                "modelList": [
                    {
                        "name": "ABE-GPT-3_5_turbo_16k",
                        "maxTokens": 16384,
                        "supportsWebSearch": true,
                        "onlyAdminUse": false
                    },
                    {
                        "name": "ABE-gpt-4-turbo-preview",
                        "maxTokens": 16384,
                        "supportsWebSearch": true,
                        "onlyAdminUse": false
                    }
                ]
            }
        ],
        headerTitle: "AWE Army Writing Enhancement",
        orgName: "",
        surveyConfig: {
            surveyLink: "https://test-survey-link.com",
            surveyQueryParam: "userId",
            surveyClassroomParam: "classroomId"
        }
    }   
}