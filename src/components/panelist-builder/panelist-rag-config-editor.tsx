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
import { RagConfig } from '../../store/slices/panels/types';
import {
  CheckBoxInput,
  InputField,
} from '../activity-builder/shared/input-components';
import Collapse from '@mui/material/Collapse';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { IconButton } from '@mui/material';

interface PanelistRagConfigEditorProps {
  ragConfig: RagConfig;
  updateRagConfig: (ragConfig: RagConfig) => void;
}

export function PanelistRagConfigEditor(
  props: PanelistRagConfigEditorProps
): JSX.Element {
  const { ragConfig, updateRagConfig } = props;
  const [collapsed, setCollapsed] = React.useState<boolean>(true);

  // Convert string array to comma-separated string
  const arrayToCommaString = (arr?: string | string[]): string => {
    if (!arr) return '';
    if (typeof arr === 'string') return arr;
    return arr.join(', ');
  };

  // Convert comma-separated string to string array
  const commaStringToArray = (str: string): string[] | undefined => {
    const trimmed = str.trim();
    if (!trimmed) return undefined;
    return trimmed
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item);
  };

  const groupsIds = arrayToCommaString(ragConfig.ragMetadataFilter?.groups_ids);
  const agentIds = arrayToCommaString(ragConfig.ragMetadataFilter?.agent_ids);

  const handleEnableChange = (enabled: boolean) => {
    updateRagConfig({
      includeRag: enabled,
      ragMetadataFilter: enabled ? {} : {},
    });
  };

  const updateFilter = (
    filterKey: 'groups_ids' | 'agent_ids',
    value: string
  ) => {
    const arrayValue = commaStringToArray(value);
    const updatedFilters = { ...ragConfig.ragMetadataFilter };

    if (arrayValue && arrayValue.length > 0) {
      updatedFilters[filterKey] = arrayValue;
    } else {
      delete updatedFilters[filterKey];
    }

    updateRagConfig({
      ...ragConfig,
      ragMetadataFilter: updatedFilters,
    });
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        padding: '10px 0',
        border: '1px solid #ccc',
        borderRadius: '4px',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <IconButton
          size="small"
          onClick={() => setCollapsed(!collapsed)}
          style={{ padding: '4px' }}
        >
          {collapsed ? <ExpandMoreIcon /> : <ExpandLessIcon />}
        </IconButton>
        <h4 style={{ margin: 0 }}>RAG Configuration</h4>
      </div>

      <Collapse in={!collapsed}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            paddingTop: '10px',
          }}
        >
          <CheckBoxInput
            label="Include RAG"
            value={ragConfig.includeRag}
            onChange={handleEnableChange}
          />

          {ragConfig.includeRag && (
            <>
              <InputField
                label="Group IDs (comma-separated)"
                value={groupsIds}
                onChange={(value) => updateFilter('groups_ids', value)}
                width="100%"
              />

              <InputField
                label="Agent IDs (comma-separated)"
                value={agentIds}
                onChange={(value) => updateFilter('agent_ids', value)}
                width="100%"
              />
            </>
          )}
        </div>
      </Collapse>
    </div>
  );
}
