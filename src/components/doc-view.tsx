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
import { useNavigateWithParams } from '../hooks/use-navigate-with-params';

function DocView(props: {
  docId?: string;
  activityId?: string;
  goalId?: string;
  disableActivitySelector?: boolean;
}): JSX.Element {
  const { docId: docIdFromUrlParams } = useParams<Record<string, string>>();
  const docId = props.docId || docIdFromUrlParams;
  const navigate = useNavigateWithParams();
  const { updateCurrentDocId, newSession } = useWithState();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const activityFromParams =
    props.activityId || queryParams.get('activityId') || '';
  const goalFromParams = props.goalId || queryParams.get('goalId') || '';
  const googleDocUrl = `https://docs.google.com/document/d/${docId}/edit`;

  const [urlSearchParams] = useSearchParams();
  const isNewGoogleDoc = urlSearchParams.get(URL_PARAM_NEW_DOC) === 'true';

  useEffect(() => {
    if (docId) {
      updateCurrentDocId(docId);
    }
  }, [docId]);

  useEffect(() => {
    newSession();
  }, []);

  if (!docId) {
    navigate('/docs');
    return <></>;
  }

  return (
    <EditGoogleDoc
      docId={docId}
      docUrl={googleDocUrl}
      activityFromParams={activityFromParams}
      goalFromParams={goalFromParams}
      isNewDoc={isNewGoogleDoc}
      disableActivitySelector={props.disableActivitySelector}
    />
  );
}

export default withAuthorizationOnly(DocView);
