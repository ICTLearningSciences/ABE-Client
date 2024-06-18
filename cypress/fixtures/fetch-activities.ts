/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
export const fetchActivitiesResponse = {
    "fetchActivities": {
        "edges": [
            {
                "node":             {
                    "_id": "6580e4e80ac7bcb42fc8d279",
                    "title": "Thesis Ideas",
                    "description": "Discuss ideas related to your thesis.",
                    "displayIcon": null,
                    "introduction": "In this activity we will be exploring improvements to your thesis.",
                },
            },
            {
                "node":                        {
                    "_id": "658230f699045156193339ac",
                    "title": "Stronger Hook",
                    "description": "Work on improving the hook of your essay.",
                    "displayIcon": null,
                    "introduction": "This activity is to work on the hook that gets the readers interest at the start of the paper. We are going to consider the narrativity and the emotions that are connected with the intro.",
                },
            },
            {
                "node":                         {
                    "_id": "65a8592b26523c7ce5acac9e",
                    "title": "Army Style Checklist",
                    "steps": [],
                    "description": "Army Style Prompt Checklist",
                    "introduction": "",
                    "prompt": {
                        "_id": "659dd7664575cc2a8f595375",
                        "clientId": "4a224649-8a00-45df-929d-a4299b277b82",
                        "aiPromptSteps": [
                          {
                            "prompts": [
                              {
                                "promptText": "You are an Army officer who is an expert in the Army writing style. The Army writing style has the following key criteria:\n1. BLUF - Bottom Line Up Front: Put the recommendation, conclusion, or reason for writing—the “ bottom line ”—in the first or second paragraph, not at the end.\n2. Active Voice: Use the active voice.\n3. Short Sentences: Use short sentences (an average of 15 or fewer words).\n4. Concise Language: Use short words (three syllables or fewer). (See the clarity index in paragraph 4–3.)\n5. Brief Paragraphs: Write paragraphs that, with few exceptions, are no more than 250 characters long.\n6. Grammar: Use correct spelling, grammar, and punctuation.\ng. Direct Pronouns: Use “I\",“you” and “we” as subjects of sentences instead of “this office\", “this headquarters\", “all individuals\", and so forth, for most kinds of writing.\n\nPlease rate the quality of this essay on each criteria and reply with JSON in the following format:\n{\n     Bottom Line Up Front: \n    {\n       Rating: int,  // Rate from 1-5 how well this document states its purpose quickly and clearly in the first few sentences, such as a recommendation for action. Any recommendation or conclusion should be specific about who, what, and why the conclusion was made\n       BLUF Summary: str, // Summarize the \"Bottom Line\" purpose of this document in a single sentence under 20 words\n       Issues: // List 0 to 3 issues that might be improved for the BLUF\n       [\n            {\n                Passage 1 : str, // A copy of the sentence or passage which has the problem\n                Explanation: str, // An explanation how the passage might be improved to state the bottom line up front more clearly\n                Suggestion: str, // If the BLUF rating was poor, suggest an improved bottom line up front statement for the purpose of this writing. This must state who, what, and why in specific terms when available (e.g., names, equipment, locations)\n            }\n        ]\n    },\n    Active Voice: \n    {\n     Rating: int,  // Rate from 1-5 how well this document uses active voice, where a 1 is less than 60% and a 5 is over 95% of sentences\n       Active Count: int, // A count of the number of sentences using only active voice\n       Passive Count: int, // A count of the number of sentences using passive voice at least once\n       Total Count: int, // A count of the total number of sentences\n       Issues: // List 0 to 5 issues that might be improved for active voice. List the most passive with the least clear action statements first\n       [\n            {\n                Passage 1 : str // A copy of the sentence or passage which has the problem\n                Explanation: str // An explanation how the passage might be improved to use active voice, such as a suggestion to rewrite the passage such as \"try instead, <Passage 1 re-written in active voice>\"\n            }\n        ]\n    },\n    Short Sentences: \n    {\n     Rating: int,  // Rate from 1-5 how well this document uses short sentences under 15 words. Count the percentage of sentences with more than 15 words, and rate as 1 when less than 60% and a 5 is over 95% of sentences\n       Too Long Count: int, // A count of the number of sentences with more than 15 words\n       Long Count: int // A count of the number of sentences with 11 to 15 words\n       Short Count: int, // A count of the number of sentences under 10 words\n       Total Count: int, // A count of the total number of sentences\n       Issues: // List the 20 longest and least clear sentences which could be improved by breaking them up or shortening them, in order starting with the longest and least clear. Do not list any sentences shorter than 15 words.\n       [\n            {\n                Passage 1 : str // A copy of the sentence which is too long\n                Explanation: str // An explanation how the passage might be improved, such as breaking into more sentences or more direct language\n            }\n        ]\n    }\n}",
                                "includeEssay": true,
                                "promptRole": "user"
                              }
                            ],
                            "outputDataType": "JSON"
                          },
                          {
                            "prompts": [
                              {
                                "promptText": "The JSON contains a review of a writing passage against the Army Style guidelines. Please provide a summary which states the overall quality of the writing where a good-quality writing product should be rated at least 4 on all criteria and a 5 on most criteria. Then, note which of the criteria were high quality (rating of 5), which need some improvement (rating of 4), and which need significant improvement.  Do not list the numerical ratings but state them in a text form. Start each criteria which needs improvement in a new paragraph, and summarize the suggested improvements as bullet points with appropriate quotation marks were appropriate. If a quality category has no bullet points, then skip that category. ",
                                "includeEssay": false,
                                "promptRole": "user"
                              }
                            ],
                            "outputDataType": "TEXT"
                          }
                        ],
                        "title": "Army Style Checklist"
                      }
                },
            },
            {
                "node":                         {
                    "_id": "65a8592b26523c7ce5acacsa",
                    "title": "Prompt test 2",
                    "steps": [],
                    "description": "Army Style Prompt Checklist",
                    "introduction": "",
                    "prompt": {
                        "_id": "659dd7664575cc2a8f595375",
                        "clientId": "4a224649-8a00-45df-929d-a4299b277b82",
                        "aiPromptSteps": [
                          {
                            "prompts": [
                              {
                                "promptText": "You are an Army officer who is an expert in the Army writing style. The Army writing style has the following key criteria:\n1. BLUF - Bottom Line Up Front: Put the recommendation, conclusion, or reason for writing—the “ bottom line ”—in the first or second paragraph, not at the end.\n2. Active Voice: Use the active voice.\n3. Short Sentences: Use short sentences (an average of 15 or fewer words).\n4. Concise Language: Use short words (three syllables or fewer). (See the clarity index in paragraph 4–3.)\n5. Brief Paragraphs: Write paragraphs that, with few exceptions, are no more than 250 characters long.\n6. Grammar: Use correct spelling, grammar, and punctuation.\ng. Direct Pronouns: Use “I\",“you” and “we” as subjects of sentences instead of “this office\", “this headquarters\", “all individuals\", and so forth, for most kinds of writing.\n\nPlease rate the quality of this essay on each criteria and reply with JSON in the following format:\n{\n     Bottom Line Up Front: \n    {\n       Rating: int,  // Rate from 1-5 how well this document states its purpose quickly and clearly in the first few sentences, such as a recommendation for action. Any recommendation or conclusion should be specific about who, what, and why the conclusion was made\n       BLUF Summary: str, // Summarize the \"Bottom Line\" purpose of this document in a single sentence under 20 words\n       Issues: // List 0 to 3 issues that might be improved for the BLUF\n       [\n            {\n                Passage 1 : str, // A copy of the sentence or passage which has the problem\n                Explanation: str, // An explanation how the passage might be improved to state the bottom line up front more clearly\n                Suggestion: str, // If the BLUF rating was poor, suggest an improved bottom line up front statement for the purpose of this writing. This must state who, what, and why in specific terms when available (e.g., names, equipment, locations)\n            }\n        ]\n    },\n    Active Voice: \n    {\n     Rating: int,  // Rate from 1-5 how well this document uses active voice, where a 1 is less than 60% and a 5 is over 95% of sentences\n       Active Count: int, // A count of the number of sentences using only active voice\n       Passive Count: int, // A count of the number of sentences using passive voice at least once\n       Total Count: int, // A count of the total number of sentences\n       Issues: // List 0 to 5 issues that might be improved for active voice. List the most passive with the least clear action statements first\n       [\n            {\n                Passage 1 : str // A copy of the sentence or passage which has the problem\n                Explanation: str // An explanation how the passage might be improved to use active voice, such as a suggestion to rewrite the passage such as \"try instead, <Passage 1 re-written in active voice>\"\n            }\n        ]\n    },\n    Short Sentences: \n    {\n     Rating: int,  // Rate from 1-5 how well this document uses short sentences under 15 words. Count the percentage of sentences with more than 15 words, and rate as 1 when less than 60% and a 5 is over 95% of sentences\n       Too Long Count: int, // A count of the number of sentences with more than 15 words\n       Long Count: int // A count of the number of sentences with 11 to 15 words\n       Short Count: int, // A count of the number of sentences under 10 words\n       Total Count: int, // A count of the total number of sentences\n       Issues: // List the 20 longest and least clear sentences which could be improved by breaking them up or shortening them, in order starting with the longest and least clear. Do not list any sentences shorter than 15 words.\n       [\n            {\n                Passage 1 : str // A copy of the sentence which is too long\n                Explanation: str // An explanation how the passage might be improved, such as breaking into more sentences or more direct language\n            }\n        ]\n    }\n}",
                                "includeEssay": true,
                                "promptRole": "user"
                              }
                            ],
                            "outputDataType": "JSON"
                          },
                          {
                            "prompts": [
                              {
                                "promptText": "The JSON contains a review of a writing passage against the Army Style guidelines. Please provide a summary which states the overall quality of the writing where a good-quality writing product should be rated at least 4 on all criteria and a 5 on most criteria. Then, note which of the criteria were high quality (rating of 5), which need some improvement (rating of 4), and which need significant improvement.  Do not list the numerical ratings but state them in a text form. Start each criteria which needs improvement in a new paragraph, and summarize the suggested improvements as bullet points with appropriate quotation marks were appropriate. If a quality category has no bullet points, then skip that category. ",
                                "includeEssay": false,
                                "promptRole": "user"
                              }
                            ],
                            "outputDataType": "TEXT"
                          }
                        ],
                        "title": "Army Style Checklist"
                      }
                }
            }
        ]
    }
}