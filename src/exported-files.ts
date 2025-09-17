/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import docGoalsActivitiesReducer from './store/slices/doc-goals-activities';
export { default as SelectCreateDocs } from './components/user-view/select-create-docs';
export { store } from './store/store';
export { Provider } from 'react-redux';

export { useWithLogin } from './store/slices/login/use-with-login';
export { useWithChat } from './store/slices/chat/use-with-chat';
export { useWithConfig } from './store/slices/config/use-with-config';
export { docGoalsActivitiesReducer }; // store slice
export { useWithDocGoalsActivities } from './store/slices/doc-goals-activities/use-with-doc-goals-activites';
export { useWithSpfxLogin } from './store/slices/login/use-with-spfx-login';
export { useWithState } from './store/slices/state/use-with-state';
export { useWithUsersDocs } from './hooks/use-with-users-docs';
export { useWithPrompts } from './hooks/use-with-prompts';
export { useReduxHydration } from './use-redux-hydration';
export { EditGoogleDoc } from './components/user-view/user-edit-google-doc';
export { useWithCurrentGoalActivity } from './hooks/use-with-current-goal-activity';
export { ChatActivity } from './components/user-view/chat-activity';
export { useConfigLoader } from './components/config-loading/use-config-loader';
export { DocumentTimelinePage } from './components/user-view/document-timeline';
export { useWithRawTextDocVersions } from './hooks/use-with-raw-text-doc-versions';
export { LoginUI } from './pages/login/login-ui';
export * from './hooks/api';

export { ActivityBuilderPage } from './components/activity-builder/activity-builder-page';
export * from './components/activity-builder/types';
