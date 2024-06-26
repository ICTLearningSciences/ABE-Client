/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { GQLPrompt } from "../helpers/types";

export interface FetchPromptsResponse {
    fetchPrompts: GQLPrompt[];
}

export const fetchPromptTemplates: FetchPromptsResponse =  {
    "fetchPrompts": [
            {
                "_id": "654e926e7aaab424574a7de6",
                "title": "Reverse Outline Thesis, Claims, Evidence",
                "clientId": "",
                "userInputIsIntention": false,
                "aiPromptSteps": [
                    {
                        "prompts": [
                            {
                                "promptText": "You are a literary and scholarly expert and have been evaluating university-level essays and thesis statements. You have been invited as an evaluation judge of writing quality, where a detailed and specific evaluation is expected.\n\nYour task is to find the most likely thesis statement for that essay and where it lacks support. For the thesis statement, I want you to evaluate the support claims that are required for the thesis statement to be valid. Based on this goal and the format below, output a list of paragraphs in the essay might be improved by adding more support for specific claims.\n\n{\n\t“thesisStatement”: str ,\n\t// return the most likely thesis statement from the essay\n\t“importantSupportingClaims” : [str]\n\t// List of key claims that are needed to support this thesis \n\t“areasToImproveSupportForClaim” : [\n\t { \n\t\t\"claim\": str,   // The first primary claim that supports the thesis statement.\n \t  \t\"missingEvidence\": [ // Support that is missing for this claim\n\t\t\t{\n\t\t\t\t“supportingEvidence” : str // the supporting evidence that is missing for the claim\n\t\t\t\t“justification: str // how the supporting evidence affectively supports the claim\n\t\t\t},\n                       {\n                               ...\n                        }\n                ]\n        },\n        {\n                      ...\n        }\n       ],\n       \"overall\": {\n           \"justification\": str // an overall statement about how well the the paper supports its thesis through its claims and how well its claims are supported. You are responding to a message from the student writer, so please refer to them in the second person\n           \"thesisSupportRating\": number // 1-5 rating of how well the paper supports its thesis with claims\n           \"claimsSupportRating\": number // 1-5 rating of how well the paper supports its claims\n        }\n}\nYou must respond as JSON following the format above. Only respond using valid JSON. Please check that the JSON is valid and follows the format given. Do NOT include any JSON markdown, only JSON data.\n",
                                "includeEssay": true,
                                "includeUserInput": false,
                                "promptRole": null
                            }
                        ],
                        "targetAiServiceModel": {
                            "serviceName": "OPEN_AI",
                            "model": "gpt-3.5-turbo-16k"
                        },
                        "systemRole": "",
                        "outputDataType": "JSON",
                        "includeChatLogContext": false,
                        "responseFormat": ""
                    }
                ]
            },
            {
                "_id": "6597e19cbe5c8774bb51b4d6",
                "title": "Review Sources",
                "clientId": "",
                "userInputIsIntention": false,
                "aiPromptSteps": [
                    {
                        "prompts": [
                            {
                                "promptText": "You are a literary and scholarly expert and have been evaluating university-level essays and thesis statements. You have been invited as an evaluation judge at USC, where a detailed and specific evaluation is expected.\n\nYour task is to find important statements in the essay that have been made without adequate references for three possible reasons:\n•\tLacks Reference: A claim is made which would require external verification but that has no citation or reference given\n•\tLow Quality Reference: A claim is made with a reference that is not a strong source in that field (e.g., in a science article, a citation to a popular magazine or blog instead of a scientific article).\n•\tVague Evidence: Cites a source but lacks specific supporting evidence from the reference (e.g., lacks hard numbers or details). \nGive a justification that is specific to the content, and include what could have been added as a support to make that statement more authoritative to read. \n\nEach issue should be output in a JSON format as shown below:\n{\n   “Sentence“: str, \\\\ \"<Reference name as mentioned>\",\n   “Type” : str \\\\ If the issue is “Lacks Reference”, “Low Quality Reference” or “Vague Evidence”\n   “Justification”: str  \\\\ \"<Justification for why without evidence or references>\"\n} \n\nYou must respond as JSON following the format above. Only respond using valid JSON. Please check that the JSON is valid and follows the format given.\n",
                                "includeEssay": true,
                                "includeUserInput": false,
                                "promptRole": null
                            }
                        ],
                        "targetAiServiceModel": null,
                        "systemRole": "",
                        "outputDataType": "JSON",
                        "includeChatLogContext": false,
                        "responseFormat": ""
                    },
                    {
                        "prompts": [
                            {
                                "promptText": "Summarize the justification for each issue listed in the JSON as a numbered list.",
                                "includeEssay": false,
                                "includeUserInput": false,
                                "promptRole": null
                            }
                        ],
                        "targetAiServiceModel": null,
                        "systemRole": "",
                        "outputDataType": "TEXT",
                        "includeChatLogContext": false,
                        "responseFormat": ""
                    }
                ]
            },
            {
                "_id": "6597e1cbbe5c8774bb51b4d7",
                "title": "Originality & New Angles",
                "clientId": "",
                "userInputIsIntention": false,
                "aiPromptSteps": [
                    {
                        "prompts": [
                            {
                                "promptText": "You are a literary and scholarly expert and have been evaluating university-level essays and thesis statements. You have been invited as an evaluation judge at USC, where a detailed and specific evaluation is expected.\n\nYour task is to find the most likely thesis statement for that essay and where it lacks support. For the thesis statement, I want you to evaluate the support claims that are required for the thesis statement to be valid. Based on this goal and the format below, output how predictable these claims are.  Have these claims been made often before or are they formulaic and often-repeated?\n\n{\n\t“Thesis Statement”: str ,\n\t// return the most likely thesis statement from the essay\n\t“Important Supporting Claims” : \n\t// List of key claims that are needed to support this thesis \n\t“Areas to Improve Support for Claims” : [\n\t { \n\t\t\"Claim A\": str,   // The first primary claim that supports the thesis statement.\n \t  \t \"Novelty\":  \n\t\t\t{\n\t\t\t\t“Frequency” : int // How many people have seen this claim, from 1 = Extremely infrequent and novel, never to 5 = Common knowledge, said often\n\t\t\t\t“Predictability\": int // How predictable is this claim based on what you'd expect, from 1= Highly Surprising to 5 = Very Predictable\n                               \"Justification\" : str // The reason this is novel versus highly familiar\n\t\t\t},\n\t\t\"Claim B\": \"The first primary claim that supports the thesis statement.\",\n\t \t \"Novelty B1\": \n\t\t\t{\n\t\t\t\t“Frequency” : int\n\t\t\t\t“Predictability\": int\n                              \"Justification\" : str\n\t\t\t},\n\t}\nYou must respond as JSON following the format above. Only respond using valid JSON. Please check that the JSON is valid and follows the format given.\n\nThe essay you are rating is given below:\n----------------------------------------------\n",
                                "includeEssay": true,
                                "includeUserInput": false,
                                "promptRole": null
                            }
                        ],
                        "targetAiServiceModel": null,
                        "systemRole": "",
                        "outputDataType": "JSON",
                        "includeChatLogContext": false,
                        "responseFormat": ""
                    }
                ]
            },
            {
                "_id": "6597e24abe5c8774bb51b4d8",
                "title": "Expand Perspectives",
                "clientId": "",
                "userInputIsIntention": false,
                "aiPromptSteps": [
                    {
                        "prompts": [
                            {
                                "promptText": "You are a literary and scholarly expert and have been evaluating university-level essays and thesis statements. You have been invited as an evaluation judge at USC, where a detailed and specific evaluation is expected.\n\nYour task is to find the key stakeholders covered in that essay and determine if any key viewpoints are missing. You will rate the stakeholders in the essay based on their importance and relevance in the essay, and return the output in a JSON format as:\n\n{\n\t“Stakeholders Covered”: [str]\n\t// list of all the stakeholders covered in the essay, in decreasing order of importance\n\n\t“Stakeholders Missing”: [str]\n\t// List of all the stakeholders whose views are important to or affected by the essay but whose views do not appear well-represented in the essay, in decreasing order of importance\n\t“Justification”: str\n\t// give a justification for why certain stakeholders are missing. Give examples for the first 2 important stakeholders who are missing\n}\n\nYou must respond as JSON following the format above. Only respond using valid JSON. Please check that the JSON is valid and follows the format given.\n \n",
                                "includeEssay": true,
                                "includeUserInput": false,
                                "promptRole": null
                            }
                        ],
                        "targetAiServiceModel": null,
                        "systemRole": "",
                        "outputDataType": "JSON",
                        "includeChatLogContext": false,
                        "responseFormat": ""
                    },
                    {
                        "prompts": [
                            {
                                "promptText": "Summarize this JSON in plain text, as bullet points and without talking about the JSON formatting it was stored in.",
                                "includeEssay": false,
                                "includeUserInput": false,
                                "promptRole": null
                            }
                        ],
                        "targetAiServiceModel": null,
                        "systemRole": "",
                        "outputDataType": "TEXT",
                        "includeChatLogContext": false,
                        "responseFormat": ""
                    }
                ]
            },
            {
                "_id": "6597e27dbe5c8774bb51b4d9",
                "title": "Vagueness Detection",
                "clientId": "",
                "userInputIsIntention": false,
                "aiPromptSteps": [
                    {
                        "prompts": [
                            {
                                "promptText": "You are a literary and scholarly expert and have been evaluating university-level essays and thesis statements. You have been invited as an evaluation judge at USC, where a detailed and specific evaluation is expected.\n\nYour task is to evaluate if the thesis statement paragraph, conclusion, and key claims are clear and not vague. Find the thesis statement paragraph and indicate if it is vague and suggest which areas appear weakest. Then, perform this task for the concluding paragraph and up to 3 claim paragraphs which appear vague.\n\n{\n\t“Thesis”: {\n\t\t“Paragraph Text” :  str,  // The full text of the thesis statement paragraph\n\t\t“Thesis Statement” : str , // The text of the main thesis statement sentence\n\t\t“Rating” : int \t\t       // How vague the paragraph is from 1-5\n\t\t“Areas for Improvement” : [str] // List of weak areas (changes made)\n\t},\n\t“Conclusion”: {\n\t\t“Paragraph Text” : str , \t// The full text of the concluding paragraph\n\t\t“Main Conclusion Statement” : str , // The text of the main conclusion statement sentence\n\t\t“Rating” : int \t\t // How vague the paragraph is from 1-5\n\t\t“Areas for Improvement” : [str] // List of weak areas (changes made)\n\t},\n\t“Paragraph 1”: \n\t\t{\n\t\t“Paragraph Text” : ,  // The full text of the concluding paragraph\n\t\t“Main Claim” : str , // The text of the main conclusion statement sentence\n\t\t“Rating” : int   \t// How vague the paragraph is from 1-5\n\t\t“Areas for Improvement” : [str] // List of weak areas (changes made)\n\t\t}\n}\n\nYou must respond as JSON following the format above. Only respond using valid JSON. Please check that the JSON is valid and follows the format given.\n\nThe essay you are reviewing is given below:\n----------------------------------------------\n",
                                "includeEssay": true,
                                "includeUserInput": false,
                                "promptRole": null
                            }
                        ],
                        "targetAiServiceModel": null,
                        "systemRole": "",
                        "outputDataType": "JSON",
                        "includeChatLogContext": false,
                        "responseFormat": ""
                    }
                ]
            },
            {
                "_id": "6597e33ebe5c8774bb51b4da",
                "title": "1 Hook Analysis",
                "clientId": "",
                "userInputIsIntention": false,
                "aiPromptSteps": [
                    {
                        "prompts": [
                            {
                                "promptText": "You are a literary and scholarly expert and have been evaluating university-level essays and thesis statements. You have been invited as an evaluation judge for writing, where a detailed and specific evaluation is expected.\n\nYour task is to find the most important and emphasized thesis statement in the essay and determine if the thesis has a strong hook (highly engaging) versus a weak hook. In particular, you want to identify areas for improvement. Consider the paragraph for the thesis and the title. ONLY rate the hook based upon this introduction, do not consider later paragraphs.  You will rate the \"hook\" of the essay on the following criteria:\n\n{\n\t“content”: \n\t{\n\t\t“thesis_statement”: str,   // Main thesis statement. This should typically be found in the first paragraph\n\t\t“paragraph”: str // extract the paragraph in which the main thesis statement is contained\n\t}\n\t“emotion”:\n\t// How much the paragraph invokes emotions, as opposed to abstract ideas\n\t{\n\t\t“emotions”: [str] // List of emotions that the paragraph evokes,\n\t\t“rating”: int, // Emotional evocativeness rated from 1 to 5. A rating of 1 1 means hardly any emotions evoked (extremely dry), 2 means limited use of emotions or emotional language, 3 means a typical amount of emotion for a personal conversation, 4 means it engages with significant emotions, and 5 being very emotional and helping the reader feel the emotions or events\n\t\t“justification”: str // Contextual justification for the rating provided\n\t},\n\t“narrativity”:\n\t// How much does the paragraph describe a specific event, story, incident, or persons?\n\t{\n               \"characters\" : [str], // List every person or agent in the paragraph, including the essay writer if relevant. Carefully consider each noun of the content paragraph. Please check that all people are listed.\n               \"places\" : [str], // List of places or locations described in the paragraph\n                \"events\" : [str] // List the events and conflicts in the story. Please\n\t\t“rating”: int, // Rating of narrativity from 1 to 5, where 1 is the least narrative (no story at all), rating 2 is vaguely refers to a story, rating 3 is describes an event but only briefly, rating 4 is a specific story with clear characters and events, and rating 5 is highly narrative where most of the paragraph is tied to a detailed story\n\t\t“justification”: str // Contextual justification for the rating provided\n\t},\n\t“overall”:\n\t{\n\t\t“rating”: int, // Considering the factors in the JSON, provide a score from 1 to 5, 1 being a weakest hook, 5 being the strongest hook\n               \"justification\": str // In 2 of 3 sentences, please explain your rating to the writer, based on your ratings and justifications for both emotions and narrativity. Focus on emotions and narrativity. Include constructive criticism, using I statements (e.g., \"I liked\", \"x interested me the most\"). Also state what you would like to see expanded or strengthened. Do not provide the rating numbers in your justification.\n}\n}\n",
                                "includeEssay": true,
                                "includeUserInput": false,
                                "promptRole": null
                            }
                        ],
                        "targetAiServiceModel": null,
                        "systemRole": "",
                        "outputDataType": "JSON",
                        "includeChatLogContext": false,
                        "responseFormat": ""
                    }
                ]
            },
            {
                "_id": "6597e3e42e029947c96556f4",
                "title": "N Entity Detection and Ranking",
                "clientId": "9175c103-b86a-49db-8e1a-a63e1154b41b",
                "userInputIsIntention": false,
                "aiPromptSteps": [
                    {
                        "prompts": [
                            {
                                "promptText": "You are a professor helping a student with their writing, who will read two pieces of writing from a student: their Essay and their Message. \n\nThe user input has a message from the student where they share personal experiences. Review these personal experiences for narrative hooks that raise interesting questions about the essay provided. ONLY consider entities and experiences from the brief message in the user input, and do not include entities from the essay. Summarize each experience or interesting entity using as few words as possible (2 to 6 words ideally). Please include the specific people or places from the student's experience. List them rank in order of which ones would be most interesting to connect to the student's thesis. Then, provide an overall \"response\" which which talks about how these experiences relate to the essay.\n\n{\n\t“experiences”: [\n         {\n              \"experience\" : str, // Entity which did something or question about entity\n              \"interest\" : int // Number from 1-5, where 1 is least interesting and unsurprising and 5 is extremely interesting or unexpected\n              \"justification\" : str // A single sentence about why the experience is interesting when connected to the essay\n              \"question: str // A question that a reader might want to know about the experience, and how it relates to the essay\n         },\n         ],\n         \"response\": str // Message to the student about which parts of the experiences were most interesting, using first-person I statements. You MUST start with a statement like: \"Thanks. I could think of a few ways you could use this.\" Then you must use a numbered list with exactly 2 sentences for each experience: 1 sentence justification about what you found interesting and 1 question about what you'd want to know more about. Be encouraging and express curiosity. Have a little encouraging words like \"Great!\" Do not generate an edited essay or example. \n}\n\nYou must respond as JSON following the format above. Only respond using valid JSON. Please check that the JSON is valid and follows the format given.\n",
                                "includeEssay": true,
                                "includeUserInput": true,
                                "promptRole": "user"
                            }
                        ],
                        "targetAiServiceModel": null,
                        "systemRole": "",
                        "outputDataType": "JSON",
                        "includeChatLogContext": false,
                        "responseFormat": ""
                    }
                ]
            },
            {
                "_id": "659dd7664575cc2a8f595375",
                "title": "Army Style Review",
                "clientId": "4a224649-8a00-45df-929d-a4299b277b82",
                "userInputIsIntention": false,
                "aiPromptSteps": [
                    {
                        "prompts": [
                            {
                                "promptText": "You are an Army officer who is an expert in the Army writing style. The Army writing style has the following key criteria:\n1. BLUF - Bottom Line Up Front: Put the recommendation, conclusion, or reason for writing—the “ bottom line ”—in the first or second paragraph, not at the end.\n2. Active Voice: Use the active voice.\n3. Short Sentences: Use short sentences (an average of 15 or fewer words).\n4. Concise Language: Use short words (three syllables or fewer). (See the clarity index in paragraph 4–3.)\n5. Brief Paragraphs: Write paragraphs that, with few exceptions, are no more than 250 characters long.\n6. Grammar: Use correct spelling, grammar, and punctuation.\ng. Direct Pronouns: Use “I\",“you” and “we” as subjects of sentences instead of “this office\", “this headquarters\", “all individuals\", and so forth, for most kinds of writing.\n\nPlease rate the quality of this essay on each criteria and reply with JSON in the following format:\n{\n     Bottom Line Up Front: \n    {\n       Rating: int,  // Rate from 1-5 how well this document states its purpose quickly and clearly in the first few sentences, such as a recommendation for action. Any recommendation or conclusion should be specific about who, what, and why the conclusion was made\n       BLUF Summary: str, // Summarize the \"Bottom Line\" purpose of this document in a single sentence under 20 words\n       Issues: // List 0 to 3 issues that might be improved for the BLUF\n       [\n            {\n                Passage 1 : str, // A copy of the sentence or passage which state states the purpose\n                Explanation: str, // An explanation how the passage might be improved to state the bottom line up front more clearly. This should check the purpose is specific, including that both the problem and solution is clear.\n                Suggestion: str, // If the rating was poor, suggest an improved bottom line up front statement for the purpose of this writing. Briefly state the purpose of the paper who, what, and why using specific names (e.g., names, equipment, locations). \n            }\n        ]\n    },\n    Active Voice: \n    {\n     Rating: int,  // Rate from 1-5 how well this document uses active voice, where a 1 is less than 60% and a 5 is over 95% of sentences\n       Active Count: int, // A count of the number of sentences using only active voice\n       Passive Count: int, // A count of the number of sentences using passive voice at least once\n       Total Count: int, // A count of the total number of sentences\n       Issues: // List 0 to 5 issues that might be improved for active voice. List the most passive with the least clear action statements first\n       [\n            {\n                Passage 1 : str // A copy of the sentence or passage which has the problem\n                Explanation: str // An explanation how the passage might be improved to use active voice, such as a suggestion to rewrite the passage such as \"try instead, <Passage 1 re-written in active voice>\"\n            }\n        ]\n    },\n    Short Sentences: \n    {\n     Rating: int,  // Rate from 1-5 how well this document uses short sentences under 15 words. Count the percentage of sentences with more than 15 words, and rate as 1 when less than 60% and a 5 is over 95% of sentences\n       Too Long Count: int, // A count of the number of sentences with more than 15 words\n       Long Count: int // A count of the number of sentences with 11 to 15 words\n       Short Count: int, // A count of the number of sentences under 10 words\n       Total Count: int, // A count of the total number of sentences\n       Issues: // List the 20 longest and least clear sentences which could be improved by breaking them up or shortening them, in order starting with the longest and least clear. Do not list any sentences shorter than 15 words.\n       [\n            {\n                Passage 1 : str // A copy of the sentence which is too long\n                Explanation: str // An explanation how the passage might be improved, such as breaking into more sentences or more direct language\n            }\n        ]\n    }\n}\n\nAll suggested text should be stated concisely and using active voice.",
                                "includeEssay": true,
                                "includeUserInput": false,
                                "promptRole": "user"
                            }
                        ],
                        "targetAiServiceModel": null,
                        "systemRole": "",
                        "outputDataType": "JSON",
                        "includeChatLogContext": false,
                        "responseFormat": ""
                    },
                    {
                        "prompts": [
                            {
                                "promptText": "The JSON contains a review of a writing passage against the Army Style guidelines. Please provide a summary which states the overall quality of the writing where a good-quality writing product should be rated at least 4 on all criteria and a 5 on most criteria. Then, note which of the criteria were high quality (rating of 5), which need some improvement (rating of 4), and which need significant improvement.  Do not list the numerical ratings but state them in a text form. Start each criteria which needs improvement in a new paragraph, and summarize the suggested improvements as bullet points with appropriate quotation marks were appropriate. If a quality category has no bullet points, then skip that category. ",
                                "includeEssay": false,
                                "includeUserInput": false,
                                "promptRole": "user"
                            }
                        ],
                        "targetAiServiceModel": null,
                        "systemRole": "",
                        "outputDataType": "TEXT",
                        "includeChatLogContext": false,
                        "responseFormat": ""
                    }
                ]
            },
            {
                "_id": "65a622d688aa62b94041f87e",
                "title": "N-3 Compare Story to Hook",
                "clientId": "0c289f10-9d47-4ea0-90e1-d7c4d2dc79be",
                "userInputIsIntention": false,
                "aiPromptSteps": [
                    {
                        "prompts": [
                            {
                                "promptText": "I am going to provide you with a story that the user wrote, and an essay that the user wrote. Your task is to see how the users story can be used to improve the narrativity of the users thesis in their essay.\n\nPlease answer this question starting with \"Thank you. I could think of a few ways to connect this with what you have so far.\" Then use a numbered list of points to answer the question: \n\nWhat are three ways you would find interesting, emotionally-evocative, and original to connect this user's story input with the thesis of the essay?  Please build on the strengths of the current essay.\n\nEach point must refer to the story in the user input. Each point must be 16 to 30 words. Do not include points that the current essay already makes. Refer to specific people and events from the user input and answer directly to the user (say \"you\" rather than \"the user\").\n1. <Story Aspect>: 1 sentence about why you find this part of the story interesting. 1 sentence about a place or idea in the current essay where you connect this story.",
                                "includeEssay": true,
                                "includeUserInput": true,
                                "promptRole": "user"
                            }
                        ],
                        "targetAiServiceModel": null,
                        "systemRole": "",
                        "outputDataType": "TEXT",
                        "includeChatLogContext": false,
                        "responseFormat": ""
                    }
                ]
            },
            {
                "_id": "65a752f7005cd6556ad048aa",
                "title": "E-1A Audience and Emotion detection",
                "clientId": "230fadff-8b42-43f6-988e-f9612535ee9f",
                "userInputIsIntention": false,
                "aiPromptSteps": [
                    {
                        "prompts": [
                            {
                                "promptText": "You are a USC professor grading a papers hook/thesis. Your student was asked to write down a list of expected audience members for their essay, and what emotions they'd like to convey to each audience member. Please extract each audience member and what emotions the student would like to convey to each audience member.\n\n{\n\t“audience”: [\n         {\n              \"name\": \"audienceName1\",\n              \"emotions\": [\"emotion1\", \"emotion2\"]\n         }\n         ]\n}\n\nYou must respond as JSON following the format above. Only respond using valid JSON. Please check that the JSON is valid and follows the format given.",
                                "includeEssay": false,
                                "includeUserInput": true,
                                "promptRole": "user"
                            }
                        ],
                        "targetAiServiceModel": null,
                        "systemRole": "",
                        "outputDataType": "TEXT",
                        "includeChatLogContext": false,
                        "responseFormat": ""
                    }
                ]
            },
            {
                "_id": "65ae913f040d2f6550779bca",
                "title": "Hook Emotions",
                "clientId": "ae4605ff-601f-4b9c-bcbb-9ea70b98c564",
                "userInputIsIntention": false,
                "aiPromptSteps": [
                    {
                        "prompts": [
                            {
                                "promptText": "You are a literary and scholarly expert and have been evaluating university-level essays and thesis statements. You have been invited as an evaluation judge for writing, where a detailed and specific evaluation is expected.\n\nCan you help brainstorm some narrative content about the life experiences in this writing that would strengthen this essay that focus on the emotions and feeling of why this is important? Please list specific emotions and examples. List emotions in order of importance to the narrative and prioritize emotions that are not already present in the hook.\n",
                                "includeEssay": true,
                                "includeUserInput": false,
                                "promptRole": "user"
                            }
                        ],
                        "targetAiServiceModel": null,
                        "systemRole": "",
                        "outputDataType": "TEXT",
                        "includeChatLogContext": false,
                        "responseFormat": ""
                    }
                ]
            },
            {
                "_id": "65af12d1695c606add8ae8f4",
                "title": "(Test) Stronger Hook",
                "clientId": "64199576-4931-438d-b7d4-3b9a215d7b93",
                "userInputIsIntention": false,
                "aiPromptSteps": [
                    {
                        "prompts": [
                            {
                                "promptText": "You are a literary and scholarly expert and have been evaluating university-level essays and thesis statements. You have been invited as an evaluation judge at USC, where a detailed and specific evaluation is expected.\n\nYour task is to find the most important and emphasized thesis statement in the essay and determine if the thesis has a strong hook (highly engaging) versus a weak hook. In particular, you want to identify areas for improvement. Consider the paragraph for the thesis. You will rate the \"hook\" of the essay on the following criteria:\n\n{\n\t“content”: \n\t{\n\t\t“thesis_statement”: str\n\t\t// actual thesis statement\n\t\t“paragraph”: str\n\t\t// paragraph in which the actual thesis statement is contained\n\t}\n\t“emotion”:\n\t// How much the paragraph invokes emotions, as opposed to abstract ideas\n\t{\n\t\t“emotions”: List of emotions that the paragraph evokes,\n\t\t“rating”: <1-5>\n\t\t// 1 being hardly any emotions evoked\n\t\t// 5 being very emotional\n\t\t“justification”: Contextual justification for the rating provided\n\t}\n\t“narrativity”:\n\t// How much the paragraph speaks about a specific person, event, story, or incident\n\t{\n\t\t“rating”: <1-5>\n\t\t// 1 being least narrative, 5 being most narrative\n\t\t“Justification”: Contextual justification for the rating provided\n\t}\n\t“overall”:\n\t{\n\t\t“rating”: <1-5>\n\t\t// considering the factors in the JSON, provide a score from 1 to 5\n\t\t// 1 being a weakest hook, 5 being the strongest hook\n               \"Justification\": // Based on the users emotion and narrativity ratings, provide a total of 2 sentences, and please include the scores in your sentences.\n}\n\n",
                                "includeEssay": true,
                                "includeUserInput": false,
                                "promptRole": "user"
                            }
                        ],
                        "targetAiServiceModel": null,
                        "systemRole": "",
                        "outputDataType": "JSON",
                        "includeChatLogContext": false,
                        "responseFormat": ""
                    }
                ]
            },
            {
                "_id": "65afec279a81dc65f39bbf71",
                "title": "Reverse Outline",
                "clientId": "fdacda84-e67c-46ed-9e17-1723e0f85e09",
                "userInputIsIntention": false,
                "aiPromptSteps": [
                    {
                        "prompts": [
                            {
                                "promptText": "You are a literary and scholarly expert and have been evaluating university-level essays and thesis statements. You have been invited as an evaluation judge of writing, where a detailed and specific evaluation is expected.\n\nYour task is to generate an outline for this writing. This outline should have a logical inverted pyramid structure. First, identify the most likely thesis statement for that essay. For the thesis statement, I want you to evaluate the claims that made to support the thesis statement. Based on this goal and the format below, list each main point.\n\n{\n\t“Thesis Statement”: str ,\n\t// return the most likely thesis statement from the essay\n\t“Supporting Claims” : [str]\n\t// List of key claims that are needed to support this thesis \n\t“Evidence Given for Each Claim” : [\n\t { \n\t\t\"Claim A\": str,   // The first primary claim that supports the thesis statement.\n \t  \t \"Claim A Evidence\": [str]  // List of evidence provided for this claim,\n\t\t\"Claim B\": str,   // The first primary claim that supports the thesis statement.\n \t  \t \"Claim B Evidence\": [str]  // List of evidence provided for this claim,\n\t}\n}\nYou must respond as JSON following the format above. Only respond using valid JSON. The thesis statement, claims, and evidence must all be described in briefly (20 words or less). Please check that the JSON is valid and follows the format given.\n\nThe essay you are rating is given below:\n----------------------------------------------\n",
                                "includeEssay": true,
                                "includeUserInput": false,
                                "promptRole": "user"
                            }
                        ],
                        "targetAiServiceModel": null,
                        "systemRole": "",
                        "outputDataType": "JSON",
                        "includeChatLogContext": false,
                        "responseFormat": ""
                    }
                ]
            },
            {
                "_id": "65b87466dd9a050559af68ba",
                "title": "N-2 Help Me Brainstorm",
                "clientId": "13adae3d-bd41-43a6-ac9a-c06810deda7b",
                "userInputIsIntention": false,
                "aiPromptSteps": [
                    {
                        "prompts": [
                            {
                                "promptText": "You are a literary and scholarly expert and have been evaluating university-level essays and thesis statements. You have been invited as an evaluation judge at USC, where a detailed and specific evaluation is expected.\n\nYour task is to review the users essay and provide them a few questions that will get them thinking about things that will improve the narrativity of their essay. Please provide 3 questions (and no more than 5), with the most novel and compelling listed first.",
                                "includeEssay": true,
                                "includeUserInput": false,
                                "promptRole": "user"
                            }
                        ],
                        "targetAiServiceModel": null,
                        "systemRole": "",
                        "outputDataType": "TEXT",
                        "includeChatLogContext": false,
                        "responseFormat": ""
                    }
                ]
            },
            {
                "_id": "65b876425d92d7f15e694a63",
                "title": "N-4 Relate story and revision to hook",
                "clientId": "4d960d95-fb1e-4ab5-aba7-8f80396b2154",
                "userInputIsIntention": true,
                "aiPromptSteps": [
                    {
                        "prompts": [
                            {
                                "promptText": "You will be provided with both a story and a revision that the user has stated that they would like to incorporate into their essay. Please provide constructive criticism about how the user's revision was worked into the \"hook\" at the start of the paper. Speak to the user in the second person perspective and state your views subjectively (e.g., \"I liked how you\"). Answer in 2-4 short sentences.",
                                "includeEssay": true,
                                "includeUserInput": true,
                                "promptRole": "user"
                            }
                        ],
                        "targetAiServiceModel": null,
                        "systemRole": "",
                        "outputDataType": "TEXT",
                        "includeChatLogContext": false,
                        "responseFormat": ""
                    }
                ]
            },
            {
                "_id": "65b8775765e5a0d202475c94",
                "title": "E-2 Comment on Proposed Revision",
                "clientId": "2ee889f3-9ec9-4d11-a42e-e9bcfe5fac82",
                "userInputIsIntention": true,
                "aiPromptSteps": [
                    {
                        "prompts": [
                            {
                                "promptText": "Provide some analysis and comments on the revision that the user would like to do to their essay. Max 100 words.",
                                "includeEssay": true,
                                "includeUserInput": false,
                                "promptRole": "user"
                            }
                        ],
                        "targetAiServiceModel": null,
                        "systemRole": "",
                        "outputDataType": "TEXT",
                        "includeChatLogContext": false,
                        "responseFormat": ""
                    }
                ]
            },
            {
                "_id": "65b8781668b6a0e94c7bee47",
                "title": "E-3 Analyze Doc Revision",
                "clientId": "060581ea-1a99-4830-be38-42a9f627b36b",
                "userInputIsIntention": false,
                "aiPromptSteps": [
                    {
                        "prompts": [
                            {
                                "promptText": "You will be provided with the users proposed revision and their final essay. Please comment on how well they incorporated the revision into their final essay.",
                                "includeEssay": true,
                                "includeUserInput": true,
                                "promptRole": "user"
                            }
                        ],
                        "targetAiServiceModel": null,
                        "systemRole": "",
                        "outputDataType": "TEXT",
                        "includeChatLogContext": false,
                        "responseFormat": ""
                    }
                ]
            },
            {
                "_id": "65b9a2bd609726ae17d2b9d3",
                "title": "E-1B Audience Analysis",
                "clientId": "3b8c3e83-70a8-4155-8086-17942d1a198e",
                "userInputIsIntention": false,
                "aiPromptSteps": [
                    {
                        "prompts": [
                            {
                                "promptText": "Analyze this list of readers and emotions that the user would like to incorporate into their essay, and provide some input in the form of a list of how they may achieve this.",
                                "includeEssay": true,
                                "includeUserInput": false,
                                "promptRole": "user"
                            }
                        ],
                        "targetAiServiceModel": null,
                        "systemRole": "",
                        "outputDataType": "TEXT",
                        "includeChatLogContext": false,
                        "responseFormat": ""
                    }
                ]
            },
            {
                "_id": "65c1c2e01391ce4d5e146359",
                "title": "Key Phrases Thesaurus",
                "clientId": "61169e89-ae24-419f-aae2-4c0bcac1be52",
                "userInputIsIntention": false,
                "aiPromptSteps": [
                    {
                        "prompts": [
                            {
                                "promptText": "You are a writing coach who specializes in helping college students improve their writing. The student you are working with has written the essay below.\n\nYour task is to extract the five most important words and/or phrases from the student’s essay, then, for each word/phrase, suggest three synonyms that are more specific and appropriate in the context of the essay.\n\n{“current key words/phrases”: str // extract the five most important words and/or phrases from the student’s essay\n}\n\n{“suggested  key words/phrases”: str // for each identified important word and/or phrases suggest three synonyms that are more specific\n}",
                                "includeEssay": true,
                                "includeUserInput": false,
                                "promptRole": "user"
                            }
                        ],
                        "targetAiServiceModel": null,
                        "systemRole": "",
                        "outputDataType": "TEXT",
                        "includeChatLogContext": false,
                        "responseFormat": ""
                    }
                ]
            },
            {
                "_id": "65c472cc54e40846ca49a84c",
                "title": "Raison d'être",
                "clientId": "0675999e-e983-4177-826f-9edc92c81248",
                "userInputIsIntention": false,
                "aiPromptSteps": [
                    {
                        "prompts": [
                            {
                                "promptText": "You are a literary and scholarly expert and have been evaluating university-level essays and thesis statements. You have been invited as an evaluation judge at USC, where a detailed and specific evaluation is expected.\n\nYour task is to find the key point they would like to emphasize regarding this subject. Further, your task is to determine what is the central theme they consider to be the most significant in relation to this subject?\n\nGive the user two possible options in the following form:\n\n{\n\t“key point”: str ,\n\t// return the most likely thesis statement from the essay\n\t“Important Supporting Claims” : \n\t// List of key claims that are needed to support this thesis \n\t“Areas to Improve Support for Claims” : [\n\t { \n\t\t\"Claim A\": str,   // The first primary claim that supports the thesis statement.\n \t  \t \"Novelty\":  \n\t\t\t{\n\t\t\t\t“Frequency” : int // How many people have seen this claim, from 1 = Extremely infrequent and novel, never to 5 = Common knowledge, said often\n\t\t\t\t“Predictability\": int // How predictable is this claim based on what you'd expect, from 1= Highly Surprising to 5 = Very Predictable\n                               \"Justification\" : str // The reason this is novel versus highly familiar\n\t\t\t},\n\t}\nYou must respond as JSON following the format above. Only respond using valid JSON. Please check that the JSON is valid and follows the format given.\n\nThe essay you are rating is given below:\n----------------------------------------------\n",
                                "includeEssay": true,
                                "includeUserInput": false,
                                "promptRole": "user"
                            }
                        ],
                        "targetAiServiceModel": null,
                        "systemRole": "",
                        "outputDataType": "JSON",
                        "includeChatLogContext": false,
                        "responseFormat": ""
                    },
                    {
                        "prompts": [
                            {
                                "promptText": "Consider the provided content. Look at the justification given for missing evidence. Summarize in a 2 or 3 sentence paragraph, which talks about one or two key claims that could have more evidence.",
                                "includeEssay": false,
                                "includeUserInput": false,
                                "promptRole": "user"
                            }
                        ],
                        "targetAiServiceModel": null,
                        "systemRole": "",
                        "outputDataType": "TEXT",
                        "includeChatLogContext": false,
                        "responseFormat": ""
                    }
                ]
            },
            {
                "_id": "65ca61d30a269cf7467539b9",
                "title": "Chip's Highlight Prompt",
                "clientId": "efbd6941-4cce-48d3-9829-d06ba9a5310c",
                "userInputIsIntention": false,
                "aiPromptSteps": [
                    {
                        "prompts": [
                            {
                                "promptText": "You are a writing coach who specializes in helping college students improve their writing. The student you are working with has written the following essay.\n\nYour task is to extract the five most important words and/or phrases from the student’s essay. An important word is one that is central to the essay's meaning and thesis. For each word/phrase, suggest three synonyms that are more specific and appropriate in the context of the essay.\n\n{ \"Thesis\" : str // Summarize the thesis statement for this essay\n  \"Key Words\" [str] // List 5 words which are key terms for this essay's meaning\n  \"Synonym Sets\" : \n  [\n    { \"Key Word\" : str, // current key words/phrases”: The most important words and/or phrases from the student’s essay\n     \"Suggested  Key Words/Phrases”: str // For this identified important word and/or phrase suggest three synonyms that are more specific and appropriate in the context of the essay.\n  }\n  ]\n}\n\nPlease check that the output is valid JSON. Ensure that the output is valid JSON.",
                                "includeEssay": true,
                                "includeUserInput": false,
                                "promptRole": "user"
                            }
                        ],
                        "targetAiServiceModel": null,
                        "systemRole": "",
                        "outputDataType": "TEXT",
                        "includeChatLogContext": false,
                        "responseFormat": ""
                    }
                ]
            },
            {
                "_id": "65ca7e53f27324e936470e75",
                "title": "Jargon Use",
                "clientId": "37aff806-48a3-4340-afec-981a4be6d636",
                "userInputIsIntention": false,
                "aiPromptSteps": [
                    {
                        "prompts": [
                            {
                                "promptText": "You are a literary and scholarly expert and have been evaluating university-level essays and thesis statements. You have been invited as an evaluation judge for writing, where a detailed and specific evaluation is expected.\n\nYour task is to find the jargon. For this task, jargon is defined by the following traits:\n- Jargon can be either unknown terms or known, but rare terms.\n- Uncommon acronyms that are not expanded are always jargon\n- Jargon can be words that do not exist in the dictionary, unless they are a clear typo (must be a known misspelling)\n- Jargon can be acronyms, single words, or phrases.\n- Jargon is not explained explicitly in the text.\n\nEach jargon that is identified as unexplained should be output in a JSON format as shown below. \n{ \"Jargon List\" : \n  [ \n  {\n   “Jargon“: str, \\\\ Acronym, term, or phrase identified as unexplained\n   \"Domain\" : [str] \\\\ List of domains where this jargon is used commonly\n   \"Type\" : str \\\\ Indicate if this is an \"Acronym\", \"Unknown Word\", \"Single Word\", or \"Phrase\"\n   “Explanation”: str  \\\\ Explanation for the identified jargon\n   \"Rating: int \\\\ Rate how rare this jargon is in common use. \n                    \\\\ 1=Extremely common, known by almost all adult speakers\n                    \\\\ 2=Somewhat common, used in newspapers\n                    \\\\ 3=Somewhat uncommon, used domain guides or  instructional materials such as textbooks\n                    \\\\ 4=High domain-specific, almost never used except in specialized materials such as scientific journals or technical manuals\n                    \\\\ 5=Very rare. Word is almost unknown or not used in this form, such as new acronyms \n  }] // Sort the list so that the jargon with the highest rating are listed first.\n} \n\nPlease check that the output is valid JSON. Only output a valid JSON object as a response.",
                                "includeEssay": true,
                                "includeUserInput": false,
                                "promptRole": "user"
                            }
                        ],
                        "targetAiServiceModel": null,
                        "systemRole": "",
                        "outputDataType": "JSON",
                        "includeChatLogContext": false,
                        "responseFormat": ""
                    }
                ]
            },
            {
                "_id": "65caa2fc386566e704178ed6",
                "title": "Red Teaming an Essay",
                "clientId": "ced20c0d-f6bf-4f29-8e4b-6cb1e2342ada",
                "userInputIsIntention": false,
                "aiPromptSteps": [
                    {
                        "prompts": [
                            {
                                "promptText": "You are a critical reader of an essay, with beliefs and opinions that oppose the concepts in this essay. Read the following essay and provide well-reasoned argument against the essay. You should include the following:\n\nThesis Summary: Summarize is the main purpose you think this paper was written. What is the thesis of the paper and why was it written?\n\nYour Role: Consider who could be disadvantaged or hurt by this thesis or outcome of people changing their behavior after reading this paper. Your role must be someone who is in the same organization or community as the essay writer, but with a different opinion. State your role here.\n\nOpposing View: Generate and summarize your opposing view of the paper. Provide a numbered list of critiques of the paper's intended purpose, the claims it makes, and the assumptions that are required to believe it.\n\nOpposing Groups: List who else you think would oppose the thesis or claims made by this essay, and the reason why they might be opposed. This can include both groups in the same community and other groups who might oppose these changes, as compared to the current situation.\n\nAfter you give this analysis, continue your critique of the weaknesses you feel are in the paper from your current perspective. If those specific issues are refuted, identify additional issues and concerns related to other opposing groups, risks, or concerns.\n\n",
                                "includeEssay": true,
                                "includeUserInput": false,
                                "promptRole": "user"
                            }
                        ],
                        "targetAiServiceModel": null,
                        "systemRole": "",
                        "outputDataType": "TEXT",
                        "includeChatLogContext": false,
                        "responseFormat": ""
                    }
                ]
            },
            {
                "_id": "66144b64c2027d0f8e5828dd",
                "title": "Conclusion Analysis",
                "clientId": "40d97364-6a32-4eaa-8fda-e7b865dbf229",
                "userInputIsIntention": false,
                "aiPromptSteps": [
                    {
                        "prompts": [
                            {
                                "promptText": "You are a literary and scholarly expert and have been evaluating university-level essays and thesis statements. You have been invited as an evaluation judge for writing, where a detailed and specific evaluation is expected.\n\nYour task is to find the most important and emphasized thesis statement in the essay and determine if the conclusion provides a clear persuasive impact on the audience. \n\nConsider the thesis and the structure of the argument made to support this thesis. Rate the categories of argument.\n\n{ // Whole Paper Analysis\n        \"audiences\" :  // List containing audiences who the writing speaks toward for the whole paper. These are people commonly interested in the topics presented. Please list all relevant audiences.\n        [\n           {\n            \"name\" : str, // The name of the audience\n            \"relevance\": str // VALUES: primary, secondary, or other\n            \"intention\" : str, // The intended effect on that audience such as persuading them to feel a certain way or do a certain action\n            \"sentiment\" : str // How the audience is likely to feel when reading this\n            },\n            {\n               ...\n             }\n        ]\n\t\t\"implications\": // List of implications that the essay adds, please make sure this data is an array\n\t\t[\n               {\n\t\t\n\t\t\t\"implication\": str // implication that that includes\n\t\t\t\"supportingArgument\": str\n\t\t\n\t\t},\n               {\n                ...\n                }\n               ]\n\t“content”:  // Evaluation of the content of the whole paper\n\t{\n\t\t“thesisStatement”: str,   // Main thesis statement. This should typically be found in the first paragraph\n\t\t“paragraph”: str // extract the paragraph in which the main thesis statement is contained\n\t}\n\t“argumentType”: str, // How the argument claims and support are supported\n\t\"logicalCauses\" : {\n              \"causeAndEffects\" : {\n                       cause1 : effect1, // A list of key causes and their effects stated in the paper,\n               \"rating\" : int // A rating of the causality of the argument given from 1 to 5. A rating of 1 means hardly any logical relationships evoked (list of similar things, purely emotional appeal), 2 means limited depth of causes, usually just pairs language, 3 means that at least one efect is also a cause of some other effect, 4 means that multiple causes are connected in a graph-like relationship, and 5 means that arguments are highly connected and almost entirely tied by logical causes and effects that support the thesis\n                \"justification\" : str \n                  } \n        }\n}\n\nYou must respond as JSON following the format above. Only respond using valid JSON. Please check that the JSON is valid and follows the format given.\n",
                                "includeEssay": true,
                                "includeUserInput": false,
                                "promptRole": "user"
                            }
                        ],
                        "targetAiServiceModel": null,
                        "systemRole": "",
                        "outputDataType": "TEXT",
                        "includeChatLogContext": false,
                        "responseFormat": ""
                    },
                    {
                        "prompts": [
                            {
                                "promptText": "You are a literary and scholarly expert and have been evaluating university-level essays and thesis statements. You have been invited as an evaluation judge for writing, where a detailed and specific feedback is expected.\n\nConsidering only the conclusion paragraph, collect any emotions invoked and narrative elements following the JSON format below. Then rate the text of the conclusion based on how much it connects the content to the audience within the JSON provided above.\n\n{\n\temotions : // How much the conclusion paragraph invokes emotions, as opposed to abstract ideas\n   {\n\t\t“emotions”: [str] // List of emotions that the paragraph evokes,\n\t\t“rating”: int, // Emotional evocativeness rated from 1 to 5. A rating of 1 means hardly any emotions evoked (extremely dry), 2 means limited use of emotions or emotional language, 3 means a typical amount of emotion for a personal conversation, 4 means it engages with significant emotions, and 5 being very emotional and helping the reader feel the emotions or events\n\t\t“justification”: str // Contextual justification for the rating provided\n\t}\n\t“narrativity”:\n\t// How much does the conclusion paragraph describe a specific event, story, incident, or persons?\n\t{\n               \"characters\" : [str], // List every person or agent in the paragraph, including the essay writer if relevant. Carefully consider each noun of the content paragraph. Please check that all people are listed.\n               \"places\" : [str], // List of places or locations described in the paragraph\n                \"events\" : [str] // List the events and conflicts in the story. Please\n\t\t“rating”: int, // Rating of narrativity from 1 to 5, where 1 is the least narrative (no story at all), rating 2 is vaguely refers to a story, rating 3 is describes an event but only briefly, rating 4 is a specific story with clear characters and events, and rating 5 is highly narrative where most of the paragraph is tied to a detailed story\n\t\t“justification”: str // Contextual justification for the rating provided\n\t}\n\t“conclusion”: // Conclusion Analysis \n\t{\n               \"impact\" : // How do you think this conclusion will impact the paper's expected audiences. Please list all that apply.\n               [\n                {\n                     \"audience\" : str // Description of the audience impacted\n                     \"typeOfImpact\" : str // The type of impact expected on the audience from the list of [Emotional, Attitude Change, Call to Action, Another Person's Perspective, New Idea or Perspective]\n                      \"description\" : str, // Brief summary of the conclusion statement(s) that make this point in the conclusion final paragraph(s)\n                      \"support\" : str // Brief summary of statements in the main paper that support this concluding statement, if any\n                      \"rating\" :  // How effectively this concluding point is made\n               },\n               {\n               ...\n               },\n              ]\n\t\t\t\t“overallRating”: int, // Considering the factors in the JSON, provide a score from 1 to 5, 1 being a weakest conclusion, 5 being the strongest conclusion\n               \"justification\": str // In 2 of 3 sentences, please explain your rating to the writer, based on your ratings and justifications for how well each audience should be affected by the conclusion. Consider also how the conclusion builds on the paper structure and content. Provide constructive criticism, using I statements (e.g., \"I liked\", \"x interested me the most\").\n\t}\n}\n\nYou must respond as JSON following the format above. Only respond using valid JSON. Please check that the JSON is valid and follows the format given.",
                                "includeEssay": true,
                                "includeUserInput": false,
                                "promptRole": "user"
                            }
                        ],
                        "targetAiServiceModel": null,
                        "systemRole": "",
                        "outputDataType": "TEXT",
                        "includeChatLogContext": false,
                        "responseFormat": ""
                    }
                ]
            },
            {
                "_id": "66144b70c2027d0f8e582920",
                "title": "N Audience, Implications, and Emotion Detection",
                "clientId": "37872dfb-e70e-4c71-9e65-c666375ad074",
                "userInputIsIntention": false,
                "aiPromptSteps": [
                    {
                        "prompts": [
                            {
                                "promptText": "You are a literary and scholarly expert and have been evaluating university-level essays and thesis statements. You have been invited as an evaluation judge for writing, where a detailed and specific evaluation is expected.\n\nConsider only the conclusion paragraph. Rate the text of the conclusion based on how much it connects the content to the audience within the JSON provided above.\n\n{\n\temotions : // How much the conclusion paragraph invokes emotions, as opposed to abstract ideas\n   {\n\t\t“emotions”: [str] // List of emotions that the paragraph evokes,\n\t\t“rating”: int, // Emotional evocativeness rated from 1 to 5. A rating of 1 means hardly any emotions evoked (extremely dry), 2 means limited use of emotions or emotional language, 3 means a typical amount of emotion for a personal conversation, 4 means it engages with significant emotions, and 5 being very emotional and helping the reader feel the emotions or events\n\t\t“justification”: str // Contextual justification for the rating provided\n\t}\n\t“narrativity”:\n\t// How much does the conclusion paragraph describe a specific event, story, incident, or persons?\n\t{\n               \"characters\" : [str], // List every person or agent in the paragraph, including the essay writer if relevant. Carefully consider each noun of the content paragraph. Please check that all people are listed.\n               \"places\" : [str], // List of places or locations described in the paragraph\n                \"events\" : [str] // List the events and conflicts in the story. Please\n\t\t“rating”: int, // Rating of narrativity from 1 to 5, where 1 is the least narrative (no story at all), rating 2 is vaguely refers to a story, rating 3 is describes an event but only briefly, rating 4 is a specific story with clear characters and events, and rating 5 is highly narrative where most of the paragraph is tied to a detailed story\n\t\t“justification”: str // Contextual justification for the rating provided\n\t}\n\t“conclusion”: // Conclusion Analysis \n\t{\n               \"impact\" : // How do you think this conclusion will impact the paper's expected audiences. Please list all that apply.\n               {\n                     \"audience\" : str // Description of the audience impacted\n                     \"type of impact\" : str // The type of impact expected on the audience from the list of [Emotional, Attitude Change, Call to Action, Another Person's Perspective, New Idea or Perspective]\n                      \"description\" : str, // Brief summary of the conclusion statement(s) that make this point in the conclusion final paragraph(s)\n                      \"support\" : str // Brief summary of statements in the main paper that support this concluding statement, if any\n                      \"rating\" :  // How effectively this concluding point is made\n               }\n\t\t\t\t“overall rating”: int, // Considering the factors in the JSON, provide a score from 1 to 5, 1 being a weakest conclusion, 5 being the strongest conclusion\n               \"justification\": str // In 2 of 3 sentences, please explain your rating to the writer, based on your ratings and justifications for how well each audience should be affected by the conclusion. Consider also how the conclusion builds on the paper structure and content. Provide constructive criticism, using I statements (e.g., \"I liked\", \"x interested me the most\").\n\t}\n}\n\nYou must respond as JSON following the format above. Only respond using valid JSON. Please check that the JSON is valid and follows the format given.",
                                "includeEssay": true,
                                "includeUserInput": false,
                                "promptRole": "user"
                            }
                        ],
                        "targetAiServiceModel": null,
                        "systemRole": "",
                        "outputDataType": "TEXT",
                        "includeChatLogContext": false,
                        "responseFormat": ""
                    }
                ]
            },
            {
                "_id": "66144b7ac2027d0f8e58295f",
                "title": "I-1 Comment on Key Implications",
                "clientId": "c7eb14e7-cd86-4325-839a-8fdcda41ac49",
                "userInputIsIntention": false,
                "aiPromptSteps": [
                    {
                        "prompts": [
                            {
                                "promptText": "You are a literary and scholarly expert and have been evaluating university-level essays and thesis statements. You have been invited as an evaluation judge for writing, where a detailed and specific feedback is expected.\n\nYou are provided with the key implications of the student writers essay in the JSON above. Please provide feedback based on the conclusion of the essay.\n\nPlease format your response following these guidelines:\n - In 2 or 3 short sentences about the implications, describe the specific parts of the conclusion that you liked and then any areas you would want to revise\n - Do not mention that you were provided these key implications\n - Avoid overly effusive praise or harsh criticism. Avoid statements like \"Well done.\"\n - You are responding to a direct message from the writer, so please respond in the second person perspective.",
                                "includeEssay": true,
                                "includeUserInput": false,
                                "promptRole": "user"
                            }
                        ],
                        "targetAiServiceModel": null,
                        "systemRole": "",
                        "outputDataType": "TEXT",
                        "includeChatLogContext": false,
                        "responseFormat": ""
                    }
                ]
            },
            {
                "_id": "66144b81c2027d0f8e5829a0",
                "title": "I-2 Collect Author Original Intention",
                "clientId": "db152347-ca27-4945-a39c-ece09dfd176b",
                "userInputIsIntention": false,
                "aiPromptSteps": [
                    {
                        "prompts": [
                            {
                                "promptText": "You are a literary and scholarly expert and have been evaluating university-level essays and thesis statements. You have been invited as an evaluation judge for writing, where a detailed and specific evaluation is expected.\n\nYou are provided with the students original intention for writing this paper. Please provide a short (1 sentence) response to the student with regards to how well their original intention ties in with the paper and their conclusion. You are responding to a direct message from the student writer, so please respond in the second person perspective.",
                                "includeEssay": true,
                                "includeUserInput": true,
                                "promptRole": "user"
                            }
                        ],
                        "targetAiServiceModel": null,
                        "systemRole": "",
                        "outputDataType": "TEXT",
                        "includeChatLogContext": false,
                        "responseFormat": ""
                    }
                ]
            },
            {
                "_id": "66144b89c2027d0f8e5829e3",
                "title": "I-3 \"So What\" Question",
                "clientId": "dacf9ec6-0369-4d5e-8363-978ae4e8e3cd",
                "userInputIsIntention": false,
                "aiPromptSteps": [
                    {
                        "prompts": [
                            {
                                "promptText": "You are a literary and scholarly expert and have been evaluating university-level essays and thesis statements. You have been invited as an evaluation judge for writing, where a detailed and specific evaluation is expected.\n\nThe student writers input is why they think people should care about their essay. Please review their essay and their input and comment on how well their essay conveys their reasoning for why people should care about their essay.\n\nPlease format your response following these rules:\n - Max 3 short sentences\n - You are responding to a direct message from the student writer, so please respond in the second person perspective.",
                                "includeEssay": true,
                                "includeUserInput": true,
                                "promptRole": "user"
                            }
                        ],
                        "targetAiServiceModel": null,
                        "systemRole": "",
                        "outputDataType": "TEXT",
                        "includeChatLogContext": false,
                        "responseFormat": ""
                    }
                ]
            },
            {
                "_id": "66144b97c2027d0f8e582a28",
                "title": "I-4 Brainstorming on So-What",
                "clientId": "43bdb40b-49b3-4c7f-8725-e628bcd27c05",
                "userInputIsIntention": false,
                "aiPromptSteps": [
                    {
                        "prompts": [
                            {
                                "promptText": "The writer of this essay needs help brainstorming on why the main intended reader might care about what they are writing about. Please provide 3 reasons that the main intended audience might care about what they are writing about. \n\nPlease respond following these rules:\n - bullet points\n - short sentences\n - Be clear about who you feel is the main audience for the paper\n - Each point should refer to a specific part of the conclusion, which could be expanded or revised. In may also refer to a statement made in the paper but not mentioned in the conclusion, if you believe it should be mentioned.\n - Each point should focus on the goals of the intended audience and how the essay takeaways affect that audience, such as an a intended action, a change in attitude, or understanding a new perspective\n - You are responding to a direct message from the student writer, so please respond in the second person perspective.",
                                "includeEssay": true,
                                "includeUserInput": false,
                                "promptRole": "user"
                            }
                        ],
                        "targetAiServiceModel": null,
                        "systemRole": "",
                        "outputDataType": "TEXT",
                        "includeChatLogContext": false,
                        "responseFormat": ""
                    }
                ]
            },
            {
                "_id": "66144b9fc2027d0f8e582a6f",
                "title": "I-5 Collect Proposed Revision",
                "clientId": "aea36f3b-62d1-495e-880b-9a9666deb29d",
                "userInputIsIntention": true,
                "aiPromptSteps": [
                    {
                        "prompts": [
                            {
                                "promptText": "The provided user input is the revision goal that they'd like to make to their writing. Please provide 3 different ideas for how the user might change their conclusion based on their revision goal.\n\nPlease respond following these rules:\n - start with sentence along the lines of \"Based on that goal, I could think of a few directions that were interesting: \"\n - bullet points\n - 1 sentence each\n - The ideas should focus on the conclusion\n - You are responding to a direct message from the student writer, so please respond in the second person perspective.",
                                "includeEssay": true,
                                "includeUserInput": true,
                                "promptRole": "user"
                            }
                        ],
                        "targetAiServiceModel": null,
                        "systemRole": "",
                        "outputDataType": "TEXT",
                        "includeChatLogContext": false,
                        "responseFormat": ""
                    }
                ]
            },
            {
                "_id": "66148b67f54f4328b0431cb9",
                "title": "A wizard reads your essay",
                "clientId": "d195c143-a112-4d05-9282-4ed091ec47f3",
                "userInputIsIntention": false,
                "aiPromptSteps": [
                    {
                        "prompts": [
                            {
                                "promptText": "Respond with 1 thing I could improve my essay about.",
                                "includeEssay": true,
                                "includeUserInput": false,
                                "promptRole": "user"
                            }
                        ],
                        "targetAiServiceModel": {
                            "serviceName": "GEMINI",
                            "model": "gemini-pro"
                        },
                        "systemRole": "You are a wizard in a tower responding to a students message.",
                        "outputDataType": "TEXT",
                        "includeChatLogContext": false,
                        "responseFormat": "Please respond to this message in JSON and only JSON. No JSON markdown, only JSON data."
                    }
                ]
            },
            {
                "_id": "66148f6e65a9e04e071aba02",
                "title": "(Old) Conclusion Analysis",
                "clientId": "a2868bbd-e9aa-4337-818c-8b0fd2644650",
                "userInputIsIntention": false,
                "aiPromptSteps": [
                    {
                        "prompts": [
                            {
                                "promptText": "You are a literary and scholarly expert and have been evaluating university-level essays and thesis statements. You have been invited as an evaluation judge for writing, where a detailed and specific evaluation is expected.\n\nYour task is to find the most important and emphasized thesis statement in the essay and determine if the conclusion provides a clear persuasive impact on the audience. \n\nFirst, consider the thesis and the structure of the argument made to support this thesis. Rate the categories of argument.\n\nThen, consider the paragraph for the conclusion. Rate the text of the conclusion based on how much it connects the content to the audience.\n\n{ // Whole Paper Analysis\n        \"audiences\" :  // The list of audiences who the writing speaks toward for the whole paper. These are people commonly interested in the topics presented. Please list all relevant audiences.\n        {\n           {\n            \"audience 1\" : str, // The primary audience for the paper\n            \"intention\" : str, // The intended effect on that audience such as persuading them to feel a certain way or do a certain action\n            \"sentiment\" : str // How the audience is likely to feel when reading this\n            },\n          {\n            \"audience 2\" : str, // A secondary audience for the paper\n            \"intention\" : str, // The intended effect on that audience such as persuading them to feel a certain way or do a certain action\n            \"sentiment\" : str // How the audience is likely to feel when reading this\n            },\n          {\n            \"audience 3\" : str, // Another key audience for the paper\n            \"intention\" : str, // The intended effect on that audience such as persuading them to feel a certain way or do a certain action\n            \"sentiment\" : str // How the audience is likely to feel when reading this\n            },\n        }\n\t“content”:  // Evaluation of the content of the whole paper\n\t{\n\t\t“thesis_statement”: str,   // Main thesis statement. This should typically be found in the first paragraph\n\t\t“paragraph”: str // extract the paragraph in which the main thesis statement is contained\n\t}\n\t“argument type”: // How the argument claims and support are supported\n\t\"logical causes\" : {\n              \"cause and effects\" : {\n                       cause1 : effect1, // A list of key causes and their effects stated in the paper,\n               \"rating\" : int // A rating of the causality of the argument given from 1 to 5. A rating of 1 means hardly any logical relationships evoked (list of similar things, purely emotional appeal), 2 means limited depth of causes, usually just pairs language, 3 means that at least one efect is also a cause of some other effect, 4 means that multiple causes are connected in a graph-like relationship, and 5 means that arguments are highly connected and almost entirely tied by logical causes and effects that support the thesis\n                \"justification\" : str \n                  } \n        },\n\temotions : // How much the paragraph invokes emotions, as opposed to abstract ideas\n   {\n\t\t“emotions”: [str] // List of emotions that the paragraph evokes,\n\t\t“rating”: int, // Emotional evocativeness rated from 1 to 5. A rating of 1 means hardly any emotions evoked (extremely dry), 2 means limited use of emotions or emotional language, 3 means a typical amount of emotion for a personal conversation, 4 means it engages with significant emotions, and 5 being very emotional and helping the reader feel the emotions or events\n\t\t“justification”: str // Contextual justification for the rating provided\n\t}\n\t“narrativity”:\n\t// How much does the paragraph describe a specific event, story, incident, or persons?\n\t{\n               \"characters\" : [str], // List every person or agent in the paragraph, including the essay writer if relevant. Carefully consider each noun of the content paragraph. Please check that all people are listed.\n               \"places\" : [str], // List of places or locations described in the paragraph\n                \"events\" : [str] // List the events and conflicts in the story. Please\n\t\t“rating”: int, // Rating of narrativity from 1 to 5, where 1 is the least narrative (no story at all), rating 2 is vaguely refers to a story, rating 3 is describes an event but only briefly, rating 4 is a specific story with clear characters and events, and rating 5 is highly narrative where most of the paragraph is tied to a detailed story\n\t\t“justification”: str // Contextual justification for the rating provided\n\t}\n       // Conclusion Analysis \n\t“conclusion”:\n\t{\n               \"impact\" : // How do you think this conclusion will impact the paper's expected audiences. Please list all that apply.\n               {\n                     \"audience\" : str // Description of the audience impacted\n                     \"type of impact\" : str // The type of impact expected on the audience from the list of [Emotional, Attitude Change, Call to Action, Another Person's Perspective, New Idea or Perspective]\n                      \"description\" : str, // Brief summary of the conclusion statement(s) that make this point in the conclusion final paragraph(s)\n                      \"support\" : str // Brief summary of statements in the main paper that support this concluding statement, if any\n                      \"rating\" :  // How effectively this concluding point is made\n               }\n\t\t“overall rating”: int, // Considering the factors in the JSON, provide a score from 1 to 5, 1 being a weakest conclusion, 5 being the strongest conclusion\n               \"justification\": str // In 2 of 3 sentences, please explain your rating to the writer, based on your ratings and justifications for how well each audience should be affected by the conclusion. Consider also how the conclusion builds on the paper structure and content. Provide constructive criticism, using I statements (e.g., \"I liked\", \"x interested me the most\").\n}\n}\n\nYou must respond as JSON following the format above. Only respond using valid JSON. Please check that the JSON is valid and follows the format given.\n",
                                "includeEssay": true,
                                "includeUserInput": false,
                                "promptRole": "user"
                            }
                        ],
                        "targetAiServiceModel": null,
                        "systemRole": "",
                        "outputDataType": "TEXT",
                        "includeChatLogContext": false,
                        "responseFormat": ""
                    }
                ]
            },
            {
                "_id": "6616fd3bf182cb71657eb628",
                "title": "C-1: Brainstorm Claims To Add/Remove/Revise",
                "clientId": "def909f1-96e2-4e42-85cd-e31d67a1c591",
                "userInputIsIntention": false,
                "aiPromptSteps": [
                    {
                        "prompts": [
                            {
                                "promptText": "You are a literary and scholarly expert and have been evaluating university-level essays and thesis statements. You have been invited as an evaluation judge of writing quality, where a detailed and specific evaluation is expected.\n\nYour task is to review the students paper and then determine what claims in their paper could benefit from being revised, removed, or added. The claims you recommend to add should be directly beneficial to the papers thesis statement. The claims you recommend to remove should primarily be ones that are essentially duplicates. Please only state your recommendations and not your review, and only provide a max of 4 recommendations.\n\nWhen listing specific claims, please put in bullet points. You are responding to a message from the student writer, so please refer to them in the second person",
                                "includeEssay": true,
                                "includeUserInput": false,
                                "promptRole": "user"
                            }
                        ],
                        "targetAiServiceModel": null,
                        "systemRole": "",
                        "outputDataType": "TEXT",
                        "includeChatLogContext": false,
                        "responseFormat": ""
                    }
                ]
            },
            {
                "_id": "6616fd4d32d66ed2526d8015",
                "title": "C-2: Analyze Inteded Claim Usage",
                "clientId": "39235691-4790-4a2a-b442-e365e114efd5",
                "userInputIsIntention": false,
                "aiPromptSteps": [
                    {
                        "prompts": [
                            {
                                "promptText": "You are a literary and scholarly expert and have been evaluating university-level essays and thesis statements. You have been invited as an evaluation judge of writing quality, where a detailed and specific evaluation is expected.\n\nYou are provided with the students intended claim that they'd like to either add, remove, or revise to their essay. Your task is to determine whether they are trying to add, remove, or revise their intended claim, and to also provide a short sentence providing feedback on their intention. In your feedback, be critical but fair, for example, if the students input is to add a claim that is already in the paper, please mention that.\n\nPlease respond in the following format:\n{\n \"intendedAction\": str // values ADDING, REMOVING, or REVISING\n \"intentionFeedback\": str // short sentence providing feedback on their intention. You are responding to a message from the student writer, so please refer to them in the second person\n}\n\nYou must respond as JSON following the format above. Only respond using valid JSON. Please check that the JSON is valid and follows the format given.",
                                "includeEssay": true,
                                "includeUserInput": true,
                                "promptRole": "user"
                            }
                        ],
                        "targetAiServiceModel": null,
                        "systemRole": "",
                        "outputDataType": "TEXT",
                        "includeChatLogContext": false,
                        "responseFormat": ""
                    }
                ]
            },
            {
                "_id": "6616fd68f182cb71657eb797",
                "title": "CA-1: Brainstorm Arguments For New Claim",
                "clientId": "1031a62d-7cc9-4bb9-a638-d086a599f5ca",
                "userInputIsIntention": false,
                "aiPromptSteps": [
                    {
                        "prompts": [
                            {
                                "promptText": "You are a literary and scholarly expert and have been evaluating university-level essays and thesis statements. You have been invited as an evaluation judge of writing quality, where a detailed and specific evaluation is expected.\n\nYou are provided with the students intended claim that they'd like to add to their paper. Your task is to come up with some arguments that could support this claim as it pertains to the paper. Please list your arguments in bullet points and keep your arguments short. Maximum 3 arguments. You are responding to a message from the student writer, so please refer to them in the second person",
                                "includeEssay": true,
                                "includeUserInput": false,
                                "promptRole": "user"
                            }
                        ],
                        "targetAiServiceModel": null,
                        "systemRole": "",
                        "outputDataType": "TEXT",
                        "includeChatLogContext": false,
                        "responseFormat": ""
                    }
                ]
            },
            {
                "_id": "6616fd77f182cb71657eb847",
                "title": "CA-2: Analyze Intended Arguments For Claim",
                "clientId": "03d593c3-350f-4b18-b144-55560d8b70c1",
                "userInputIsIntention": false,
                "aiPromptSteps": [
                    {
                        "prompts": [
                            {
                                "promptText": "You are a literary and scholarly expert and have been evaluating university-level essays and thesis statements. You have been invited as an evaluation judge of writing quality, where a detailed and specific evaluation is expected.\n\nYou are provided with both the claim that the student would like to add to their essay and their input describing the arguments they intend to use to support that claim. Your task is to inform the student how well these arguments support the claim. If the arguments could be adjusted in some way, please inform the student of this. Keep your response down to a couple sentences. You are responding to a message from the student writer, so please refer to them in the second person",
                                "includeEssay": true,
                                "includeUserInput": true,
                                "promptRole": "user"
                            }
                        ],
                        "targetAiServiceModel": null,
                        "systemRole": "",
                        "outputDataType": "TEXT",
                        "includeChatLogContext": false,
                        "responseFormat": ""
                    }
                ]
            },
            {
                "_id": "6616fd8032d66ed2526d816c",
                "title": "CA-3: Analyze Claim Added To Paper",
                "clientId": "b4b2a8e3-1353-4e26-893c-fbb2b8e097c7",
                "userInputIsIntention": false,
                "aiPromptSteps": [
                    {
                        "prompts": [
                            {
                                "promptText": "You are provided with a student writers claim that they intended to add to their paper to support their thesis. Your task is to review their paper and provide feedback on how well they added their intended claim to their paper.\n\nKeep in mind, you are responding to a direct message from the student writer, so please refer to them in the second person.",
                                "includeEssay": true,
                                "includeUserInput": false,
                                "promptRole": "user"
                            }
                        ],
                        "targetAiServiceModel": null,
                        "systemRole": "",
                        "outputDataType": "TEXT",
                        "includeChatLogContext": false,
                        "responseFormat": ""
                    }
                ]
            },
            {
                "_id": "6616fd88f182cb71657eb954",
                "title": "CR-1: Brainstorm Claim Removal Tips",
                "clientId": "085919c0-30ae-4f74-bf06-23f43787c74c",
                "userInputIsIntention": false,
                "aiPromptSteps": [
                    {
                        "prompts": [
                            {
                                "promptText": "You are a literary and scholarly expert and have been evaluating university-level essays and thesis statements. You have been invited as an evaluation judge of writing quality, where a detailed and specific evaluation is expected.\n\nYou are provided with the claim that the student would like to remove from their paper. Please provide some tips on how to remove the claim from their paper. Please respond in bullet points. Keep your tips short and to a maximum of 3 tips. Keep in mind, you are responding to a direct message from the student writer, so please refer to them in the second person.",
                                "includeEssay": true,
                                "includeUserInput": false,
                                "promptRole": "user"
                            }
                        ],
                        "targetAiServiceModel": null,
                        "systemRole": "",
                        "outputDataType": "TEXT",
                        "includeChatLogContext": false,
                        "responseFormat": ""
                    }
                ]
            },
            {
                "_id": "6616fd90f182cb71657eb9ee",
                "title": "CR-2: Analyze Claim Removal From Paper",
                "clientId": "be20945a-bb35-4012-8996-05aea8142f3c",
                "userInputIsIntention": false,
                "aiPromptSteps": [
                    {
                        "prompts": [
                            {
                                "promptText": "You are provided with the claim that the student intended to remove from their essay. Review the students essay and provide feedback to the student based on if they were successful or not in removing the claim from their essay. Please be short but concise in your response. You are responding to a direct message from the student writer, so please respond in the second person perspective.",
                                "includeEssay": true,
                                "includeUserInput": false,
                                "promptRole": "user"
                            }
                        ],
                        "targetAiServiceModel": null,
                        "systemRole": "",
                        "outputDataType": "TEXT",
                        "includeChatLogContext": false,
                        "responseFormat": ""
                    }
                ]
            },
            {
                "_id": "6616fd99f182cb71657eba8a",
                "title": "S-1: Analyze Intention vs. Outline",
                "clientId": "9d9c2997-fdd8-4a80-996b-0eca86245a17",
                "userInputIsIntention": true,
                "aiPromptSteps": [
                    {
                        "prompts": [
                            {
                                "promptText": "You are a literary and scholarly expert and have been evaluating university-level essays and thesis statements. You have been invited as an evaluation judge of writing quality, where a detailed and specific evaluation is expected.\n\nYou are provided with the students claim that they intend to improve support on. Review their essay and determine what arguments they used to support their claim. Please respond with feedback on arguments they made in support of their intended claim that could be improved upon, or arguments that could be added in support of their claim. \n\nPlease respond following these rules:\n - 3 maximum bullet points\n - short sentences\n - Start your sentences with \"Why did you say\" or \"Why didn't you say\" in regards ONLY to the claim that they intend to improve upon.\n - You are responding to a direct message from the student writer, so please respond in the second person perspective.\n - Finish your message off with \"Please respond to one of the above questions\"",
                                "includeEssay": true,
                                "includeUserInput": true,
                                "promptRole": "user"
                            }
                        ],
                        "targetAiServiceModel": null,
                        "systemRole": "",
                        "outputDataType": "TEXT",
                        "includeChatLogContext": false,
                        "responseFormat": ""
                    }
                ]
            },
            {
                "_id": "6616fda532d66ed2526d82f5",
                "title": "S-2: Suggest Claim Support Changes",
                "clientId": "ca970bfe-3f59-4566-96c6-9123ce5edf9b",
                "userInputIsIntention": false,
                "aiPromptSteps": [
                    {
                        "prompts": [
                            {
                                "promptText": "You are a literary and scholarly expert and have been evaluating university-level essays and thesis statements. You have been invited as an evaluation judge of writing quality, where a detailed and specific evaluation is expected.\n\nYou are provided with the students intended claim they'd like to improve their support on in their paper. You are also provided with their input where they explain why they did or didn't say certain things in support of their paper. Your task is to respond to the user with tips on how to improve the claim that they intend to improve support on.\n\nPlease respond in the following format: \n\n{\n \"suggestedImprovements\": str[] // a list of short tips that the user could do to improve support for their intended claim\n}\n\nYou must respond as JSON following the format above. Only respond using valid JSON. Please check that the JSON is valid and follows the format given.",
                                "includeEssay": true,
                                "includeUserInput": true,
                                "promptRole": "user"
                            }
                        ],
                        "targetAiServiceModel": null,
                        "systemRole": "",
                        "outputDataType": "TEXT",
                        "includeChatLogContext": false,
                        "responseFormat": ""
                    }
                ]
            },
            {
                "_id": "66185c96b765bc832e5b78aa",
                "title": "Impact Open Discussion",
                "clientId": "ea882449-352b-41ac-920c-86889e998108",
                "userInputIsIntention": false,
                "aiPromptSteps": [
                    {
                        "prompts": [
                            {
                                "promptText": "You are provided the users essay and the previous chat log they had with you. Please respond accordingly. When the USER addresses \"you,\" they may be addressing the previous messages in the chat log. Keep that in mind. \n\nYou are responding to a direct message from the student writer, so please respond in the second person perspective. Please keep your response short.\n\nGive new ideas and directions. Think critically about the pros and cons for different revisions. Do not repeat the same summary points you have already stated previously in the chat, unless absolutely necessary.",
                                "includeEssay": true,
                                "includeUserInput": true,
                                "promptRole": "user"
                            }
                        ],
                        "targetAiServiceModel": null,
                        "systemRole": "",
                        "outputDataType": "TEXT",
                        "includeChatLogContext": true,
                        "responseFormat": ""
                    }
                ]
            },
            {
                "_id": "6619c4c7050b5afe087a49f6",
                "title": "Analyze Argument",
                "clientId": "c3936440-e66c-445e-ab12-195ca8274b09",
                "userInputIsIntention": false,
                "aiPromptSteps": [
                    {
                        "prompts": [
                            {
                                "promptText": "You are a literary and scholarly expert and have been evaluating university-level essays and thesis statements. You have been invited as an evaluation judge for writing, where a detailed and specific evaluation is expected.\n\nYou must evaluate the provided paper and analyze the papers intended audiences and the impact the paper has on them, and also determine what audiences may have a strong opinion on the paper that are not mentioned within the paper.\n\n{\n        \"thesis\" : str, // The main point or intention of this paper\n        \"claims\" : [str] // A list of the main claims of the paper that support the thesis\n        \"conclusion\" : str, // The final takeaway or point made at the end of the paper\n\t\"intendedAudiences\": [ // Specific people or groups mentioned or addressed in the writing\n\t\t{\n\t\t\t\"name\": str // name of the audience REQUIRED\n\t\t\t\"impact\": str // impact the arguments might have on this audience REQUIRED\n\t\t\t\"BeforeReading Attitudes\": [str] // a list of strings of attitudes/beliefs that this audience may have before reading the paper\n\t\t\t\"AfterReading Attitudes\": [str] // a list of strings of attitudes/beliefs that this audience may have after reading the paper\n\t\t\t\"Opposing Reactions\": [str] // a list of ways that this audience may react negatively. Consider arguments, limitations,  questions, or confusion about the thesis or claims.\n\t\t},\n\t\t{\n\t\t\t...\n\t\t}\n\t],\n\t\"otherAudiences\": [ // List 3 groups or people who are directly affected by the topic. When possible, list groups who are under-served or who could be directly disadvantaged\n\t\t{\n\t\t\t\"name\": str // name of the audience REQUIRED\n\t\t\t\"Opposing Reactions\": [str] // A list of arguments this audience may have against the thesis. Consider arguments, limitations,  questions, or confusion about the thesis or claims.  REQUIRED\n\t\t},\n\t\t{\n\t\t\t...\n\t\t}\n\t],\n\t\"overallResponse\": str // leave as an empty string for now\n}\n\nPlease respond following these guidelines:\n - You must respond as JSON following the format above.\n - Only respond using valid JSON. Please check that the JSON is valid and follows the format given.",
                                "includeEssay": true,
                                "includeUserInput": false,
                                "promptRole": "user"
                            }
                        ],
                        "targetAiServiceModel": null,
                        "systemRole": "",
                        "outputDataType": "JSON",
                        "includeChatLogContext": false,
                        "responseFormat": ""
                    },
                    {
                        "prompts": [
                            {
                                "promptText": "You are a literary and scholarly expert and have been evaluating university-level essays and thesis statements. You have been invited as an evaluation judge for writing, where a detailed and specific evaluation is expected.\n\nYou are provided with the JSON analysis of the users essay. Please respond following these guidelines:\n- This should be a response to the question 'Who are some critiques of my paper and why?'\n- You are responding to a direct message from the student writer, so please respond in the second person perspective.\n- Start with a single sentence summary of the paper's purpose and the intended audiences you noted. \n- Next, list 3 to 5 points where each contains an Opposing Reaction from an audience. Pick Opposing Reactions that have the highest possibility of harm or that have the strongest attitudes\n- Do not list an audience if it has no Opposing Reaction.\n\n",
                                "includeEssay": true,
                                "includeUserInput": false,
                                "promptRole": "user"
                            }
                        ],
                        "targetAiServiceModel": null,
                        "systemRole": "",
                        "outputDataType": "TEXT",
                        "includeChatLogContext": false,
                        "responseFormat": ""
                    }
                ]
            },
            {
                "_id": "6619c4d4050b5afe087a4a5f",
                "title": "Initiate Conversation",
                "clientId": "d77969d5-c0ac-4e65-8ad2-3dc3fc6240ed",
                "userInputIsIntention": false,
                "aiPromptSteps": [
                    {
                        "prompts": [
                            {
                                "promptText": "You are provided with a role to play. Please critique the author's essay as if you are someone from this role. Any critiques you have must be relevant to the role that you are playing.\n\nFollow these rules:\n- Introduce yourself exactly once, giving your name and your overall attitude about the paper\n - You are responding to a direct message from the author, so please respond in the second person perspective.\n- You are in a chat with the author, so your tone should be conversational\n - Using bullet points, list three critiques of their paper. \n - Your critiques need to be directly related to your role. \n - If the author responds with a question or argues against your critiques, please give more specific answers. Focus on a specific limit or counter-example where their thesis or their claims would not hold.",
                                "includeEssay": true,
                                "includeUserInput": false,
                                "promptRole": "user"
                            }
                        ],
                        "targetAiServiceModel": null,
                        "systemRole": "",
                        "outputDataType": "TEXT",
                        "includeChatLogContext": false,
                        "responseFormat": ""
                    }
                ]
            },
            {
                "_id": "661d8ef0947389cb72be7568",
                "title": "S-3: Analyze Claim Support Revision Intention",
                "clientId": "f8461654-f0f8-4d75-9952-cc717dddd692",
                "userInputIsIntention": true,
                "aiPromptSteps": [
                    {
                        "prompts": [
                            {
                                "promptText": "You are a literary and scholarly expert and have been evaluating university-level essays and thesis statements. You have been invited as an evaluation judge of writing quality, where a detailed and specific evaluation is expected.\n\nYou are provided with both the students claim that they'd like to improve support upon, and their input where they describe the improvement they'd like to make to their paper to improve the support upon this claim. Your task is to review their paper and provide short feedback on how well their improvement would improve the support upon their claim, and some short feedback on how they could go about implementing the improvement. You are responding to a direct message from the student writer, so please respond in the second person perspective.",
                                "includeEssay": true,
                                "includeUserInput": true,
                                "promptRole": "user"
                            }
                        ],
                        "targetAiServiceModel": null,
                        "systemRole": "",
                        "outputDataType": "TEXT",
                        "includeChatLogContext": false,
                        "responseFormat": ""
                    }
                ]
            },
            {
                "_id": "6671e7da5e3bc37363ee2f75",
                "title": "Compare User Interpretation of Commanders Intention",
                "clientId": "6aaae457-3ace-4a05-82f9-5316960ab657",
                "userInputIsIntention": false,
                "aiPromptSteps": [
                    {
                        "prompts": [
                            {
                                "promptText": "Analyze the users interpretation of the of the commanders intention and how well their interpretation matches the commanders intention.",
                                "includeEssay": false,
                                "includeUserInput": false,
                                "promptRole": "user"
                            }
                        ],
                        "targetAiServiceModel": {
                            "serviceName": "OPEN_AI",
                            "model": "gpt-3.5-turbo-16k"
                        },
                        "systemRole": "",
                        "outputDataType": "JSON",
                        "includeChatLogContext": false,
                        "responseFormat": "Please respond following this JSON format:\n{\n   \"matchRating\": int, // how well the users interpretation matches the commanders intent 1-5\n\n   \"response\": string, // if it matches, respond with something like ‘you have a good understanding!’, if it does not match, respond with something like ‘I have some questions about your understanding of the commanders intention, which one would you like to further discuss?’\n\n   \"questionList\": string[] // Please ALWAYS provide at least 2 questions about the users analysis of the commanders original intention.\n}\n\n\nPlease ONLY respond in JSON. Validate that your response is in valid json."
                    }
                ]
            },
            {
                "_id": "6671e7e15e3bc37363ee2fe4",
                "title": "Initiate Compare Interpretation Discussion",
                "clientId": "8ce31569-e159-4ab9-842e-b5bb2889e680",
                "userInputIsIntention": false,
                "aiPromptSteps": [
                    {
                        "prompts": [
                            {
                                "promptText": "You are a critic of the users interpretation of their commanders intention, and the user selected a critique you made that they would like to discuss with you further.  Please respond as if you are starting a discussion with the user about the critique.",
                                "includeEssay": false,
                                "includeUserInput": false,
                                "promptRole": "user"
                            }
                        ],
                        "targetAiServiceModel": {
                            "serviceName": "OPEN_AI",
                            "model": "gpt-3.5-turbo-16k"
                        },
                        "systemRole": "",
                        "outputDataType": "TEXT",
                        "includeChatLogContext": false,
                        "responseFormat": "Please keep your response short, down to 2 sentences max "
                    }
                ]
            },
            {
                "_id": "6671e7eb5e3bc37363ee3055",
                "title": "Compare Document Content to Commander Intent",
                "clientId": "d44337c9-56a1-4809-ace4-c5fcf277eb7e",
                "userInputIsIntention": false,
                "aiPromptSteps": [
                    {
                        "prompts": [
                            {
                                "promptText": "Analyze the contents of the essay and determine how well it conveys the commanders intention.",
                                "includeEssay": true,
                                "includeUserInput": false,
                                "promptRole": "user"
                            }
                        ],
                        "targetAiServiceModel": {
                            "serviceName": "OPEN_AI",
                            "model": "gpt-3.5-turbo-16k"
                        },
                        "systemRole": "",
                        "outputDataType": "JSON",
                        "includeChatLogContext": false,
                        "responseFormat": "Please respond following this JSON format:\n{\n   \"matchRating\": int, // how well the document content conveys the commanders intent 1-5\n\n   \"response\": string, //  if it matches well, respond with something like “Your document matches it very well, good job! But I still have some questions. Please choose one to discuss.”. If it does not match well, respond with something like “The content of your document does not match your commander's intention very well, I have some questions. Please choose one to discuss.”\n\n   \"questionList\": string[] // Please ALWAYS provide at least 2 critiques about the document's content and how it pertains to the commanders intention.\n}\n\n\nPlease ONLY respond in JSON. Validate that your response is in valid json."
                    }
                ]
            },
            {
                "_id": "6671e7f45e3bc37363ee30c8",
                "title": "Initiate Document Content Discussion",
                "clientId": "5be50a84-09dc-496c-a799-4469b451a295",
                "userInputIsIntention": false,
                "aiPromptSteps": [
                    {
                        "prompts": [
                            {
                                "promptText": "You are a critiquing the users essay on how well it conveys the commanders intention.\n\nThe user selected a critique you made that they would like to discuss with you further.  Please informally respond as if you are responding directly to the user, and begin the discussion with them.",
                                "includeEssay": true,
                                "includeUserInput": false,
                                "promptRole": "user"
                            }
                        ],
                        "targetAiServiceModel": {
                            "serviceName": "OPEN_AI",
                            "model": "gpt-3.5-turbo-16k"
                        },
                        "outputDataType": "TEXT",
                        "includeChatLogContext": false,
                        "responseFormat": "Please keep your response short, max 2 sentences."
                    }
                ]
            },
            {
                "_id": "6672245a4debd590a4be7783",
                "title": "List Crucial Elements",
                "clientId": "5800f000-caaa-4982-925e-f003bcc7b59b",
                "userInputIsIntention": false,
                "aiPromptSteps": [
                    {
                        "prompts": [
                            {
                                "promptText": "Look at the users essay and produce a list of 3 elements that you would find crucial to their missions success and/or failure.",
                                "includeEssay": true,
                                "includeUserInput": false,
                                "promptRole": "user"
                            }
                        ],
                        "targetAiServiceModel": {
                            "serviceName": "OPEN_AI",
                            "model": "gpt-3.5-turbo-16k"
                        },
                        "systemRole": "",
                        "outputDataType": "TEXT",
                        "includeChatLogContext": false,
                        "responseFormat": ""
                    }
                ]
            },
            {
                "_id": "667224604debd590a4be77fa",
                "title": "Brainstorm Mission Category Success Elements",
                "clientId": "29b24a97-ebbb-408a-b6dc-5ebf00e63954",
                "userInputIsIntention": false,
                "aiPromptSteps": [
                    {
                        "prompts": [
                            {
                                "promptText": "Review the users essay and brainstorm a list of 3 elements that are critical for the mission's success related to the discussion category provided.",
                                "includeEssay": true,
                                "includeUserInput": false,
                                "promptRole": "user"
                            }
                        ],
                        "targetAiServiceModel": null,
                        "systemRole": "",
                        "outputDataType": "TEXT",
                        "includeChatLogContext": false,
                        "responseFormat": ""
                    }
                ]
            },
            {
                "_id": "667224654debd590a4be7873",
                "title": "Brainstorm Mission Category Failure Elements",
                "clientId": "a2196740-dc8f-4715-bf5f-af3d7d718d15",
                "userInputIsIntention": false,
                "aiPromptSteps": [
                    {
                        "prompts": [
                            {
                                "promptText": "Review the users essay and brainstorm a list of 3 elements that are critical for the mission's failure related to the discussion category provided.",
                                "includeEssay": true,
                                "includeUserInput": false,
                                "promptRole": "user"
                            }
                        ],
                        "targetAiServiceModel": null,
                        "systemRole": "",
                        "outputDataType": "TEXT",
                        "includeChatLogContext": false,
                        "responseFormat": ""
                    }
                ]
            }
        ] as GQLPrompt[]
}
