/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Button,
} from '@mui/material';
import { useWithBrowserDetection } from '../hooks/use-with-browser-detection';

const STORAGE_KEY = 'firefox-cookie-warning-last-shown';
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

export function FirefoxCookieWarningDialog(): JSX.Element {
  const { warnFirefoxWithGoogleLogin } = useWithBrowserDetection();

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!warnFirefoxWithGoogleLogin) {
      return;
    }

    const lastShown = localStorage.getItem(STORAGE_KEY);
    const now = Date.now();

    if (!lastShown) {
      setOpen(true);
      return;
    }

    const lastShownTime = parseInt(lastShown, 10);
    const timeSinceLastShown = now - lastShownTime;

    if (timeSinceLastShown >= ONE_DAY_MS) {
      setOpen(true);
    }
  }, [warnFirefoxWithGoogleLogin]);

  const handleClose = () => {
    setOpen(false);
    localStorage.setItem(STORAGE_KEY, Date.now().toString());
  };

  return (
    <Dialog
      data-cy="firefox-cookie-warning-dialog"
      maxWidth="sm"
      fullWidth={true}
      open={open}
      onClose={handleClose}
      style={{
        textAlign: 'center',
      }}
    >
      <DialogTitle data-cy="firefox-cookie-warning-title">
        Heads up!
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          The <b>Firefox</b> browser sometimes has third-party cookies disabled
          by default, which will break features on this site. If you run into
          any issues, try enabling third-party cookies in your settings or
          switch to another browser.
        </DialogContentText>
      </DialogContent>
      <DialogContent>
        <Button
          data-cy="close-firefox-warning-dialog"
          onClick={handleClose}
          style={{
            color: 'blue',
          }}
          variant="contained"
        >
          Close
        </Button>
      </DialogContent>
    </Dialog>
  );
}
