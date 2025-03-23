/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/

import { AiServicesResponseTypes } from '../../ai-services/ai-service-types';

export const openAiTextResponse = (
  resText: string
): AiServicesResponseTypes => {
  return {
    aiAllStepsData: [
      {
        aiServiceRequestParams: {
          model: 'gpt-4o-mini',
          input: [
            {
              role: 'system',
              content: ' ',
            },
            {
              role: 'user',
              content:
                'Please look up current events related to Chocolate Bars.',
            },
          ],
          tools: [
            {
              type: 'web_search_preview',
            },
          ],
          tool_choice: {
            type: 'web_search_preview',
          },
          store: false,
        },
        aiServiceResponse: {
          id: 'resp_67dc7ebc06dc819289afec75d63dd4cd0613b3084b7f7cef',
          object: 'response',
          created_at: 1742503612,
          status: 'completed',
          error: null,
          incomplete_details: null,
          instructions: null,
          max_output_tokens: null,
          model: 'gpt-4o-mini-2024-07-18',
          output: [
            {
              type: 'web_search_call',
              id: 'ws_67dc7ebc1edc819281b651094201ac030613b3084b7f7cef',
              status: 'completed',
            },
            {
              type: 'message',
              id: 'msg_67dc7ebdaf6c8192828869399f9234870613b3084b7f7cef',
              status: 'completed',
              role: 'assistant',
              content: [
                {
                  type: 'output_text',
                  text: resText,
                  annotations: [],
                },
              ],
            },
          ],
          parallel_tool_calls: true,
          previous_response_id: null,
          reasoning: {
            effort: null,
            generate_summary: null,
          },
          temperature: 1,
          text: {
            format: {
              type: 'text',
            },
          },
          tool_choice: {
            type: 'web_search_preview',
          },
          tools: [
            {
              type: 'web_search_preview',
              search_context_size: 'medium',
              user_location: {
                type: 'approximate',
                city: undefined,
                country: 'US',
                region: undefined,
                timezone: undefined,
              },
            },
          ],
          top_p: 1,
          truncation: 'disabled',
          usage: {
            input_tokens: 336,
            input_tokens_details: {
              cached_tokens: 0,
            },
            output_tokens: 221,
            output_tokens_details: {
              reasoning_tokens: 0,
            },
            total_tokens: 557,
          },
          user: undefined,
          metadata: {},
          output_text: resText,
        },
        tokenUsage: {
          promptUsage: 0,
          completionUsage: 0,
          totalUsage: 0,
        },
      },
    ],
    answer: resText,
  };
};
