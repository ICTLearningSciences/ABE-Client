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
import { Button, TextField } from '@mui/material';
import { RagStoreConfigurationEditor } from '../activity-builder/edit-activity/step-builder/rag-store-configuration-editor';

export function EditPanelist(props: {
  panelist: Panelist;
  onSave: (panelist: Panelist) => void;
  onCancel: () => void;
}): JSX.Element {
  const { panelist, onSave, onCancel } = props;
  const [editedPanelist, setEditedPanelist] =
    React.useState<Panelist>(panelist);

  const updateField = (field: keyof Panelist, value: string) => {
    setEditedPanelist({
      ...editedPanelist,
      [field]: value,
    });
  };

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
      <ColumnDiv style={{ width: '90%', maxWidth: '800px', gap: '20px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <h2>Edit Panelist</h2>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Button variant="outlined" onClick={onCancel}>
              Cancel
            </Button>
            <Button variant="contained" onClick={() => onSave(editedPanelist)}>
              Save
            </Button>
          </div>
        </div>

        <TextField
          label="Panelist Name"
          value={editedPanelist.panelistName}
          onChange={(e) => updateField('panelistName', e.target.value)}
          fullWidth
        />

        <TextField
          label="Panelist Description"
          value={editedPanelist.panelistDescription}
          onChange={(e) => updateField('panelistDescription', e.target.value)}
          fullWidth
          multiline
          rows={3}
        />

        <TextField
          label="Role Segment"
          value={editedPanelist.roleSegment}
          onChange={(e) => updateField('roleSegment', e.target.value)}
          fullWidth
          multiline
          rows={3}
        />

        <TextField
          label="Prompt Segment"
          value={editedPanelist.promptSegment}
          onChange={(e) => updateField('promptSegment', e.target.value)}
          fullWidth
          multiline
          rows={4}
        />

        <TextField
          label="Introduction Message"
          value={editedPanelist.introductionMessage}
          onChange={(e) => updateField('introductionMessage', e.target.value)}
          fullWidth
          multiline
          rows={3}
        />

        <TextField
          label="Profile Picture URL"
          value={editedPanelist.profilePicture}
          onChange={(e) => updateField('profilePicture', e.target.value)}
          fullWidth
        />

        <RagStoreConfigurationEditor
          ragConfiguration={editedPanelist.ragConfig}
          updateRagConfiguration={(updater) => {
            setEditedPanelist((prev) => {
              const newConfig =
                typeof updater === 'function'
                  ? updater(prev.ragConfig)
                  : updater;
              return {
                ...prev,
                ragConfig: newConfig,
              };
            });
          }}
        />
      </ColumnDiv>
    </ColumnDiv>
  );
}
