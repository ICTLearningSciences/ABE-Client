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
  DialogActions,
  TextField,
  Button,
  IconButton,
  Typography,
  Box,
  Alert,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { extractErrorMessageFromError } from '../../../helpers';

interface JoinSectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (sectionCode: string) => Promise<void>;
  isLoading?: boolean;
}

const JoinSectionModal: React.FC<JoinSectionModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const [sectionCode, setSectionCode] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setSectionCode('');
      setError('');
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError('');

    if (!sectionCode.trim()) {
      setError('Section code is required');
      return;
    }

    try {
      await onSubmit(sectionCode.trim());
      setSectionCode('');
      onClose();
    } catch (err) {
      setError(extractErrorMessageFromError(err) || 'Failed to join section');
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setSectionCode('');
      setError('');
      onClose();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSectionCode(e.target.value);
    setError('');
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      data-cy="join-section-modal"
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pb: 1,
          color: '#1B6A9C',
          fontWeight: 600,
        }}
      >
        Join Section
        <IconButton
          onClick={handleClose}
          disabled={isLoading}
          sx={{ color: 'grey.500' }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 2 }}>
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 3, lineHeight: 1.5 }}
            >
              Enter the section code provided by your instructor to join the
              section.
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <TextField
              fullWidth
              label="Section Code"
              value={sectionCode}
              onChange={handleInputChange}
              placeholder="Enter section code"
              disabled={isLoading}
              autoFocus
              variant="outlined"
              data-cy="section-code-input"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#1B6A9C',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#1B6A9C',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#1B6A9C',
                },
              }}
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button
            onClick={handleClose}
            disabled={isLoading}
            variant="outlined"
            data-cy="join-section-cancel-button"
            sx={{
              color: 'grey.600',
              borderColor: 'grey.300',
              '&:hover': {
                borderColor: 'grey.400',
                backgroundColor: 'grey.50',
              },
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading || !sectionCode.trim()}
            data-cy="join-section-submit-button"
            sx={{
              backgroundColor: '#1B6A9C',
              '&:hover': {
                backgroundColor: '#145a87',
              },
              '&:disabled': {
                backgroundColor: 'grey.300',
              },
            }}
          >
            {isLoading ? 'Joining...' : 'Join Section'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default JoinSectionModal;
