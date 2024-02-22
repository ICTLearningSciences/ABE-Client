/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React from 'react';
import { Button } from '@mui/material';
import { ColumnDiv, RowDivSB } from '../../styled-components';

export interface ViewAdminActionProps {
  returnToAdminActions: () => void;
  onSetPageToViewUserDocs: () => void;
  onSetPageToAuthorGoogleDocs: () => void;
}

function AdminActionItem(props: {
  title: string;
  onClick: () => void;
}): JSX.Element {
  const { title, onClick } = props;
  return (
    <RowDivSB
      style={{
        alignItems: 'center',
      }}
    >
      <h3>{title}</h3>
      <Button
        variant="outlined"
        onClick={onClick}
        style={{ height: 'fit-content' }}
      >
        Go
      </Button>
    </RowDivSB>
  );
}

export function ViewAdminActions(props: ViewAdminActionProps): JSX.Element {
  return (
    <ColumnDiv
      style={{
        width: '20%',
        borderBottom: '1px solid black',
        padding: '10px',
        alignItems: 'center',
      }}
    >
      <h3>Admin Actions</h3>
      <AdminActionItem
        title="View My Docs"
        onClick={props.onSetPageToViewUserDocs}
      />
      <AdminActionItem
        title="Author Google Docs"
        onClick={props.onSetPageToAuthorGoogleDocs}
      />
    </ColumnDiv>
  );
}
