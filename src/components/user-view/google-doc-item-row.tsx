/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React from 'react';
import {
  IconButton,
  Tooltip,
  TableCell,
  CircularProgress,
} from '@mui/material';
import { UserDoc } from '../../types';
import { RowDiv } from '../../styled-components';
import DescriptionIcon from '@mui/icons-material/Description';
import { Delete } from '@mui/icons-material';
import RestoreIcon from '@mui/icons-material/Restore';
import ArchiveIcon from '@mui/icons-material/Archive';
import UnarchiveIcon from '@mui/icons-material/Unarchive';
import { formatISODateToReadable } from '../../helpers';
import {
  GoogleDocItemName,
  StyledGoogleDocItemRow,
} from './select-create-docs-styles';

interface GoogleDocItemRowProps {
  doc: UserDoc;
  index: number;
  viewingArchived: boolean;
  onDoubleClick: () => void;
  onHistoryClick: () => void;
  onArchiveClick: () => Promise<void>;
  onUnarchiveClick: () => Promise<void>;
  onDeleteClick: () => void;
}

export function GoogleDocItemRow({
  doc,
  index,
  viewingArchived,
  onDoubleClick,
  onHistoryClick,
  onArchiveClick,
  onUnarchiveClick,
  onDeleteClick,
}: GoogleDocItemRowProps): JSX.Element {
  const [archivingInProgress, setArchivingInProgress] = React.useState(false);

  const handleArchiveClick = async () => {
    setArchivingInProgress(true);
    try {
      await onArchiveClick();
    } finally {
      setArchivingInProgress(false);
    }
  };

  const handleUnarchiveClick = async () => {
    setArchivingInProgress(true);
    try {
      await onUnarchiveClick();
    } finally {
      setArchivingInProgress(false);
    }
  };

  return (
    <StyledGoogleDocItemRow key={index} onDoubleClick={onDoubleClick}>
      <TableCell>
        <RowDiv
          data-cy={`doc-list-item-${index}`}
          style={{
            opacity: doc.archived ? 0.5 : 1,
          }}
        >
          <DescriptionIcon />
          <GoogleDocItemName
            data-cy={`doc-list-item-${doc.title.replaceAll(' ', '-')}`}
            onClick={onDoubleClick}
          >
            {doc.title || 'My Document'}
          </GoogleDocItemName>
        </RowDiv>
      </TableCell>
      <TableCell style={{ textAlign: 'center' }}>
        {formatISODateToReadable(doc.createdAt)}
      </TableCell>
      <TableCell style={{ textAlign: 'center' }}>
        {formatISODateToReadable(doc.updatedAt)}
      </TableCell>
      <TableCell
        style={{
          display: 'flex',
          gap: '8px',
        }}
      >
        {!viewingArchived && (
          <RowDiv style={{ gap: '8px' }}>
            <Tooltip title="View History">
              <IconButton onClick={onHistoryClick}>
                <RestoreIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Archive">
              <IconButton
                disabled={archivingInProgress}
                data-cy={`archive-doc-${doc.title.replaceAll(' ', '-')}`}
                onClick={handleArchiveClick}
              >
                {archivingInProgress ? (
                  <CircularProgress size={20} />
                ) : (
                  <ArchiveIcon />
                )}
              </IconButton>
            </Tooltip>
          </RowDiv>
        )}
        {viewingArchived && (
          <RowDiv style={{ gap: '8px' }}>
            <Tooltip title="Unarchive">
              <IconButton
                disabled={archivingInProgress}
                data-cy={`unarchive-doc-${doc.title.replaceAll(' ', '-')}`}
                onClick={handleUnarchiveClick}
              >
                {archivingInProgress ? (
                  <CircularProgress size={20} />
                ) : (
                  <UnarchiveIcon />
                )}
              </IconButton>
            </Tooltip>

            <Tooltip title="Delete">
              <IconButton
                data-cy={`delete-doc-${doc.title.replaceAll(' ', '-')}`}
                onClick={onDeleteClick}
              >
                <Delete />
              </IconButton>
            </Tooltip>
          </RowDiv>
        )}
      </TableCell>
    </StyledGoogleDocItemRow>
  );
}
