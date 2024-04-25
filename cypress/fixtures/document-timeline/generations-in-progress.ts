/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/

import { GQLDocumentTimeline, OpenAiGenerationStatus, TimelinePointType } from '../../helpers/types';

export const generationInProgress: GQLDocumentTimeline = {
  docId: '1LqProM_kIFbMbMfZKzvlgaFNl5ii6z5xwyAsQZ0U87Y',
  user: '653972706e601e65dbc3acea',
  timelinePoints: [
    {
      type: TimelinePointType.START,
      versionTime: '2024-03-27T05:00:02.587Z',
      version: {
        docId: '1LqProM_kIFbMbMfZKzvlgaFNl5ii6z5xwyAsQZ0U87Y',
        plainText: 'Hello, world! What’s going on ?\n',
        lastChangedId:
          'ALBJ4LvGtDw60PlOb4l1tFcX4PLEKKguGqtBIRo_qqoSB4_bFjOkQDcvy7-FcRRMaoFZ6y2Q_3m77cwrMmm3WjA',
        sessionIntention: {
          description:
            'This activity is to work on the hook that gets the readers interest at the start of the paper. We are going to consider the narrativity and the emotions that are connected with the intro.',
          createdAt: '2024-03-27T05:00:02.587Z',
        },
        chatLog: [
          {
            sender: 'SYSTEM',
            message:
              'This activity is to work on the hook that gets the readers interest at the start of the paper. We are going to consider the narrativity and the emotions that are connected with the intro.',
          },
          {
            sender: 'SYSTEM',
            message:
              "Feel free to edit the intro to your paper, and tell me when it's ready for me to review.",
          },
          {
            sender: 'USER',
            message: 'Ready',
          },
          {
            sender: 'SYSTEM',
            message: 'Request failed, please try again later.',
          },
          {
            sender: 'USER',
            message: 'Retry',
          },
          {
            sender: 'SYSTEM',
            message: 'Request failed, please try again later.',
          },
          {
            sender: 'USER',
            message: 'Retry',
          },
          {
            sender: 'SYSTEM',
            message:
              "The hook of the essay has a weak engagement factor. It lacks both emotional evocativeness and narrative elements. The thesis statement is a simple greeting without any depth or compelling elements. To improve the hook, consider introducing a thought-provoking question, a surprising fact, or a captivating anecdote to capture the reader's attention. (Emotion: 1; Narrativity: 1)",
          },
          {
            sender: 'SYSTEM',
            message: 'What would you like to work on?',
          },
        ],
        activity: '65a8592b26523c7ce5acac9e',
        intent: '',
        title: 'Same activity, 8 hour',
        lastModifyingUser: 'ashiel408@gmail.com',
        sessionId: '123',
        modifiedTime: '2024-03-27T04:53:41.735Z',
        createdAt: '2024-03-27T04:53:41.735Z',
        updatedAt: '2024-03-27T04:53:41.735Z',
      },
      intent: '',
      changeSummary: '',
      changeSummaryStatus: OpenAiGenerationStatus.IN_PROGRESS,
      reverseOutline:
        '',
      reverseOutlineStatus: OpenAiGenerationStatus.IN_PROGRESS,
      relatedFeedback: '',
    },
    {
      type: TimelinePointType.TIME_DIFFERENCE,
      versionTime: '2024-03-27T20:00:57.804Z',
      version: {
        docId: '1LqProM_kIFbMbMfZKzvlgaFNl5ii6z5xwyAsQZ0U87Y',
        plainText: 'Hello, world! What’s going on ? I’m making more changes\n',
        lastChangedId:
          'ALBJ4LvpUjPG6iVXa8vibKE0FafnztNmt9B3Qmmn8h0Z5SfAgNZSjfH1Dk33Ygrte_B_WuN1EIxZ4uBJoekEju8',
        sessionIntention: {
          description: 'This activity is to work on the hook of the essay.',
          createdAt: '2024-03-27T05:00:02.587Z',
        },
        chatLog: [
          {
            sender: 'SYSTEM',
            message:
              'This activity is to work on the hook that gets the readers interest at the start of the paper. We are going to consider the narrativity and the emotions that are connected with the intro.',
          },
          {
            sender: 'SYSTEM',
            message:
              "Feel free to edit the intro to your paper, and tell me when it's ready for me to review.",
          },
          {
            sender: 'USER',
            message: 'Ready',
          },
          {
            sender: 'SYSTEM',
            message:
              'Based on the absence of emotional evocativeness and narrativity, the hook in this essay is weak. It does not engage the reader or provide any narrative context. To improve the hook, it could benefit from incorporating emotions and narrative elements to create a more engaging and captivating introduction. The current rating for emotions is 1 and for narrativity is 1.',
          },
          {
            sender: 'SYSTEM',
            message: 'What would you like to work on?',
          },
        ],
        activity: '658230f699045156193339ac',
        intent: '',
        title: 'Same activity, 8 hour',
        lastModifyingUser: 'ashiel408@gmail.com',
        sessionId: '123',
        modifiedTime: '2024-03-27T04:53:41.735Z',
        createdAt: '2024-03-27T04:53:41.735Z',
        updatedAt: '2024-03-27T04:53:41.735Z',
      },
      intent: '',
      changeSummary:
        "",
      changeSummaryStatus: OpenAiGenerationStatus.IN_PROGRESS,
        reverseOutline:
        '',
      reverseOutlineStatus: OpenAiGenerationStatus.IN_PROGRESS,
        relatedFeedback: '',
    },
  ],
};

export const generationCompleted: GQLDocumentTimeline = {
    docId: '1LqProM_kIFbMbMfZKzvlgaFNl5ii6z5xwyAsQZ0U87Y',
    user: '653972706e601e65dbc3acea',
    timelinePoints: [
      {
        type: TimelinePointType.START,
        versionTime: '2024-03-27T05:00:02.587Z',
        version: {
          docId: '1LqProM_kIFbMbMfZKzvlgaFNl5ii6z5xwyAsQZ0U87Y',
          plainText: 'Hello, world! What’s going on ?\n',
          lastChangedId:
            'ALBJ4LvGtDw60PlOb4l1tFcX4PLEKKguGqtBIRo_qqoSB4_bFjOkQDcvy7-FcRRMaoFZ6y2Q_3m77cwrMmm3WjA',
          sessionIntention: {
            description:
              'This activity is to work on the hook that gets the readers interest at the start of the paper. We are going to consider the narrativity and the emotions that are connected with the intro.',
            createdAt: '2024-03-27T05:00:02.587Z',
          },
          chatLog: [
            {
              sender: 'SYSTEM',
              message:
                'This activity is to work on the hook that gets the readers interest at the start of the paper. We are going to consider the narrativity and the emotions that are connected with the intro.',
            },
            {
              sender: 'SYSTEM',
              message:
                "Feel free to edit the intro to your paper, and tell me when it's ready for me to review.",
            },
            {
              sender: 'USER',
              message: 'Ready',
            },
            {
              sender: 'SYSTEM',
              message: 'Request failed, please try again later.',
            },
            {
              sender: 'USER',
              message: 'Retry',
            },
            {
              sender: 'SYSTEM',
              message: 'Request failed, please try again later.',
            },
            {
              sender: 'USER',
              message: 'Retry',
            },
            {
              sender: 'SYSTEM',
              message:
                "The hook of the essay has a weak engagement factor. It lacks both emotional evocativeness and narrative elements. The thesis statement is a simple greeting without any depth or compelling elements. To improve the hook, consider introducing a thought-provoking question, a surprising fact, or a captivating anecdote to capture the reader's attention. (Emotion: 1; Narrativity: 1)",
            },
            {
              sender: 'SYSTEM',
              message: 'What would you like to work on?',
            },
          ],
          activity: '65a8592b26523c7ce5acac9e',
          intent: '',
          title: 'Same activity, 8 hour',
          lastModifyingUser: 'ashiel408@gmail.com',
          sessionId: '123',
          modifiedTime: '2024-03-27T04:53:41.735Z',
          createdAt: '2024-03-27T04:53:41.735Z',
          updatedAt: '2024-03-27T04:53:41.735Z',
        },
        intent: '',
        changeSummary: '',
        changeSummaryStatus: OpenAiGenerationStatus.COMPLETED,
        reverseOutline:
          '{\n  "Thesis Statement": "The impact of climate change on global food security",\n  "Supporting Claims": [\n    "Decreased crop yields",\n    "Altered growing conditions",\n    "Water scarcity"\n  ],\n  "Evidence Given for Each Claim": [\n    {\n      "Claim A": "Decreased crop yields",\n      "Claim A Evidence": [\n        "Studies show that global warming leads to a decline in crop yields.",\n        "Extreme weather events caused by climate change have a negative impact on crop production.",\n      "Rising temperatures affect the nutritional value and quality of crops."\n      ]\n    },\n    {\n      "Claim B": "Altered growing conditions",\n      "Claim B Evidence": [\n        "Changing rainfall patterns affect the timing and success of planting.",\n        "Increasing temperatures and heatwaves reduce the viability of certain crops.",\n      "Shifts in temperature and humidity create new challenges for farmers."\n      ]\n    },\n    {\n      "Claim C": "Water scarcity",\n      "Claim C Evidence": [\n        "Rising temperatures cause higher rates of evaporation, leading to water scarcity.",\n        "Decreased snowpack and glacier melt reduce available water for agriculture.",\n      "Droughts and extreme weather events disrupt irrigation and water supply."\n      ]\n    }\n  ]\n}',
        reverseOutlineStatus: OpenAiGenerationStatus.COMPLETED,
        relatedFeedback: '',
      },
      {
        type: TimelinePointType.TIME_DIFFERENCE,
        versionTime: '2024-03-27T20:00:57.804Z',
        version: {
          docId: '1LqProM_kIFbMbMfZKzvlgaFNl5ii6z5xwyAsQZ0U87Y',
          plainText: 'Hello, world! What’s going on ? I’m making more changes\n',
          lastChangedId:
            'ALBJ4LvpUjPG6iVXa8vibKE0FafnztNmt9B3Qmmn8h0Z5SfAgNZSjfH1Dk33Ygrte_B_WuN1EIxZ4uBJoekEju8',
          sessionIntention: {
            description: 'This activity is to work on the hook of the essay.',
            createdAt: '2024-03-27T05:00:02.587Z',
          },
          chatLog: [
            {
              sender: 'SYSTEM',
              message:
                'This activity is to work on the hook that gets the readers interest at the start of the paper. We are going to consider the narrativity and the emotions that are connected with the intro.',
            },
            {
              sender: 'SYSTEM',
              message:
                "Feel free to edit the intro to your paper, and tell me when it's ready for me to review.",
            },
            {
              sender: 'USER',
              message: 'Ready',
            },
            {
              sender: 'SYSTEM',
              message:
                'Based on the absence of emotional evocativeness and narrativity, the hook in this essay is weak. It does not engage the reader or provide any narrative context. To improve the hook, it could benefit from incorporating emotions and narrative elements to create a more engaging and captivating introduction. The current rating for emotions is 1 and for narrativity is 1.',
            },
            {
              sender: 'SYSTEM',
              message: 'What would you like to work on?',
            },
          ],
          activity: '658230f699045156193339ac',
          intent: '',
          title: 'Same activity, 8 hour',
          lastModifyingUser: 'ashiel408@gmail.com',
          sessionId: '123',
          modifiedTime: '2024-03-27T04:53:41.735Z',
          createdAt: '2024-03-27T04:53:41.735Z',
          updatedAt: '2024-03-27T04:53:41.735Z',
        },
        intent: '',
        changeSummary:
          "Complete Summary",
        changeSummaryStatus: OpenAiGenerationStatus.COMPLETED,
          reverseOutline:
          '{\n  "Thesis Statement": "The impact of climate change on global food security",\n  "Supporting Claims": [\n    "Decreased crop yields",\n    "Altered growing conditions",\n    "Water scarcity"\n  ],\n  "Evidence Given for Each Claim": [\n    {\n      "Claim A": "Decreased crop yields",\n      "Claim A Evidence": [\n        "Studies show that global warming leads to a decline in crop yields.",\n        "Extreme weather events caused by climate change have a negative impact on crop production.",\n      "Rising temperatures affect the nutritional value and quality of crops."\n      ]\n    },\n    {\n      "Claim B": "Altered growing conditions",\n      "Claim B Evidence": [\n        "Changing rainfall patterns affect the timing and success of planting.",\n        "Increasing temperatures and heatwaves reduce the viability of certain crops.",\n      "Shifts in temperature and humidity create new challenges for farmers."\n      ]\n    },\n    {\n      "Claim C": "Water scarcity",\n      "Claim C Evidence": [\n        "Rising temperatures cause higher rates of evaporation, leading to water scarcity.",\n        "Decreased snowpack and glacier melt reduce available water for agriculture.",\n      "Droughts and extreme weather events disrupt irrigation and water supply."\n      ]\n    }\n  ]\n}',
        reverseOutlineStatus: OpenAiGenerationStatus.COMPLETED,
          relatedFeedback: '',
      },
    ],
  };
