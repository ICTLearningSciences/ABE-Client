/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved.
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React from 'react';
import { RagStoreConfiguration } from '../../../../types';
import { CheckBoxInput, InputField } from '../../shared/input-components';
import Collapse from '@mui/material/Collapse';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { IconButton } from '@mui/material';

type RagConfigurationUpdater =
  | RagStoreConfiguration
  | undefined
  | ((prev?: RagStoreConfiguration) => RagStoreConfiguration | undefined);

interface RagStoreConfigurationEditorProps {
  ragConfiguration?: RagStoreConfiguration;
  updateRagConfiguration: (updater: RagConfigurationUpdater) => void;
}

export function RagStoreConfigurationEditor(
  props: RagStoreConfigurationEditorProps
): JSX.Element {
  const { ragConfiguration, updateRagConfiguration } = props;
  const [collapsed, setCollapsed] = React.useState<boolean>(true);
  const [errors, setErrors] = React.useState<{
    topN?: string;
    ragQuery?: string;
  }>({});

  const isEnabled = Boolean(ragConfiguration);

  // Convert string array to comma-separated string
  const arrayToCommaString = (arr?: string[]): string => {
    return arr?.join(', ') || '';
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

  const groupsIds = arrayToCommaString(
    ragConfiguration?.filters?.groups_ids as string[] | undefined
  );
  const agentIds = arrayToCommaString(
    ragConfiguration?.filters?.agent_ids as string[] | undefined
  );

  const validateFields = (config: RagStoreConfiguration): boolean => {
    const newErrors: { topN?: string; ragQuery?: string } = {};
    let isValid = true;

    if (!config.ragQuery || config.ragQuery.trim() === '') {
      newErrors.ragQuery = 'Query is required when RAG is enabled';
      isValid = false;
    }

    if (config.topN === undefined || config.topN === null || config.topN <= 0) {
      newErrors.topN = 'Top N must be a positive number';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleEnableChange = (enabled: boolean) => {
    if (enabled) {
      const newConfig: RagStoreConfiguration = {
        ragQuery: '',
        topN: 3,
        filters: {},
      };
      updateRagConfiguration(() => newConfig);
      validateFields(newConfig);
    } else {
      updateRagConfiguration(() => undefined);
      setErrors({});
    }
  };

  const updateField = (
    field: keyof RagStoreConfiguration,
    value: string | number
  ) => {
    updateRagConfiguration((prevConfig) => {
      if (!prevConfig) return prevConfig;

      const updatedConfig = {
        ...prevConfig,
        [field]: value,
      };
      validateFields(updatedConfig);
      return updatedConfig;
    });
  };

  const updateFilter = (
    filterKey: 'groups_ids' | 'agent_ids',
    value: string
  ) => {
    updateRagConfiguration((prevConfig) => {
      if (!prevConfig) return prevConfig;

      const arrayValue = commaStringToArray(value);
      const updatedFilters = { ...prevConfig.filters };

      if (arrayValue && arrayValue.length > 0) {
        updatedFilters[filterKey] = arrayValue;
      } else {
        delete updatedFilters[filterKey];
      }

      const updatedConfig = {
        ...prevConfig,
        filters: updatedFilters,
      };
      validateFields(updatedConfig);
      return updatedConfig;
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
            label="Enable RAG"
            value={isEnabled}
            onChange={handleEnableChange}
          />

          {isEnabled && ragConfiguration && (
            <>
              <div>
                <InputField
                  label="Query"
                  value={ragConfiguration.ragQuery}
                  onChange={(value) => updateField('ragQuery', value)}
                  width="100%"
                />
                {errors.ragQuery && (
                  <span
                    style={{
                      color: 'red',
                      fontSize: '12px',
                      marginLeft: '8px',
                    }}
                  >
                    {errors.ragQuery}
                  </span>
                )}
              </div>

              <div>
                <InputField
                  label="Top N"
                  value={ragConfiguration.topN?.toString() || '0'}
                  onChange={(value) => {
                    const numValue = parseInt(value, 10);
                    if (!isNaN(numValue)) {
                      updateField('topN', numValue);
                    }
                  }}
                  width="100%"
                />
                {errors.topN && (
                  <span
                    style={{
                      color: 'red',
                      fontSize: '12px',
                      marginLeft: '8px',
                    }}
                  >
                    {errors.topN}
                  </span>
                )}
              </div>

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
