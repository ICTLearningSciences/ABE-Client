/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { UserAccessToken } from '../types';
import { execGql } from './api';

export async function loginMicrosoft(
  accessToken: string
): Promise<UserAccessToken> {
  return await execGql<UserAccessToken>(
    {
      query: `
        mutation LoginMicrosoft($accessToken: String) {
        loginMicrosoft(accessToken: $accessToken) {
            user {
              _id
              googleId
              name
              email
              userRole
              lastLoginAt
            }
            accessToken
          }
        }
      `,
      variables: {
        accessToken: accessToken,
      },
    },
    // login responds with set-cookie, w/o withCredentials it doesnt get stored
    {
      dataPath: 'loginMicrosoft',
      axiosConfig: {
        withCredentials: true,
      },
    }
  );
}
