/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React from 'react';
import { Button } from '@mui/material';
import { RawTextDocument } from './raw-text-document';
import { useWithStoreDocVersions } from '../../hooks/use-with-google-doc-versions';
import { useAppSelector } from '../../store/hooks';
import { LoginService } from '../../store/slices/login';
interface UserDocumentDisplayProps {
  docId: string;
  docUrl: string;
  width: string;
  returnToDocs: () => void;
  currentActivityId: string;
}

export function GoogleDocDisplay(props: {
  docUrl: string;
  currentActivityId: string;
}): JSX.Element {
  const { docUrl, currentActivityId } = props;
  useWithStoreDocVersions(currentActivityId);
  return (
    <iframe
      width={'98%'}
      height={'98%'}
      src={docUrl}
      data-cy="google-doc-iframe"
    />
  );
}

export function UserDocumentDisplay(
  props: UserDocumentDisplayProps
): JSX.Element {
  const { docId, docUrl, width, returnToDocs, currentActivityId } = props;
  const loginService = useAppSelector(
    (state) => state.login.user?.loginService
  );

  // Render appropriate document component based on doc service type
  const renderDocumentComponent = () => {
    switch (loginService) {
      case LoginService.GOOGLE:
        return (
          <GoogleDocDisplay
            docUrl={docUrl}
            currentActivityId={currentActivityId}
          />
        );
      case LoginService.EMAIL:
      default:
        return (
          <RawTextDocument
            docId={docId}
            currentActivityId={currentActivityId}
          />
        );
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: width,
      }}
    >
      {renderDocumentComponent()}
      <Button variant="text" onClick={returnToDocs}>
        Return
      </Button>
    </div>
  );
}
