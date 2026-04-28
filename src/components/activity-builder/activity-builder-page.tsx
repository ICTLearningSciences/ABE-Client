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
import { SelectCreateActivity } from './select-create-activity';
import { EditActivity } from './edit-activity/edit-activity';
import { ActivityBuilder } from './types';
import { ActivityBuilderProvider } from './activity-builder-context';
import { BuiltActivityVersion } from './types';
import { AiPromptStep } from '../../types';
import { AiServicesResponseTypes } from '../../ai-services/ai-service-types';
import { Tabs, Tab, Box } from '@mui/material';
import { Panel, Panelist } from '../../store/slices/panels/types';
import { SelectCreatePanelist } from '../panelist-builder/select-create-panelist';
import { EditPanelist } from '../panelist-builder/edit-panelist';
import { SelectCreatePanel } from '../panel-builder/select-create-panel';
import { EditPanel } from '../panel-builder/edit-panel';

type BuilderTab = 'ACTIVITY_BUILDER' | 'PANELIST_BUILDER' | 'PANEL_BUILDER';

export function ActivityBuilderPage(props: {
  goToActivity: (activity: ActivityBuilder) => void;
  curActivity?: ActivityBuilder;
  builtActivities: ActivityBuilder[];
  isActivityEducationReady: (activityId: string) => boolean;
  addOrUpdateBuiltActivity: (
    activity: ActivityBuilder
  ) => Promise<ActivityBuilder>;
  addNewLocalBuiltActivity: () => ActivityBuilder;
  copyBuiltActivity: (activityId: string) => Promise<ActivityBuilder>;
  deleteBuiltActivity: (activityId: string) => Promise<void>;
  userId?: string;
  canEditActivity: (activity: ActivityBuilder) => boolean;
  canDeleteActivity: (activity: ActivityBuilder) => boolean;
  activityVersions: Record<string, BuiltActivityVersion[]>;
  loadActivityVersions: (
    activityClientId: string
  ) => Promise<BuiltActivityVersion[]>;
  executePromptSteps: (
    aiPromptSteps: AiPromptStep[],
    callback?: (response: AiServicesResponseTypes) => void
  ) => Promise<AiServicesResponseTypes>;
  // Panel/Panelist props
  panels: Panel[];
  panelists: Panelist[];
  addOrUpdatePanel: (panel: Panel) => void;
  addOrUpdatePanelist: (panelist: Panelist) => void;
  addNewLocalPanel: () => Panel;
  addNewLocalPanelist: () => Panelist;
  deletePanel: (panelClientId: string) => void;
  deletePanelist: (panelistClientId: string) => void;
}): JSX.Element {
  const {
    goToActivity,
    curActivity,
    builtActivities,
    isActivityEducationReady,
    addOrUpdateBuiltActivity,
    addNewLocalBuiltActivity,
    copyBuiltActivity,
    deleteBuiltActivity,
    activityVersions,
    loadActivityVersions,
    executePromptSteps,
    panels,
    panelists,
    addOrUpdatePanel,
    addOrUpdatePanelist,
    addNewLocalPanel,
    addNewLocalPanelist,
    deletePanel,
    deletePanelist,
  } = props;

  const [selectedTab, setSelectedTab] =
    React.useState<BuilderTab>('ACTIVITY_BUILDER');
  const [selectedActivityClientId, setSelectedActivityClientId] =
    React.useState<string>(curActivity?.clientId || '');
  const [selectedPanelistClientId, setSelectedPanelistClientId] =
    React.useState<string>('');
  const [selectedPanelClientId, setSelectedPanelClientId] =
    React.useState<string>('');

  const selectedActivity = builtActivities.find(
    (activity) => activity.clientId === selectedActivityClientId
  );
  const selectedPanelist = panelists.find(
    (panelist) => panelist.clientId === selectedPanelistClientId
  );
  const selectedPanel = panels.find(
    (panel) => panel.clientId === selectedPanelClientId
  );

  const renderContent = () => {
    // Activity Builder Tab
    if (selectedTab === 'ACTIVITY_BUILDER') {
      if (!selectedActivity) {
        return (
          <ActivityBuilderProvider
            userId={props.userId}
            canEditActivity={props.canEditActivity}
            canDeleteActivity={props.canDeleteActivity}
            activityVersions={activityVersions}
            loadActivityVersions={loadActivityVersions}
            executePromptSteps={executePromptSteps}
          >
            <SelectCreateActivity
              copyActivity={copyBuiltActivity}
              goToActivity={goToActivity}
              builtActivities={builtActivities}
              isActivityEducationReady={isActivityEducationReady}
              onEditActivity={(activity) => {
                setSelectedActivityClientId(activity.clientId);
              }}
              onCreateActivity={() => {
                const newActivity = addNewLocalBuiltActivity();
                setSelectedActivityClientId(newActivity.clientId);
              }}
              deleteBuiltActivity={deleteBuiltActivity}
            />
          </ActivityBuilderProvider>
        );
      } else {
        return (
          <ActivityBuilderProvider
            userId={props.userId}
            canEditActivity={props.canEditActivity}
            canDeleteActivity={props.canDeleteActivity}
            activityVersions={activityVersions}
            loadActivityVersions={loadActivityVersions}
            executePromptSteps={executePromptSteps}
          >
            <EditActivity
              returnTo={() => {
                setSelectedActivityClientId('');
              }}
              goToActivity={goToActivity}
              activity={selectedActivity}
              saveActivity={async (activity) => {
                return await addOrUpdateBuiltActivity(activity);
              }}
            />
          </ActivityBuilderProvider>
        );
      }
    }

    // Panelist Builder Tab
    if (selectedTab === 'PANELIST_BUILDER') {
      if (!selectedPanelist) {
        return (
          <SelectCreatePanelist
            panelists={panelists}
            onSelectPanelist={(panelist) => {
              setSelectedPanelistClientId(panelist.clientId);
            }}
            onCreatePanelist={() => {
              const newPanelist = addNewLocalPanelist();
              setSelectedPanelistClientId(newPanelist.clientId);
            }}
            onDeletePanelist={deletePanelist}
          />
        );
      } else {
        return (
          <EditPanelist
            panelist={selectedPanelist}
            onSave={(panelist) => {
              addOrUpdatePanelist(panelist);
              setSelectedPanelistClientId('');
            }}
            onCancel={() => {
              setSelectedPanelistClientId('');
            }}
          />
        );
      }
    }

    // Panel Builder Tab
    if (selectedTab === 'PANEL_BUILDER') {
      if (!selectedPanel) {
        return (
          <SelectCreatePanel
            panels={panels}
            onSelectPanel={(panel) => {
              setSelectedPanelClientId(panel.clientId);
            }}
            onCreatePanel={() => {
              const newPanel = addNewLocalPanel();
              setSelectedPanelClientId(newPanel.clientId);
            }}
            onDeletePanel={deletePanel}
          />
        );
      } else {
        return (
          <EditPanel
            panel={selectedPanel}
            panelists={panelists}
            onSave={(panel) => {
              addOrUpdatePanel(panel);
              setSelectedPanelClientId('');
            }}
            onCancel={() => {
              setSelectedPanelClientId('');
            }}
          />
        );
      }
    }

    return null;
  };

  return (
    <Box
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Tabs
        value={selectedTab}
        onChange={(_, newValue) => {
          setSelectedTab(newValue as BuilderTab);
          // Clear selections when switching tabs
          setSelectedActivityClientId('');
          setSelectedPanelistClientId('');
          setSelectedPanelClientId('');
        }}
        centered
      >
        <Tab label="Activity Builder" value="ACTIVITY_BUILDER" />
        <Tab label="Panelist Builder" value="PANELIST_BUILDER" />
        <Tab label="Panel Builder" value="PANEL_BUILDER" />
      </Tabs>
      <Box style={{ flexGrow: 1, overflow: 'auto' }}>{renderContent()}</Box>
    </Box>
  );
}
