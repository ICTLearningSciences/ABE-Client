/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React, { useMemo } from 'react';
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
import { useAppSelector } from '../../store/hooks';
import {
  Assignment,
  isStudentData,
  StudentData,
} from '../../store/slices/education-management/types';
import { useWithEducationalManagement } from '../../store/slices/education-management/use-with-educational-management';
import { getStudentAssignmentDocs } from '../../helpers';

export default function SelectCreateDocs(props: {
  googleDocs?: UserDoc[];
  copyDocs?: UserDoc[];
  creationInProgress: boolean;
  handleCreateDoc: (
    docIdToCopy?: string,
    title?: string,
    isAdminDoc?: boolean,
    courseId?: string,
    courseAssignmentId?: string,
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
  const [docToDelete, setDocToDelete] = React.useState<UserDoc>();
  const [deleteInProgress, setDeleteInProgress] = React.useState(false);
  const [loadInProgress, setLoadInProgress] = React.useState(false);
  const { viewState, myData, studentActivityDocPrimaryStatusSet } =
    useWithEducationalManagement();
  const isStudent = myData
    ? Boolean(isStudentData(myData) && viewState.selectedActivityId)
    : false;
  const studentAssignmentDocs =
    isStudent && viewState.selectedAssignmentId
      ? getStudentAssignmentDocs(
          myData as StudentData,
          viewState.selectedAssignmentId
        )
      : [];
  const primaryDocId = studentAssignmentDocs.find((d) => d.primaryDocument)
    ?.docId;
  const assignments = useAppSelector(
    (state) => state.educationManagement.assignments
  );
  const googleDocs = getDisplayedDocs(
    archivedDocs || [],
    unarchivedDocs || [],
    viewingArchived,
    viewState.selectedAssignmentId
  );
  const title = useMemo(
    () =>
      getTitle(assignments, viewingArchived, viewState.selectedAssignmentId),
    [assignments, viewingArchived, viewState.selectedAssignmentId]
  );

  function getDisplayedDocs(
    archivedDocs: UserDoc[],
    unarchivedDocs: UserDoc[],
    viewingArchived: boolean,
    courseAssignmentId?: string
  ): UserDoc[] {
    if (courseAssignmentId) {
      return viewingArchived
        ? archivedDocs.filter(
            (doc) => doc.courseAssignmentId === courseAssignmentId
          )
        : unarchivedDocs.filter(
            (doc) => doc.courseAssignmentId === courseAssignmentId
          );
    }
    return viewingArchived ? archivedDocs : unarchivedDocs;
  }

  function getTitle(
    assignments: Assignment[],
    viewingArchived: boolean,
    courseAssignmentId?: string
  ): string {
    if (!courseAssignmentId) {
      return viewingArchived ? 'Archived Docs' : 'Your Docs';
    }
    const assignment = assignments.find(
      (assignment) => assignment._id === courseAssignmentId
    );
    return viewingArchived
      ? 'Archived Docs'
      : `Assignment Docs: ${assignment?.title || 'Assignment'}`;
  }

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
        {/* Header */}
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
                width: '20%',
                gap: '10px',
              }}
            >
              <Button
                data-cy="create-doc-button"
                onClick={() => {
                  handleCreateDoc(
                    undefined,
                    undefined,
                    undefined,
                    viewState.selectedCourseId,
                    viewState.selectedAssignmentId,
                    (data) => {
                      goToDoc(data.docId, true);
                    }
                  );
                }}
                size="small"
                style={{
                  fontWeight: 'bold',
                }}
                variant="contained"
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
          <h2 style={{ width: '60%', textAlign: 'center' }}>{title}</h2>
          <Button
            style={{ width: '20%' }}
            data-cy={`toggle-view-archived`}
            onClick={() => {
              setViewingArchived(!viewingArchived);
            }}
          >
            {viewingArchived ? 'View Active' : 'View Archived'}
          </Button>
        </RowDiv>

        {/* Table */}
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
                {isStudent && (
                  <TableCell style={{ width: '50px' }}>
                    Main Document?
                  </TableCell>
                )}
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
                  onPrimaryDocSet={async () => {
                    setLoadInProgress(true);
                    try {
                      await studentActivityDocPrimaryStatusSet(doc.googleDocId);
                    } finally {
                      setLoadInProgress(false);
                    }
                  }}
                  loadInProgress={loadInProgress}
                  isPrimaryDoc={doc.googleDocId === primaryDocId}
                  isStudent={isStudent}
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
