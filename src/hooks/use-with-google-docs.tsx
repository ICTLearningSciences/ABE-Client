/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React, { useEffect } from 'react';
import { createNewGoogleDoc } from './api';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { useWithState } from '../store/slices/state/use-with-state';
import { GoogleDoc, NewDocData, StoreGoogleDoc } from '../types';
import { useNavigate } from 'react-router-dom';
import {
  GoogleDocsLoadStatus,
  loadUserGoogleDocs,
  updateGoogleDoc as _updateGoogleDoc,
} from '../store/slices/state';

export interface DocRevisionResponse {
  revisions: RevisionsItem[];
}

export interface RevisionsItem {
  id: string;
  modifiedTime: string;
  rawText: string;
}

export interface UseWithGoogleDocs {
  docId: string;
  docUrl: string;
  googleDocs: GoogleDoc[];
  copyGoogleDocs: GoogleDoc[];
  creationInProgress: boolean;
  handleCreateGoogleDoc: (
    docIdToCopyFrom?: string,
    title?: string,
    isAdminDoc?: boolean
  ) => Promise<void>;
  handleOpenGoogleDoc: (docId: string) => void;
  handleSelectGoogleDocs: (docId: string) => void;
  docsLoading: boolean;
  updateGoogleDoc: (googleDoc: StoreGoogleDoc) => Promise<GoogleDoc>;
  loadUsersGoogleDocs: () => void;
}

export function UseWithGoogleDocs(): UseWithGoogleDocs {
  const { updateCurrentDocId } = useWithState();
  const googleDocId = useAppSelector((state) => state.state.googleDocId);
  const userEmail = useAppSelector((state) => state.login.user?.email);
  const userId = useAppSelector((state) => state.login.user?._id) || '';
  const googleDocs = useAppSelector((state) => state.state.userGoogleDocs);
  const googleDocsLoadStatus = useAppSelector(
    (state) => state.state.userGoogleDocsLoadStatus
  );
  const dispatch = useAppDispatch();
  const isLoading = googleDocsLoadStatus === GoogleDocsLoadStatus.LOADING;
  const userGoogleDocs = googleDocs?.filter((doc) => !doc.admin);
  const copyGoogleDocs = googleDocs?.filter((doc) => doc.admin);
  const navigate = useNavigate();
  const [creationInProgress, setCreationInProgress] =
    React.useState<boolean>(false);

  function handleNewGoogleDoc(newGoogleDoc: NewDocData) {
    updateCurrentDocId(newGoogleDoc.docId);
    navigate(`/docs/${newGoogleDoc.docId}`);
  }
  useEffect(() => {
    const queryParameters = new URLSearchParams(window.location.search);
    const targetDocId = queryParameters.get('docId');
    if (targetDocId) {
      updateCurrentDocId(targetDocId);
    }
  }, []);

  function loadUsersGoogleDocs() {
    dispatch(loadUserGoogleDocs({ userId }));
  }

  async function handleCreateGoogleDoc(
    docIdToCopyFrom?: string,
    title?: string,
    isAdminDoc?: boolean
  ) {
    setCreationInProgress(true);
    await createNewGoogleDoc(
      userId,
      userEmail,
      docIdToCopyFrom,
      title,
      isAdminDoc
    )
      .then((newDocData) => {
        handleNewGoogleDoc(newDocData);
        loadUsersGoogleDocs(); //reload the user's google docs since have new onces
      })
      .catch((err) => {
        console.error('Error creating google doc');
        console.error(err);
      })
      .finally(() => {
        setCreationInProgress(false);
      });
  }

  function handleOpenGoogleDoc(docId: string) {
    window.open(`https://docs.google.com/document/d/${docId}`, '_blank');
  }

  function handleSelectGoogleDocs(docId: string) {
    updateCurrentDocId(docId);
  }

  async function updateGoogleDoc(
    googleDoc: StoreGoogleDoc
  ): Promise<GoogleDoc> {
    const res = await dispatch(_updateGoogleDoc({ googleDoc }));
    return res.payload as GoogleDoc;
  }

  return {
    docId: googleDocId,
    docUrl: googleDocId
      ? `https://docs.google.com/document/d/${googleDocId}`
      : '',
    googleDocs: userGoogleDocs || [],
    copyGoogleDocs: copyGoogleDocs || [],
    creationInProgress,
    handleCreateGoogleDoc,
    handleOpenGoogleDoc,
    handleSelectGoogleDocs,
    docsLoading: isLoading,
    updateGoogleDoc,
    loadUsersGoogleDocs,
  };
}
