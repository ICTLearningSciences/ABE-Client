/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/

import { JobStatus, AiJobStatusApiRes } from "../../helpers/types";


export const analyzeHookResponse = (emotionRating: number, narrativityRating: number, jobStatus?: JobStatus): AiJobStatusApiRes => {
    let finalJustification = "";
    if (emotionRating >=1 && emotionRating <= 3) {
        finalJustification += "Your hook mostly lacks any emotion.";
    } else if (emotionRating > 3) {
        finalJustification += "Your hook contains strong emotion. Good job!";
    }

    if (narrativityRating >=1 && narrativityRating <= 3) {
        finalJustification += "Your hook lacks any narrativity.";
    } else if (narrativityRating > 3) {
        finalJustification += "Your hook contains strong narritivity. Good job!";
    }

    
    return {
        response: {
            "aiServiceResponse": {
                "aiAllStepsData": [
                    {
                        "aiServiceRequestParams": {
                            "messages": [
                                {
                                    "role": "system",
                                    "content": "You are ChatGPT, a large language model trained by OpenAI, based on the GPT-3.5 architecture. Knowledge cutoff: 2021-09."
                                },
                                {
                                    "role": "user",
                                    "content": "You are a literary and scholarly expert and have been evaluating university-level essays and thesis statements. You have been invited as an evaluation judge at USC, where a detailed and specific evaluation is expected.\n\nYour task is to find the most important and emphasized thesis statement in the essay and determine if the thesis has a strong hook (highly engaging) versus a weak hook. In particular, you want to identify areas for improvement. Consider the paragraph for the thesis. You will rate the \"hook\" of the essay on the following criteria and give your rating in this form:\n\n{\n\t“content”: \n\t{\n\t\t“thesis_statement”: str\n\t\t// actual thesis statement\n\t\t“paragraph”: str\n\t\t// paragraph in which the actual thesis statement is contained\n\t}\n\t“emotion”:\n\t// How much the paragraph invokes emotions, as opposed to abstract ideas\n\t{\n\t\t“emotions”: List of emotions that the paragraph evokes,\n\t\t“rating”: <1-5>\n\t\t// 1 being hardly any emotions evoked\n\t\t// 5 being very emotional\n\t\t“justification”: Contextual justification for the rating provided\n\t}\n\t“narrativity”:\n\t// How much the paragraph speaks about a specific person, event, story, or incident\n\t{\n\t\t“rating”: <1-5>\n\t\t// 1 being least narrative, 5 being most narrative\n\t\t“Justification”: Contextual justification for the rating provided\n\t}\n\t“overall”:\n\t{\n\t\t“rating”: <1-5>\n\t\t// considering the factors in the JSON, provide a score from 1 to 5\n\t\t// 1 being a weakest hook, 5 being the strongest hook\n}\n\nYou must respond as JSON following the format above. Only respond using valid JSON. Please check that the JSON is valid and follows the format given.\n\nThe essay you are rating is given below:\n----------------------------------------------\n\n\nAI ethics is a critical field of study and practice that aims to ensure that artificial intelligence systems are developed, deployed, and used in a responsible and morally sound manner. It encompasses a range of principles and guidelines to address concerns related to fairness, accountability, transparency, privacy, and bias in AI systems. Central to AI ethics is the need to balance the potential benefits of AI with the potential risks and consequences, while also considering the social, cultural, and legal implications of AI technologies. As AI continues to advance and integrate into various aspects of society, the ethical considerations surrounding its design and use become increasingly important in shaping a future where AI benefits humanity while minimizing harm.\n"
                                }
                            ],
                            "model": "gpt-3.5-turbo-16k"
                        },
                        "aiServiceResponse": [
                            {
                                "index": 0,
                                "message": {
                                    "role": "assistant",
                                    "content": `{\n\t\"content\": {\n\t\t\"thesis_statement\": \"The ethical considerations surrounding the design and use of AI are crucial for shaping a future where AI benefits humanity while minimizing harm.\",\n\t\t\"paragraph\": \"AI ethics is a critical field of study and practice that aims to ensure that artificial intelligence systems are developed, deployed, and used in a responsible and morally sound manner. It encompasses a range of principles and guidelines to address concerns related to fairness, accountability, transparency, privacy, and bias in AI systems. Central to AI ethics is the need to balance the potential benefits of AI with the potential risks and consequences, while also considering the social, cultural, and legal implications of AI technologies. As AI continues to advance and integrate into various aspects of society, the ethical considerations surrounding its design and use become increasingly important in shaping a future where AI benefits humanity while minimizing harm.\"\n\t},\n\t\"emotion\": {\n\t\t\"emotions\": [\"concern\", \"responsibility\", \"moral\", \"fairness\", \"accountability\", \"transparency\", \"privacy\", \"bias\", \"risks\", \"consequences\"],\n\t\t\"rating\": ${emotionRating},\n\t\t\"justification\": \"The paragraph discusses various ethical concerns, such as fairness, accountability, privacy, and bias, which evoke emotions like concern and responsibility. These emotions are central to the field of AI ethics, making the paragraph emotionally engaging.\"\n\t},\n\t\"narrativity\": {\n\t\t\"rating\": ${narrativityRating},\n\t\t\"justification\": \"The paragraph provides an overview of AI ethics, principles, and guidelines related to the design and use of AI systems. It does not extensively discuss specific incidents or stories, making it less narrative.\"\n\t},\n\t\"overall\": {\n\t\t\"rating\": 3,\n\t\t\"justification\": \"${finalJustification}\"\n\t}\n}`
                                },
                                "finish_reason": "stop"
                            }
                        ]
                    }
                ],
                "answer": `{\n\t\"content\": {\n\t\t\"thesis_statement\": \"The ethical considerations surrounding the design and use of AI are crucial for shaping a future where AI benefits humanity while minimizing harm.\",\n\t\t\"paragraph\": \"AI ethics is a critical field of study and practice that aims to ensure that artificial intelligence systems are developed, deployed, and used in a responsible and morally sound manner. It encompasses a range of principles and guidelines to address concerns related to fairness, accountability, transparency, privacy, and bias in AI systems. Central to AI ethics is the need to balance the potential benefits of AI with the potential risks and consequences, while also considering the social, cultural, and legal implications of AI technologies. As AI continues to advance and integrate into various aspects of society, the ethical considerations surrounding its design and use become increasingly important in shaping a future where AI benefits humanity while minimizing harm.\"\n\t},\n\t\"emotion\": {\n\t\t\"emotions\": [\"concern\", \"responsibility\", \"moral\", \"fairness\", \"accountability\", \"transparency\", \"privacy\", \"bias\", \"risks\", \"consequences\"],\n\t\t\"rating\": ${emotionRating},\n\t\t\"justification\": \"The paragraph discusses various ethical concerns, such as fairness, accountability, privacy, and bias, which evoke emotions like concern and responsibility. These emotions are central to the field of AI ethics, making the paragraph emotionally engaging.\"\n\t},\n\t\"narrativity\": {\n\t\t\"rating\": ${narrativityRating},\n\t\t\"justification\": \"The paragraph provides an overview of AI ethics, principles, and guidelines related to the design and use of AI systems. It does not extensively discuss specific incidents or stories, making it less narrative.\"\n\t},\n\t\"overall\": {\n\t\t\"rating\": 3,\n\t\t\"justification\": \"${finalJustification}\"\n\t}\n}`
            },
            jobStatus: jobStatus || JobStatus.COMPLETE
        }
    }
}