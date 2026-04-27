/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React from 'react';
import { ActivityBuilder, BuiltActivityVersion, ActivityBuilderStepTypes, JsonResponseData } from './types';
import { AiPromptStep, RagStoreConfiguration } from '../../types';
import { AiServicesResponseTypes } from '../../ai-services/ai-service-types';

interface ActivityBuilderContextType {
  userId?: string;
  canEditActivity: (activity: ActivityBuilder) => boolean;
  canDeleteActivity: (activity: ActivityBuilder) => boolean;
  activityVersions: Record<string, BuiltActivityVersion[]>;
  loadActivityVersions: (
    activityClientId: string
  ) => Promise<BuiltActivityVersion[]>;
  executePromptSteps?: (
    aiPromptSteps: AiPromptStep[],
    callback?: (response: AiServicesResponseTypes) => void
  ) => Promise<AiServicesResponseTypes>;
}

const ActivityBuilderContext = React.createContext<ActivityBuilderContextType>({
  userId: undefined,
  canEditActivity: () => false,
  canDeleteActivity: () => false,
  activityVersions: {},
  loadActivityVersions: () => Promise.resolve([]),
  executePromptSteps: undefined,
});

export const useActivityBuilderContext = () => {
  return React.useContext(ActivityBuilderContext);
};

export const ActivityBuilderProvider: React.FC<{
  children: React.ReactNode;
  userId?: string;
  canEditActivity: (activity: ActivityBuilder) => boolean;
  activityVersions: Record<string, BuiltActivityVersion[]>;
  loadActivityVersions: (
    activityClientId: string
  ) => Promise<BuiltActivityVersion[]>;
  canDeleteActivity: (activity: ActivityBuilder) => boolean;
  executePromptSteps: (
    aiPromptSteps: AiPromptStep[],
    callback?: (response: AiServicesResponseTypes) => void
  ) => Promise<AiServicesResponseTypes>;
}> = ({
  userId,
  canEditActivity,
  canDeleteActivity,
  children,
  activityVersions,
  loadActivityVersions,
  executePromptSteps,
}) => {
  return (
    <ActivityBuilderContext.Provider
      value={{
        userId,
        canEditActivity,
        canDeleteActivity,
        activityVersions,
        loadActivityVersions,
        executePromptSteps,
      }}
    >
      {children}
    </ActivityBuilderContext.Provider>
  );
};

// ============================================================================
// Edit Activity Context (for managing local activity state during editing)
// ============================================================================

type EditActivityAction =
  | { type: 'SET_ACTIVITY'; payload: ActivityBuilder }
  | { type: 'UPDATE_TITLE'; payload: string }
  | { type: 'UPDATE_DESCRIPTION'; payload: string }
  | { type: 'UPDATE_VISIBILITY'; payload: ActivityBuilder['visibility'] }
  | { type: 'ADD_FLOW'; payload: { clientId: string; name: string } }
  | { type: 'DELETE_FLOW'; payload: string }
  | { type: 'UPDATE_FLOW_NAME'; payload: { flowClientId: string; name: string } }
  | { type: 'ADD_STEP'; payload: { flowClientId: string; step: ActivityBuilderStepTypes; index: number } }
  | { type: 'UPDATE_STEP'; payload: { flowClientId: string; step: ActivityBuilderStepTypes } }
  | { type: 'DELETE_STEP'; payload: { flowClientId: string; stepId: string } }
  | { type: 'UPDATE_PROMPT_CONFIG_FIELD'; payload: {
      stepId: string;
      configIndex: number;
      field: string;
      value: string | boolean | JsonResponseData[] | RagStoreConfiguration | undefined;
    }}
  | { type: 'UPDATE_STEP_FIELD'; payload: { stepId: string; field: string; value: any } }
  | { type: 'ADD_PROMPT_CONFIGURATION'; payload: { stepId: string; configuration: any } }
  | { type: 'REMOVE_PROMPT_CONFIGURATION'; payload: { stepId: string; configIndex: number } }
  | { type: 'UPDATE_JSON_RESPONSE_DATA'; payload: {
      stepId: string;
      configIndex: number;
      clientId: string;
      field: string;
      value: string | boolean;
      parentJsonResponseDataIds: string[];
    }}
  | { type: 'ADD_JSON_RESPONSE_DATA'; payload: {
      stepId: string;
      configIndex: number;
      parentJsonResponseDataIds: string[];
      newData: JsonResponseData;
    }}
  | { type: 'DELETE_JSON_RESPONSE_DATA'; payload: {
      stepId: string;
      configIndex: number;
      clientId: string;
      parentJsonResponseDataIds: string[];
    }};

function editActivityReducer(
  state: ActivityBuilder,
  action: EditActivityAction
): ActivityBuilder {
  switch (action.type) {
    case 'SET_ACTIVITY':
      return action.payload;

    case 'UPDATE_TITLE':
      return { ...state, title: action.payload };

    case 'UPDATE_DESCRIPTION':
      return { ...state, description: action.payload };

    case 'UPDATE_VISIBILITY':
      return { ...state, visibility: action.payload };

    case 'ADD_FLOW':
      return {
        ...state,
        flowsList: [
          ...state.flowsList,
          { clientId: action.payload.clientId, name: action.payload.name, steps: [] },
        ],
      };

    case 'DELETE_FLOW':
      return {
        ...state,
        flowsList: state.flowsList.filter((f) => f.clientId !== action.payload),
      };

    case 'UPDATE_FLOW_NAME':
      return {
        ...state,
        flowsList: state.flowsList.map((f) =>
          f.clientId === action.payload.flowClientId
            ? { ...f, name: action.payload.name }
            : f
        ),
      };

    case 'ADD_STEP':
      return {
        ...state,
        flowsList: state.flowsList.map((f) => {
          if (f.clientId === action.payload.flowClientId) {
            const newSteps = [...f.steps];
            newSteps.splice(action.payload.index + 1, 0, action.payload.step);
            return { ...f, steps: newSteps };
          }
          return f;
        }),
      };

    case 'UPDATE_STEP':
      return {
        ...state,
        flowsList: state.flowsList.map((f) => {
          if (f.clientId === action.payload.flowClientId) {
            return {
              ...f,
              steps: f.steps.map((s) =>
                s.stepId === action.payload.step.stepId ? action.payload.step : s
              ),
            };
          }
          return f;
        }),
      };

    case 'DELETE_STEP':
      return {
        ...state,
        flowsList: state.flowsList.map((f) => {
          if (f.clientId === action.payload.flowClientId) {
            return {
              ...f,
              steps: f.steps.filter((s) => s.stepId !== action.payload.stepId),
            };
          }
          return f;
        }),
      };

    case 'UPDATE_STEP_FIELD':
      return {
        ...state,
        flowsList: state.flowsList.map((f) => ({
          ...f,
          steps: f.steps.map((s) =>
            s.stepId === action.payload.stepId
              ? { ...s, [action.payload.field]: action.payload.value }
              : s
          ),
        })),
      };

    case 'UPDATE_PROMPT_CONFIG_FIELD':
      return {
        ...state,
        flowsList: state.flowsList.map((f) => ({
          ...f,
          steps: f.steps.map((s) => {
            if (s.stepId === action.payload.stepId && s.stepType === 'PROMPT') {
              const promptStep = s as any;
              const updatedConfigurations = [...promptStep.promptConfigurations];
              updatedConfigurations[action.payload.configIndex] = {
                ...updatedConfigurations[action.payload.configIndex],
                [action.payload.field]: action.payload.value,
              };
              return { ...s, promptConfigurations: updatedConfigurations };
            }
            return s;
          }),
        })),
      };

    case 'ADD_PROMPT_CONFIGURATION':
      return {
        ...state,
        flowsList: state.flowsList.map((f) => ({
          ...f,
          steps: f.steps.map((s) => {
            if (s.stepId === action.payload.stepId && s.stepType === 'PROMPT') {
              const promptStep = s as any;
              return {
                ...s,
                promptConfigurations: [
                  ...promptStep.promptConfigurations,
                  action.payload.configuration,
                ],
              };
            }
            return s;
          }),
        })),
      };

    case 'REMOVE_PROMPT_CONFIGURATION':
      return {
        ...state,
        flowsList: state.flowsList.map((f) => ({
          ...f,
          steps: f.steps.map((s) => {
            if (s.stepId === action.payload.stepId && s.stepType === 'PROMPT') {
              const promptStep = s as any;
              return {
                ...s,
                promptConfigurations: promptStep.promptConfigurations.filter(
                  (_: any, index: number) => index !== action.payload.configIndex
                ),
              };
            }
            return s;
          }),
        })),
      };

    case 'UPDATE_JSON_RESPONSE_DATA':
      return {
        ...state,
        flowsList: state.flowsList.map((f) => ({
          ...f,
          steps: f.steps.map((s) => {
            if (s.stepId === action.payload.stepId && s.stepType === 'PROMPT') {
              const promptStep = s as any;
              const config = promptStep.promptConfigurations[action.payload.configIndex];
              const updatedResponseData = updateNestedJsonResponseData(
                config.jsonResponseData || [],
                action.payload.clientId,
                action.payload.field,
                action.payload.value,
                action.payload.parentJsonResponseDataIds
              );
              const updatedConfigurations = [...promptStep.promptConfigurations];
              updatedConfigurations[action.payload.configIndex] = {
                ...updatedConfigurations[action.payload.configIndex],
                jsonResponseData: updatedResponseData,
              };
              return { ...s, promptConfigurations: updatedConfigurations };
            }
            return s;
          }),
        })),
      };

    case 'ADD_JSON_RESPONSE_DATA':
      return {
        ...state,
        flowsList: state.flowsList.map((f) => ({
          ...f,
          steps: f.steps.map((s) => {
            if (s.stepId === action.payload.stepId && s.stepType === 'PROMPT') {
              const promptStep = s as any;
              const config = promptStep.promptConfigurations[action.payload.configIndex];
              const updatedResponseData = addNestedJsonResponseData(
                config.jsonResponseData || [],
                action.payload.newData,
                action.payload.parentJsonResponseDataIds
              );
              const updatedConfigurations = [...promptStep.promptConfigurations];
              updatedConfigurations[action.payload.configIndex] = {
                ...updatedConfigurations[action.payload.configIndex],
                jsonResponseData: updatedResponseData,
              };
              return { ...s, promptConfigurations: updatedConfigurations };
            }
            return s;
          }),
        })),
      };

    case 'DELETE_JSON_RESPONSE_DATA':
      return {
        ...state,
        flowsList: state.flowsList.map((f) => ({
          ...f,
          steps: f.steps.map((s) => {
            if (s.stepId === action.payload.stepId && s.stepType === 'PROMPT') {
              const promptStep = s as any;
              const config = promptStep.promptConfigurations[action.payload.configIndex];
              const updatedResponseData = deleteNestedJsonResponseData(
                config.jsonResponseData || [],
                action.payload.clientId,
                action.payload.parentJsonResponseDataIds
              );
              const updatedConfigurations = [...promptStep.promptConfigurations];
              updatedConfigurations[action.payload.configIndex] = {
                ...updatedConfigurations[action.payload.configIndex],
                jsonResponseData: updatedResponseData,
              };
              return { ...s, promptConfigurations: updatedConfigurations };
            }
            return s;
          }),
        })),
      };

    default:
      return state;
  }
}

// Helper functions for nested JSON response data operations
function updateNestedJsonResponseData(
  data: JsonResponseData[],
  clientId: string,
  field: string,
  value: string | boolean,
  parentIds: string[]
): JsonResponseData[] {
  if (!parentIds.length) {
    return data.map((item) =>
      item.clientId === clientId ? { ...item, [field]: value } : item
    );
  }
  return data.map((item) => {
    if (item.clientId === parentIds[0]) {
      return {
        ...item,
        subData: updateNestedJsonResponseData(
          item.subData || [],
          clientId,
          field,
          value,
          parentIds.slice(1)
        ),
      };
    }
    return item;
  });
}

function addNestedJsonResponseData(
  data: JsonResponseData[],
  newData: JsonResponseData,
  parentIds: string[]
): JsonResponseData[] {
  if (!parentIds.length) {
    return [...data, newData];
  }
  return data.map((item) => {
    if (item.clientId === parentIds[0]) {
      return {
        ...item,
        subData: addNestedJsonResponseData(
          item.subData || [],
          newData,
          parentIds.slice(1)
        ),
      };
    }
    return item;
  });
}

function deleteNestedJsonResponseData(
  data: JsonResponseData[],
  clientId: string,
  parentIds: string[]
): JsonResponseData[] {
  if (!parentIds.length) {
    return data.filter((item) => item.clientId !== clientId);
  }
  return data.map((item) => {
    if (item.clientId === parentIds[0]) {
      return {
        ...item,
        subData: deleteNestedJsonResponseData(
          item.subData || [],
          clientId,
          parentIds.slice(1)
        ),
      };
    }
    return item;
  });
}

interface EditActivityContextType {
  activity: ActivityBuilder;
  dispatch: React.Dispatch<EditActivityAction>;
  // Helpers
  getStep: (stepId: string) => ActivityBuilderStepTypes | undefined;
  getFlowByStepId: (stepId: string) => { clientId: string; name: string } | undefined;
  // Convenience action creators
  updateTitle: (title: string) => void;
  updateDescription: (description: string) => void;
  updateVisibility: (visibility: ActivityBuilder['visibility']) => void;
  addFlow: (clientId: string, name: string) => void;
  deleteFlow: (flowClientId: string) => void;
  updateFlowName: (flowClientId: string, name: string) => void;
  addStep: (flowClientId: string, step: ActivityBuilderStepTypes, index: number) => void;
  updateStep: (flowClientId: string, step: ActivityBuilderStepTypes) => void;
  deleteStep: (flowClientId: string, stepId: string) => void;
  updateStepField: (stepId: string, field: string, value: any) => void;
  updatePromptConfigField: (
    stepId: string,
    configIndex: number,
    field: string,
    value: string | boolean | JsonResponseData[] | RagStoreConfiguration | undefined
  ) => void;
  addPromptConfiguration: (stepId: string, configuration: any) => void;
  removePromptConfiguration: (stepId: string, configIndex: number) => void;
  updateJsonResponseData: (
    stepId: string,
    configIndex: number,
    clientId: string,
    field: string,
    value: string | boolean,
    parentJsonResponseDataIds: string[]
  ) => void;
  addJsonResponseData: (
    stepId: string,
    configIndex: number,
    parentJsonResponseDataIds: string[],
    newData: JsonResponseData
  ) => void;
  deleteJsonResponseData: (
    stepId: string,
    configIndex: number,
    clientId: string,
    parentJsonResponseDataIds: string[]
  ) => void;
}

const EditActivityContext = React.createContext<EditActivityContextType | null>(null);

export const useEditActivityContext = () => {
  const context = React.useContext(EditActivityContext);
  if (!context) {
    throw new Error('useEditActivityContext must be used within EditActivityProvider');
  }
  return context;
};

export const EditActivityProvider: React.FC<{
  children: React.ReactNode;
  initialActivity: ActivityBuilder;
}> = ({ children, initialActivity }) => {
  const [activity, dispatch] = React.useReducer(
    editActivityReducer,
    initialActivity
  );

  // Sync with external changes to initialActivity (e.g., when activity prop changes)
  React.useEffect(() => {
    dispatch({ type: 'SET_ACTIVITY', payload: initialActivity });
  }, [initialActivity]);

  const contextValue = React.useMemo<EditActivityContextType>(
    () => ({
      activity,
      dispatch,
      getStep: (stepId: string) => {
        for (const flow of activity.flowsList) {
          const step = flow.steps.find((s) => s.stepId === stepId);
          if (step) return step;
        }
        return undefined;
      },
      getFlowByStepId: (stepId: string) => {
        for (const flow of activity.flowsList) {
          if (flow.steps.find((s) => s.stepId === stepId)) {
            return { clientId: flow.clientId, name: flow.name };
          }
        }
        return undefined;
      },
      updateTitle: (title: string) => dispatch({ type: 'UPDATE_TITLE', payload: title }),
      updateDescription: (description: string) =>
        dispatch({ type: 'UPDATE_DESCRIPTION', payload: description }),
      updateVisibility: (visibility: ActivityBuilder['visibility']) =>
        dispatch({ type: 'UPDATE_VISIBILITY', payload: visibility }),
      addFlow: (clientId: string, name: string) =>
        dispatch({ type: 'ADD_FLOW', payload: { clientId, name } }),
      deleteFlow: (flowClientId: string) =>
        dispatch({ type: 'DELETE_FLOW', payload: flowClientId }),
      updateFlowName: (flowClientId: string, name: string) =>
        dispatch({ type: 'UPDATE_FLOW_NAME', payload: { flowClientId, name } }),
      addStep: (flowClientId: string, step: ActivityBuilderStepTypes, index: number) =>
        dispatch({ type: 'ADD_STEP', payload: { flowClientId, step, index } }),
      updateStep: (flowClientId: string, step: ActivityBuilderStepTypes) =>
        dispatch({ type: 'UPDATE_STEP', payload: { flowClientId, step } }),
      deleteStep: (flowClientId: string, stepId: string) =>
        dispatch({ type: 'DELETE_STEP', payload: { flowClientId, stepId } }),
      updateStepField: (stepId: string, field: string, value: any) =>
        dispatch({ type: 'UPDATE_STEP_FIELD', payload: { stepId, field, value } }),
      updatePromptConfigField: (
        stepId: string,
        configIndex: number,
        field: string,
        value: string | boolean | JsonResponseData[] | RagStoreConfiguration | undefined
      ) =>
        dispatch({
          type: 'UPDATE_PROMPT_CONFIG_FIELD',
          payload: { stepId, configIndex, field, value },
        }),
      addPromptConfiguration: (stepId: string, configuration: any) =>
        dispatch({ type: 'ADD_PROMPT_CONFIGURATION', payload: { stepId, configuration } }),
      removePromptConfiguration: (stepId: string, configIndex: number) =>
        dispatch({ type: 'REMOVE_PROMPT_CONFIGURATION', payload: { stepId, configIndex } }),
      updateJsonResponseData: (
        stepId: string,
        configIndex: number,
        clientId: string,
        field: string,
        value: string | boolean,
        parentJsonResponseDataIds: string[]
      ) =>
        dispatch({
          type: 'UPDATE_JSON_RESPONSE_DATA',
          payload: { stepId, configIndex, clientId, field, value, parentJsonResponseDataIds },
        }),
      addJsonResponseData: (
        stepId: string,
        configIndex: number,
        parentJsonResponseDataIds: string[],
        newData: JsonResponseData
      ) =>
        dispatch({
          type: 'ADD_JSON_RESPONSE_DATA',
          payload: { stepId, configIndex, parentJsonResponseDataIds, newData },
        }),
      deleteJsonResponseData: (
        stepId: string,
        configIndex: number,
        clientId: string,
        parentJsonResponseDataIds: string[]
      ) =>
        dispatch({
          type: 'DELETE_JSON_RESPONSE_DATA',
          payload: { stepId, configIndex, clientId, parentJsonResponseDataIds },
        }),
    }),
    [activity]
  );

  return (
    <EditActivityContext.Provider value={contextValue}>
      {children}
    </EditActivityContext.Provider>
  );
};
