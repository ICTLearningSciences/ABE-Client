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
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { Assignment } from '../../../store/slices/education-management/types';

interface AssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (assignmentData: Partial<Assignment>) => void;
  mode: 'create' | 'edit';
  sectionId?: string;
  initialData?: Assignment;
  isLoading?: boolean;
}

const AssignmentModal: React.FC<AssignmentModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  mode,
  sectionId,
  initialData,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<Partial<Assignment>>({
    title: '',
    description: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && initialData) {
        setFormData({
          title: initialData.title || '',
          description: initialData.description || '',
        });
      } else {
        setFormData({
          title: '',
          description: '',
        });
      }
      setErrors({});
    }
  }, [isOpen, mode, initialData]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.title?.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description?.trim()) {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const submitData: Partial<Assignment> = {
      title: formData.title?.trim() || '',
      description: formData.description?.trim() || '',
      activityIds: mode === 'edit' ? initialData?.activityIds || [] : [],
    };

    if (mode === 'edit' && initialData) {
      submitData._id = initialData._id;
    }

    onSubmit(submitData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
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
          color: '#1B6A9C',
          fontWeight: 600,
          fontSize: '1.25rem',
        }}
      >
        {mode === 'create' ? 'Create New Assignment' : 'Edit Assignment'}
        <IconButton
          onClick={onClose}
          disabled={isLoading}
          size="small"
          sx={{ color: 'grey.500' }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {mode === 'create'
            ? 'Create a new assignment with activities and learning objectives. You can add activities later.'
            : 'Update the assignment information below.'}
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            required
            label="Title"
            placeholder="e.g., Introduction to Variables"
            value={formData.title || ''}
            onChange={(e) => handleInputChange('title', e.target.value)}
            error={!!errors.title}
            helperText={errors.title}
            disabled={isLoading}
            sx={{ mb: 2.5 }}
            InputProps={{
              sx: {
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#1B6A9C',
                },
              },
            }}
            InputLabelProps={{
              sx: {
                '&.Mui-focused': {
                  color: '#1B6A9C',
                },
              },
            }}
          />

          <TextField
            fullWidth
            required
            multiline
            rows={4}
            label="Description"
            placeholder="Brief description of the assignment objectives and content..."
            value={formData.description || ''}
            onChange={(e) => handleInputChange('description', e.target.value)}
            error={!!errors.description}
            helperText={errors.description}
            disabled={isLoading}
            sx={{ mb: sectionId ? 2.5 : 3 }}
            InputProps={{
              sx: {
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#1B6A9C',
                },
              },
            }}
            InputLabelProps={{
              sx: {
                '&.Mui-focused': {
                  color: '#1B6A9C',
                },
              },
            }}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={onClose}
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
          onClick={handleSubmit}
          disabled={isLoading}
          variant="contained"
          sx={{
            backgroundColor: '#1B6A9C',
            '&:hover': {
              backgroundColor: '#145a87',
            },
          }}
        >
          {isLoading
            ? 'Saving...'
            : mode === 'create'
            ? 'Create Assignment'
            : 'Update Assignment'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AssignmentModal;
