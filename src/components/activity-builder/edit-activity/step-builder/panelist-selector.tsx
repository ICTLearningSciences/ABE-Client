/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved.
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React from 'react';
import { useWithPanels } from '../../../../store/slices/panels/use-with-panels';
import { useEditActivityContext } from '../../activity-builder-context';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Panelist } from '../../../../store/slices/panels/types';

interface PanelistSelectorProps {
  selectedPanelistClientIds: string[];
  onChange: (panelistClientIds: string[]) => void;
}

export function PanelistSelector(
  props: PanelistSelectorProps
): JSX.Element | null {
  const { selectedPanelistClientIds, onChange } = props;
  const { activity } = useEditActivityContext();
  const { panels, panelists } = useWithPanels();

  // If no panel is attached to the activity, don't render anything
  if (!activity.attachedPanel) {
    return null;
  }

  // Find the attached panel
  const attachedPanel = panels.find(
    (panel) => panel.clientId === activity.attachedPanel
  );

  // If panel not found or has no panelists, don't render
  if (!attachedPanel || !attachedPanel.panelists.length) {
    return null;
  }

  // Get the panelist data for each panelist in the panel
  const availablePanelists = attachedPanel.panelists.reduce(
    (acc: Panelist[], panelistClientId: string) => {
      const panelist = panelists.find((p) => p.clientId === panelistClientId);
      if (panelist) {
        acc.push(panelist);
      }
      return acc;
    },
    []
  );

  // If no valid panelists found, don't render
  if (availablePanelists.length === 0) {
    return null;
  }

  const handleTogglePanelist = (panelistClientId: string) => {
    const currentIds = selectedPanelistClientIds || [];
    const isCurrentlySelected = currentIds.includes(panelistClientId);

    if (isCurrentlySelected) {
      onChange(currentIds.filter((id) => id !== panelistClientId));
    } else {
      onChange([...currentIds, panelistClientId]);
    }
  };

  const selectedCount = selectedPanelistClientIds.length;
  const summaryText =
    selectedCount === 0
      ? 'Run for Panelists'
      : `Run for Panelists (${selectedCount} selected)`;

  return (
    <Accordion data-cy="panelist-selector">
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panelist-selector-content"
        id="panelist-selector-header"
      >
        <Typography>{summaryText}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <FormGroup>
          {availablePanelists.map((panelist: Panelist) => (
            <FormControlLabel
              key={panelist.clientId}
              control={
                <Checkbox
                  checked={selectedPanelistClientIds.includes(
                    panelist.clientId
                  )}
                  onChange={() => handleTogglePanelist(panelist.clientId)}
                  data-cy={`panelist-checkbox-${panelist.clientId}`}
                />
              }
              label={panelist.panelistName || panelist.clientId}
            />
          ))}
        </FormGroup>
      </AccordionDetails>
    </Accordion>
  );
}
