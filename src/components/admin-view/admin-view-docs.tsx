/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React from 'react';
import { UseWithGoogleDocs } from '../../hooks/use-with-google-docs';
import { ColumnCenterDiv } from '../../styled-components';
import SelectCreateDocs from '../user-view/select-create-docs';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';
import { UserRole } from '../../store/slices/login';
import { URL_PARAM_NEW_DOC } from '../../constants';
import { useWithState } from '../../exported-files';
import ExampleGoogleDocModal from '../user-view/example-google-docs-modal';

export interface AdminViewUserGoogleDocsProps {
  useWithGoogleDocs: UseWithGoogleDocs;
}

export default function ViewUserGoogleDocs(
  props: AdminViewUserGoogleDocsProps
): JSX.Element {
  const { useWithGoogleDocs } = props;
  const {
    googleDocs,
    copyGoogleDocs,
    creationInProgress,
    handleCreateGoogleDoc,
    handleDeleteGoogleDoc,
  } = useWithGoogleDocs;
  const { updateCurrentDocId } = useWithState();
  const navigate = useNavigate();
  const userRole = useAppSelector((state) => state.login.userRole);
  const [exampleDocsOpen, setExampleDocsOpen] = React.useState(false);

  function goToDoc(docId: string, newDoc?: boolean) {
    updateCurrentDocId(docId);
    navigate(`/docs/${docId}?${newDoc ? `${URL_PARAM_NEW_DOC}=true` : ''}`);
  }

  function previewUrlBuilder(docId: string) {
    return `https://docs.google.com/document/d/${docId}/view`;
  }

  return (
    <ColumnCenterDiv
      style={{
        width: '100%',
        height: '100%',
        overflowY: 'auto',
      }}
    >
      <SelectCreateDocs
        handleDeleteGoogleDoc={handleDeleteGoogleDoc}
        googleDocs={googleDocs}
        copyGoogleDocs={copyGoogleDocs}
        creationInProgress={creationInProgress}
        handleCreateGoogleDoc={handleCreateGoogleDoc}
        goToDoc={goToDoc}
        onHistoryClicked={(docId: string) => navigate(`/docs/history/${docId}`)}
        setExampleDocsOpen={setExampleDocsOpen}
        sx={{
          width: '60%',
        }}
      />
      <ExampleGoogleDocModal
        viewingAsAdmin={userRole === UserRole.ADMIN}
        open={exampleDocsOpen}
        close={() => {
          setExampleDocsOpen(false);
        }}
        adminDocs={copyGoogleDocs}
        onCreateDoc={(
          docIdtoCopy?: string,
          title?: string,
          isAdminDoc?: boolean
        ) => {
          handleCreateGoogleDoc(docIdtoCopy, title, isAdminDoc, (data) => {
            goToDoc(data.docId, true);
          });
        }}
        goToDoc={goToDoc}
        previewUrlBuilder={previewUrlBuilder}
      />
    </ColumnCenterDiv>
  );
}
