/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved.
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React from 'react';
import { Panelist } from '../../store/slices/panels/types';
import { ColumnDiv } from '../../styled-components';
import { Button, Card, CardContent, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

function PanelistItem(props: {
  panelist: Panelist;
  onSelect: () => void;
  onDelete: () => void;
}): JSX.Element {
  const { panelist, onSelect, onDelete } = props;

  return (
    <Card
      style={{
        width: '100%',
        cursor: 'pointer',
        marginBottom: '10px',
      }}
      onClick={onSelect}
    >
      <CardContent
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <h3 style={{ margin: 0 }}>
            {panelist.panelistName || 'Untitled Panelist'}
          </h3>
          {panelist.panelistDescription && (
            <p style={{ margin: '5px 0 0 0', color: '#666' }}>
              {panelist.panelistDescription}
            </p>
          )}
        </div>
        <IconButton
          color="error"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <DeleteIcon />
        </IconButton>
      </CardContent>
    </Card>
  );
}

export function SelectCreatePanelist(props: {
  panelists: Panelist[];
  onSelectPanelist: (panelist: Panelist) => void;
  onCreatePanelist: () => void;
  onDeletePanelist: (panelistClientId: string) => void;
}): JSX.Element {
  const { panelists, onSelectPanelist, onCreatePanelist, onDeletePanelist } =
    props;

  return (
    <ColumnDiv
      style={{
        width: '100%',
        height: '100%',
        alignItems: 'center',
        overflow: 'auto',
        padding: '20px',
      }}
    >
      <ColumnDiv style={{ width: '90%', maxWidth: '800px' }}>
        <h2>Panelists</h2>

        {panelists.length === 0 && <p>No panelists found</p>}

        {panelists.map((panelist) => (
          <PanelistItem
            key={panelist.clientId}
            panelist={panelist}
            onSelect={() => onSelectPanelist(panelist)}
            onDelete={() => onDeletePanelist(panelist.clientId)}
          />
        ))}

        <Button
          variant="outlined"
          style={{
            marginTop: '20px',
            width: 'fit-content',
            alignSelf: 'center',
          }}
          onClick={onCreatePanelist}
        >
          + Create New Panelist
        </Button>
      </ColumnDiv>
    </ColumnDiv>
  );
}
