/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React from 'react';
import { Button, CircularProgress, IconButton } from '@mui/material';
import { GoogleDoc } from '../../types';
import ExampleGoogleDocModal from './example-google-docs-modal';
import { RowDiv } from '../../styled-components';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { formatISODateToReadable } from '../../helpers';
import DescriptionIcon from '@mui/icons-material/Description';
import { Delete } from '@mui/icons-material';
import './select-create-docs.css';
import { useNavigate } from 'react-router-dom';
import RestoreIcon from '@mui/icons-material/Restore';
import { TwoOptionDialog } from '../dialog';

export default function SelectCreateDocs(props: {
  googleDocs?: GoogleDoc[];
  copyGoogleDocs?: GoogleDoc[];
  creationInProgress: boolean;
  handleCreateGoogleDoc: (
    docIdToCopy?: string,
    title?: string,
    isAdminDoc?: boolean
  ) => void;
  handleDeleteGoogleDoc: (docId: string) => Promise<void>;
}): JSX.Element {
  const {
    googleDocs,
    copyGoogleDocs,
    creationInProgress,
    handleCreateGoogleDoc,
    handleDeleteGoogleDoc,
  } = props;
  const [createDocOpen, setCreateDocOpen] = React.useState(false);
  const [deleteInProgress, setDeleteInProgress] = React.useState(false);
  const [docToDelete, setDocToDelete] = React.useState<GoogleDoc>();
  const navigate = useNavigate();

  function onHistoryClicked(docId: string) {
    navigate(`/docs/history/${docId}`);
  }

  function googleDocsDisplay() {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          // overflowY: 'auto',
        }}
      >
        <RowDiv
          style={{
            position: 'relative',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <RowDiv
            style={{
              position: 'absolute',
              left: 0,
            }}
          >
            <Button
              onClick={() => {
                handleCreateGoogleDoc();
              }}
              size="large"
              style={{
                fontWeight: 'bold',
                marginRight: '10px',
              }}
              variant="outlined"
            >
              + New
            </Button>
            <Button
              onClick={() => {
                setCreateDocOpen(true);
              }}
              size="large"
              variant="text"
            >
              Examples
            </Button>
          </RowDiv>
          <h2>Your Docs</h2>
        </RowDiv>
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ height: '0px', padding: 0, margin: 0 }}>
              <TableRow>
                <TableCell style={{ width: '66%', padding: 0 }}></TableCell>
                <TableCell style={{ padding: 0 }}></TableCell>
                <TableCell style={{ padding: 0 }}></TableCell>
                <TableCell style={{ padding: 0 }}></TableCell>
                {/* Empty cells for delete/history buttons */}
              </TableRow>
            </TableHead>

            <TableBody>
              {googleDocs?.map((doc, index) => (
                <TableRow
                  key={index}
                  className="google-doc-item-row"
                  onDoubleClick={() => {
                    navigate(`/docs/${doc.googleDocId}`);
                  }}
                >
                  <TableCell>
                    <RowDiv>
                      <DescriptionIcon />
                      <span
                        className="google-doc-item-name"
                        data-cy={`doc-list-item-${doc.title.replaceAll(
                          ' ',
                          '-'
                        )}`}
                        onClick={() => {
                          navigate(`/docs/${doc.googleDocId}`);
                        }}
                      >
                        {doc.title || 'My Document'}
                      </span>
                    </RowDiv>
                  </TableCell>
                  <TableCell>
                    {formatISODateToReadable(doc.createdAt)}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => {
                        onHistoryClicked(doc.googleDocId);
                      }}
                    >
                      <RestoreIcon />
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    <IconButton
                      data-cy={`delete-doc-${doc.title.replaceAll(' ', '-')}`}
                      onClick={() => {
                        setDocToDelete(doc);
                      }}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TwoOptionDialog
          title={`Are you sure you want to delete the document "${
            docToDelete?.title || 'My Document'
          }"?`}
          actionInProgress={deleteInProgress}
          open={Boolean(docToDelete)}
          option1={{
            display: 'Delete',
            onClick: () => {
              setDeleteInProgress(true);
              handleDeleteGoogleDoc(docToDelete?.googleDocId || '').finally(
                () => {
                  setDeleteInProgress(false);
                  setDocToDelete(undefined);
                }
              );
            },
          }}
          option2={{
            display: 'Cancel',
            onClick: () => {
              setDocToDelete(undefined);
            },
          }}
        />
      </div>
    );
  }

  if (creationInProgress) {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress />
      </div>
    );
  }

  return (
    <div
      style={{
        width: '60%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
      }}
    >
      {googleDocsDisplay()}
      <ExampleGoogleDocModal
        open={createDocOpen}
        close={() => {
          setCreateDocOpen(false);
        }}
        adminDocs={copyGoogleDocs}
        onCreateDoc={handleCreateGoogleDoc}
      />
    </div>
  );
}
