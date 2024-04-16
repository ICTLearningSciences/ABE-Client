import { Schema } from 'jsonschema';

export const reverseOutlineResponseExample: ReverseOutlineResponse = {
  thesisStatement:
    "Using another's property for financial gain should be seen as morally wrong, unless the sample is transformed into something new.",
  importantSupportingClaims: [
    'Copyright infringement is a violation of intellectual property rights',
    'Transformative use can be a legal way to sample music without copyright infringement',
    'Small artists face more challenges when sampling music',
  ],
  areasToImproveSupportForClaim: [
    {
      claim:
        'Copyright infringement is a violation of intellectual property rights',
      missingEvidence: [
        {
          supportingEvidence:
            'Specific examples of copyright infringement cases related to music',
          justification:
            'Providing specific examples will strengthen the claim and demonstrate the impact of copyright infringement in the music industry.',
        },
      ],
    },
    {
      claim:
        'Transformative use can be a legal way to sample music without copyright infringement',
      missingEvidence: [
        {
          supportingEvidence:
            'Explanation of transformative use and its legal precedent',
          justification:
            'Defining and providing examples of transformative use will clarify the argument and support the claim.',
        },
        {
          supportingEvidence:
            'Case studies of artists successfully using transformative use to sample music',
          justification:
            'Showing real-life examples of transformative use will strengthen the claim and provide evidence of its legality.',
        },
      ],
    },
    {
      claim: 'Small artists face more challenges when sampling music',
      missingEvidence: [
        {
          supportingEvidence:
            'Statistics or studies on the difficulties small artists face in obtaining clearance for sample usage',
          justification:
            'Providing data or research will add credibility to the claim and show the specific challenges faced by small artists.',
        },
        {
          supportingEvidence:
            'Examples of lawsuits or legal battles involving small artists sampling music',
          justification:
            'Presenting real-life examples will illustrate the claim and demonstrate the impact of these challenges on small artists.',
        },
      ],
    },
  ],
  overall: {
    justification:
      'The thesis statement is clear and presents a moral argument related to sampling music. However, the essay could benefit from additional support for the important supporting claims. Adding specific examples, case studies, and data/statistics will strengthen the arguments and provide a more well-rounded perspective.',
    thesisSupportRating: 3,
    claimsSupportRating: 2,
  },
};

export interface MissingEvidence {
  supportingEvidence: string;
  justification: string;
}

export interface AreasToImproveSupportForClaim {
  claim: string;
  missingEvidence: MissingEvidence[];
}

export interface ReverseOutlineResponse {
  thesisStatement: string;
  importantSupportingClaims: string[];
  areasToImproveSupportForClaim: AreasToImproveSupportForClaim[];
  overall: {
    justification: string;
    thesisSupportRating: number;
    claimsSupportRating: number;
  };
}

export const areasToImproveSupportForClaimSchema: Schema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      claim: { type: 'string' },
      missingEvidence: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            supportingEvidence: { type: 'string' },
            justification: { type: 'string' },
          },
        },
      },
    },
  },
  required: ['claim'],
};

export const reverseOutlineOverallSchema: Schema = {
  type: 'object',
  properties: {
    justification: { type: 'string' },
    thesisSupportRating: { type: 'number' },
    claimsSupportRating: { type: 'number' },
  },
  required: ['justification', 'thesisSupportRating', 'claimsSupportRating'],
};

export const reverseOutlineResponseSchema: Schema = {
  type: 'object',
  properties: {
    thesisStatement: { type: 'string' },
    importantSupportingClaims: { type: 'array', items: { type: 'string' } },
    areasToImproveSupportForClaim: areasToImproveSupportForClaimSchema,
    overall: reverseOutlineOverallSchema,
  },
  required: ['overall', 'areasToImproveSupportForClaim'],
};
