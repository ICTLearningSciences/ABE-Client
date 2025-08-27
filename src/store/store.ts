/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { logger } from 'redux-logger';
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import loginReducer from './slices/login';
import chatReducer from './slices/chat';
import stateReducer from './slices/state';
import configReducer from './slices/config';
import docGoalsActivitiesReducer from './slices/doc-goals-activities';
import educationManagementReducer from './slices/education-management';
import * as Sentry from '@sentry/react';

const sentryEnhancer = Sentry.createReduxEnhancer({
  actionTransformer: (action) => {
    if (action.error) {
      Sentry.captureException(Error(JSON.stringify(action.error)));
    }
    return action;
  },
});

// Create the combined reducer
const appReducer = combineReducers({
  login: loginReducer,
  chat: chatReducer,
  state: stateReducer,
  config: configReducer,
  docGoalsActivities: docGoalsActivitiesReducer,
  educationManagement: educationManagementReducer,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const rootReducer = (state: any, action: any) => {
  if (action.type === 'login/logout/fulfilled') {
    // preserve just config on logout
    return appReducer(
      {
        ...state,
        login: loginReducer(undefined, action),
        chat: chatReducer(undefined, action),
        docGoalsActivities: docGoalsActivitiesReducer(undefined, action),
        educationManagement: educationManagementReducer(undefined, action),
        state: stateReducer(undefined, action),
      },
      action
    );
  }
  return appReducer(state, action);
};

export const store = configureStore({
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
  reducer: rootReducer,
  enhancers: (defaultEhancers) => defaultEhancers.concat(sentryEnhancer),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
