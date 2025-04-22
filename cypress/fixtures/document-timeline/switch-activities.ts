/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/

import { DehydratedGQLDocumentTimeline, AiGenerationStatus, TimelinePointType, IGDocVersion } from '../../helpers/types';

export const switchActivities: DehydratedGQLDocumentTimeline = {
  docId: '1LqProM_kIFbMbMfZKzvlgaFNl5ii6z5xwyAsQZ0U87Y',
  user: '653972706e601e65dbc3acea',
  timelinePoints: [
    {
      type: TimelinePointType.START,
      versionTime: '2024-03-27T04:53:41.735Z',
      versionId: '1LqProM_kIFbMbMfZKzvlgaFNl5ii6z5xwyAsQZ0U87Y',
      intent: '',
      changeSummary: '',
      changeSummaryStatus: AiGenerationStatus.COMPLETED,
      reverseOutline:
        '{\n                "Thesis Statement": "CDC vaccines are great!",\n            \n                "Supporting Claims": [\n                    "Vaccines prevent the spread of diseases",\n                    "Vaccines save lives",\n                    "Vaccines are safe and effective"\n                ],\n            \n                "Evidence Given for Each Claim": [\n                    {\n                        "Claim A": "Vaccines prevent the spread of diseases",\n                        "Claim A Evidence": [\n                            "Numerous studies have shown that vaccines effectively reduce the transmission of diseases.",\n                            "Vaccinated individuals are less likely to contract and spread infectious diseases.",\n                            "The eradication of diseases like polio and smallpox can be attributed to vaccines."\n                        ]\n                    },\n                    {\n                        "Claim B": "Vaccines save lives",\n                        "Claim B Evidence": [\n                            "Vaccines have significantly reduced mortality rates from infectious diseases.",\n                            "Vaccines have prevented millions of deaths worldwide.",\n                            "Childhood vaccines alone have saved an estimated 732,000 lives in the United States."\n                        ]\n                    },\n                    {\n                        "Claim C": "Vaccines are safe and effective",\n                        "Claim C Evidence": [\n                            "Extensive testing and research has proven the safety of vaccines.",\n                            "Vaccine side effects are typically mild and temporary.",\n                            "Vaccines go through a rigorous approval process before being made available to the public."\n                        ]\n                    }\n                ]\n            }',
        reverseOutlineStatus: AiGenerationStatus.COMPLETED,
        relatedFeedback: '',
    },
    {
      type: TimelinePointType.NEW_ACTIVITY,
      versionTime: '2024-03-27T04:54:26.932Z',
      versionId: '1LqProM_kIFbMbMfZKzvlgaFNl5ii6z5xwyAsQZ0U87Y',
      intent: '',
      changeSummary: 'No changes from previous version',
      changeSummaryStatus: AiGenerationStatus.COMPLETED,
      reverseOutlineStatus: AiGenerationStatus.COMPLETED,

      reverseOutline:
        '{\n                "Thesis Statement": "CDC vaccines are great!",\n            \n                "Supporting Claims": [\n                    "Vaccines prevent the spread of diseases",\n                    "Vaccines save lives",\n                    "Vaccines are safe and effective"\n                ],\n            \n                "Evidence Given for Each Claim": [\n                    {\n                        "Claim A": "Vaccines prevent the spread of diseases",\n                        "Claim A Evidence": [\n                            "Numerous studies have shown that vaccines effectively reduce the transmission of diseases.",\n                            "Vaccinated individuals are less likely to contract and spread infectious diseases.",\n                            "The eradication of diseases like polio and smallpox can be attributed to vaccines."\n                        ]\n                    },\n                    {\n                        "Claim B": "Vaccines save lives",\n                        "Claim B Evidence": [\n                            "Vaccines have significantly reduced mortality rates from infectious diseases.",\n                            "Vaccines have prevented millions of deaths worldwide.",\n                            "Childhood vaccines alone have saved an estimated 732,000 lives in the United States."\n                        ]\n                    },\n                    {\n                        "Claim C": "Vaccines are safe and effective",\n                        "Claim C Evidence": [\n                            "Extensive testing and research has proven the safety of vaccines.",\n                            "Vaccine side effects are typically mild and temporary.",\n                            "Vaccines go through a rigorous approval process before being made available to the public."\n                        ]\n                    }\n                ]\n            }',
      relatedFeedback: '',
    },
  ],
};
export const switchActivitiesDocVersions: IGDocVersion[] = [
  {
    _id: '1LqProM_kIFbMbMfZKzvlgaFNl5ii6z5xwyAsQZ0U87Y',
    docId: '1LqProM_kIFbMbMfZKzvlgaFNl5ii6z5xwyAsQZ0U87Y',
    plainText: 'CDC vaccines are great!\n',
    lastChangedId:
      'ALBJ4LuqOjQVnAA3GapMNWBmG4F6vdvlfyZ-1VzMT3QtO1R3ZNros6a03RQWlZb16ebVWYnsMKjHOkJjNeEahs8',
    chatLog: [
      {
        sender: 'SYSTEM',
        message:
          "Feel free to edit your paper. Let me know when you're ready for me to analyze it.",
      },
      {
        sender: 'USER',
        message: 'Ready',
      },
      {
        sender: 'SYSTEM',
        message:
          'I apologize for the confusion, but the essay content for evaluation was not provided. Could you please provide the essay so I can proceed with the evaluation?',
      },
      {
        sender: 'SYSTEM',
        message:
          'Feel free to ask me anything else about your essay, or I can analyze it again for you.',
      },
    ],
    sessionId: '123',
    modifiedTime: '2024-03-27T04:53:41.735Z',
    createdAt: '2024-03-27T04:53:41.735Z',
    updatedAt: '2024-03-27T04:53:41.735Z',
    activity: '65a8838126523c7ce5acacac',
    intent: '',
    title: 'Copy of CDC Vaccines',
    lastModifyingUser: 'ashiel408@gmail.com',
  }
];
