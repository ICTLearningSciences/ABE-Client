import { Schema } from 'jsonschema';

export const analyzeIntendedClaimResponseExample = {
  intendedAction: 'ADDING',
  intentionFeedback: 'The student intends to add a claim to their essay.',
};

export interface AnalyzeIntendedClaimResponse {
  intendedAction: string;
  intentionFeedback: string;
}

export const analyzeIntendedClaimResponseSchema: Schema = {
  type: 'object',
  properties: {
    intendedAction: { type: 'string' },
    intentionFeedback: { type: 'string' },
  },
  required: ['intendedAction', 'intentionFeedback'],
};
