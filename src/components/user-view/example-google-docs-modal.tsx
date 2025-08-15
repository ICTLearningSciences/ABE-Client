/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { Box, Button, Modal, Theme } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { UserDoc } from '../../types';
import { RowDiv, RowDivSB } from '../../styled-components';
import React, { useEffect } from 'react';
import CreateNewAdminGoogleDoc from '../admin-view/author-new-google-doc-modal';
import LockIcon from '@mui/icons-material/Lock';
import { PreviewGoogleDocModal } from './preview-google-doc-modal';
import styled from 'styled-components';
const useStyles = makeStyles({ name: { ExampleGoogleDocModal } })(
  (theme: Theme) => ({
    inputField: {
      width: '100%',
      margin: 10,
    },
    modal: {},
    paper: {
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
      maxWidth: '50%',
    },
  })
);

export const StyledExampleGoogleDocItem = styled(RowDivSB)`
  &:hover {
    background-color: rgb(245, 245, 245);
  }
`;

export default function ExampleGoogleDocModal(props: {
  adminDocs?: UserDoc[];
  onCreateDoc: (docId?: string, title?: string, isAdminDoc?: boolean) => void;
  open: boolean;
  close: () => void;
  goToDoc: (docId: string) => void;
  viewingAsAdmin: boolean;
}): JSX.Element {
  const [selectedGoogleDoc, setSelectedGoogleDoc] = React.useState<string>('');
  const { open, close, adminDocs, onCreateDoc, viewingAsAdmin } = props;
  const [openNewDocModal, setOpenNewDocModal] = React.useState(false);
  const [previewDocId, setPreviewDocId] = React.useState<string>('');
  const { classes } = useStyles();
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 'fit-content',
    minWidth: '30%',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  function previewUrlBuilder(docId: string) {
    return `https://docs.google.com/document/d/${docId}/view`;
  }

  useEffect(() => {
    if (!open) {
      setSelectedGoogleDoc('');
    }
  }, [open]);

  return (
    <div>
      <Modal open={Boolean(open)} className={classes.modal}>
        <Box sx={style}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              height: '100%',
            }}
          >
            <h2 style={{ alignSelf: 'center', marginBottom: 5 }}>
              Example Documents
            </h2>
            <span
              style={{
                alignSelf: 'center',
                fontWeight: 'bold',
                marginBottom: '10px',
              }}
            >
              Select One
            </span>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                height: '80%',
                overflow: 'auto',
              }}
            >
              <div
                style={{
                  maxHeight: 'fit-content',
                  overflow: 'auto',
                }}
              >
                {adminDocs?.map((doc, i) => (
                  <StyledExampleGoogleDocItem
                    key={i}
                    style={{
                      borderBottom: '1px solid black',
                      backgroundColor:
                        selectedGoogleDoc === doc.googleDocId
                          ? 'lightgrey'
                          : '',
                      cursor: 'pointer',
                    }}
                    onClick={() => {
                      setSelectedGoogleDoc(doc.googleDocId);
                    }}
                  >
                    <h4>{doc.title}</h4>
                  </StyledExampleGoogleDocItem>
                ))}
              </div>
            </div>
            <RowDiv
              style={{
                alignSelf: 'center',
                marginTop: '20px',
              }}
            >
              <Button
                size="large"
                variant="outlined"
                style={{
                  marginRight: '20px',
                }}
                onClick={() => {
                  setPreviewDocId(selectedGoogleDoc);
                }}
                disabled={!selectedGoogleDoc}
              >
                Preview
              </Button>
              <Button
                onClick={() => {
                  onCreateDoc(selectedGoogleDoc);
                }}
                style={{
                  marginRight: '20px',
                }}
                disabled={!selectedGoogleDoc}
                size="large"
                variant="outlined"
              >
                COPY
              </Button>
              <Button size="large" variant="outlined" onClick={close}>
                Close
              </Button>
            </RowDiv>

            {viewingAsAdmin && (
              <RowDiv
                style={{
                  alignSelf: 'center',
                  marginTop: '20px',
                  padding: '10px',
                  border: '1px solid black',
                }}
              >
                <LockIcon
                  style={{
                    marginRight: '10px',
                  }}
                />
                <span
                  style={{
                    marginRight: '20px',
                    fontWeight: 'bold',
                  }}
                >
                  Admin
                </span>
                <Button
                  variant="outlined"
                  size="large"
                  style={{
                    marginRight: '20px',
                  }}
                  onClick={() => {
                    setOpenNewDocModal(true);
                  }}
                >
                  + New
                </Button>
                <Button
                  onClick={() => {
                    // navigate(`/docs/${selectedGoogleDoc}`);
                    props.goToDoc(selectedGoogleDoc);
                  }}
                  style={{
                    marginRight: '20px',
                  }}
                  disabled={!selectedGoogleDoc}
                  size="large"
                  variant="outlined"
                >
                  Edit
                </Button>
              </RowDiv>
            )}
          </div>
        </Box>
      </Modal>
      <CreateNewAdminGoogleDoc
        open={openNewDocModal}
        close={() => {
          setOpenNewDocModal(false);
        }}
        onCreateDoc={(title: string) => {
          onCreateDoc('', title, true);
        }}
      />
      <PreviewGoogleDocModal
        docUrl={previewDocId ? previewUrlBuilder(previewDocId) : ''}
        close={() => {
          setPreviewDocId('');
        }}
      />
    </div>
  );
}
