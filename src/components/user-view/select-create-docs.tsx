/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React from 'react';
import { Button, CircularProgress } from '@mui/material';
import { UserDoc, NewDocData, SortConfig } from '../../types';
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
import { TwoOptionDialog } from '../dialog';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { GoogleDocItemRow } from './google-doc-item-row';

export default function SelectCreateDocs(props: {
  googleDocs?: UserDoc[];
  copyDocs?: UserDoc[];
  creationInProgress: boolean;
  handleCreateDoc: (
    docIdToCopy?: string,
    title?: string,
    isAdminDoc?: boolean,
    callback?: (newDocData: NewDocData) => void
  ) => void;
  handleDeleteDoc: (docId: string) => Promise<void>;
  onHistoryClicked: (docId: string) => void;
  goToDoc: (docId: string, newDoc?: boolean) => void;
  sx?: React.CSSProperties;
  setExampleDocsOpen: (open: boolean) => void;
  setSortBy: (config: SortConfig) => void;
  sortBy: SortConfig;
  archiveDoc: (googleDocId: string) => Promise<void>;
  unarchiveDoc: (googleDocId: string) => Promise<void>;
  docsLoading: boolean;
}): JSX.Element {
  const {
    googleDocs: _googleDocs,
    copyDocs,
    creationInProgress,
    handleCreateDoc,
    handleDeleteDoc,
    onHistoryClicked,
    goToDoc,
    archiveDoc,
    unarchiveDoc,
    sx,
    setExampleDocsOpen,
    setSortBy,
    sortBy,
    docsLoading,
  } = props;
  const archivedDocs = _googleDocs?.filter((doc) => doc.archived);
  const unarchivedDocs = _googleDocs?.filter((doc) => !doc.archived);
  const [viewingArchived, setViewingArchived] = React.useState(false);
  const googleDocs = viewingArchived ? archivedDocs : unarchivedDocs;
  const [docToDelete, setDocToDelete] = React.useState<UserDoc>();
  const [deleteInProgress, setDeleteInProgress] = React.useState(false);

  function SortIndicator(props: { field: string }) {
    const { field } = props;
    const isActive = sortBy.field === field;
    return sortBy.ascend ? (
      <KeyboardArrowUpIcon
        style={{
          opacity: isActive ? 1 : 0,
          position: 'absolute',
          right: 0,
        }}
      />
    ) : (
      <KeyboardArrowDownIcon
        style={{
          opacity: isActive ? 1 : 0,
          position: 'absolute',
          right: 0,
        }}
      />
    );
  }

  const handleSortClick = (field: string): void => {
    setSortBy({
      field,
      ascend: sortBy.field === field ? !sortBy.ascend : false,
    });
  };

  function googleDocsDisplay() {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
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
          {!viewingArchived && (
            <RowDiv
              style={{
                position: 'absolute',
                left: 0,
              }}
            >
              <Button
                onClick={() => {
                  handleCreateDoc(undefined, undefined, undefined, (data) => {
                    goToDoc(data.docId, true);
                  });
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
              {copyDocs && copyDocs.length > 0 && (
                <Button
                  onClick={() => {
                    setExampleDocsOpen(true);
                  }}
                  size="large"
                  variant="text"
                >
                  Examples
                </Button>
              )}
            </RowDiv>
          )}
          <h2>{viewingArchived ? 'Archived' : 'Your'} Docs</h2>
          <Button
            data-cy={`toggle-view-archived`}
            style={{
              position: 'absolute',
              right: 0,
            }}
            onClick={() => {
              setViewingArchived(!viewingArchived);
            }}
          >
            {viewingArchived ? 'View Active' : 'View Archived'}
          </Button>
        </RowDiv>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ width: '40%' }}>Title</TableCell>
                <TableCell
                  style={{ cursor: 'pointer', textAlign: 'center' }}
                  onClick={() => handleSortClick('createdAt')}
                >
                  <RowDiv
                    data-cy="created-at-header"
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      gap: '4px',
                      textAlign: 'center',
                      position: 'relative',
                    }}
                  >
                    <span style={{ textAlign: 'center' }}>Created At</span>
                    <SortIndicator field="createdAt" />
                  </RowDiv>
                </TableCell>
                <TableCell
                  style={{ cursor: 'pointer', textAlign: 'center' }}
                  onClick={() => handleSortClick('updatedAt')}
                >
                  <RowDiv
                    data-cy="updated-at-header"
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      gap: '4px',
                      position: 'relative',
                    }}
                  >
                    <span style={{ textAlign: 'center' }}>Updated At</span>
                    <SortIndicator field="updatedAt" />
                  </RowDiv>
                </TableCell>
                <TableCell style={{ width: '50px' }}></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {docsLoading && (
                <TableRow>
                  <TableCell colSpan={4} style={{ textAlign: 'center' }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              )}
              {googleDocs?.map((doc, index) => (
                <GoogleDocItemRow
                  key={index}
                  doc={doc}
                  index={index}
                  viewingArchived={viewingArchived}
                  onDoubleClick={() => {
                    goToDoc(doc.googleDocId);
                  }}
                  onHistoryClick={() => {
                    onHistoryClicked(doc.googleDocId);
                  }}
                  onArchiveClick={() => archiveDoc(doc.googleDocId)}
                  onUnarchiveClick={() => unarchiveDoc(doc.googleDocId)}
                  onDeleteClick={() => {
                    setDocToDelete(doc);
                  }}
                />
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
              handleDeleteDoc(docToDelete?.googleDocId || '').finally(() => {
                setDeleteInProgress(false);
                setDocToDelete(undefined);
              });
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
        Creating google doc, this could take a few seconds...
        <CircularProgress />
      </div>
    );
  }

  return (
    <div
      style={{
        // width: '60%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        ...sx,
      }}
    >
      {googleDocsDisplay()}
    </div>
  );
}
