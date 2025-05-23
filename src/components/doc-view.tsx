/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React from 'react';
import { useEffect } from 'react';
import withAuthorizationOnly from '../hooks/wrap-with-authorization-only';
import { EditGoogleDoc } from './user-view/user-edit-google-doc';
import { useLocation, useParams, useSearchParams } from 'react-router-dom';
import { useWithState } from '../store/slices/state/use-with-state';
import { URL_PARAM_NEW_DOC } from '../constants';
import { useWithPrompts } from '../hooks/use-with-prompts';
import { useNavigateWithParams } from '../hooks/use-navigate-with-params';

function DocView(): JSX.Element {
  const { docId } = useParams<Record<string, string>>();
  const navigate = useNavigateWithParams();
  const { updateCurrentDocId } = useWithState();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const activityFromParams = queryParams.get('activityId');
  const goalFromParams = queryParams.get('goalId');
  const googleDocUrl = `https://docs.google.com/document/d/${docId}/edit`;

  const [urlSearchParams] = useSearchParams();
  const isNewGoogleDoc = urlSearchParams.get(URL_PARAM_NEW_DOC) === 'true';

  const prompts = useWithPrompts();

  useEffect(() => {
    if (docId) {
      updateCurrentDocId(docId);
    }
  }, [docId]);

  if (!docId) {
    navigate('/docs');
    return <></>;
  }

  return (
    <EditGoogleDoc
      docId={docId}
      docUrl={googleDocUrl}
      activityFromParams={activityFromParams || ''}
      goalFromParams={goalFromParams || ''}
      isNewDoc={isNewGoogleDoc}
      useWithPrompts={prompts}
    />
  );
}

export default withAuthorizationOnly(DocView);
