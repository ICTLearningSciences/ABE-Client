/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/

import { GQLDocumentTimeline, OpenAiGenerationStatus, TimelinePointType } from '../../helpers/types';

export const tenTimelinePoints: GQLDocumentTimeline = {
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
      changeSummary: '',
      changeSummaryStatus: OpenAiGenerationStatus.COMPLETED,
      reverseOutlineStatus: OpenAiGenerationStatus.COMPLETED,
      reverseOutline:
        '{\n  "Thesis Statement": "The impact of climate change on global food security",\n  "Supporting Claims": [\n    "Decreased crop yields",\n    "Altered growing conditions",\n    "Water scarcity"\n  ],\n  "Evidence Given for Each Claim": [\n    {\n      "Claim A": "Decreased crop yields",\n      "Claim A Evidence": [\n        "Studies show that global warming leads to a decline in crop yields.",\n        "Extreme weather events caused by climate change have a negative impact on crop production.",\n      "Rising temperatures affect the nutritional value and quality of crops."\n      ]\n    },\n    {\n      "Claim B": "Altered growing conditions",\n      "Claim B Evidence": [\n        "Changing rainfall patterns affect the timing and success of planting.",\n        "Increasing temperatures and heatwaves reduce the viability of certain crops.",\n      "Shifts in temperature and humidity create new challenges for farmers."\n      ]\n    },\n    {\n      "Claim C": "Water scarcity",\n      "Claim C Evidence": [\n        "Rising temperatures cause higher rates of evaporation, leading to water scarcity.",\n        "Decreased snowpack and glacier melt reduce available water for agriculture.",\n      "Droughts and extreme weather events disrupt irrigation and water supply."\n      ]\n    }\n  ]\n}',

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
        "In the current version, there are minor changes made to the document compared to the previous version. The only change made is the addition of the statement 'I'm making more changes' at the end of the document. No other areas of the document were substantially changed.",
      reverseOutline:
        '{\n  "Thesis Statement": "Climate change is primarily caused by human activities.",\n  "Supporting Claims": [\n    "Greenhouse gas emissions from human activities are the main driver of climate change.",\n    "Deforestation and land use changes contribute significantly to climate change.",\n    "Burning of fossil fuels is a major source of greenhouse gas emissions."\n  ],\n  "Evidence Given for Each Claim": [\n    {\n      "Claim A": "Greenhouse gas emissions from human activities are the main driver of climate change.",\n      "Claim A Evidence": [\n        "Increase in carbon dioxide levels in the atmosphere due to burning of fossil fuels.",\n        "Rise in greenhouse gas emissions correlating with industrialization and human population growth."\n      ]\n    },\n    {\n      "Claim B": "Deforestation and land use changes contribute significantly to climate change.",\n      "Claim B Evidence": [\n        "Clearing of forests releases large amounts of carbon dioxide into the atmosphere.",\n        "Conversion of forests into agricultural or urban areas reduces the Earth\'s capacity to absorb carbon dioxide."\n      ]\n    },\n    {\n      "Claim C": "Burning of fossil fuels is a major source of greenhouse gas emissions.",\n      "Claim C Evidence": [\n        "Burning of coal, oil, and natural gas releases carbon dioxide and other greenhouse gases.",\n        "Increase in global carbon dioxide concentrations closely linked with the industrial revolution and fossil fuel usage."\n      ]\n    }\n  ]\n}',
      relatedFeedback: '',
      changeSummaryStatus: OpenAiGenerationStatus.COMPLETED,
      reverseOutlineStatus: OpenAiGenerationStatus.COMPLETED,
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
        "In the current version, there are minor changes made to the document compared to the previous version. The only change made is the addition of the statement 'I'm making more changes' at the end of the document. No other areas of the document were substantially changed.",
      reverseOutline:
        '{\n  "Thesis Statement": "Climate change is primarily caused by human activities.",\n  "Supporting Claims": [\n    "Greenhouse gas emissions from human activities are the main driver of climate change.",\n    "Deforestation and land use changes contribute significantly to climate change.",\n    "Burning of fossil fuels is a major source of greenhouse gas emissions."\n  ],\n  "Evidence Given for Each Claim": [\n    {\n      "Claim A": "Greenhouse gas emissions from human activities are the main driver of climate change.",\n      "Claim A Evidence": [\n        "Increase in carbon dioxide levels in the atmosphere due to burning of fossil fuels.",\n        "Rise in greenhouse gas emissions correlating with industrialization and human population growth."\n      ]\n    },\n    {\n      "Claim B": "Deforestation and land use changes contribute significantly to climate change.",\n      "Claim B Evidence": [\n        "Clearing of forests releases large amounts of carbon dioxide into the atmosphere.",\n        "Conversion of forests into agricultural or urban areas reduces the Earth\'s capacity to absorb carbon dioxide."\n      ]\n    },\n    {\n      "Claim C": "Burning of fossil fuels is a major source of greenhouse gas emissions.",\n      "Claim C Evidence": [\n        "Burning of coal, oil, and natural gas releases carbon dioxide and other greenhouse gases.",\n        "Increase in global carbon dioxide concentrations closely linked with the industrial revolution and fossil fuel usage."\n      ]\n    }\n  ]\n}',
      relatedFeedback: '',
      changeSummaryStatus: OpenAiGenerationStatus.COMPLETED,
      reverseOutlineStatus: OpenAiGenerationStatus.COMPLETED,
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
        "In the current version, there are minor changes made to the document compared to the previous version. The only change made is the addition of the statement 'I'm making more changes' at the end of the document. No other areas of the document were substantially changed.",
      reverseOutline:
        '{\n  "Thesis Statement": "Climate change is primarily caused by human activities.",\n  "Supporting Claims": [\n    "Greenhouse gas emissions from human activities are the main driver of climate change.",\n    "Deforestation and land use changes contribute significantly to climate change.",\n    "Burning of fossil fuels is a major source of greenhouse gas emissions."\n  ],\n  "Evidence Given for Each Claim": [\n    {\n      "Claim A": "Greenhouse gas emissions from human activities are the main driver of climate change.",\n      "Claim A Evidence": [\n        "Increase in carbon dioxide levels in the atmosphere due to burning of fossil fuels.",\n        "Rise in greenhouse gas emissions correlating with industrialization and human population growth."\n      ]\n    },\n    {\n      "Claim B": "Deforestation and land use changes contribute significantly to climate change.",\n      "Claim B Evidence": [\n        "Clearing of forests releases large amounts of carbon dioxide into the atmosphere.",\n        "Conversion of forests into agricultural or urban areas reduces the Earth\'s capacity to absorb carbon dioxide."\n      ]\n    },\n    {\n      "Claim C": "Burning of fossil fuels is a major source of greenhouse gas emissions.",\n      "Claim C Evidence": [\n        "Burning of coal, oil, and natural gas releases carbon dioxide and other greenhouse gases.",\n        "Increase in global carbon dioxide concentrations closely linked with the industrial revolution and fossil fuel usage."\n      ]\n    }\n  ]\n}',
      relatedFeedback: '',
      changeSummaryStatus: OpenAiGenerationStatus.COMPLETED,
      reverseOutlineStatus: OpenAiGenerationStatus.COMPLETED,
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
        "In the current version, there are minor changes made to the document compared to the previous version. The only change made is the addition of the statement 'I'm making more changes' at the end of the document. No other areas of the document were substantially changed.",
      reverseOutline:
        '{\n  "Thesis Statement": "Climate change is primarily caused by human activities.",\n  "Supporting Claims": [\n    "Greenhouse gas emissions from human activities are the main driver of climate change.",\n    "Deforestation and land use changes contribute significantly to climate change.",\n    "Burning of fossil fuels is a major source of greenhouse gas emissions."\n  ],\n  "Evidence Given for Each Claim": [\n    {\n      "Claim A": "Greenhouse gas emissions from human activities are the main driver of climate change.",\n      "Claim A Evidence": [\n        "Increase in carbon dioxide levels in the atmosphere due to burning of fossil fuels.",\n        "Rise in greenhouse gas emissions correlating with industrialization and human population growth."\n      ]\n    },\n    {\n      "Claim B": "Deforestation and land use changes contribute significantly to climate change.",\n      "Claim B Evidence": [\n        "Clearing of forests releases large amounts of carbon dioxide into the atmosphere.",\n        "Conversion of forests into agricultural or urban areas reduces the Earth\'s capacity to absorb carbon dioxide."\n      ]\n    },\n    {\n      "Claim C": "Burning of fossil fuels is a major source of greenhouse gas emissions.",\n      "Claim C Evidence": [\n        "Burning of coal, oil, and natural gas releases carbon dioxide and other greenhouse gases.",\n        "Increase in global carbon dioxide concentrations closely linked with the industrial revolution and fossil fuel usage."\n      ]\n    }\n  ]\n}',
      relatedFeedback: '',
      changeSummaryStatus: OpenAiGenerationStatus.COMPLETED,
      reverseOutlineStatus: OpenAiGenerationStatus.COMPLETED,
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
        "In the current version, there are minor changes made to the document compared to the previous version. The only change made is the addition of the statement 'I'm making more changes' at the end of the document. No other areas of the document were substantially changed.",
      reverseOutline:
        '{\n  "Thesis Statement": "Climate change is primarily caused by human activities.",\n  "Supporting Claims": [\n    "Greenhouse gas emissions from human activities are the main driver of climate change.",\n    "Deforestation and land use changes contribute significantly to climate change.",\n    "Burning of fossil fuels is a major source of greenhouse gas emissions."\n  ],\n  "Evidence Given for Each Claim": [\n    {\n      "Claim A": "Greenhouse gas emissions from human activities are the main driver of climate change.",\n      "Claim A Evidence": [\n        "Increase in carbon dioxide levels in the atmosphere due to burning of fossil fuels.",\n        "Rise in greenhouse gas emissions correlating with industrialization and human population growth."\n      ]\n    },\n    {\n      "Claim B": "Deforestation and land use changes contribute significantly to climate change.",\n      "Claim B Evidence": [\n        "Clearing of forests releases large amounts of carbon dioxide into the atmosphere.",\n        "Conversion of forests into agricultural or urban areas reduces the Earth\'s capacity to absorb carbon dioxide."\n      ]\n    },\n    {\n      "Claim C": "Burning of fossil fuels is a major source of greenhouse gas emissions.",\n      "Claim C Evidence": [\n        "Burning of coal, oil, and natural gas releases carbon dioxide and other greenhouse gases.",\n        "Increase in global carbon dioxide concentrations closely linked with the industrial revolution and fossil fuel usage."\n      ]\n    }\n  ]\n}',
      relatedFeedback: '',
      changeSummaryStatus: OpenAiGenerationStatus.COMPLETED,
      reverseOutlineStatus: OpenAiGenerationStatus.COMPLETED,
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
        "In the current version, there are minor changes made to the document compared to the previous version. The only change made is the addition of the statement 'I'm making more changes' at the end of the document. No other areas of the document were substantially changed.",
      reverseOutline:
        '{\n  "Thesis Statement": "Climate change is primarily caused by human activities.",\n  "Supporting Claims": [\n    "Greenhouse gas emissions from human activities are the main driver of climate change.",\n    "Deforestation and land use changes contribute significantly to climate change.",\n    "Burning of fossil fuels is a major source of greenhouse gas emissions."\n  ],\n  "Evidence Given for Each Claim": [\n    {\n      "Claim A": "Greenhouse gas emissions from human activities are the main driver of climate change.",\n      "Claim A Evidence": [\n        "Increase in carbon dioxide levels in the atmosphere due to burning of fossil fuels.",\n        "Rise in greenhouse gas emissions correlating with industrialization and human population growth."\n      ]\n    },\n    {\n      "Claim B": "Deforestation and land use changes contribute significantly to climate change.",\n      "Claim B Evidence": [\n        "Clearing of forests releases large amounts of carbon dioxide into the atmosphere.",\n        "Conversion of forests into agricultural or urban areas reduces the Earth\'s capacity to absorb carbon dioxide."\n      ]\n    },\n    {\n      "Claim C": "Burning of fossil fuels is a major source of greenhouse gas emissions.",\n      "Claim C Evidence": [\n        "Burning of coal, oil, and natural gas releases carbon dioxide and other greenhouse gases.",\n        "Increase in global carbon dioxide concentrations closely linked with the industrial revolution and fossil fuel usage."\n      ]\n    }\n  ]\n}',
      relatedFeedback: '',
      changeSummaryStatus: OpenAiGenerationStatus.COMPLETED,
      reverseOutlineStatus: OpenAiGenerationStatus.COMPLETED,
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
        "In the current version, there are minor changes made to the document compared to the previous version. The only change made is the addition of the statement 'I'm making more changes' at the end of the document. No other areas of the document were substantially changed.",
      reverseOutline:
        '{\n  "Thesis Statement": "Climate change is primarily caused by human activities.",\n  "Supporting Claims": [\n    "Greenhouse gas emissions from human activities are the main driver of climate change.",\n    "Deforestation and land use changes contribute significantly to climate change.",\n    "Burning of fossil fuels is a major source of greenhouse gas emissions."\n  ],\n  "Evidence Given for Each Claim": [\n    {\n      "Claim A": "Greenhouse gas emissions from human activities are the main driver of climate change.",\n      "Claim A Evidence": [\n        "Increase in carbon dioxide levels in the atmosphere due to burning of fossil fuels.",\n        "Rise in greenhouse gas emissions correlating with industrialization and human population growth."\n      ]\n    },\n    {\n      "Claim B": "Deforestation and land use changes contribute significantly to climate change.",\n      "Claim B Evidence": [\n        "Clearing of forests releases large amounts of carbon dioxide into the atmosphere.",\n        "Conversion of forests into agricultural or urban areas reduces the Earth\'s capacity to absorb carbon dioxide."\n      ]\n    },\n    {\n      "Claim C": "Burning of fossil fuels is a major source of greenhouse gas emissions.",\n      "Claim C Evidence": [\n        "Burning of coal, oil, and natural gas releases carbon dioxide and other greenhouse gases.",\n        "Increase in global carbon dioxide concentrations closely linked with the industrial revolution and fossil fuel usage."\n      ]\n    }\n  ]\n}',
      relatedFeedback: '',
      changeSummaryStatus: OpenAiGenerationStatus.COMPLETED,
      reverseOutlineStatus: OpenAiGenerationStatus.COMPLETED,
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
        "In the current version, there are minor changes made to the document compared to the previous version. The only change made is the addition of the statement 'I'm making more changes' at the end of the document. No other areas of the document were substantially changed.",
      reverseOutline:
        '{\n  "Thesis Statement": "Climate change is primarily caused by human activities.",\n  "Supporting Claims": [\n    "Greenhouse gas emissions from human activities are the main driver of climate change.",\n    "Deforestation and land use changes contribute significantly to climate change.",\n    "Burning of fossil fuels is a major source of greenhouse gas emissions."\n  ],\n  "Evidence Given for Each Claim": [\n    {\n      "Claim A": "Greenhouse gas emissions from human activities are the main driver of climate change.",\n      "Claim A Evidence": [\n        "Increase in carbon dioxide levels in the atmosphere due to burning of fossil fuels.",\n        "Rise in greenhouse gas emissions correlating with industrialization and human population growth."\n      ]\n    },\n    {\n      "Claim B": "Deforestation and land use changes contribute significantly to climate change.",\n      "Claim B Evidence": [\n        "Clearing of forests releases large amounts of carbon dioxide into the atmosphere.",\n        "Conversion of forests into agricultural or urban areas reduces the Earth\'s capacity to absorb carbon dioxide."\n      ]\n    },\n    {\n      "Claim C": "Burning of fossil fuels is a major source of greenhouse gas emissions.",\n      "Claim C Evidence": [\n        "Burning of coal, oil, and natural gas releases carbon dioxide and other greenhouse gases.",\n        "Increase in global carbon dioxide concentrations closely linked with the industrial revolution and fossil fuel usage."\n      ]\n    }\n  ]\n}',
      relatedFeedback: '',
      changeSummaryStatus: OpenAiGenerationStatus.COMPLETED,
      reverseOutlineStatus: OpenAiGenerationStatus.COMPLETED,
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
        "In the current version, there are minor changes made to the document compared to the previous version. The only change made is the addition of the statement 'I'm making more changes' at the end of the document. No other areas of the document were substantially changed.",
      reverseOutline:
        '{\n  "Thesis Statement": "Climate change is primarily caused by human activities.",\n  "Supporting Claims": [\n    "Greenhouse gas emissions from human activities are the main driver of climate change.",\n    "Deforestation and land use changes contribute significantly to climate change.",\n    "Burning of fossil fuels is a major source of greenhouse gas emissions."\n  ],\n  "Evidence Given for Each Claim": [\n    {\n      "Claim A": "Greenhouse gas emissions from human activities are the main driver of climate change.",\n      "Claim A Evidence": [\n        "Increase in carbon dioxide levels in the atmosphere due to burning of fossil fuels.",\n        "Rise in greenhouse gas emissions correlating with industrialization and human population growth."\n      ]\n    },\n    {\n      "Claim B": "Deforestation and land use changes contribute significantly to climate change.",\n      "Claim B Evidence": [\n        "Clearing of forests releases large amounts of carbon dioxide into the atmosphere.",\n        "Conversion of forests into agricultural or urban areas reduces the Earth\'s capacity to absorb carbon dioxide."\n      ]\n    },\n    {\n      "Claim C": "Burning of fossil fuels is a major source of greenhouse gas emissions.",\n      "Claim C Evidence": [\n        "Burning of coal, oil, and natural gas releases carbon dioxide and other greenhouse gases.",\n        "Increase in global carbon dioxide concentrations closely linked with the industrial revolution and fossil fuel usage."\n      ]\n    }\n  ]\n}',
      relatedFeedback: '',
      changeSummaryStatus: OpenAiGenerationStatus.COMPLETED,
      reverseOutlineStatus: OpenAiGenerationStatus.COMPLETED,
    },
    {
      type: TimelinePointType.TIME_DIFFERENCE,
      versionTime: '2024-03-27T20:00:57.804Z',
      version: {
        docId: '1LqProM_kIFbMbMfZKzvlgaFNl5ii6z5xwyAsQZ0U87Y',
        plainText:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Platea dictumst vestibulum rhoncus est. Est pellentesque elit ullamcorper dignissim cras tincidunt. Cursus in hac habitasse platea dictumst quisque. Sem fringilla ut morbi tincidunt augue interdum velit euismod in. Non blandit massa enim nec dui. Velit sed ullamcorper morbi tincidunt ornare massa eget. Elit ullamcorper dignissim cras tincidunt lobortis feugiat vivamus. Enim sed faucibus turpis in. Vel pretium lectus quam id. Ut placerat orci nulla pellentesque dignissim enim sit amet venenatis.          Dolor sed viverra ipsum nunc aliquet bibendum. Non consectetur a erat nam at lectus urna duis. Ipsum nunc aliquet bibendum enim. Amet commodo nulla facilisi nullam vehicula ipsum a. Morbi tristique senectus et netus et malesuada fames. Faucibus et molestie ac feugiat. Tristique et egestas quis ipsum. Consequat ac felis donec et odio pellentesque diam volutpat. Ullamcorper sit amet risus nullam eget. Diam vulputate ut pharetra sit amet. Id ornare arcu odio ut sem. Velit scelerisque in dictum non consectetur a. Dignissim diam quis enim lobortis scelerisque fermentum dui faucibus. Sit amet cursus sit amet dictum sit. Interdum velit laoreet id donec. Nulla porttitor massa id neque aliquam vestibulum morbi blandit. Consectetur lorem donec massa sapien faucibus et molestie. Pretium lectus quam id leo in vitae. Dolor sit amet consectetur adipiscing elit duis tristique sollicitudin nibh.          Platea dictumst vestibulum rhoncus est pellentesque elit. Vitae et leo duis ut diam. Lobortis feugiat vivamus at augue eget arcu dictum. Lorem ipsum dolor sit amet consectetur adipiscing elit duis. Volutpat diam ut venenatis tellus in metus vulputate eu. Habitant morbi tristique senectus et netus et malesuada fames. Amet consectetur adipiscing elit pellentesque habitant morbi tristique senectus. Feugiat sed lectus vestibulum mattis. Nec ullamcorper sit amet risus nullam eget. Sed viverra tellus in hac habitasse. Vulputate ut pharetra sit amet aliquam id diam. Praesent semper feugiat nibh sed.       Odio aenean sed adipiscing diam donec adipiscing tristique. Ultrices in iaculis nunc sed augue lacus viverra vitae congue. Lobortis elementum nibh tellus molestie nunc non blandit massa enim. Turpis cursus in hac habitasse platea. At tempor commodo ullamcorper a lacus vestibulum. In nibh mauris cursus mattis molestie a iaculis. Nisi scelerisque eu ultrices vitae. Risus sed vulputate odio ut. Non consectetur a erat nam at lectus urna. Adipiscing tristique risus nec feugiat in fermentum posuere urna. Egestas sed sed risus pretium quam vulputate dignissim suspendisse in. Arcu felis bibendum ut tristique et egestas quis. Augue lacus viverra vitae congue. Sagittis orci a scelerisque purus semper eget duis at. Vivamus arcu felis bibendum ut tristique et egestas quis. Enim neque volutpat ac tincidunt. Fringilla phasellus faucibus scelerisque eleifend donec pretium vulputate sapien nec. Sit amet nulla facilisi morbi tempus iaculis urna.          Euismod lacinia at quis risus sed vulputate odio ut. Tincidunt tortor aliquam nulla facilisi cras fermentum odio eu. Vitae congue mauris rhoncus aenean vel elit scelerisque. Adipiscing elit pellentesque habitant morbi tristique senectus et netus et. Pulvinar proin gravida hendrerit lectus a. Duis convallis convallis tellus id interdum velit laoreet id donec. Tellus orci ac auctor augue mauris augue neque. Ut sem nulla pharetra diam sit. Nunc lobortis mattis aliquam faucibus purus. Hac habitasse platea dictumst quisque. In massa tempor nec feugiat nisl pretium. Non tellus orci ac auctor augue mauris.          Adipiscing elit pellentesque habitant morbi tristique. Massa sapien faucibus et molestie ac feugiat sed lectus. Eu augue ut lectus arcu. Ipsum faucibus vitae aliquet nec ullamcorper sit amet. Diam quam nulla porttitor massa id neque aliquam. Mattis vulputate enim nulla aliquet. Vel orci porta non pulvinar. Nullam ac tortor vitae purus faucibus ornare suspendisse. Leo integer malesuada nunc vel. Diam donec adipiscing tristique risus nec. Ultricies lacus sed turpis tincidunt id aliquet risus feugiat. Amet luctus venenatis lectus magna fringilla urna porttitor rhoncus dolor. Vestibulum sed arcu non odio euismod lacinia at quis risus.          In fermentum posuere urna nec tincidunt praesent. Eros in cursus turpis massa tincidunt dui. Egestas congue quisque egestas diam in arcu. Varius quam quisque id diam vel quam elementum pulvinar. Amet nulla facilisi morbi tempus iaculis urna id volutpat. Purus in mollis nunc sed id semper risus in. Mauris vitae ultricies leo integer malesuada. Integer feugiat scelerisque varius morbi enim nunc faucibus a pellentesque. Tortor id aliquet lectus proin nibh. Pellentesque habitant morbi tristique senectus et netus et. Amet dictum sit amet justo donec enim diam. Mi bibendum neque egestas congue quisque egestas diam in. Venenatis a condimentum vitae sapien pellentesque. Nunc sed id semper risus in hendrerit gravida rutrum. Turpis massa tincidunt dui ut ornare lectus sit.          Habitant morbi tristique senectus et netus et malesuada. Id donec ultrices tincidunt arcu non sodales. Nullam non nisi est sit amet facilisis magna etiam. Pulvinar neque laoreet suspendisse interdum consectetur libero id faucibus. Felis donec et odio pellentesque diam volutpat. Tempor orci eu lobortis elementum nibh tellus molestie. Venenatis a condimentum vitae sapien pellentesque. Lectus nulla at volutpat diam ut venenatis tellus in metus. Pellentesque eu tincidunt tortor aliquam nulla facilisi. Egestas quis ipsum suspendisse ultrices gravida dictum fusce. Tempus quam pellentesque nec nam aliquam. Integer malesuada nunc vel risus commodo. Non odio euismod lacinia at quis risus sed vulputate. Nisl rhoncus mattis rhoncus urna neque. At auctor urna nunc id cursus metus aliquam eleifend mi. Tristique magna sit amet purus gravida. Vitae justo eget magna fermentum iaculis eu non diam phasellus. Risus sed vulputate odio ut enim blandit volutpat maecenas. Nisl nunc mi ipsum faucibus vitae aliquet nec ullamcorper.          Dui accumsan sit amet nulla facilisi morbi tempus iaculis. Fusce id velit ut tortor pretium viverra suspendisse potenti. Quam elementum pulvinar etiam non quam. Nulla facilisi morbi tempus iaculis urna id. Ac turpis egestas integer eget aliquet. Volutpat odio facilisis mauris sit amet massa vitae. Dictum non consectetur a erat nam at. Tortor id aliquet lectus proin nibh. Morbi leo urna molestie at elementum eu facilisis sed odio. Convallis tellus id interdum velit laoreet id. Sit amet risus nullam eget.          Congue eu consequat ac felis donec. Habitant morbi tristique senectus et netus et malesuada fames ac. Eget nunc lobortis mattis aliquam faucibus purus in massa tempor. Dictum non consectetur a erat nam at lectus urna. Maecenas accumsan lacus vel facilisis volutpat est velit egestas. Quis ipsum suspendisse ultrices gravida dictum fusce ut. Vitae nunc sed velit dignissim sodales ut. Sed faucibus turpis in eu. Ipsum dolor sit amet consectetur adipiscing. Nibh sit amet commodo nulla facilisi nullam vehicula ipsum a. Commodo odio aenean sed adipiscing diam donec adipiscing. Molestie nunc non blandit massa enim nec. Varius quam quisque id diam vel. Sed turpis tincidunt id aliquet.',

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
        "In the current version, there are minor changes made to the document compared to the previous version. The only change made is the addition of the statement 'I'm making more changes' at the end of the document. No other areas of the document were substantially changed.",
      reverseOutline:
        '{\n  "Thesis Statement": "Climate change is primarily caused by human activities.",\n  "Supporting Claims": [\n    "Greenhouse gas emissions from human activities are the main driver of climate change.",\n    "Deforestation and land use changes contribute significantly to climate change.",\n    "Burning of fossil fuels is a major source of greenhouse gas emissions."\n  ],\n  "Evidence Given for Each Claim": [\n    {\n      "Claim A": "Greenhouse gas emissions from human activities are the main driver of climate change.",\n      "Claim A Evidence": [\n        "Increase in carbon dioxide levels in the atmosphere due to burning of fossil fuels.",\n        "Rise in greenhouse gas emissions correlating with industrialization and human population growth."\n      ]\n    },\n    {\n      "Claim B": "Deforestation and land use changes contribute significantly to climate change.",\n      "Claim B Evidence": [\n        "Clearing of forests releases large amounts of carbon dioxide into the atmosphere.",\n        "Conversion of forests into agricultural or urban areas reduces the Earth\'s capacity to absorb carbon dioxide."\n      ]\n    },\n    {\n      "Claim C": "Burning of fossil fuels is a major source of greenhouse gas emissions.",\n      "Claim C Evidence": [\n        "Burning of coal, oil, and natural gas releases carbon dioxide and other greenhouse gases.",\n        "Increase in global carbon dioxide concentrations closely linked with the industrial revolution and fossil fuel usage."\n      ]\n    }\n  ]\n}',
      relatedFeedback: '',
      changeSummaryStatus: OpenAiGenerationStatus.COMPLETED,
      reverseOutlineStatus: OpenAiGenerationStatus.COMPLETED,
    },
  ],
};
