import axios from 'axios';
import React, { useEffect } from 'react';
import { createNewGoogleDoc } from './api';
import { useAppSelector } from '../store/hooks';
import { useWithState } from '../store/slices/state/use-with-state';
import { GoogleDoc, NewDocData } from '../types';
import { useWithGoogleDocsData } from './use-with-google-docs-data';
import { useNavigate } from 'react-router-dom';

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
  revisionsList: RevisionsItem[];
  creationInProgress: boolean;
  handleCreateGoogleDoc: (
    docIdToCopyFrom?: string,
    title?: string,
    isAdminDoc?: boolean
  ) => Promise<void>;
  handleOpenGoogleDoc: (docId: string) => void;
  handleSelectGoogleDocs: (docId: string) => void;
  docsLoading: boolean;
  handleRefreshGoogleDocs: () => void;
  testNumber: number;
  setTestNumber: (newNumber: number) => void;
}

export function UseWithGoogleDocs(): UseWithGoogleDocs {
  const { updateCurrentDocId } = useWithState();
  const googleDocId = useAppSelector((state) => state.state.googleDocId);
  const userEmail = useAppSelector((state) => state.login.user?.email);
  const userId = useAppSelector((state) => state.login.user?._id) || '';
  const { googleDocs, reloadData, isSaving, isLoading } =
    useWithGoogleDocsData(userId);
  const userGoogleDocs = googleDocs?.filter((doc) => !doc.admin);
  const copyGoogleDocs = googleDocs?.filter((doc) => doc.admin);
  const navigate = useNavigate();
  const [revisionsList, setRevisionsList] = React.useState<RevisionsItem[]>([]);
  const [creationInProgress, setCreationInProgress] =
    React.useState<boolean>(false);
  const [testNumber, setTestNumber] = React.useState<number>(0);

  function handleNewGoogleDoc(newGoogleDoc: NewDocData) {
    updateCurrentDocId(newGoogleDoc.docId);
    navigate(`/docs/${newGoogleDoc.docId}`);
    // TODO: add to list of google docs, which will need to also pull from the backend
  }

  useEffect(() => {
    const queryParameters = new URLSearchParams(window.location.search);
    const targetDocId = queryParameters.get('docId');
    if (targetDocId) {
      updateCurrentDocId(targetDocId);
    }
  }, []);

  useEffect(() => {
    if (!googleDocId) {
      handleRefreshGoogleDocs();
    }
  }, [googleDocId]);

  function handleRefreshGoogleDocs() {
    reloadData();
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
        reloadData();
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

  function getGoogleDocRevisions(docId: string) {
    axios
      .get<DocRevisionResponse>(
        `${process.env.REACT_APP_GOOGLE_API_ENDPOINT}/doc_revisions/${docId}`
      )
      .then((res) => {
        console.log(res);
        setRevisionsList(res.data.revisions);
      })
      .catch((err) => {
        console.error('Error getting google doc revisions');
        console.error(err);
      });
  }

  return {
    docId: googleDocId,
    docUrl: googleDocId
      ? `https://docs.google.com/document/d/${googleDocId}`
      : '',
    googleDocs: userGoogleDocs || [],
    copyGoogleDocs: copyGoogleDocs || [],
    revisionsList,
    creationInProgress,
    handleCreateGoogleDoc,
    handleOpenGoogleDoc,
    handleSelectGoogleDocs,
    docsLoading: isSaving || isLoading,
    handleRefreshGoogleDocs,
    testNumber,
    setTestNumber,
  };
}
