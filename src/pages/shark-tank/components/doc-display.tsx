/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React from 'react';
import ViewUserGoogleDocs from '../../../components/admin-view/admin-view-docs';
import { useWithStoreDocVersions } from '../../../hooks/use-with-google-doc-versions';
import { useAppSelector } from '../../../store/hooks';
import { useNavigateWithParams } from '../../../hooks/use-navigate-with-params';

export default function UserDocumentDisplay(props: {
  docId?: string;
  activityId?: string;
  onOpenDoc: (id: string) => void;
}): JSX.Element {
  const { docId, activityId, onOpenDoc } = props;
  const { user } = useAppSelector((state) => state.login);
  const navigate = useNavigateWithParams();
  useWithStoreDocVersions(activityId || '');

  function onHistoryClicked(docId: string) {
    if (!docId) {
      console.warn('onHistoryClicked no docId');
      return;
    }
    navigate(`/docs/history/${docId}`);
  }

  return docId ? (
    <iframe
      width="100%"
      height="100%"
      src={`https://docs.google.com/document/d/${docId}/edit?authuser=${user?.email}`}
    />
  ) : (
    <ViewUserGoogleDocs
      goToDoc={onOpenDoc}
      onHistoryClicked={onHistoryClicked}
      isEducationalSetting={false}
    />
  );
}
