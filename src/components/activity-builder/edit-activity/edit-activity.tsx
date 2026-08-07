/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/

import React, { useEffect, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";
import { Button, CircularProgress, IconButton } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";

import type {
  ActivityBuilder as ActivityBuilderType,
  ActivityBuilderVisibility,
} from "../types";
import { ActivityFlowContainer } from "./activity-flow-container";
import { ColumnDiv, RowDiv } from "../../../styled-components";
import { InputField, SelectInputField } from "../shared/input-components";
import { equals } from "../../../helpers";
import { isActivityRunnable, useActivityBuilderContext } from "../helpers";
import {
  DOC_NUM_WORDS_KEY,
  DOC_TEXT_KEY,
} from "../../../classes/activity-builder-activity/built-activity-handler";
import { useWithCheckActivityErrors } from "../../../hooks/use-with-check-activity-errors";
import {
  EditActivityProvider,
  useEditActivityContext,
} from "../activity-builder-context";
import { useWithPanels } from "../../../store/slices/panels/use-with-panels";
import { useAppSelector } from "../../../store/hooks";

// Inner component that uses the context
function EditActivityContent(props: {
  goToActivity: (activity: ActivityBuilderType) => void;
  originalActivity: ActivityBuilderType;
  saveActivity: (activity: ActivityBuilderType) => Promise<ActivityBuilderType>;
  returnTo: () => void;
}): React.ReactNode {
  const {
    originalActivity,
    saveActivity: _saveActivity,
    goToActivity,
    returnTo,
  } = props;

  const {
    activity,
    addFlow,
    updateTitle,
    updateDescription,
    updateVisibility,
    updateAttachedPanel,
  } = useEditActivityContext();
  const [saveInProgress, setSaveInProgress] = React.useState<boolean>(false);
  const { activityVersions, loadActivityVersions } =
    useActivityBuilderContext();
  const { panels } = useWithPanels();

  const globalStateKeys: string[] = useMemo(() => {
    return activity.flowsList.reduce(
      (acc, flow) => {
        const stateKeysForFlow = flow.steps.reduce((acc, step) => {
          if (step.stepType === "REQUEST_USER_INPUT") {
            if (step.saveResponseVariableName) {
              acc.push(step.saveResponseVariableName);
            }
          }
          if (step.stepType === "PROMPT") {
            const jsonKeys = step.promptConfigurations.flatMap(
              (d) => d.jsonResponseData?.map((d) => d.name) || [],
            );
            acc.push(...jsonKeys);
          }
          return acc;
        }, [] as string[]);
        acc.push(...stateKeysForFlow);
        return acc;
      },
      [DOC_TEXT_KEY, DOC_NUM_WORDS_KEY] as string[],
    );
  }, [activity.flowsList]);

  const { errors } = useWithCheckActivityErrors(globalStateKeys, activity);

  useEffect(() => {
    const alreadyLoaded = Boolean(
      originalActivity.clientId in activityVersions,
    );
    if (originalActivity.clientId && !alreadyLoaded) {
      loadActivityVersions(originalActivity.clientId);
    }
  }, [originalActivity.clientId, activityVersions, loadActivityVersions]);

  async function saveActivity() {
    setSaveInProgress(true);
    try {
      await _saveActivity(activity);
    } catch (e) {
      console.error(e);
    } finally {
      setSaveInProgress(false);
    }
  }

  function addNewFlow() {
    addFlow(uuidv4(), "");
  }

  const user = useAppSelector((state) => state.login.user);
  const canEdit =
    activity.user === user?._id ||
    user?.userRole === "ADMIN" ||
    activity.visibility === "editable";

  if (!errors) return <div />;
  return (
    <ColumnDiv
      style={{
        width: "100%",
        height: "100%",
        overflowY: "auto",
        position: "relative",
      }}
    >
      <IconButton
        data-cy="return-to-activity-list"
        onClick={returnTo}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 100,
          color: "#1976d2",
        }}
      >
        <ArrowBack />
      </IconButton>
      <ColumnDiv
        data-cy="edit-activity-header"
        style={{
          width: "50%",
          alignSelf: "center",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <InputField
          label="Activity Name"
          value={activity.title}
          width="100%"
          disabled={!canEdit}
          key={activity.clientId}
          onChange={updateTitle}
        />
        <InputField
          label="Activity Description"
          width="100%"
          value={activity.description}
          onChange={updateDescription}
        />
        <SelectInputField
          label="Visibility"
          value={activity.visibility}
          options={["editable", "read-only", "private"]}
          disabled={!canEdit}
          onChange={(v) => updateVisibility(v as ActivityBuilderVisibility)}
        />
        <SelectInputField
          label="Attached Panel"
          value={activity.attachedPanel || ""}
          options={["", ...panels.map((panel) => panel.clientId)]}
          optionLabels={["None", ...panels.map((panel) => panel.panelName)]}
          disabled={!canEdit}
          onChange={(v) => updateAttachedPanel(v || undefined)}
        />

        <RowDiv>
          <Button
            style={{
              marginRight: "10px",
            }}
            disabled={saveInProgress || !isActivityRunnable(activity)}
            variant="outlined"
            onClick={async () => {
              saveActivity().then(() => {
                goToActivity(activity);
              });
            }}
          >
            Preview
          </Button>
          {!saveInProgress ? (
            <Button
              data-cy="save-activity"
              style={{
                marginRight: "10px",
              }}
              variant="outlined"
              disabled={!canEdit || equals(activity, originalActivity)}
              onClick={saveActivity}
            >
              Save
            </Button>
          ) : (
            <CircularProgress
              style={{
                marginRight: 10,
              }}
            />
          )}
          <Button
            data-cy="add-flow"
            onClick={addNewFlow}
            variant="outlined"
            disabled={!canEdit}
          >
            + Add Flow
          </Button>
        </RowDiv>
      </ColumnDiv>
      <ActivityFlowContainer
        globalStateKeys={globalStateKeys}
        versions={activityVersions[activity.clientId] || []}
        disabled={!canEdit}
        stepErrors={errors}
      />
    </ColumnDiv>
  );
}

// Wrapper component that provides the context
export function EditActivity(props: {
  goToActivity: (activity: ActivityBuilderType) => void;
  activity: ActivityBuilderType;
  saveActivity: (activity: ActivityBuilderType) => Promise<ActivityBuilderType>;
  returnTo: () => void;
}): React.ReactNode {
  return (
    <EditActivityProvider initialActivity={props.activity}>
      <EditActivityContent {...props} originalActivity={props.activity} />
    </EditActivityProvider>
  );
}
