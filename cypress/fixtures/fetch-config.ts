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
                "activities": []
              },
            {
                "goal": "6580e5640ac7bcb42fc8d27f",
                activities: [
                { activity: '6580e4e80ac7bcb42fc8d279', disabled: false },
                { activity: '658230f699045156193339ac', disabled: false },
                { activity: '65a8592b26523c7ce5acac9e', disabled: false },
                { activity: '65a8592b26523c7ce5acacsa', disabled: false },
                ],
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
        "availableAiServiceModels": [
            {
                "serviceName": AiServiceNames.OPEN_AI,
                "models": [
                    "gpt-3.5-turbo-16k",
                    "gpt-4",
                    "gpt-4-turbo-preview"
                ]
            },
            {
                "serviceName": AiServiceNames.AZURE,
                "models": [
                    "ABE-GPT-3_5_turbo_16k",
                    "ABE-gpt-4-turbo-preview"
                ]
            }
        ],
        headerTitle: "AWE Army Writing Enhancement",
        orgName: ""
    }   
}