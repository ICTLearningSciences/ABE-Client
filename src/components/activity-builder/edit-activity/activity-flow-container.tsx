/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React, { useState } from 'react';
import { Box, Tab, Tabs } from '@mui/material';
import {
  ActivityBuilderStepTypes,
  BuiltActivityVersion,
  PromptActivityStep,
} from '../types';
import { FlowStepsBuilderTab } from './flow-steps-builder-tab';
import { getPromptStepById } from '../helpers';
import { ColumnDiv } from '../../../styled-components';
import { PromptStepBuilder } from './step-builder/prompt-step-builder';
import { FlowErrors } from '../../../classes/activity-builder-activity/activity-step-error-checker';
import ErrorIcon from '@mui/icons-material/Error';
import { useEditActivityContext } from '../activity-builder-context';
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export interface StepVersion {
  step: ActivityBuilderStepTypes;
  versionTime: string;
}

export function ActivityFlowContainer(props: {
  globalStateKeys: string[];
  versions: BuiltActivityVersion[];
  disabled?: boolean;
  stepErrors: FlowErrors;
}): JSX.Element {
  const {
    versions,
    stepErrors,
    globalStateKeys,
    disabled,
  } = props;
  const { activity, updateStep, deleteStep } = useEditActivityContext();
  const flowsList = activity.flowsList;
  const allStepVersions: StepVersion[] = versions
    .flatMap((v) =>
      v.activity.flowsList.map((s) => {
        return {
          steps: s.steps,
          versionTime: v.versionTime,
        };
      })
    )
    .flatMap((f) =>
      f.steps.map((s) => ({ step: s, versionTime: f.versionTime }))
    );

  const [value, setValue] = useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const [previewPromptId, setPreviewPromptId] = React.useState<string>('');
  const previewPrompt: PromptActivityStep | undefined = getPromptStepById(
    previewPromptId,
    flowsList
  ) as PromptActivityStep;

  function getVersionsForStep(stepId: string): StepVersion[] {
    return allStepVersions.filter((v) => v.step.stepId === stepId);
  }

  function filterFlowName(name: string): string {
    return name.length > 20 ? name.substring(0, 20) + '...' : name;
  }

  const tabs = flowsList.map((flow, index) => {
    const flowContainsErrors =
      stepErrors[flow.clientId] &&
      Object.keys(stepErrors[flow.clientId]).length > 0;
    return (
      <Tab
        key={flow.clientId}
        icon={flowContainsErrors ? <ErrorIcon color="error" /> : undefined}
        label={filterFlowName(flow.name || `Flow ${index + 1}`)}
        {...a11yProps(index)}
      />
    );
  });

  const customTabPanels = flowsList.map((flow, index) => {
    return (
      <CustomTabPanel key={flow.clientId} value={value} index={index}>
        <FlowStepsBuilderTab
          stepsErrors={stepErrors[flow.clientId]}
          globalStateKeys={globalStateKeys}
          flow={flow}
          flowsList={flowsList}
          updateStep={updateStep}
          deleteStep={deleteStep}
          setPreviewPromptId={(id: string) => setPreviewPromptId(id)}
          getVersionsForStep={getVersionsForStep}
          disabled={disabled}
        />
      </CustomTabPanel>
    );
  });

  if (previewPrompt) {
    return (
      <ColumnDiv
        style={{
          alignItems: 'center',
          position: 'relative',
        }}
      >
        <PromptStepBuilder
          stepIndex={0}
          stepId={previewPrompt.stepId}
          deleteStep={deleteStep}
          flowsList={flowsList}
          previewed={true}
          startPreview={() => setPreviewPromptId(previewPrompt.stepId)}
          stopPreview={() => setPreviewPromptId('')}
          versions={getVersionsForStep(previewPrompt.stepId)}
          errors={[]}
        />
      </ColumnDiv>
    );
  }

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          width: '100%',
          maxWidth: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Tabs
          sx={{
            maxWidth: '98vw',
          }}
          centered
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
          variant={'scrollable'}
        >
          {tabs}
        </Tabs>
      </Box>
      {customTabPanels}
    </Box>
  );
}
