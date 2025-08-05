/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  IconButton,
  Box,
} from '@mui/material';
import {
  Close as CloseIcon,
  Warning as WarningIcon,
  Delete as TrashIcon,
} from '@mui/icons-material';

interface DeleteConfirmationModalProps {
  onDelete: () => void;
  entityType: 'course' | 'section' | 'assignment';
  entityName: string;
  isLoading?: boolean;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  onDelete,
  entityType,
  entityName,
  isLoading = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const getEntityIcon = () => {
    switch (entityType) {
      case 'course':
        return '📚';
      case 'section':
        return '📑';
      case 'assignment':
        return '📝';
      default:
        return '🗑️';
    }
  };

  return (
    <div>
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            p: 1,
          },
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            color: '#d32f2f',
            fontWeight: 600,
            fontSize: '1.25rem',
          }}
        >
          <div />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <WarningIcon sx={{ color: '#d32f2f' }} />
            Delete {entityType.charAt(0).toUpperCase() + entityType.slice(1)}
          </Box>
          <IconButton
            onClick={() => setIsOpen(false)}
            disabled={isLoading}
            size="small"
            sx={{ color: 'grey.500' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography sx={{ fontSize: '64px', mb: 2 }}>
              {getEntityIcon()}
            </Typography>

            <Typography
              variant="h6"
              sx={{
                mb: 2,
                color: 'text.primary',
                fontWeight: 500,
              }}
            >
              Are you sure you want to delete {entityName}?
            </Typography>

            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mb: 2, lineHeight: 1.5 }}
            >
              This will permanently delete the {entityType} and all associated
              data.
            </Typography>
          </Box>

          <Typography
            variant="body2"
            color="text.disabled"
            sx={{
              textAlign: 'center',
              fontStyle: 'italic',
            }}
          >
            This action cannot be undone.
          </Typography>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setIsOpen(false)}
            disabled={isLoading}
            variant="outlined"
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
            onClick={onDelete}
            disabled={isLoading}
            variant="contained"
            color="error"
            sx={{
              backgroundColor: '#d32f2f',
              '&:hover': {
                backgroundColor: '#b71c1c',
              },
            }}
          >
            {isLoading
              ? 'Deleting...'
              : `Delete ${
                  entityType.charAt(0).toUpperCase() + entityType.slice(1)
                }`}
          </Button>
        </DialogActions>
      </Dialog>
      <IconButton
        sx={{
          color: 'red',
          borderColor: 'red',
          '&:hover': {
            backgroundColor: 'red',
            color: 'white',
          },
          marginLeft: 2,
        }}
        onClick={() => setIsOpen(true)}
      >
        {' '}
        <TrashIcon />{' '}
      </IconButton>
    </div>
  );
};

export default DeleteConfirmationModal;
