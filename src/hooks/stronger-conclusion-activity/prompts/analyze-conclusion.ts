import { Schema } from 'jsonschema';

// {\n   \"audiences\":[\n      {\n         \"name\":\"Admissions officers\",\n         \"relevance\":\"primary\",\n         \"intention\":\"Evaluate the applicant's academic interests and career goals\",\n         \"sentiment\":\"Interested\"\n      }\n   ],\n   \"implications\":[\n      {\n         \"implication\":\"The applicant has a passion for dance and biology\",\n         \"supportingArgument\":\"The applicant has been dancing for 11 years and has a fascination for human biology\"\n      },\n      {\n         \"implication\":\"The applicant has a desire to make a positive impact in the world\",\n         \"supportingArgument\":\"The applicant wants to do missionary work in Peru after finishing pre-med\"\n      },\n      {\n         \"implication\":\"The applicant is interested in pursuing a career in medicine\",\n         \"supportingArgument\":\"The applicant's ultimate goal is to become a doctor\"\n      }\n   ],\n   \"content\":{\n      \"thesisStatement\":\"I've chosen to major in Human Biology, confident it will satisfy the insatiable curiosity I developed in dance class.\",\n      \"paragraph\":\"With each grand jeté and every pirouette, the biological systems in my body—circulatory, respiratory, nervous, and skeletal—operate together in their own constant dance, their harmonious movement choreographed by the brain.\"\n   },\n   \"argumentType\":\"Causal\",\n   \"logicalCauses\":{\n      \"causeAndEffects\":{\n         \"Passion for dance and biology\":{\n            \"11 years of dancing\": \"fascination for human biology\"\n         },\n         \"Desire to make a positive impact in the world\":{\n            \"Finishing pre-med\": \"Missionary work in Peru\"\n         },\n         \"Interest in pursuing a career in medicine\":{\n            \"Ultimate goal is to become a doctor\": null\n         }\n      },\n      \"rating\":4,\n      \"justification\":\"The argument presents multiple causes that are connected in a graph-like relationship, supporting the overall thesis.\"\n   }\n}
// {\n   \"audiences\":[\n      {\n         \"name\":\"University admissions committee\",\n         \"relevance\":\"primary\",\n         \"intention\":\"assess the applicant's academic potential and suitability for the chosen majors\",\n         \"sentiment\":\"interested\"\n      },\n      {\n         \"name\":\"Scholars in the field of Human Biology and Global Health\",\n         \"relevance\":\"secondary\",\n         \"intention\":\"evaluate the depth of the applicant's knowledge and understanding of the subjects\",\n         \"sentiment\":\"engaged\"\n      }\n   ],\n   \"implications\":[\n      {\n         \"implication\":\"The applicant is highly interested in the field of Human Biology and Global Health.\",\n         \"supportingArgument\":\"Their choice of major and the topics they want to delve into demonstrate their passion and commitment.\"\n      },\n      {\n         \"implication\":\"The applicant has a strong desire to make a positive impact on the world through missionary work.\",\n         \"supportingArgument\":\"They want to apply their medical studies to serve impoverished communities in Peru, which aligns with their family's sacrifices and personal aspirations.\"\n      }\n   ],\n   \"content\":{\n      \"thesisStatement\":\"I've chosen to major in Human Biology based on my curiosity developed in dance class, sparked by those few nights reading an old anatomy book with my mother.\",\n      \"paragraph\":\"One summer eleven years ago, my family couldn't afford both dance and science camp...\"\n   },\n   \"argumentType\":\"The argument is primarily based on personal experiences, interests, and aspirations. The applicant connects their passion for dance, the study of anatomy, and their desire to become a doctor and serve communities in need.\",\n   \"logicalCauses\":{\n      \"causeAndEffects\":{\n         \"Exploration of dance and anatomy\":\"Developed curiosity for human biology\",\n         \"Interest in genetics, evolutionary medicine, and neurobiology\":\"Choice of Human Biology major\",\n         \"Desire to apply medical studies to serve impoverished Peruvian communities\":\"Aspiration to do missionary work in Peru\"\n      },\n      \"rating\":4,\n      \"justification\":\"The argument presents a series of interconnected causes and effects that support the applicant's main thesis statement. The exploration of dance and anatomy sparked their curiosity, leading to their interest in genetics, evolutionary medicine, and neurobiology. This interest, in turn, influenced their decision to major in Human Biology. Furthermore, their desire to make a positive impact on the world through missionary work in Peru is directly connected to their aspiration of applying medical studies to serve impoverished communities. The logical causes and effects provide a strong foundation for the essay's argument.\"\n   }\n}
export const analyzeConclusionFirstStepSchema: Schema = {
  id: '/analyzeConclusionFirstStep',
  type: 'object',
  properties: {
    audiences: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
          },
          relevance: {
            type: 'string',
          },
          intention: {
            type: 'string',
          },
          sentiment: {
            type: 'string',
          },
        },
        required: ['name', 'relevance', 'intention', 'sentiment'],
      },
    },
    implications: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          implication: {
            type: 'string',
          },
          supportingArgument: {
            type: 'string',
          },
        },
        required: ['implication', 'supportingArgument'],
      },
    },
    content: {
      type: 'object',
      properties: {
        thesisStatement: {
          type: 'string',
        },
        paragraph: {
          type: 'string',
        },
      },
      required: ['thesisStatement', 'paragraph'],
    },
    argumentType: {
      type: 'string',
    },
    logicalCauses: {
      type: 'object',
      properties: {
        causeAndEffects: {
          type: 'object',
        },
        rating: {
          type: 'number',
        },
        justification: {
          type: 'string',
        },
      },
      required: ['causeAndEffects', 'rating', 'justification'],
    },
  },
  required: ['implications'],
};

export interface Audience {
  name: string;
  relevance: string;
  intention: string;
  sentiment: string;
}

export interface Implication {
  implication: string;
  supportingArgument: string;
}

export interface Content {
  thesisStatement: string;
  paragraph: string;
}

export interface LogicalCauses {
  causeAndEffects: CauseAndEffects;
  rating: number;
  justification: string;
}

export interface CauseAndEffects {
  [key: string]: {
    [key: string]: string | null;
  };
}

export interface AnalyzeConclusionFirstStep {
  audiences: Audience[];
  implications: Implication[];
  content: Content;
  argumentType: string;
  logicalCauses: LogicalCauses;
}

// {\n   \"emotions\":{\n      \"emotions\":[\"Passion\", \"Purpose\"],\n      \"rating\":4,\n      \"justification\":\"The paragraph evokes emotions such as passion and purpose as the applicant expresses their passion for doing missionary work in Peru and their desire to make a difference in the world. This evokes a sense of determination and emotional connection to their goals.\"\n   },\n   \"narrativity\":{\n      \"characters\":[\"Applicant\"],\n      \"places\":[\"Peru\"],\n      \"events\":[\"Missionary work in Peru\"],\n      \"rating\":3,\n      \"justification\":\"The conclusion paragraph briefly describes the applicant's goal of doing missionary work in Peru after completing pre-med. It mentions the specific location of Peru and the idea of serving impoverished communities. While it provides some narrative elements, the focus is more on the applicant's goals and aspirations rather than a detailed story or event.\"\n   },\n   \"conclusion\":{\n      \"impact\":[\n         {\n            \"audience\":\"Admissions officers\",\n            \"typeOfImpact\":\"New Idea or Perspective\",\n            \"description\":\"The conclusion emphasizes the applicant's goal of doing missionary work in Peru after pre-med, providing a new perspective on their motivation and potential impact.\",\n            \"support\":\"The applicant's intention to use their medical studies to serve marginalized communities in Peru\",\n            \"rating\":4\n         },\n         {\n            \"audience\":\"Missionary organizations and individuals working in Peru\",\n            \"typeOfImpact\":\"New Idea or Perspective\",\n            \"description\":\"The conclusion highlights the applicant's commitment to serving impoverished communities in Peru and may inspire missionary organizations and individuals in Peru.\",\n            \"support\":\"The applicant's intention to do missionary work in Peru after completing pre-med\",\n            \"rating\":4\n         }\n      ],\n      \"overallRating\":4,\n      \"justification\":\"The conclusion paragraph effectively conveys the applicant's passion, purpose, and commitment to serving marginalized communities in Peru. It provides a new perspective on their goals and potential impact, which will likely resonate with admissions officers and inspire missionary organizations and individuals in Peru. Additionally, it builds on the content of the essay by reinforcing the applicant's career goals and motivations.\",\n      \"constructiveCriticism\":\"One suggestion for improvement would be to provide more specific examples or personal experiences related to the applicant's goal of doing missionary work in Peru. This could further strengthen the narrative elements and emotional impact of the conclusion.\"\n   }\n}

export interface Emotions {
  emotions: string[];
  rating: number;
  justification: string;
}

export interface Narrativity {
  characters: string[];
  places: string[];
  events: string[];
  rating: number;
  justification: string;
}

export interface Impact {
  audience: string;
  typeOfImpact: string;
  description: string;
  support: string;
  rating: number;
}

export interface Conclusion {
  impact: Impact[];
  overallRating: number;
  justification: string;
  constructiveCriticism: string;
}

export interface AnalyzeConclusionSecondStep {
  emotions: Emotions;
  narrativity: Narrativity;
  conclusion: Conclusion;
}

export const analyzeConclusionSecondStepSchema: Schema = {
  id: '/analyzeConclusionSecondStep',
  type: 'object',
  properties: {
    emotions: {
      type: 'object',
      properties: {
        emotions: {
          type: 'array',
          items: {
            type: 'string',
          },
        },
        rating: {
          type: 'number',
        },
        justification: {
          type: 'string',
        },
      },
      required: ['emotions', 'rating', 'justification'],
    },
    narrativity: {
      type: 'object',
      properties: {
        characters: {
          type: 'array',
          items: {
            type: 'string',
          },
        },
        places: {
          type: 'array',
          items: {
            type: 'string',
          },
        },
        events: {
          type: 'array',
          items: {
            type: 'string',
          },
        },
        rating: {
          type: 'number',
        },
        justification: {
          type: 'string',
        },
      },
      required: ['characters', 'places', 'events', 'rating', 'justification'],
    },
    conclusion: {
      type: 'object',
      properties: {
        impact: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              audience: {
                type: 'string',
              },
              typeOfImpact: {
                type: 'string',
              },
              description: {
                type: 'string',
              },
              support: {
                type: 'string',
              },
              rating: {
                type: 'number',
              },
            },
            required: ['audience', 'description'],
          },
        },
        overallRating: {
          type: 'number',
        },
        justification: {
          type: 'string',
        },
      },
      required: ['impact', 'overallRating', 'justification'],
    },
  },
  required: ['emotions', 'narrativity', 'conclusion'],
};
