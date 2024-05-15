/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/

import { AiServiceNames } from "../../src/types";
import { Config } from "../helpers/types"

interface FetchConfigResponse {
    fetchConfig: Config;
}

export const fetchConfigResponse: FetchConfigResponse = {
    "fetchConfig": {
        "aiSystemPrompt": [
            "You are ChatGPT, a large language model trained by OpenAI, based on the GPT-3.5 architecture. Knowledge cutoff: 2021-09.",
            "You are a professor that speaks very eloquently and in short sentences."
        ],
        "displayedGoals": undefined,
        "displayedActivities": undefined,
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
        ]
    }
}