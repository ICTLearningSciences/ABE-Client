import { Schema } from "jsonschema";

export interface CompareAnalysisRes {
  matchRating:    number;
    response:   string;
    questionList: string[];
}

export const compareAnalysisSchema: Schema = {
    "type": "object",
    "properties": {
      "matchRating": {
        "type": "number",
        "description": "Indicates if the interpretation of the command intent matches."
      },
      "response": {
        "type": "string",
        "description": "The response corresponding to the command intent."
      },
      "questionList": {
        "type": "array",
        "items": {
          "type": "string"
        },
        "description": "A list of questions related to the command intent."
      }
    },
    "required": ["matchRating", "response", "questionList"]
  }
