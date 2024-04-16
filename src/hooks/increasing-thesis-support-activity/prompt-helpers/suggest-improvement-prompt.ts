import { Schema } from 'jsonschema';

export const suggestImprovementResponseExample = {
  suggestedImprovements: [
    'Provide specific examples of how Albert King has influenced other artists and how his impact can be seen in their music.',
    "Include research or quotes from credible sources to support your claims about Albert King's popularity and influence.",
    'Discuss the legal and ethical implications of copyright infringement and sampling in more depth to strengthen your argument.',
    "Consider addressing counterarguments or potential criticisms of your stance on using others' property for financial gain.",
  ],
};

export interface SuggestImprovementResponse {
  suggestedImprovements: string[];
}

export const suggestImprovementResponseSchema: Schema = {
  type: 'object',
  properties: {
    suggestedImprovements: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
  },
  required: ['suggestedImprovements'],
};
