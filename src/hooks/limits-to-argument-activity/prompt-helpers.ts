/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { Schema } from 'jsonschema';

// const analyzeArgumentsExampleRes = {
// 	"intendedAudiences": [
// 		{
// 			"name": "Fans of blues music and Albert King",
// 			"impact": "The paper provides insight into Albert King's contributions to the genre and highlights his importance, which can enhance the appreciation and admiration of his fans.",
// 			"beforeReadingAttitudes": [
// 				"Already familiar with Albert King's music",
// 				"Appreciate the blues genre",
// 				"Interested in learning more about influential musicians"
// 			],
// 			"afterReadingAttitudes": [
// 				"Deepened understanding of Albert King's impact",
// 				"Increased admiration for Albert King",
// 				"Motivated to explore more of his music"
// 			],
// 			"otherReactions": [
// 				"Fascinated by the description of King's humble beginnings",
// 				"Surprised by the extent of his influence on other artists"
// 			]
// 		},
// 		{
// 			"name": "Music history enthusiasts",
// 			"impact": "The paper adds to their knowledge of the blues genre and highlights an influential figure in its history, expanding their appreciation for the music of that era.",
// 			"beforeReadingAttitudes": [
// 				"Interested in studying the history of music",
// 				"Curious about significant artists from different genres"
// 			],
// 			"afterReadingAttitudes": [
// 				"Increased understanding of Albert King's role in the blues genre",
// 				"Enriched knowledge of blues history",
// 				"Motivated to explore more artists from that era"
// 			],
// 			"otherReactions": [
// 				"Curiosity about the specific impact of Albert King's music on the blues genre",
// 				"Desire to explore the cultural and historical context surrounding King's career"
// 			]
// 		}
// 	],
// 	"otherAudiences": [
// 		{
// 			"name": "Blues musicians and artists who sample music",
// 			"arguments": [
// 				"May argue for more leniency in copyright infringement cases for transformative use",
// 				"Could discuss the challenges faced by smaller artists in obtaining sample clearances",
// 				"Might debate the moral implications of using another artist's work for personal gain"
// 			]
// 		},
// 		{
// 			"name": "Copyright holders and original artists",
// 			"arguments": [
// 				"May argue for strict copyright enforcement to protect their original work",
// 				"Could debate the impact of sampling on the value and integrity of their creations",
// 				"Might express concern about fair compensation for their intellectual property"
// 			]
// 		}
// 	],
// 	"overallResponse": "The identified audiences, including 'Fans of blues music and Albert King' and 'Music history enthusiasts,' will likely appreciate the paper's exploration of Albert King's contributions and its impact on the blues genre. They may react positively, gaining deeper insights into King's career and feeling motivated to explore his music further. However, it's important to acknowledge the potential critiques from 'Blues musicians/artists who sample music' and 'Copyright holders and original artists.' They may raise concerns about copyright infringement, transformative use, and fair compensation. It would be valuable to consider these perspectives and address their arguments to provide a balanced analysis of the topic."
// }

//   turn the above into a json schema

const intendedAudiences = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      name: { type: 'string' },
      impact: { type: 'string' },
      beforeReadingAttitudes: {
        type: 'array',
        items: { type: 'string' },
      },
      afterReadingAttitudes: {
        type: 'array',
        items: { type: 'string' },
      },
      otherReactions: {
        type: 'array',
        items: { type: 'string' },
      },
    },
  },
};

const otherAudiences = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      name: { type: 'string' },
      arguments: {
        type: 'array',
        items: { type: 'string' },
      },
    },
  },
};

export const analyzeArgumentsPromptSchema: Schema = {
  type: 'object',
  properties: {
    intendedAudiences,
    otherAudiences,
    overallResponse: { type: 'string' },
  },
  required: ['intendedAudiences', 'otherAudiences', 'overallResponse'],
};

export interface IntendedAudiences {
  name: string;
  impact: string;
  beforeReadingAttitudes: string[];
  afterReadingAttitudes: string[];
  otherReactions: string[];
}

export interface OtherAudiences {
  name: string;
  arguments: string[];
}

export interface AnalyzeArgumentsResponse {
  intendedAudiences: IntendedAudiences[];
  otherAudiences: OtherAudiences[];
  overallResponse: string;
}
