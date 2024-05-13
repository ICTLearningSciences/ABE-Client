/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React, { useEffect, useState } from 'react';
import { useWithConfig } from '../../store/slices/config/use-with-config';
import { Button, CircularProgress } from '@mui/material';
import { FullScreenCenterDiv } from '../../styled-components';

export function useConfigLoader() {
  const { isConfigLoaded, loadConfig, loadFailed } = useWithConfig();
  const [initialConfigLoadComplete, setInitialConfigLoadComplete] =
    useState(false);
  const configLoading = !isConfigLoaded();
  const configLoadFailed = loadFailed();
  useEffect(() => {
    loadConfig();
  }, []);

  useEffect(() => {
    if (isConfigLoaded() && !initialConfigLoadComplete) {
      setInitialConfigLoadComplete(true);
    }
  }, [isConfigLoaded()]);

  function Display(): JSX.Element {
    if (configLoadFailed) {
      return (
        <FullScreenCenterDiv data-cy="config-loading-screen">
          <h1>Config Load Failed</h1>
          <Button
            data-cy="config-load-retry-button"
            onClick={() => {
              console.log('here');
              loadConfig();
            }}
          >
            Retry
          </Button>
        </FullScreenCenterDiv>
      );
    }
    if (configLoading) {
      return (
        <FullScreenCenterDiv data-cy="config-loading-screen">
          <CircularProgress data-cy="config-loading-spinner" size={100} />
        </FullScreenCenterDiv>
      );
    }
    return <></>;
  }

  return {
    ConfigLoader: Display,
    configLoaded: initialConfigLoadComplete,
  };
}
