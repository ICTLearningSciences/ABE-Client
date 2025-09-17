/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React from 'react';
import { ActivityBuilder, BuiltActivityVersion } from './types';
import { AiPromptStep } from '../../types';
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
