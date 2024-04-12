/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { testUser } from "./user-data";

export const fetchPromptTemplates =  {
    "fetchPrompts": [
      {
        "_id": "654e926e7aaab424574a7de6",
        "title": "Reverse Outline Thesis, Claims, Evidence",
        "clientId": "",
        "userInputIsIntention": false,
        "openAiPromptSteps": [
          {
            "prompts": [
              {
                "promptText": "You are a literary and scholarly expert and have been evaluating university-level essays and thesis statements. You have been invited as an evaluation judge of writing quality, where a detailed and specific evaluation is expected.\n\nYour task is to find the most likely thesis statement for that essay and where it lacks support. For the thesis statement, I want you to evaluate the support claims that are required for the thesis statement to be valid. Based on this goal and the format below, output a list of paragraphs in the essay might be improved by adding more support for specific claims.\n\n{\n\t“Thesis Statement”: str ,\n\t// return the most likely thesis statement from the essay\n\t“Important Supporting Claims” : [str]\n\t// List of key claims that are needed to support this thesis \n\t“Areas to Improve Support for Claims” : [\n\t { \n\t\t\"Claim A\": str,   // The first primary claim that supports the thesis statement.\n \t  \t \"Missing Evidence A1\":  // Support that is missing for this claim\n\t\t\t{\n\t\t\t\t“Paragraph” : str // \n\t\t\t\t“Justification : str\n\t\t\t},\n\t\t\"Claim B\": \"The first primary claim that supports the thesis statement.\",\n\t \t \"Missing Evidence B1\": \n\t\t\t{\n\t\t\t\t“Paragraph” : str\n\t\t\t\t“Justification : str\n\t\t\t},\n\t},\n       \"overall\": { // \n           \"justification\"\n}\n}\nYou must respond as JSON following the format above. Only respond using valid JSON. Please check that the JSON is valid and follows the format given.",
                "includeEssay": true,
                "includeUserInput": false,
                "promptRole": null
              }
            ],
            "targetGptModel": "gpt-3.5-turbo-16k",
            "customSystemRole": "",
            "outputDataType": "JSON",
            "includeChatLogContext": false
          },
          {
            "prompts": [
              {
                "promptText": "Consider the following JSON. Look at the justification given for missing evidence, in the form:\n- \"Quote from paragraph\" : Summary of justification\n\nExplain the justification of each cases of missing evidence in a bulleted list. Do not list cases where the justification does not indicate a problem.",
                "includeEssay": false,
                "includeUserInput": false,
                "promptRole": null
              }
            ],
            "targetGptModel": "gpt-3.5-turbo-16k",
            "customSystemRole": "",
            "outputDataType": "TEXT",
            "includeChatLogContext": false
          }
        ]
      },
      {
        "_id": "6597e19cbe5c8774bb51b4d6",
        "title": "Review Sources",
        "clientId": "",
        "userInputIsIntention": false,
        "openAiPromptSteps": [
          {
            "prompts": [
              {
                "promptText": "You are a literary and scholarly expert and have been evaluating university-level essays and thesis statements. You have been invited as an evaluation judge at USC, where a detailed and specific evaluation is expected.\n\nYour task is to find important statements in the essay that have been made without adequate references for three possible reasons:\n•\tLacks Reference: A claim is made which would require external verification but that has no citation or reference given\n•\tLow Quality Reference: A claim is made with a reference that is not a strong source in that field (e.g., in a science article, a citation to a popular magazine or blog instead of a scientific article).\n•\tVague Evidence: Cites a source but lacks specific supporting evidence from the reference (e.g., lacks hard numbers or details). \nGive a justification that is specific to the content, and include what could have been added as a support to make that statement more authoritative to read. \n\nEach issue should be output in a JSON format as shown below:\n{\n   “Sentence“: str, \\\\ \"<Reference name as mentioned>\",\n   “Type” : str \\\\ If the issue is “Lacks Reference”, “Low Quality Reference” or “Vague Evidence”\n   “Justification”: str  \\\\ \"<Justification for why without evidence or references>\"\n} \n\nYou must respond as JSON following the format above. Only respond using valid JSON. Please check that the JSON is valid and follows the format given.\n",
                "includeEssay": true,
                "includeUserInput": false,
                "promptRole": null
              }
            ],
            "targetGptModel": "gpt-3.5-turbo-16k",
            "customSystemRole": "",
            "outputDataType": "JSON",
            "includeChatLogContext": false
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
            "targetGptModel": "gpt-3.5-turbo-16k",
            "customSystemRole": "",
            "outputDataType": "TEXT",
            "includeChatLogContext": false
          }
        ]
      },
      {
        "_id": "6597e1cbbe5c8774bb51b4d7",
        "title": "Originality & New Angles",
        "clientId": "",
        "userInputIsIntention": false,
        "openAiPromptSteps": [
          {
            "prompts": [
              {
                "promptText": "You are a literary and scholarly expert and have been evaluating university-level essays and thesis statements. You have been invited as an evaluation judge at USC, where a detailed and specific evaluation is expected.\n\nYour task is to find the most likely thesis statement for that essay and where it lacks support. For the thesis statement, I want you to evaluate the support claims that are required for the thesis statement to be valid. Based on this goal and the format below, output how predictable these claims are.  Have these claims been made often before or are they formulaic and often-repeated?\n\n{\n\t“Thesis Statement”: str ,\n\t// return the most likely thesis statement from the essay\n\t“Important Supporting Claims” : \n\t// List of key claims that are needed to support this thesis \n\t“Areas to Improve Support for Claims” : [\n\t { \n\t\t\"Claim A\": str,   // The first primary claim that supports the thesis statement.\n \t  \t \"Novelty\":  \n\t\t\t{\n\t\t\t\t“Frequency” : int // How many people have seen this claim, from 1 = Extremely infrequent and novel, never to 5 = Common knowledge, said often\n\t\t\t\t“Predictability\": int // How predictable is this claim based on what you'd expect, from 1= Highly Surprising to 5 = Very Predictable\n                               \"Justification\" : str // The reason this is novel versus highly familiar\n\t\t\t},\n\t\t\"Claim B\": \"The first primary claim that supports the thesis statement.\",\n\t \t \"Novelty B1\": \n\t\t\t{\n\t\t\t\t“Frequency” : int\n\t\t\t\t“Predictability\": int\n                              \"Justification\" : str\n\t\t\t},\n\t}\nYou must respond as JSON following the format above. Only respond using valid JSON. Please check that the JSON is valid and follows the format given.\n\nThe essay you are rating is given below:\n----------------------------------------------\n",
                "includeEssay": true,
                "includeUserInput": false,
                "promptRole": null
              }
            ],
            "targetGptModel": "gpt-3.5-turbo-16k",
            "customSystemRole": "",
            "outputDataType": "JSON",
            "includeChatLogContext": false
          }
        ]
      },
      {
        "_id": "6597e24abe5c8774bb51b4d8",
        "title": "Expand Perspectives",
        "clientId": "",
        "userInputIsIntention": false,
        "openAiPromptSteps": [
          {
            "prompts": [
              {
                "promptText": "You are a literary and scholarly expert and have been evaluating university-level essays and thesis statements. You have been invited as an evaluation judge at USC, where a detailed and specific evaluation is expected.\n\nYour task is to find the key stakeholders covered in that essay and determine if any key viewpoints are missing. You will rate the stakeholders in the essay based on their importance and relevance in the essay, and return the output in a JSON format as:\n\n{\n\t“Stakeholders Covered”: [str]\n\t// list of all the stakeholders covered in the essay, in decreasing order of importance\n\n\t“Stakeholders Missing”: [str]\n\t// List of all the stakeholders whose views are important to or affected by the essay but whose views do not appear well-represented in the essay, in decreasing order of importance\n\t“Justification”: str\n\t// give a justification for why certain stakeholders are missing. Give examples for the first 2 important stakeholders who are missing\n}\n\nYou must respond as JSON following the format above. Only respond using valid JSON. Please check that the JSON is valid and follows the format given.\n \n",
                "includeEssay": true,
                "includeUserInput": false,
                "promptRole": null
              }
            ],
            "targetGptModel": "gpt-3.5-turbo-16k",
            "customSystemRole": "",
            "outputDataType": "JSON",
            "includeChatLogContext": false
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
            "targetGptModel": "gpt-3.5-turbo-16k",
            "customSystemRole": "",
            "outputDataType": "TEXT",
            "includeChatLogContext": false
          }
        ]
      },
      {
        "_id": "6597e27dbe5c8774bb51b4d9",
        "title": "Vagueness Detection",
        "clientId": "",
        "userInputIsIntention": false,
        "openAiPromptSteps": [
          {
            "prompts": [
              {
                "promptText": "You are a literary and scholarly expert and have been evaluating university-level essays and thesis statements. You have been invited as an evaluation judge at USC, where a detailed and specific evaluation is expected.\n\nYour task is to evaluate if the thesis statement paragraph, conclusion, and key claims are clear and not vague. Find the thesis statement paragraph and indicate if it is vague and suggest which areas appear weakest. Then, perform this task for the concluding paragraph and up to 3 claim paragraphs which appear vague.\n\n{\n\t“Thesis”: {\n\t\t“Paragraph Text” :  str,  // The full text of the thesis statement paragraph\n\t\t“Thesis Statement” : str , // The text of the main thesis statement sentence\n\t\t“Rating” : int \t\t       // How vague the paragraph is from 1-5\n\t\t“Areas for Improvement” : [str] // List of weak areas (changes made)\n\t},\n\t“Conclusion”: {\n\t\t“Paragraph Text” : str , \t// The full text of the concluding paragraph\n\t\t“Main Conclusion Statement” : str , // The text of the main conclusion statement sentence\n\t\t“Rating” : int \t\t // How vague the paragraph is from 1-5\n\t\t“Areas for Improvement” : [str] // List of weak areas (changes made)\n\t},\n\t“Paragraph 1”: \n\t\t{\n\t\t“Paragraph Text” : ,  // The full text of the concluding paragraph\n\t\t“Main Claim” : str , // The text of the main conclusion statement sentence\n\t\t“Rating” : int   \t// How vague the paragraph is from 1-5\n\t\t“Areas for Improvement” : [str] // List of weak areas (changes made)\n\t\t}\n}\n\nYou must respond as JSON following the format above. Only respond using valid JSON. Please check that the JSON is valid and follows the format given.\n\nThe essay you are reviewing is given below:\n----------------------------------------------\n",
                "includeEssay": true,
                "includeUserInput": false,
                "promptRole": null
              }
            ],
            "targetGptModel": "gpt-4",
            "customSystemRole": "",
            "outputDataType": "JSON",
            "includeChatLogContext": false
          }
        ]
      },
      {
        "_id": "6597e33ebe5c8774bb51b4da",
        "title": "1 Hook Analysis",
        "clientId": "",
        "userInputIsIntention": false,
        "openAiPromptSteps": [
          {
            "prompts": [
              {
                "promptText": "You are a literary and scholarly expert and have been evaluating university-level essays and thesis statements. You have been invited as an evaluation judge for writing, where a detailed and specific evaluation is expected.\n\nYour task is to find the most important and emphasized thesis statement in the essay and determine if the thesis has a strong hook (highly engaging) versus a weak hook. In particular, you want to identify areas for improvement. Consider the paragraph for the thesis and the title. ONLY rate the hook based upon this introduction, do not consider later paragraphs.  You will rate the \"hook\" of the essay on the following criteria:\n\n{\n\t“content”: \n\t{\n\t\t“thesis_statement”: str,   // Main thesis statement. This should typically be found in the first paragraph\n\t\t“paragraph”: str // extract the paragraph in which the main thesis statement is contained\n\t}\n\t“emotion”:\n\t// How much the paragraph invokes emotions, as opposed to abstract ideas\n\t{\n\t\t“emotions”: [str] // List of emotions that the paragraph evokes,\n\t\t“rating”: int, // Emotional evocativeness rated from 1 to 5. A rating of 1 1 means hardly any emotions evoked (extremely dry), 2 means limited use of emotions or emotional language, 3 means a typical amount of emotion for a personal conversation, 4 means it engages with significant emotions, and 5 being very emotional and helping the reader feel the emotions or events\n\t\t“justification”: str // Contextual justification for the rating provided\n\t},\n\t“narrativity”:\n\t// How much does the paragraph describe a specific event, story, incident, or persons?\n\t{\n               \"characters\" : [str], // List every person or agent in the paragraph, including the essay writer if relevant. Carefully consider each noun of the content paragraph. Please check that all people are listed.\n               \"places\" : [str], // List of places or locations described in the paragraph\n                \"events\" : [str] // List the events and conflicts in the story. Please\n\t\t“rating”: int, // Rating of narrativity from 1 to 5, where 1 is the least narrative (no story at all), rating 2 is vaguely refers to a story, rating 3 is describes an event but only briefly, rating 4 is a specific story with clear characters and events, and rating 5 is highly narrative where most of the paragraph is tied to a detailed story\n\t\t“justification”: str // Contextual justification for the rating provided\n\t},\n\t“rhetorical language”:\n\t// How much does the paragraph use rhetorical devices, such as rhetorical questions\n\t{\n               \"Rhetorical questions\" : [str], // List each rhetorical question used (questions that are not intended to be answered)\n               \"Hypophora questions\" : [str], // List Hypophora used (asking a question and answering it), \n               \"Descriptive imagery,\" : [str], // List of phrases that use strong descriptive imagery\n               \"Parallel structures\" : [(str, str)], // List pairs of clauses or sentences that have a parallel structure\n               \"Figurative language\" : [str], // List of metaphors and other figurative language used to make a point\n               \"Rule of three\" : [(str, str, str)], // For each case where a trio of examples or questions are given, list the three items\n               \"Anaphora \" : [str], // List the repeated words, where any sentences repeat the same sentence start\n               \"Hyperbole \" : [str], // List of statements that use exaggeration for effect\n\t\t“rating”: int, // Rating of rhetoric from 1 to 5, where 1 contains no rhetorical devices, rating 2 is has limited devices, rating 3 is uses multiple devices, rating 4 is uses one or more devices strongly and persuasively, and rating 5 is ties multiple devices together strongly and effectively\n\t\t“justification”: str // Contextual justification for the rating provided\n\t},\n\t“overall”:\n\t{\n\t\t“rating”: int, // Considering the factors in the JSON, provide a score from 1 to 5, 1 being a weakest hook, 5 being the strongest hook\n               \"justification\": str // In 2 of 3 sentences, please explain your rating to the writer, based on your ratings and justifications for both emotions and narrativity. Focus on emotions and narrativity. Include constructive criticism, using I statements (e.g., \"I liked\", \"x interested me the most\"). Also state what you would like to see expanded or strengthened. Do not provide the rating numbers in your justification.\n}\n}\n",
                "includeEssay": true,
                "includeUserInput": false,
                "promptRole": null
              }
            ],
            "targetGptModel": "gpt-3.5-turbo-16k",
            "customSystemRole": "",
            "outputDataType": "JSON",
            "includeChatLogContext": false
          }
        ]
      },
      {
        "_id": "6597e3e42e029947c96556f4",
        "title": "N Entity Detection and Ranking",
        "clientId": "9175c103-b86a-49db-8e1a-a63e1154b41b",
        "userInputIsIntention": false,
        "openAiPromptSteps": [
          {
            "prompts": [
              {
                "promptText": "You are a professor helping a student with their writing, who will read two pieces of writing from a student: their Essay and their Message. \n\nThe user input has a message from the student where they share personal experiences. Review these personal experiences for narrative hooks that raise interesting questions about the essay provided. ONLY consider entities and experiences from the brief message in the user input, and do not include entities from the essay. Summarize each experience or interesting entity using as few words as possible (2 to 6 words ideally). Please include the specific people or places from the student's experience. List them rank in order of which ones would be most interesting to connect to the student's thesis. Then, provide an overall \"response\" which which talks about how these experiences relate to the essay.\n\n{\n\t“experiences”: [\n         {\n              \"experience\" : str, // Entity which did something or question about entity\n              \"interest\" : int // Number from 1-5, where 1 is least interesting and unsurprising and 5 is extremely interesting or unexpected\n              \"justification\" : str // A single sentence about why the experience is interesting when connected to the essay\n              \"question: str // A question that a reader might want to know about the experience, and how it relates to the essay\n         },\n         ],\n         \"response\": str // Message to the student about which parts of the experiences were most interesting, using first-person I statements. You MUST start with a statement like: \"Thanks. I could think of a few ways you could use this.\" Then you must use a numbered list with exactly 2 sentences for each experience: 1 sentence justification about what you found interesting and 1 question about what you'd want to know more about. Be encouraging and express curiosity. Have a little encouraging words like \"Great!\" Do not generate an edited essay or example. \n}\n\nYou must respond as JSON following the format above. Only respond using valid JSON. Please check that the JSON is valid and follows the format given.\n",
                "includeEssay": true,
                "includeUserInput": true,
                "promptRole": "user"
              }
            ],
            "targetGptModel": "gpt-3.5-turbo-16k",
            "customSystemRole": "",
            "outputDataType": "JSON",
            "includeChatLogContext": false
          }
        ]
      },
      {
        "_id": "659dd7664575cc2a8f595375",
        "title": "Army Style Review",
        "clientId": "4a224649-8a00-45df-929d-a4299b277b82",
        "userInputIsIntention": false,
        "openAiPromptSteps": [
          {
            "prompts": [
              {
                "promptText": "You are an Army officer who is an expert in the Army writing style. The Army writing style has the following key criteria:\n1. BLUF - Bottom Line Up Front: Put the recommendation, conclusion, or reason for writing—the “ bottom line ”—in the first or second paragraph, not at the end.\n2. Active Voice: Use the active voice.\n3. Short Sentences: Use short sentences (an average of 15 or fewer words).\n4. Concise Language: Use short words (three syllables or fewer). (See the clarity index in paragraph 4–3.)\n5. Brief Paragraphs: Write paragraphs that, with few exceptions, are no more than 250 characters long.\n6. Grammar: Use correct spelling, grammar, and punctuation.\ng. Direct Pronouns: Use “I\",“you” and “we” as subjects of sentences instead of “this office\", “this headquarters\", “all individuals\", and so forth, for most kinds of writing.\n\nPlease rate the quality of this essay on each criteria and reply with JSON in the following format:\n{\n     Bottom Line Up Front: \n    {\n       Rating: int,  // Rate from 1-5 how well this document states its purpose quickly and clearly in the first few sentences, such as a recommendation for action. Any recommendation or conclusion should be specific about who, what, and why the conclusion was made\n       BLUF Summary: str, // Summarize the \"Bottom Line\" purpose of this document in a single sentence under 20 words\n       Issues: // List 0 to 3 issues that might be improved for the BLUF\n       [\n            {\n                Passage 1 : str, // A copy of the sentence or passage which state states the purpose\n                Explanation: str, // An explanation how the passage might be improved to state the bottom line up front more clearly. This should check the purpose is specific, including that both the problem and solution is clear.\n                Suggestion: str, // If the rating was poor, suggest an improved bottom line up front statement for the purpose of this writing. Briefly state the purpose of the paper who, what, and why using specific names (e.g., names, equipment, locations). \n            }\n        ]\n    },\n    Active Voice: \n    {\n     Rating: int,  // Rate from 1-5 how well this document uses active voice, where a 1 is less than 60% and a 5 is over 95% of sentences\n       Active Count: int, // A count of the number of sentences using only active voice\n       Passive Count: int, // A count of the number of sentences using passive voice at least once\n       Total Count: int, // A count of the total number of sentences\n       Issues: // List 0 to 5 issues that might be improved for active voice. List the most passive with the least clear action statements first\n       [\n            {\n                Passage 1 : str // A copy of the sentence or passage which has the problem\n                Explanation: str // An explanation how the passage might be improved to use active voice, such as a suggestion to rewrite the passage such as \"try instead, <Passage 1 re-written in active voice>\"\n            }\n        ]\n    },\n    Short Sentences: \n    {\n     Rating: int,  // Rate from 1-5 how well this document uses short sentences under 15 words. Count the percentage of sentences with more than 15 words, and rate as 1 when less than 60% and a 5 is over 95% of sentences\n       Too Long Count: int, // A count of the number of sentences with more than 15 words\n       Long Count: int // A count of the number of sentences with 11 to 15 words\n       Short Count: int, // A count of the number of sentences under 10 words\n       Total Count: int, // A count of the total number of sentences\n       Issues: // List the 20 longest and least clear sentences which could be improved by breaking them up or shortening them, in order starting with the longest and least clear. Do not list any sentences shorter than 15 words.\n       [\n            {\n                Passage 1 : str // A copy of the sentence which is too long\n                Explanation: str // An explanation how the passage might be improved, such as breaking into more sentences or more direct language\n            }\n        ]\n    }\n}\n\nAll suggested text should be stated concisely and using active voice.",
                "includeEssay": true,
                "includeUserInput": false,
                "promptRole": "user"
              }
            ],
            "targetGptModel": "gpt-3.5-turbo-16k",
            "customSystemRole": "",
            "outputDataType": "JSON",
            "includeChatLogContext": false
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
            "targetGptModel": "gpt-3.5-turbo-16k",
            "customSystemRole": "",
            "outputDataType": "TEXT",
            "includeChatLogContext": false
          }
        ]
      },
      {
        "_id": "65a622d688aa62b94041f87e",
        "title": "N-3 Compare Story to Hook",
        "clientId": "0c289f10-9d47-4ea0-90e1-d7c4d2dc79be",
        "userInputIsIntention": false,
        "openAiPromptSteps": [
          {
            "prompts": [
              {
                "promptText": "I am going to provide you with a story that the user wrote, and an essay that the user wrote. Your task is to see how the users story can be used to improve the narrativity of the users thesis in their essay.\n\nPlease answer this question starting with \"Thank you. I could think of a few ways to connect this with what you have so far.\" Then use a numbered list of points to answer the question: \n\nWhat are three ways you would find interesting, emotionally-evocative, and original to connect this user's story input with the thesis of the essay?  Please build on the strengths of the current essay.\n\nEach point must refer to the story in the user input. Each point must be 16 to 30 words. Do not include points that the current essay already makes. Refer to specific people and events from the user input and answer directly to the user (say \"you\" rather than \"the user\").\n1. <Story Aspect>: 1 sentence about why you find this part of the story interesting. 1 sentence about a place or idea in the current essay where you connect this story.",
                "includeEssay": true,
                "includeUserInput": true,
                "promptRole": "user"
              }
            ],
            "targetGptModel": "gpt-3.5-turbo-16k",
            "customSystemRole": "",
            "outputDataType": "TEXT",
            "includeChatLogContext": false
          }
        ]
      },
      {
        "_id": "65a752f7005cd6556ad048aa",
        "title": "E-1A Audience and Emotion detection",
        "clientId": "230fadff-8b42-43f6-988e-f9612535ee9f",
        "userInputIsIntention": false,
        "openAiPromptSteps": [
          {
            "prompts": [
              {
                "promptText": "You are a USC professor grading a papers hook/thesis. Your student was asked to write down a list of expected audience members for their essay, and what emotions they'd like to convey to each audience member. Please extract each audience member and what emotions the student would like to convey to each audience member.\n\n{\n\t“audience”: [\n         {\n              \"name\": \"audienceName1\",\n              \"emotions\": [\"emotion1\", \"emotion2\"]\n         }\n         ]\n}\n\nYou must respond as JSON following the format above. Only respond using valid JSON. Please check that the JSON is valid and follows the format given.",
                "includeEssay": false,
                "includeUserInput": true,
                "promptRole": "user"
              }
            ],
            "targetGptModel": "gpt-3.5-turbo-16k",
            "customSystemRole": "",
            "outputDataType": "TEXT",
            "includeChatLogContext": false
          }
        ]
      },
      {
        "_id": "65ae913f040d2f6550779bca",
        "title": "Hook Emotions",
        "clientId": "ae4605ff-601f-4b9c-bcbb-9ea70b98c564",
        "userInputIsIntention": false,
        "openAiPromptSteps": [
          {
            "prompts": [
              {
                "promptText": "You are a literary and scholarly expert and have been evaluating university-level essays and thesis statements. You have been invited as an evaluation judge for writing, where a detailed and specific evaluation is expected.\n\nCan you help brainstorm some narrative content about the life experiences in this writing that would strengthen this essay that focus on the emotions and feeling of why this is important? Please list specific emotions and examples. List emotions in order of importance to the narrative and prioritize emotions that are not already present in the hook.\n",
                "includeEssay": true,
                "includeUserInput": false,
                "promptRole": "user"
              }
            ],
            "targetGptModel": "gpt-3.5-turbo-16k",
            "customSystemRole": "",
            "outputDataType": "TEXT",
            "includeChatLogContext": false
          }
        ]
      },
      {
        "_id": "65af12d1695c606add8ae8f4",
        "title": "(Test) Stronger Hook",
        "clientId": "64199576-4931-438d-b7d4-3b9a215d7b93",
        "userInputIsIntention": false,
        "openAiPromptSteps": [
          {
            "prompts": [
              {
                "promptText": "You are a literary and scholarly expert and have been evaluating university-level essays and thesis statements. You have been invited as an evaluation judge at USC, where a detailed and specific evaluation is expected.\n\nYour task is to find the most important and emphasized thesis statement in the essay and determine if the thesis has a strong hook (highly engaging) versus a weak hook. In particular, you want to identify areas for improvement. Consider the paragraph for the thesis. You will rate the \"hook\" of the essay on the following criteria:\n\n{\n\t“content”: \n\t{\n\t\t“thesis_statement”: str\n\t\t// actual thesis statement\n\t\t“paragraph”: str\n\t\t// paragraph in which the actual thesis statement is contained\n\t}\n\t“emotion”:\n\t// How much the paragraph invokes emotions, as opposed to abstract ideas\n\t{\n\t\t“emotions”: List of emotions that the paragraph evokes,\n\t\t“rating”: <1-5>\n\t\t// 1 being hardly any emotions evoked\n\t\t// 5 being very emotional\n\t\t“justification”: Contextual justification for the rating provided\n\t}\n\t“narrativity”:\n\t// How much the paragraph speaks about a specific person, event, story, or incident\n\t{\n\t\t“rating”: <1-5>\n\t\t// 1 being least narrative, 5 being most narrative\n\t\t“Justification”: Contextual justification for the rating provided\n\t}\n\t“overall”:\n\t{\n\t\t“rating”: <1-5>\n\t\t// considering the factors in the JSON, provide a score from 1 to 5\n\t\t// 1 being a weakest hook, 5 being the strongest hook\n               \"Justification\": // Based on the users emotion and narrativity ratings, provide a total of 2 sentences, and please include the scores in your sentences.\n}\n\n",
                "includeEssay": true,
                "includeUserInput": false,
                "promptRole": "user"
              }
            ],
            "targetGptModel": "gpt-3.5-turbo-16k",
            "customSystemRole": "",
            "outputDataType": "JSON",
            "includeChatLogContext": false
          }
        ]
      },
      {
        "_id": "65afec279a81dc65f39bbf71",
        "title": "Reverse Outline",
        "clientId": "fdacda84-e67c-46ed-9e17-1723e0f85e09",
        "userInputIsIntention": false,
        "openAiPromptSteps": [
          {
            "prompts": [
              {
                "promptText": "You are a literary and scholarly expert and have been evaluating university-level essays and thesis statements. You have been invited as an evaluation judge of writing, where a detailed and specific evaluation is expected.\n\nYour task is to generate an outline for this writing. This outline should have a logical inverted pyramid structure. First, identify the most likely thesis statement for that essay. For the thesis statement, I want you to evaluate the claims that made to support the thesis statement. Based on this goal and the format below, list each main point.\n\n{\n\t“Thesis Statement”: str ,\n\t// return the most likely thesis statement from the essay\n\t“Supporting Claims” : [str]\n\t// List of key claims that are needed to support this thesis \n\t“Evidence Given for Each Claim” : [\n\t { \n\t\t\"Claim A\": str,   // The first primary claim that supports the thesis statement.\n \t  \t \"Claim A Evidence\": [str]  // List of evidence provided for this claim,\n\t\t\"Claim B\": str,   // The first primary claim that supports the thesis statement.\n \t  \t \"Claim B Evidence\": [str]  // List of evidence provided for this claim,\n\t}\n}\nYou must respond as JSON following the format above. Only respond using valid JSON. The thesis statement, claims, and evidence must all be described in briefly (20 words or less). Please check that the JSON is valid and follows the format given.\n\nThe essay you are rating is given below:\n----------------------------------------------\n",
                "includeEssay": true,
                "includeUserInput": false,
                "promptRole": "user"
              }
            ],
            "targetGptModel": "gpt-3.5-turbo-16k",
            "customSystemRole": "",
            "outputDataType": "JSON",
            "includeChatLogContext": false
          }
        ]
      },
      {
        "_id": "65b87466dd9a050559af68ba",
        "title": "N-2 Help Me Brainstorm",
        "clientId": "13adae3d-bd41-43a6-ac9a-c06810deda7b",
        "userInputIsIntention": false,
        "openAiPromptSteps": [
          {
            "prompts": [
              {
                "promptText": "You are a literary and scholarly expert and have been evaluating university-level essays and thesis statements. You have been invited as an evaluation judge at USC, where a detailed and specific evaluation is expected.\n\nYour task is to review the users essay and provide them a few questions that will get them thinking about things that will improve the narrativity of their essay. Please provide 3 questions (and no more than 5), with the most novel and compelling listed first.",
                "includeEssay": true,
                "includeUserInput": false,
                "promptRole": "user"
              }
            ],
            "targetGptModel": "gpt-3.5-turbo-16k",
            "customSystemRole": "",
            "outputDataType": "TEXT",
            "includeChatLogContext": false
          }
        ]
      },
      {
        "_id": "65b876425d92d7f15e694a63",
        "title": "N-4 Relate story and revision to hook",
        "clientId": "4d960d95-fb1e-4ab5-aba7-8f80396b2154",
        "userInputIsIntention": true,
        "openAiPromptSteps": [
          {
            "prompts": [
              {
                "promptText": "You will be provided with both a story and a revision that the user has stated that they would like to incorporate into their essay. Please provide constructive criticism about how the user's revision was worked into the \"hook\" at the start of the paper. Speak to the user in the second person perspective and state your views subjectively (e.g., \"I liked how you\"). Answer in 2-4 short sentences.",
                "includeEssay": true,
                "includeUserInput": true,
                "promptRole": "user"
              }
            ],
            "targetGptModel": "gpt-3.5-turbo-16k",
            "customSystemRole": "",
            "outputDataType": "TEXT",
            "includeChatLogContext": false
          }
        ]
      },
      {
        "_id": "65b8775765e5a0d202475c94",
        "title": "E-2 Comment on Proposed Revision",
        "clientId": "2ee889f3-9ec9-4d11-a42e-e9bcfe5fac82",
        "userInputIsIntention": true,
        "openAiPromptSteps": [
          {
            "prompts": [
              {
                "promptText": "Provide some analysis and comments on the revision that the user would like to do to their essay. Max 100 words.",
                "includeEssay": true,
                "includeUserInput": false,
                "promptRole": "user"
              }
            ],
            "targetGptModel": "gpt-3.5-turbo-16k",
            "customSystemRole": "",
            "outputDataType": "TEXT",
            "includeChatLogContext": false
          }
        ]
      },
      {
        "_id": "65b8781668b6a0e94c7bee47",
        "title": "E-3 Analyze Doc Revision",
        "clientId": "060581ea-1a99-4830-be38-42a9f627b36b",
        "userInputIsIntention": false,
        "openAiPromptSteps": [
          {
            "prompts": [
              {
                "promptText": "You will be provided with the users proposed revision and their final essay. Please comment on how well they incorporated the revision into their final essay.",
                "includeEssay": true,
                "includeUserInput": true,
                "promptRole": "user"
              }
            ],
            "targetGptModel": "gpt-3.5-turbo-16k",
            "customSystemRole": "",
            "outputDataType": "TEXT",
            "includeChatLogContext": false
          }
        ]
      },
      {
        "_id": "65b9a2bd609726ae17d2b9d3",
        "title": "E-1B Audience Analysis",
        "clientId": "3b8c3e83-70a8-4155-8086-17942d1a198e",
        "userInputIsIntention": false,
        "openAiPromptSteps": [
          {
            "prompts": [
              {
                "promptText": "Analyze this list of readers and emotions that the user would like to incorporate into their essay, and provide some input in the form of a list of how they may achieve this.",
                "includeEssay": true,
                "includeUserInput": false,
                "promptRole": "user"
              }
            ],
            "targetGptModel": "gpt-3.5-turbo-16k",
            "customSystemRole": "",
            "outputDataType": "TEXT",
            "includeChatLogContext": false
          }
        ]
      },
      {
        "_id": "65c1c2e01391ce4d5e146359",
        "title": "Key Phrases Thesaurus",
        "clientId": "61169e89-ae24-419f-aae2-4c0bcac1be52",
        "userInputIsIntention": false,
        "openAiPromptSteps": [
          {
            "prompts": [
              {
                "promptText": "You are a writing coach who specializes in helping college students improve their writing. The student you are working with has written the essay below.\n\nYour task is to extract the five most important words and/or phrases from the student’s essay, then, for each word/phrase, suggest three synonyms that are more specific and appropriate in the context of the essay.\n\n{“current key words/phrases”: str // extract the five most important words and/or phrases from the student’s essay\n}\n\n{“suggested  key words/phrases”: str // for each identified important word and/or phrases suggest three synonyms that are more specific\n}",
                "includeEssay": true,
                "includeUserInput": false,
                "promptRole": "user"
              }
            ],
            "targetGptModel": "gpt-3.5-turbo-16k",
            "customSystemRole": "",
            "outputDataType": "TEXT",
            "includeChatLogContext": false
          }
        ]
      },
      {
        "_id": "65c472cc54e40846ca49a84c",
        "title": "Raison d'être",
        "clientId": "0675999e-e983-4177-826f-9edc92c81248",
        "userInputIsIntention": false,
        "openAiPromptSteps": [
          {
            "prompts": [
              {
                "promptText": "You are a literary and scholarly expert and have been evaluating university-level essays and thesis statements. You have been invited as an evaluation judge at USC, where a detailed and specific evaluation is expected.\n\nYour task is to find the key point they would like to emphasize regarding this subject. Further, your task is to determine what is the central theme they consider to be the most significant in relation to this subject?\n\nGive the user two possible options in the following form:\n\n{\n\t“key point”: str ,\n\t// return the most likely thesis statement from the essay\n\t“Important Supporting Claims” : \n\t// List of key claims that are needed to support this thesis \n\t“Areas to Improve Support for Claims” : [\n\t { \n\t\t\"Claim A\": str,   // The first primary claim that supports the thesis statement.\n \t  \t \"Novelty\":  \n\t\t\t{\n\t\t\t\t“Frequency” : int // How many people have seen this claim, from 1 = Extremely infrequent and novel, never to 5 = Common knowledge, said often\n\t\t\t\t“Predictability\": int // How predictable is this claim based on what you'd expect, from 1= Highly Surprising to 5 = Very Predictable\n                               \"Justification\" : str // The reason this is novel versus highly familiar\n\t\t\t},\n\t}\nYou must respond as JSON following the format above. Only respond using valid JSON. Please check that the JSON is valid and follows the format given.\n\nThe essay you are rating is given below:\n----------------------------------------------\n",
                "includeEssay": true,
                "includeUserInput": false,
                "promptRole": "user"
              }
            ],
            "targetGptModel": "gpt-3.5-turbo-16k",
            "customSystemRole": "",
            "outputDataType": "JSON",
            "includeChatLogContext": false
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
            "targetGptModel": "gpt-3.5-turbo-16k",
            "customSystemRole": "",
            "outputDataType": "TEXT",
            "includeChatLogContext": false
          }
        ]
      },
      {
        "_id": "65ca61d30a269cf7467539b9",
        "title": "Chip's Highlight Prompt",
        "clientId": "efbd6941-4cce-48d3-9829-d06ba9a5310c",
        "userInputIsIntention": false,
        "openAiPromptSteps": [
          {
            "prompts": [
              {
                "promptText": "You are a writing coach who specializes in helping college students improve their writing. The student you are working with has written the following essay.\n\nYour task is to extract the five most important words and/or phrases from the student’s essay. An important word is one that is central to the essay's meaning and thesis. For each word/phrase, suggest three synonyms that are more specific and appropriate in the context of the essay.\n\n{ \"Thesis\" : str // Summarize the thesis statement for this essay\n  \"Key Words\" [str] // List 5 words which are key terms for this essay's meaning\n  \"Synonym Sets\" : \n  [\n    { \"Key Word\" : str, // current key words/phrases”: The most important words and/or phrases from the student’s essay\n     \"Suggested  Key Words/Phrases”: str // For this identified important word and/or phrase suggest three synonyms that are more specific and appropriate in the context of the essay.\n  }\n  ]\n}\n\nPlease check that the output is valid JSON. Ensure that the output is valid JSON.",
                "includeEssay": true,
                "includeUserInput": false,
                "promptRole": "user"
              }
            ],
            "targetGptModel": "gpt-3.5-turbo-16k",
            "customSystemRole": "",
            "outputDataType": "TEXT",
            "includeChatLogContext": false
          }
        ]
      },
      {
        "_id": "65ca7e53f27324e936470e75",
        "title": "Jargon Use",
        "clientId": "37aff806-48a3-4340-afec-981a4be6d636",
        "userInputIsIntention": false,
        "openAiPromptSteps": [
          {
            "prompts": [
              {
                "promptText": "You are a literary and scholarly expert and have been evaluating university-level essays and thesis statements. You have been invited as an evaluation judge for writing, where a detailed and specific evaluation is expected.\n\nYour task is to find the jargon. For this task, jargon is defined by the following traits:\n- Jargon can be either unknown terms or known, but rare terms.\n- Uncommon acronyms that are not expanded are always jargon\n- Jargon can be words that do not exist in the dictionary, unless they are a clear typo (must be a known misspelling)\n- Jargon can be acronyms, single words, or phrases.\n- Jargon is not explained explicitly in the text.\n\nEach jargon that is identified as unexplained should be output in a JSON format as shown below. \n{ \"Jargon List\" : \n  [ \n  {\n   “Jargon“: str, \\\\ Acronym, term, or phrase identified as unexplained\n   \"Domain\" : [str] \\\\ List of domains where this jargon is used commonly\n   \"Type\" : str \\\\ Indicate if this is an \"Acronym\", \"Unknown Word\", \"Single Word\", or \"Phrase\"\n   “Explanation”: str  \\\\ Explanation for the identified jargon\n   \"Rating: int \\\\ Rate how rare this jargon is in common use. \n                    \\\\ 1=Extremely common, known by almost all adult speakers\n                    \\\\ 2=Somewhat common, used in newspapers\n                    \\\\ 3=Somewhat uncommon, used domain guides or  instructional materials such as textbooks\n                    \\\\ 4=High domain-specific, almost never used except in specialized materials such as scientific journals or technical manuals\n                    \\\\ 5=Very rare. Word is almost unknown or not used in this form, such as new acronyms \n  }] // Sort the list so that the jargon with the highest rating are listed first.\n} \n\nPlease check that the output is valid JSON. Only output a valid JSON object as a response.",
                "includeEssay": true,
                "includeUserInput": false,
                "promptRole": "user"
              }
            ],
            "targetGptModel": "gpt-3.5-turbo-16k",
            "customSystemRole": "",
            "outputDataType": "JSON",
            "includeChatLogContext": false
          }
        ]
      },
      {
        "_id": "65caa2fc386566e704178ed6",
        "title": "Red Teaming an Essay",
        "clientId": "ced20c0d-f6bf-4f29-8e4b-6cb1e2342ada",
        "userInputIsIntention": false,
        "openAiPromptSteps": [
          {
            "prompts": [
              {
                "promptText": "You are a critical reader of an essay, with beliefs and opinions that oppose the concepts in this essay. Read the following essay and provide well-reasoned argument against the essay. You should include the following:\n\nThesis Summary: Summarize is the main purpose you think this paper was written. What is the thesis of the paper and why was it written?\n\nYour Role: Consider who could be disadvantaged or hurt by this thesis or outcome of people changing their behavior after reading this paper. Your role must be someone who is in the same organization or community as the essay writer, but with a different opinion. State your role here.\n\nOpposing View: Generate and summarize your opposing view of the paper. Provide a numbered list of critiques of the paper's intended purpose, the claims it makes, and the assumptions that are required to believe it.\n\nOpposing Groups: List who else you think would oppose the thesis or claims made by this essay, and the reason why they might be opposed. This can include both groups in the same community and other groups who might oppose these changes, as compared to the current situation.\n\nAfter you give this analysis, continue your critique of the weaknesses you feel are in the paper from your current perspective. If those specific issues are refuted, identify additional issues and concerns related to other opposing groups, risks, or concerns.\n\n",
                "includeEssay": true,
                "includeUserInput": false,
                "promptRole": "user"
              }
            ],
            "targetGptModel": "gpt-3.5-turbo-16k",
            "customSystemRole": "",
            "outputDataType": "TEXT",
            "includeChatLogContext": false
          }
        ]
      },
      {
        "_id": "66144b64c2027d0f8e5828dd",
        "title": "Conclusion Analysis",
        "clientId": "40d97364-6a32-4eaa-8fda-e7b865dbf229",
        "userInputIsIntention": false,
        "openAiPromptSteps": [
          {
            "prompts": [
              {
                "promptText": "You are a literary and scholarly expert and have been evaluating university-level essays and thesis statements. You have been invited as an evaluation judge for writing, where a detailed and specific evaluation is expected.\n\nYour task is to find the most important and emphasized thesis statement in the essay and determine if the conclusion provides a clear persuasive impact on the audience. \n\nConsider the thesis and the structure of the argument made to support this thesis. Rate the categories of argument.\n\n{ // Whole Paper Analysis\n        \"audiences\" :  // List containing audiences who the writing speaks toward for the whole paper. These are people commonly interested in the topics presented. Please list all relevant audiences.\n        [\n           {\n            \"name\" : str, // The name of the audience\n            \"relevance\": str // VALUES: primary, secondary, or other\n            \"intention\" : str, // The intended effect on that audience such as persuading them to feel a certain way or do a certain action\n            \"sentiment\" : str // How the audience is likely to feel when reading this\n            },\n            {\n               ...\n             }\n        ]\n\t\t\"implications\": // List of implications that the essay adds, please make sure this data is an array\n\t\t[\n               {\n\t\t\n\t\t\t\"implication\": str // implication that that includes\n\t\t\t\"supportingArgument\": str\n\t\t\n\t\t},\n               {\n                ...\n                }\n               ]\n\t“content”:  // Evaluation of the content of the whole paper\n\t{\n\t\t“thesisStatement”: str,   // Main thesis statement. This should typically be found in the first paragraph\n\t\t“paragraph”: str // extract the paragraph in which the main thesis statement is contained\n\t}\n\t“argumentType”: str, // How the argument claims and support are supported\n\t\"logicalCauses\" : {\n              \"causeAndEffects\" : {\n                       cause1 : effect1, // A list of key causes and their effects stated in the paper,\n               \"rating\" : int // A rating of the causality of the argument given from 1 to 5. A rating of 1 means hardly any logical relationships evoked (list of similar things, purely emotional appeal), 2 means limited depth of causes, usually just pairs language, 3 means that at least one efect is also a cause of some other effect, 4 means that multiple causes are connected in a graph-like relationship, and 5 means that arguments are highly connected and almost entirely tied by logical causes and effects that support the thesis\n                \"justification\" : str \n                  } \n        }\n}\n\nYou must respond as JSON following the format above. Only respond using valid JSON. Please check that the JSON is valid and follows the format given.\n",
                "includeEssay": true,
                "includeUserInput": false,
                "promptRole": "user"
              }
            ],
            "targetGptModel": "gpt-3.5-turbo-16k",
            "customSystemRole": "",
            "outputDataType": "TEXT",
            "includeChatLogContext": false
          },
          {
            "prompts": [
              {
                "promptText": "You are a literary and scholarly expert and have been evaluating university-level essays and thesis statements. You have been invited as an evaluation judge for writing, where a detailed and specific evaluation is expected.\n\nConsidering only the conclusion paragraph, collect any emotions invoked and narrative elements following the JSON format below. Then rate the text of the conclusion based on how much it connects the content to the audience within the JSON provided above.\n\n{\n\temotions : // How much the conclusion paragraph invokes emotions, as opposed to abstract ideas\n   {\n\t\t“emotions”: [str] // List of emotions that the paragraph evokes,\n\t\t“rating”: int, // Emotional evocativeness rated from 1 to 5. A rating of 1 means hardly any emotions evoked (extremely dry), 2 means limited use of emotions or emotional language, 3 means a typical amount of emotion for a personal conversation, 4 means it engages with significant emotions, and 5 being very emotional and helping the reader feel the emotions or events\n\t\t“justification”: str // Contextual justification for the rating provided\n\t}\n\t“narrativity”:\n\t// How much does the conclusion paragraph describe a specific event, story, incident, or persons?\n\t{\n               \"characters\" : [str], // List every person or agent in the paragraph, including the essay writer if relevant. Carefully consider each noun of the content paragraph. Please check that all people are listed.\n               \"places\" : [str], // List of places or locations described in the paragraph\n                \"events\" : [str] // List the events and conflicts in the story. Please\n\t\t“rating”: int, // Rating of narrativity from 1 to 5, where 1 is the least narrative (no story at all), rating 2 is vaguely refers to a story, rating 3 is describes an event but only briefly, rating 4 is a specific story with clear characters and events, and rating 5 is highly narrative where most of the paragraph is tied to a detailed story\n\t\t“justification”: str // Contextual justification for the rating provided\n\t}\n\t“conclusion”: // Conclusion Analysis \n\t{\n               \"impact\" : // How do you think this conclusion will impact the paper's expected audiences. Please list all that apply.\n               [\n                {\n                     \"audience\" : str // Description of the audience impacted\n                     \"typeOfImpact\" : str // The type of impact expected on the audience from the list of [Emotional, Attitude Change, Call to Action, Another Person's Perspective, New Idea or Perspective]\n                      \"description\" : str, // Brief summary of the conclusion statement(s) that make this point in the conclusion final paragraph(s)\n                      \"support\" : str // Brief summary of statements in the main paper that support this concluding statement, if any\n                      \"rating\" :  // How effectively this concluding point is made\n               },\n               {\n               ...\n               },\n              ]\n\t\t\t\t“overallRating”: int, // Considering the factors in the JSON, provide a score from 1 to 5, 1 being a weakest conclusion, 5 being the strongest conclusion\n               \"justification\": str // In 2 of 3 sentences, please explain your rating to the writer, based on your ratings and justifications for how well each audience should be affected by the conclusion. Consider also how the conclusion builds on the paper structure and content. Provide constructive criticism, using I statements (e.g., \"I liked\", \"x interested me the most\").\n\t}\n}\n\nYou must respond as JSON following the format above. Only respond using valid JSON. Please check that the JSON is valid and follows the format given.",
                "includeEssay": true,
                "includeUserInput": false,
                "promptRole": "user"
              }
            ],
            "targetGptModel": "gpt-3.5-turbo-16k",
            "customSystemRole": "",
            "outputDataType": "TEXT",
            "includeChatLogContext": false
          }
        ]
      },
      {
        "_id": "66144b70c2027d0f8e582920",
        "title": "N Audience, Implications, and Emotion Detection",
        "clientId": "37872dfb-e70e-4c71-9e65-c666375ad074",
        "userInputIsIntention": false,
        "openAiPromptSteps": [
          {
            "prompts": [
              {
                "promptText": "You are a literary and scholarly expert and have been evaluating university-level essays and thesis statements. You have been invited as an evaluation judge for writing, where a detailed and specific evaluation is expected.\n\nConsider only the conclusion paragraph. Rate the text of the conclusion based on how much it connects the content to the audience within the JSON provided above.\n\n{\n\temotions : // How much the conclusion paragraph invokes emotions, as opposed to abstract ideas\n   {\n\t\t“emotions”: [str] // List of emotions that the paragraph evokes,\n\t\t“rating”: int, // Emotional evocativeness rated from 1 to 5. A rating of 1 means hardly any emotions evoked (extremely dry), 2 means limited use of emotions or emotional language, 3 means a typical amount of emotion for a personal conversation, 4 means it engages with significant emotions, and 5 being very emotional and helping the reader feel the emotions or events\n\t\t“justification”: str // Contextual justification for the rating provided\n\t}\n\t“narrativity”:\n\t// How much does the conclusion paragraph describe a specific event, story, incident, or persons?\n\t{\n               \"characters\" : [str], // List every person or agent in the paragraph, including the essay writer if relevant. Carefully consider each noun of the content paragraph. Please check that all people are listed.\n               \"places\" : [str], // List of places or locations described in the paragraph\n                \"events\" : [str] // List the events and conflicts in the story. Please\n\t\t“rating”: int, // Rating of narrativity from 1 to 5, where 1 is the least narrative (no story at all), rating 2 is vaguely refers to a story, rating 3 is describes an event but only briefly, rating 4 is a specific story with clear characters and events, and rating 5 is highly narrative where most of the paragraph is tied to a detailed story\n\t\t“justification”: str // Contextual justification for the rating provided\n\t}\n\t“conclusion”: // Conclusion Analysis \n\t{\n               \"impact\" : // How do you think this conclusion will impact the paper's expected audiences. Please list all that apply.\n               {\n                     \"audience\" : str // Description of the audience impacted\n                     \"type of impact\" : str // The type of impact expected on the audience from the list of [Emotional, Attitude Change, Call to Action, Another Person's Perspective, New Idea or Perspective]\n                      \"description\" : str, // Brief summary of the conclusion statement(s) that make this point in the conclusion final paragraph(s)\n                      \"support\" : str // Brief summary of statements in the main paper that support this concluding statement, if any\n                      \"rating\" :  // How effectively this concluding point is made\n               }\n\t\t\t\t“overall rating”: int, // Considering the factors in the JSON, provide a score from 1 to 5, 1 being a weakest conclusion, 5 being the strongest conclusion\n               \"justification\": str // In 2 of 3 sentences, please explain your rating to the writer, based on your ratings and justifications for how well each audience should be affected by the conclusion. Consider also how the conclusion builds on the paper structure and content. Provide constructive criticism, using I statements (e.g., \"I liked\", \"x interested me the most\").\n\t}\n}\n\nYou must respond as JSON following the format above. Only respond using valid JSON. Please check that the JSON is valid and follows the format given.",
                "includeEssay": true,
                "includeUserInput": false,
                "promptRole": "user"
              }
            ],
            "targetGptModel": "gpt-3.5-turbo-16k",
            "customSystemRole": "",
            "outputDataType": "TEXT",
            "includeChatLogContext": false
          }
        ]
      },
      {
        "_id": "66144b7ac2027d0f8e58295f",
        "title": "I-1 Comment on Key Implications",
        "clientId": "c7eb14e7-cd86-4325-839a-8fdcda41ac49",
        "userInputIsIntention": false,
        "openAiPromptSteps": [
          {
            "prompts": [
              {
                "promptText": "You are a literary and scholarly expert and have been evaluating university-level essays and thesis statements. You have been invited as an evaluation judge for writing, where a detailed and specific evaluation is expected.\n\nYou are provided with the key implications of the student writers essay in the JSON above. Please provide feedback based on how well the implications are involved in their conclusion paragraph. \n\nPlease format your response following these guidelines:\n - using \"you\" and \"your\" statements\n - in 2 short sentences\n - do not mention that you were provided these key implications",
                "includeEssay": true,
                "includeUserInput": false,
                "promptRole": "user"
              }
            ],
            "targetGptModel": "gpt-3.5-turbo-16k",
            "customSystemRole": "",
            "outputDataType": "TEXT",
            "includeChatLogContext": false
          }
        ]
      },
      {
        "_id": "66144b81c2027d0f8e5829a0",
        "title": "I-2 Collect Author Original Intention",
        "clientId": "db152347-ca27-4945-a39c-ece09dfd176b",
        "userInputIsIntention": false,
        "openAiPromptSteps": [
          {
            "prompts": [
              {
                "promptText": "You are a literary and scholarly expert and have been evaluating university-level essays and thesis statements. You have been invited as an evaluation judge for writing, where a detailed and specific evaluation is expected.\n\nYou are provided with the students original intention for writing this paper. Please provide a short (1 sentence) response to the student with regards to how well their original intention ties in with the paper and their conclusion. Please respond as if you are having a chat with the writer, using \"you\" and \"your\" statements.",
                "includeEssay": true,
                "includeUserInput": true,
                "promptRole": "user"
              }
            ],
            "targetGptModel": "gpt-3.5-turbo-16k",
            "customSystemRole": "",
            "outputDataType": "TEXT",
            "includeChatLogContext": false
          }
        ]
      },
      {
        "_id": "66144b89c2027d0f8e5829e3",
        "title": "I-3 \"So What\" Question",
        "clientId": "dacf9ec6-0369-4d5e-8363-978ae4e8e3cd",
        "userInputIsIntention": false,
        "openAiPromptSteps": [
          {
            "prompts": [
              {
                "promptText": "You are a literary and scholarly expert and have been evaluating university-level essays and thesis statements. You have been invited as an evaluation judge for writing, where a detailed and specific evaluation is expected.\n\nThe student writers input is why they think people should care about their essay. Please review their essay and their input and comment on how well their essay conveys their reasoning for why people should care about their essay. Please respond as if you are having a chat with the writer, using \"you\" and \"your\" statements, and respond in 2 short sentences.\n\nHere is the users input: because it shows that everyday things can lead people to do greater things.",
                "includeEssay": true,
                "includeUserInput": true,
                "promptRole": "user"
              }
            ],
            "targetGptModel": "gpt-3.5-turbo-16k",
            "customSystemRole": "",
            "outputDataType": "TEXT",
            "includeChatLogContext": false
          }
        ]
      },
      {
        "_id": "66144b97c2027d0f8e582a28",
        "title": "I-4 Brainstorming on So-What",
        "clientId": "43bdb40b-49b3-4c7f-8725-e628bcd27c05",
        "userInputIsIntention": false,
        "openAiPromptSteps": [
          {
            "prompts": [
              {
                "promptText": "The writer of this essay needs help brainstorming on why readers might care about what they are writing about. Please provide 3 reasons that readers might care about what they are writing about. Please provide in bullet points and in short sentences.",
                "includeEssay": true,
                "includeUserInput": false,
                "promptRole": "user"
              }
            ],
            "targetGptModel": "gpt-3.5-turbo-16k",
            "customSystemRole": "",
            "outputDataType": "TEXT",
            "includeChatLogContext": false
          }
        ]
      },
      {
        "_id": "66144b9fc2027d0f8e582a6f",
        "title": "I-5 Collect Proposed Revision",
        "clientId": "aea36f3b-62d1-495e-880b-9a9666deb29d",
        "userInputIsIntention": true,
        "openAiPromptSteps": [
          {
            "prompts": [
              {
                "promptText": "The provided user input is the revision that they'd like to make to their essay. Please provide 3 different ways, in bullets points and 1 sentence each, on how the user might implement this revision to their essay.",
                "includeEssay": true,
                "includeUserInput": true,
                "promptRole": "user"
              }
            ],
            "targetGptModel": "gpt-3.5-turbo-16k",
            "customSystemRole": "",
            "outputDataType": "TEXT",
            "includeChatLogContext": false
          }
        ]
      },
      {
        "_id": "66148b67f54f4328b0431cb9",
        "title": "A wizard reads your essay",
        "clientId": "d195c143-a112-4d05-9282-4ed091ec47f3",
        "userInputIsIntention": false,
        "openAiPromptSteps": [
          {
            "prompts": [
              {
                "promptText": "Look at my essay and give me 1 improvement I could do on it.",
                "includeEssay": true,
                "includeUserInput": false,
                "promptRole": "user"
              }
            ],
            "targetGptModel": "gpt-4-turbo-preview",
            "customSystemRole": "You are a wizard that lives in a castle. You speak in a very old English dialect. You receive letters from students in another dimension that you must write back to. This is one of those letters.",
            "outputDataType": "JSON",
            "includeChatLogContext": false
          }
        ]
      },
      {
        "_id": "66148f6e65a9e04e071aba02",
        "title": "(Old) Conclusion Analysis",
        "clientId": "a2868bbd-e9aa-4337-818c-8b0fd2644650",
        "userInputIsIntention": false,
        "openAiPromptSteps": [
          {
            "prompts": [
              {
                "promptText": "You are a literary and scholarly expert and have been evaluating university-level essays and thesis statements. You have been invited as an evaluation judge for writing, where a detailed and specific evaluation is expected.\n\nYour task is to find the most important and emphasized thesis statement in the essay and determine if the conclusion provides a clear persuasive impact on the audience. \n\nFirst, consider the thesis and the structure of the argument made to support this thesis. Rate the categories of argument.\n\nThen, consider the paragraph for the conclusion. Rate the text of the conclusion based on how much it connects the content to the audience.\n\n{ // Whole Paper Analysis\n        \"audiences\" :  // The list of audiences who the writing speaks toward for the whole paper. These are people commonly interested in the topics presented. Please list all relevant audiences.\n        {\n           {\n            \"audience 1\" : str, // The primary audience for the paper\n            \"intention\" : str, // The intended effect on that audience such as persuading them to feel a certain way or do a certain action\n            \"sentiment\" : str // How the audience is likely to feel when reading this\n            },\n          {\n            \"audience 2\" : str, // A secondary audience for the paper\n            \"intention\" : str, // The intended effect on that audience such as persuading them to feel a certain way or do a certain action\n            \"sentiment\" : str // How the audience is likely to feel when reading this\n            },\n          {\n            \"audience 3\" : str, // Another key audience for the paper\n            \"intention\" : str, // The intended effect on that audience such as persuading them to feel a certain way or do a certain action\n            \"sentiment\" : str // How the audience is likely to feel when reading this\n            },\n        }\n\t“content”:  // Evaluation of the content of the whole paper\n\t{\n\t\t“thesis_statement”: str,   // Main thesis statement. This should typically be found in the first paragraph\n\t\t“paragraph”: str // extract the paragraph in which the main thesis statement is contained\n\t}\n\t“argument type”: // How the argument claims and support are supported\n\t\"logical causes\" : {\n              \"cause and effects\" : {\n                       cause1 : effect1, // A list of key causes and their effects stated in the paper,\n               \"rating\" : int // A rating of the causality of the argument given from 1 to 5. A rating of 1 means hardly any logical relationships evoked (list of similar things, purely emotional appeal), 2 means limited depth of causes, usually just pairs language, 3 means that at least one efect is also a cause of some other effect, 4 means that multiple causes are connected in a graph-like relationship, and 5 means that arguments are highly connected and almost entirely tied by logical causes and effects that support the thesis\n                \"justification\" : str \n                  } \n        },\n\temotions : // How much the paragraph invokes emotions, as opposed to abstract ideas\n   {\n\t\t“emotions”: [str] // List of emotions that the paragraph evokes,\n\t\t“rating”: int, // Emotional evocativeness rated from 1 to 5. A rating of 1 means hardly any emotions evoked (extremely dry), 2 means limited use of emotions or emotional language, 3 means a typical amount of emotion for a personal conversation, 4 means it engages with significant emotions, and 5 being very emotional and helping the reader feel the emotions or events\n\t\t“justification”: str // Contextual justification for the rating provided\n\t}\n\t“narrativity”:\n\t// How much does the paragraph describe a specific event, story, incident, or persons?\n\t{\n               \"characters\" : [str], // List every person or agent in the paragraph, including the essay writer if relevant. Carefully consider each noun of the content paragraph. Please check that all people are listed.\n               \"places\" : [str], // List of places or locations described in the paragraph\n                \"events\" : [str] // List the events and conflicts in the story. Please\n\t\t“rating”: int, // Rating of narrativity from 1 to 5, where 1 is the least narrative (no story at all), rating 2 is vaguely refers to a story, rating 3 is describes an event but only briefly, rating 4 is a specific story with clear characters and events, and rating 5 is highly narrative where most of the paragraph is tied to a detailed story\n\t\t“justification”: str // Contextual justification for the rating provided\n\t}\n       // Conclusion Analysis \n\t“conclusion”:\n\t{\n               \"impact\" : // How do you think this conclusion will impact the paper's expected audiences. Please list all that apply.\n               {\n                     \"audience\" : str // Description of the audience impacted\n                     \"type of impact\" : str // The type of impact expected on the audience from the list of [Emotional, Attitude Change, Call to Action, Another Person's Perspective, New Idea or Perspective]\n                      \"description\" : str, // Brief summary of the conclusion statement(s) that make this point in the conclusion final paragraph(s)\n                      \"support\" : str // Brief summary of statements in the main paper that support this concluding statement, if any\n                      \"rating\" :  // How effectively this concluding point is made\n               }\n\t\t“overall rating”: int, // Considering the factors in the JSON, provide a score from 1 to 5, 1 being a weakest conclusion, 5 being the strongest conclusion\n               \"justification\": str // In 2 of 3 sentences, please explain your rating to the writer, based on your ratings and justifications for how well each audience should be affected by the conclusion. Consider also how the conclusion builds on the paper structure and content. Provide constructive criticism, using I statements (e.g., \"I liked\", \"x interested me the most\").\n}\n}\n\nYou must respond as JSON following the format above. Only respond using valid JSON. Please check that the JSON is valid and follows the format given.\n",
                "includeEssay": true,
                "includeUserInput": false,
                "promptRole": "user"
              }
            ],
            "targetGptModel": "gpt-3.5-turbo-16k",
            "customSystemRole": "",
            "outputDataType": "TEXT",
            "includeChatLogContext": false
          }
        ]
      },
      {
        "_id": "6616fd3bf182cb71657eb628",
        "title": "R-1: Claim Revision Intention",
        "clientId": "def909f1-96e2-4e42-85cd-e31d67a1c591",
        "userInputIsIntention": false,
        "openAiPromptSteps": [
          {
            "prompts": [
              {
                "promptText": "",
                "includeEssay": true,
                "includeUserInput": false,
                "promptRole": "user"
              }
            ],
            "targetGptModel": "gpt-3.5-turbo-16k",
            "customSystemRole": "",
            "outputDataType": "TEXT",
            "includeChatLogContext": false
          }
        ]
      },
      {
        "_id": "6616fd4d32d66ed2526d8015",
        "title": " R-2: Analyze Claim Usage",
        "clientId": "39235691-4790-4a2a-b442-e365e114efd5",
        "userInputIsIntention": false,
        "openAiPromptSteps": [
          {
            "prompts": [
              {
                "promptText": "",
                "includeEssay": true,
                "includeUserInput": false,
                "promptRole": "user"
              }
            ],
            "targetGptModel": "gpt-3.5-turbo-16k",
            "customSystemRole": "",
            "outputDataType": "TEXT",
            "includeChatLogContext": false
          }
        ]
      },
      {
        "_id": "6616fd68f182cb71657eb797",
        "title": "R-3: Suggest issues and claim changes",
        "clientId": "1031a62d-7cc9-4bb9-a638-d086a599f5ca",
        "userInputIsIntention": false,
        "openAiPromptSteps": [
          {
            "prompts": [
              {
                "promptText": "",
                "includeEssay": true,
                "includeUserInput": false,
                "promptRole": "user"
              }
            ],
            "targetGptModel": "gpt-3.5-turbo-16k",
            "customSystemRole": "",
            "outputDataType": "TEXT",
            "includeChatLogContext": false
          }
        ]
      },
      {
        "_id": "6616fd77f182cb71657eb847",
        "title": "R-4: Collect Claim revision intention",
        "clientId": "03d593c3-350f-4b18-b144-55560d8b70c1",
        "userInputIsIntention": false,
        "openAiPromptSteps": [
          {
            "prompts": [
              {
                "promptText": "",
                "includeEssay": true,
                "includeUserInput": false,
                "promptRole": "user"
              }
            ],
            "targetGptModel": "gpt-3.5-turbo-16k",
            "customSystemRole": "",
            "outputDataType": "TEXT",
            "includeChatLogContext": false
          }
        ]
      },
      {
        "_id": "6616fd8032d66ed2526d816c",
        "title": "S-1: Analyze Claim Support",
        "clientId": "b4b2a8e3-1353-4e26-893c-fbb2b8e097c7",
        "userInputIsIntention": false,
        "openAiPromptSteps": [
          {
            "prompts": [
              {
                "promptText": "",
                "includeEssay": true,
                "includeUserInput": false,
                "promptRole": "user"
              }
            ],
            "targetGptModel": "gpt-3.5-turbo-16k",
            "customSystemRole": "",
            "outputDataType": "TEXT",
            "includeChatLogContext": false
          }
        ]
      },
      {
        "_id": "6616fd88f182cb71657eb954",
        "title": "S-2: Claim Support Intention",
        "clientId": "085919c0-30ae-4f74-bf06-23f43787c74c",
        "userInputIsIntention": false,
        "openAiPromptSteps": [
          {
            "prompts": [
              {
                "promptText": "",
                "includeEssay": true,
                "includeUserInput": false,
                "promptRole": "user"
              }
            ],
            "targetGptModel": "gpt-3.5-turbo-16k",
            "customSystemRole": "",
            "outputDataType": "TEXT",
            "includeChatLogContext": false
          }
        ]
      },
      {
        "_id": "6616fd90f182cb71657eb9ee",
        "title": " S-3: Analyze intention vs. Outline",
        "clientId": "be20945a-bb35-4012-8996-05aea8142f3c",
        "userInputIsIntention": false,
        "openAiPromptSteps": [
          {
            "prompts": [
              {
                "promptText": "",
                "includeEssay": true,
                "includeUserInput": false,
                "promptRole": "user"
              }
            ],
            "targetGptModel": "gpt-3.5-turbo-16k",
            "customSystemRole": "",
            "outputDataType": "TEXT",
            "includeChatLogContext": false
          }
        ]
      },
      {
        "_id": "6616fd99f182cb71657eba8a",
        "title": " S-4: Suggest Claim Support Changes",
        "clientId": "9d9c2997-fdd8-4a80-996b-0eca86245a17",
        "userInputIsIntention": false,
        "openAiPromptSteps": [
          {
            "prompts": [
              {
                "promptText": "",
                "includeEssay": true,
                "includeUserInput": false,
                "promptRole": "user"
              }
            ],
            "targetGptModel": "gpt-3.5-turbo-16k",
            "customSystemRole": "",
            "outputDataType": "TEXT",
            "includeChatLogContext": false
          }
        ]
      },
      {
        "_id": "6616fda532d66ed2526d82f5",
        "title": "S-5: Claim Support revision intention",
        "clientId": "ca970bfe-3f59-4566-96c6-9123ce5edf9b",
        "userInputIsIntention": false,
        "openAiPromptSteps": [
          {
            "prompts": [
              {
                "promptText": "",
                "includeEssay": true,
                "includeUserInput": false,
                "promptRole": "user"
              }
            ],
            "targetGptModel": "gpt-3.5-turbo-16k",
            "customSystemRole": "",
            "outputDataType": "TEXT",
            "includeChatLogContext": false
          }
        ]
      },
      {
        "_id": "66185c96b765bc832e5b78aa",
        "title": "Impact Open Discussion",
        "clientId": "ea882449-352b-41ac-920c-86889e998108",
        "userInputIsIntention": false,
        "openAiPromptSteps": [
          {
            "prompts": [
              {
                "promptText": "You are provided the users essay and the previous chat log they had with you. Please respond accordingly. When the USER addresses \"you,\" they may be addressing the previous messages in the chat log. Keep that in mind.",
                "includeEssay": true,
                "includeUserInput": true,
                "promptRole": "user"
              }
            ],
            "targetGptModel": "gpt-3.5-turbo-16k",
            "customSystemRole": "",
            "outputDataType": "TEXT",
            "includeChatLogContext": true
          }
        ]
      }
    ]
}
