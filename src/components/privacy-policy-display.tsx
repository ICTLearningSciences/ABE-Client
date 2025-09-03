/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { useAppSelector } from '../store/hooks';
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';

export function PrivacyPolicyDisplay() {
  const config = useAppSelector((state) => state.config);
  const privacyPolicy = config.config?.privacyPolicy || '';
  const [privacyPolicyOpen, setPrivacyPolicyOpen] = useState(false);

  if (!privacyPolicy) return null;

  return (
    <div>
      <Button
        onClick={() => setPrivacyPolicyOpen(true)}
        style={{ color: 'blue' }}
      >
        Privacy Policy
      </Button>
      {privacyPolicyOpen && (
        <Dialog
          open={privacyPolicyOpen}
          onClose={() => setPrivacyPolicyOpen(false)}
        >
          <DialogTitle style={{ textAlign: 'center' }}>
            Privacy Policy
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              <ReactMarkdown>{privacyPolicy}</ReactMarkdown>
            </DialogContentText>
            <DialogActions>
              {' '}
              <Button onClick={() => setPrivacyPolicyOpen(false)}>Close</Button>
            </DialogActions>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
