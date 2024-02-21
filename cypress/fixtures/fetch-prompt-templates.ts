import { testUser } from "./user-data";

export const fetchPromptTemplates =  {
    "fetchPrompts": [{
        "_id":"654e926e7aaab424574a7de6",
        "title": "Build Thesis Support",
        "clientId": "",
        "openAiPromptSteps": [
          {
            "prompts": [
              {
                "promptText": "You are a literary and scholarly expert and have been evaluating university-level essays and thesis statements. You have been invited as an evaluation judge of writing quality, where a detailed and specific evaluation is expected.\n\nYour task is to find the most likely thesis statement for that essay and where it lacks support. For the thesis statement, I want you to evaluate the support claims that are required for the thesis statement to be valid. Based on this goal and the format below, output a list of paragraphs in the essay might be improved by adding more support for specific claims.\n\n{\n\t“Thesis Statement”: str ,\n\t// return the most likely thesis statement from the essay\n\t“Important Supporting Claims” : [str]\n\t// List of key claims that are needed to support this thesis \n\t“Areas to Improve Support for Claims” : [\n\t { \n\t\t\"Claim A\": str,   // The first primary claim that supports the thesis statement.\n \t  \t \"Missing Evidence A1\":  // Support that is missing for this claim\n\t\t\t{\n\t\t\t\t“Paragraph” : str // \n\t\t\t\t“Justification : str\n\t\t\t},\n\t\t\"Claim B\": \"The first primary claim that supports the thesis statement.\",\n\t \t \"Missing Evidence B1\": \n\t\t\t{\n\t\t\t\t“Paragraph” : str\n\t\t\t\t“Justification : str\n\t\t\t},\n\t}\n}\nYou must respond as JSON following the format above. Only respond using valid JSON. Please check that the JSON is valid and follows the format given.\n\nThe essay you are rating is given below:\n----------------------------------------------\n",
                "includeEssay": true,
                "includeUserInput": false,
                "promptRole": null
              }
            ],
            "outputDataType": "JSON",
            "includeChatLogContext": false
          },
          {
            "prompts": [
              {
                "promptText": "Consider the following JSON. Look at the justification given for missing evidence. Show all cases of missing evidence in a bulleted list if the justification indicates there is a significant problem and ignore cases where evidence seems to be sufficient.",
                "includeEssay": false,
                "includeUserInput": false,
                "promptRole": null
              }
            ],
            "outputDataType": "TEXT",
            "includeChatLogContext": false
          }
        ]
      },
      {
        "_id": "6597e19cbe5c8774bb51b4d6",
        "title": "Review Sources",
        "clientId": "",
        "openAiPromptSteps": [
          {
            "prompts": [
              {
                "promptText": "You are a literary and scholarly expert and have been evaluating university-level essays and thesis statements. You have been invited as an evaluation judge at USC, where a detailed and specific evaluation is expected.\n\nYour task is to find important statements in the essay that have been made without adequate references for three possible reasons:\n•\tLacks Reference: A claim is made which would require external verification but that has no citation or reference given\n•\tLow Quality Reference: A claim is made with a reference that is not a strong source in that field (e.g., in a science article, a citation to a popular magazine or blog instead of a scientific article).\n•\tVague Evidence: Cites a source but lacks specific supporting evidence from the reference (e.g., lacks hard numbers or details). \nGive a justification that is specific to the content, and include what could have been added as a support to make that statement more authoritative to read. \n\nEach issue should be output in a JSON format as shown below:\n{\n“Statement A”: \n{\n“Sentence“: str, \\\\ \"<Reference name as mentioned>\",\n“Type” : str \\\\ If the issue is “Lacks Reference”, “Low Quality Reference” or “Vague Evidence”\n“Justification”: str  \\\\ \"<Justification for why without evidence or references>\"\n} \n}\n\nYou must respond as JSON following the format above. Only respond using valid JSON. Please check that the JSON is valid and follows the format given.\n",
                "includeEssay": true,
                "includeUserInput": false,
                "promptRole": null
              }
            ],
            "outputDataType": "JSON",
            "includeChatLogContext": false
          },
          {
            "prompts": [
              {
                "promptText": "Summarize this JSON in a bulleted list.",
                "includeEssay": false,
                "includeUserInput": false,
                "promptRole": null
              }
            ],
            "outputDataType": "TEXT",
            "includeChatLogContext": false
          }
        ]
      },
      {
        "_id": "6597e1cbbe5c8774bb51b4d7",
        "title": "Originality & New Angles",
        "clientId": "",
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
            "outputDataType": "JSON",
            "includeChatLogContext": false
          }
        ]
      },
      {
        "_id": "6597e24abe5c8774bb51b4d8",
        "title": "Expand Perspectives",
        "clientId": "",
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
            "outputDataType": "TEXT",
            "includeChatLogContext": false
          }
        ]
      },
      {
        "_id":"6597e27dbe5c8774bb51b4d9",
        "title": "Vagueness Detection",
        "clientId": "",
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
            "outputDataType": "JSON",
            "includeChatLogContext": false
          }
        ]
      },
      {
        "_id": "6597e33ebe5c8774bb51b4da",
        "title": "1 Hook Analysis",
        "clientId": "",
        "openAiPromptSteps": [
          {
            "prompts": [
              {
                "promptText": "You are a literary and scholarly expert and have been evaluating university-level essays and thesis statements. You have been invited as an evaluation judge at USC, where a detailed and specific evaluation is expected.\n\nYour task is to find the most important and emphasized thesis statement in the essay and determine if the thesis has a strong hook (highly engaging) versus a weak hook. In particular, you want to identify areas for improvement. Consider the paragraph for the thesis. You will rate the \"hook\" of the essay on the following criteria:\n\n{\n\t“content”: \n\t{\n\t\t“thesis_statement”: str\n\t\t// actual thesis statement\n\t\t“paragraph”: str\n\t\t// paragraph in which the actual thesis statement is contained\n\t}\n\t“emotion”:\n\t// How much the paragraph invokes emotions, as opposed to abstract ideas\n\t{\n\t\t“emotions”: List of emotions that the paragraph evokes,\n\t\t“rating”: <1-5>\n\t\t// 1 being hardly any emotions evoked\n\t\t// 5 being very emotional\n\t\t“justification”: Contextual justification for the rating provided\n\t}\n\t“narrativity”:\n\t// How much the paragraph speaks about a specific person, event, story, or incident\n\t{\n\t\t“rating”: <1-5>\n\t\t// 1 being least narrative, 5 being most narrative\n\t\t“Justification”: Contextual justification for the rating provided\n\t}\n\t“overall”:\n\t{\n\t\t“rating”: <1-5>\n\t\t// considering the factors in the JSON, provide a score from 1 to 5\n\t\t// 1 being a weakest hook, 5 being the strongest hook\n               \"justification\": // Based on the users emotion and narrativity ratings, provide a total of 2 sentences, and please include the scores in your sentences.\n}\n\n",
                "includeEssay": true,
                "includeUserInput": false,
                "promptRole": null
              }
            ],
            "outputDataType": "JSON",
            "includeChatLogContext": false
          }
        ]
      },
      {
        "_id": "6597e3e42e029947c96556f4",
        "clientId": "9175c103-b86a-49db-8e1a-a63e1154b41b",
        "openAiPromptSteps": [
          {
            "prompts": [
              {
                "promptText": "You are a USC professor grading a papers thesis. You will first be given a message from the user which you will extract people and places from. You will then rank those people and places by which you find most interesting to include in the users thesis.\n\n{\n\t“entitiesFound”: [\n         {\n              \"entityName\": \"entity1\",\n              \"interest\": <1-5>\n         }\n         ],\n         \"response\": // short text response about entities found, have a little encouraging words like \"Great!\"\n}\n\nYou must respond as JSON following the format above. Only respond using valid JSON. Please check that the JSON is valid and follows the format given.\n",
                "includeEssay": true,
                "includeUserInput": true,
                "promptRole": "user"
              }
            ],
            "outputDataType": "JSON",
            "includeChatLogContext": false
          }
        ],
        "title": "N Entity Detection and Ranking"
      },
      {
        "_id": "659dd7664575cc2a8f595375",
        "clientId": "4a224649-8a00-45df-929d-a4299b277b82",
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
            "outputDataType": "TEXT",
            "includeChatLogContext": false
          }
        ],
        "title": "Army Style Review"
      },
      {
        "_id": "65a622d688aa62b94041f87e",
        "clientId": "0c289f10-9d47-4ea0-90e1-d7c4d2dc79be",
        "openAiPromptSteps": [
          {
            "prompts": [
              {
                "promptText": "I am going to provide you with a story that the user wrote, and an essay that the user wrote. Your task is to see how the users story can be used to improve the narrativity of the users thesis in their essay.\n\nPlease answer this question in a list of bullet points: \nWhat are three ways you would find interesting, emotionally-evocative, and original to connect this story with the thesis of the essay.",
                "includeEssay": true,
                "includeUserInput": true,
                "promptRole": "user"
              }
            ],
            "outputDataType": "TEXT",
            "includeChatLogContext": false
          }
        ],
        "title": "N-3 Compare Story to Hook"
      },
      {
        "_id": "65a752f7005cd6556ad048aa",
        "clientId": "230fadff-8b42-43f6-988e-f9612535ee9f",
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
            "outputDataType": "TEXT",
            "includeChatLogContext": false
          }
        ],
        "title": "E-1 Audience and Emotion detection"
      },
      {
        "_id": "65ae913f040d2f6550779bca",
        "clientId": "ae4605ff-601f-4b9c-bcbb-9ea70b98c564",
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
            "outputDataType": "TEXT",
            "includeChatLogContext": false
          }
        ],
        "title": "Hook Emotions"
      },
      {
        "_id":"65af12d1695c606add8ae8f4",
        "clientId": "64199576-4931-438d-b7d4-3b9a215d7b93",
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
            "outputDataType": "JSON",
            "includeChatLogContext": false
          }
        ],
        "title": "(Test) Stronger Hook"
      },
      {
        "_id": "65afec279a81dc65f39bbf71",
        "clientId": "fdacda84-e67c-46ed-9e17-1723e0f85e09",
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
            "outputDataType": "JSON",
            "includeChatLogContext": false
          }
        ],
        "title": "Reverse Outline"
      },
      {
        "_id": "65b87466dd9a050559af68ba",
        "clientId": "13adae3d-bd41-43a6-ac9a-c06810deda7b",
        "openAiPromptSteps": [
          {
            "prompts": [
              {
                "promptText": "You are a literary and scholarly expert and have been evaluating university-level essays and thesis statements. You have been invited as an evaluation judge at USC, where a detailed and specific evaluation is expected.\n\nYour task is to review the users essay and provide them a couple of questions that will get them thinking about things that will improve the narrativity of their essay.\n\nMaximum a list of 5 questions.",
                "includeEssay": true,
                "includeUserInput": false,
                "promptRole": "user"
              }
            ],
            "outputDataType": "TEXT",
            "includeChatLogContext": false
          }
        ],
        "title": "N-2 Help Me Brainstorm"
      },
      {
        "_id":"65b876425d92d7f15e694a63",
        "clientId": "4d960d95-fb1e-4ab5-aba7-8f80396b2154",
        "openAiPromptSteps": [
          {
            "prompts": [
              {
                "promptText": "You will be provided with both a story and a revision that the user has stated that they would like to incorporate into their essay. Please provide some input on how the user maybe able to achieve this. Speak to the user in the second person perspective. Maximum 200 words.",
                "includeEssay": true,
                "includeUserInput": true,
                "promptRole": "user"
              }
            ],
            "outputDataType": "TEXT",
            "includeChatLogContext": false
          }
        ],
        "title": "N-4 Relate story and revision to hook"
      },
      {
        "_id":"65b8775765e5a0d202475c94",
        "clientId": "2ee889f3-9ec9-4d11-a42e-e9bcfe5fac82",
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
            "outputDataType": "TEXT",
            "includeChatLogContext": false
          }
        ],
        "title": "E-2 Comment on Proposed Revision"
      },
      {
        "_id":"65b9a2bd609726ae17d2b9d3",
        "clientId": "2ee889f3-9ec9-4d11-a42e-e9bcfe5fac82",
        "openAiPromptSteps": [
          {
            "prompts": [
              {
                "promptText": "Audience Analysis response",
                "includeEssay": false,
                "includeUserInput": false,
                "promptRole": "user"
              }
            ],
            "outputDataType": "TEXT",
            "includeChatLogContext": false
          }
        ],
        "title": "E_1_B_AUDIENCE_ANALYSIS_PROMPT_ID"
      },
      {
        "_id": "65b8781668b6a0e94c7bee47",
        "clientId": "060581ea-1a99-4830-be38-42a9f627b36b",
        "openAiPromptSteps": [
          {
            "prompts": [
              {
                "promptText": "You will be provided with the users proposed revision and their final essay. Please comment on how well they incorporated the revision into their final essay.",
                "includeEssay": true,
                "includeUserInput": false,
                "promptRole": "user"
              }
            ],
            "outputDataType": "TEXT",
            "includeChatLogContext": false
          }
        ],
        "title": "E-3 Analyze Doc Revision"
      }]
}
