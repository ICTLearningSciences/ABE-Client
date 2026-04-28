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
import { Panel, Panelist } from '../../store/slices/panels/types';
import { ColumnDiv } from '../../styled-components';
import {
  Button,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  IconButton,
  Card,
  CardContent,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { PanelistRagConfigEditor } from '../panelist-builder/panelist-rag-config-editor';

export function EditPanel(props: {
  panel: Panel;
  panelists: Panelist[];
  onSave: (panel: Panel) => void;
  onCancel: () => void;
}): JSX.Element {
  const { panel, panelists, onSave, onCancel } = props;
  const [editedPanel, setEditedPanel] = React.useState<Panel>(panel);

  const updateField = (field: keyof Panel, value: string) => {
    setEditedPanel({
      ...editedPanel,
      [field]: value,
    });
  };

  const addPanelist = (panelistClientId: string) => {
    if (!editedPanel.panelists.includes(panelistClientId)) {
      setEditedPanel({
        ...editedPanel,
        panelists: [...editedPanel.panelists, panelistClientId],
      });
    }
  };

  const removePanelist = (panelistClientId: string) => {
    setEditedPanel({
      ...editedPanel,
      panelists: editedPanel.panelists.filter((id) => id !== panelistClientId),
    });
  };

  const availablePanelists = panelists.filter(
    (panelist) => !editedPanel.panelists.includes(panelist.clientId)
  );

  const getPanelistName = (clientId: string): string => {
    const panelist = panelists.find((p) => p.clientId === clientId);
    return panelist?.panelistName || 'Unknown Panelist';
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
          <h2>Edit Panel</h2>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Button variant="outlined" onClick={onCancel}>
              Cancel
            </Button>
            <Button variant="contained" onClick={() => onSave(editedPanel)}>
              Save
            </Button>
          </div>
        </div>

        <TextField
          label="Panel Name"
          value={editedPanel.panelName}
          onChange={(e) => updateField('panelName', e.target.value)}
          fullWidth
        />

        <TextField
          label="Panel Description"
          value={editedPanel.panelDescription}
          onChange={(e) => updateField('panelDescription', e.target.value)}
          fullWidth
          multiline
          rows={3}
        />

        <div>
          <h3>Panelists in this Panel</h3>
          {editedPanel.panelists.length === 0 && (
            <p style={{ color: '#666' }}>No panelists added yet</p>
          )}
          {editedPanel.panelists.map((panelistId) => (
            <Card key={panelistId} style={{ marginBottom: '10px' }}>
              <CardContent
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 16px',
                }}
              >
                <span>{getPanelistName(panelistId)}</span>
                <IconButton
                  color="error"
                  size="small"
                  onClick={() => removePanelist(panelistId)}
                >
                  <DeleteIcon />
                </IconButton>
              </CardContent>
            </Card>
          ))}

          {availablePanelists.length > 0 && (
            <FormControl fullWidth style={{ marginTop: '10px' }}>
              <InputLabel>Add Panelist</InputLabel>
              <Select
                value=""
                label="Add Panelist"
                onChange={(e) => addPanelist(e.target.value as string)}
              >
                {availablePanelists.map((panelist) => (
                  <MenuItem key={panelist.clientId} value={panelist.clientId}>
                    {panelist.panelistName || 'Untitled Panelist'}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </div>

        <PanelistRagConfigEditor
          ragConfig={editedPanel.ragConfig}
          updateRagConfig={(ragConfig) => {
            setEditedPanel({
              ...editedPanel,
              ragConfig,
            });
          }}
        />
      </ColumnDiv>
    </ColumnDiv>
  );
}
