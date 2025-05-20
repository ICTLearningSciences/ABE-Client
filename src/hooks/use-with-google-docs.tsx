/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React, { useEffect, useMemo, useState } from 'react';
import { createNewDoc } from './api';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { useWithState } from '../store/slices/state/use-with-state';
import { UserDoc, NewDocData, StoreUserDoc } from '../types';

import {
  UserDocsLoadStatus,
  loadUserDocs,
  updateUserDoc as _updateUserDoc,
  deleteUserDoc,
  updateDocTitleLocally as _updateDocTitle,
  setArchiveUserDoc,
} from '../store/slices/state';

export interface DocRevisionResponse {
  revisions: RevisionsItem[];
}

export interface RevisionsItem {
  id: string;
  modifiedTime: string;
  rawText: string;
}

export interface SortConfig {
  field: string;
  ascend: boolean;
}

export interface UseWithGoogleDocs {
  docId: string;
  googleDocs: UserDoc[];
  copyDocs: UserDoc[];
  creationInProgress: boolean;
  handleCreateDoc: (
    docIdToCopyFrom?: string,
    title?: string,
    isAdminDoc?: boolean,
    callback?: (newDocData: NewDocData) => void
  ) => Promise<void>;
  docsLoading: boolean;
  updateUserDoc: (googleDoc: StoreUserDoc) => Promise<UserDoc>;
  loadUsersDocs: () => void;
  handleDeleteDoc: (docId: string) => Promise<void>;
  getCurrentDoc: (docId: string | undefined) => UserDoc | undefined;
  updateDocTitleLocally: (googleDocId: string, title: string) => void;
  sortBy: SortConfig;
  setSortBy: (config: SortConfig) => void;
  archiveDoc: (googleDocId: string) => Promise<void>;
  unarchiveDoc: (googleDocId: string) => Promise<void>;
}

export function useWithGoogleDocs(): UseWithGoogleDocs {
  const { updateCurrentDocId } = useWithState();
  const [sortBy, setSortByState] = useState<SortConfig>({
    field: 'updatedAt',
    ascend: false,
  });

  const setSortBy = (config: SortConfig) => {
    setSortByState((prev) => ({
      field: config.field,
      ascend: config.field === prev.field ? !prev.ascend : config.ascend,
    }));
  };

  const googleDocId = useAppSelector((state) => state.state.googleDocId);
  const userEmail = useAppSelector((state) => state.login.user?.email);
  const userId = useAppSelector((state) => state.login.user?._id) || '';
  const googleDocs = useAppSelector((state) => state.state.userDocs);

  const googleDocsLoadStatus = useAppSelector(
    (state) => state.state.userDocsLoadStatus
  );
  const dispatch = useAppDispatch();
  const config = useAppSelector((state) => state.config);
  const isLoading = googleDocsLoadStatus === UserDocsLoadStatus.LOADING;

  const userDocs = useMemo(() => {
    const filteredDocs = googleDocs?.filter((doc) => !doc.admin) || [];
    return [...filteredDocs].sort((a, b) => {
      let comparison = 0;

      if (sortBy.field === 'title') {
        comparison = (a.title || '').localeCompare(b.title || '');
      } else if (sortBy.field === 'createdAt') {
        comparison =
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime();
      } else if (sortBy.field === 'updatedAt') {
        comparison =
          new Date(b.updatedAt || 0).getTime() -
          new Date(a.updatedAt || 0).getTime();
      }

      return sortBy.ascend ? -comparison : comparison;
    });
  }, [googleDocs, sortBy]);

  const exampleDocs = config.config?.exampleGoogleDocs || [];
  const copyDocs = googleDocs?.filter((doc) => {
    return exampleDocs.includes(doc.googleDocId);
  });

  const [creationInProgress, setCreationInProgress] =
    React.useState<boolean>(false);

  useEffect(() => {
    const queryParameters = new URLSearchParams(window.location.search);
    const targetDocId = queryParameters.get('docId');
    if (targetDocId) {
      updateCurrentDocId(targetDocId);
    }
  }, []);

  function loadUsersDocs() {
    dispatch(loadUserDocs({ userId }));
  }

  const getCurrentDoc = (docId: string | undefined): UserDoc | undefined => {
    if (!docId) return undefined;

    return userDocs?.find((doc) => doc.googleDocId === docId);
  };

  async function handleCreateDoc(
    docIdToCopyFrom?: string,
    title?: string,
    isAdminDoc?: boolean,
    callback?: (newDocData: NewDocData) => void
  ) {
    setCreationInProgress(true);
    await createNewDoc(userId, userEmail, docIdToCopyFrom, title, isAdminDoc)
      .then((newDocData) => {
        if (callback) {
          callback(newDocData);
        }
        loadUsersDocs(); //reload the user's docs since have new onces
      })
      .catch((err) => {
        console.error('Error creating doc');
        console.error(err);
      })
      .finally(() => {
        setCreationInProgress(false);
      });
  }

  async function updateUserDoc(userDoc: StoreUserDoc): Promise<UserDoc> {
    const res = await dispatch(_updateUserDoc({ userDoc }));
    return res.payload as UserDoc;
  }

  async function handleDeleteDoc(docId: string) {
    await dispatch(deleteUserDoc({ googleDocId: docId, userId }));
  }

  /**
   * Note: This will only update the google doc as it is titled in local redux, not in any server
   */
  async function updateDocTitleLocally(googleDocId: string, title: string) {
    dispatch(_updateDocTitle({ googleDocId, title }));
  }

  async function archiveDoc(googleDocId: string) {
    await dispatch(setArchiveUserDoc({ googleDocId, userId, archive: true }));
  }

  async function unarchiveDoc(googleDocId: string) {
    await dispatch(setArchiveUserDoc({ googleDocId, userId, archive: false }));
  }

  return {
    docId: googleDocId,
    googleDocs: userDocs || [],
    copyDocs: copyDocs || [],
    creationInProgress,
    handleCreateDoc,
    docsLoading: isLoading,
    updateUserDoc,
    loadUsersDocs,
    handleDeleteDoc,
    getCurrentDoc,
    updateDocTitleLocally,
    sortBy,
    setSortBy,
    archiveDoc,
    unarchiveDoc,
  };
}
