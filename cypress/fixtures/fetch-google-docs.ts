/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { UserDoc, DocService } from '../helpers/types';
import { testUser } from './user-data';

const getNDaysAgo = (days: number) => {
  return new Date(new Date().getTime() - days * 24 * 60 * 60 * 1000).toISOString();
};

export const fetchGoogleDocsResponse = (docService?: DocService): { fetchGoogleDocs: UserDoc[] } => {
  return {
    fetchGoogleDocs: [
      {
        user: testUser._id,
      title: 'Aliens',
      documentIntention: {
        description: 'Aliens document intention',
        createdAt: new Date().toISOString(),
      },
      currentDayIntention: {
        description: 'Aliens day intention',
        createdAt: new Date().toISOString(),
      },
      assignmentDescription: 'Aliens assignment description',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      admin: false,
      googleDocId: '1LqProM_kIFbMbMfZKzvlgaFNl5ii6z5xwyAsQZ0U87Y',
      archived: false,
      service: docService || DocService.GOOGLE_DOCS,
    },
    {
      googleDocId: '1LqProM_kIFbMbMfZKzvlgaFNl5ii6z5xwyAsQZ0U87Z',
      user: testUser._id,
      title: 'Aliens 2',
      documentIntention: {
        description: 'Aliens document intention',
        createdAt: new Date().toISOString(),
      },
      currentDayIntention: {
        description: 'Aliens day intention',
        createdAt: new Date().toISOString(),
      },
      assignmentDescription: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      admin: false,
      archived: false,
        service: docService || DocService.GOOGLE_DOCS,
      },
    ],
  };
};

export const fetchGoogleDocsDated = (docService?: DocService): { fetchGoogleDocs: UserDoc[] } => {
  return {
    fetchGoogleDocs: [
      {
        user: testUser._id,
      title: 'Aliens',
      documentIntention: {
        description: 'Aliens document intention',
        createdAt: new Date().toISOString(),
      },
      currentDayIntention: {
        description: 'Aliens day intention',
        createdAt: new Date().toISOString(),
      },
      assignmentDescription: 'Aliens assignment description',
      createdAt: getNDaysAgo(5),
      updatedAt: getNDaysAgo(5),
      admin: false,
      googleDocId: '1LqProM_kIFbMbMfZKzvlgaFNl5ii6z5xwyAsQZ0U87Y',
      archived: false,
      service: docService || DocService.GOOGLE_DOCS,
    },
    {
      googleDocId: '1LqProM_kIFbMbMfZKzvlgaFNl5ii6z5xwyAsQZ0U87Z',
      user: testUser._id,
      title: 'Aliens 2',
      documentIntention: {
        description: 'Aliens document intention',
        createdAt: new Date().toISOString(),
      },
      currentDayIntention: {
        description: 'Aliens day intention',
        createdAt: new Date().toISOString(),
      },
      assignmentDescription: '',
      createdAt: getNDaysAgo(5),
      updatedAt: getNDaysAgo(1),
      admin: false,
      archived: false,
        service: docService || DocService.GOOGLE_DOCS,
      },
    ],
  };
};