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
import { Course } from '../../../store/slices/education-management/types';
import { extractErrorMessageFromError } from '../../../helpers';

export enum CourseModalMode {
  CREATE = 'create',
  EDIT = 'edit',
}

interface CourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (courseData: Partial<Course>) => Promise<void>;
  mode: CourseModalMode;
  initialData?: Course;
  isLoading?: boolean;
}

const CourseModal: React.FC<CourseModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  mode,
  initialData,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<Partial<Course>>({
    title: '',
    description: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [requestError, setRequestError] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      if (mode === CourseModalMode.EDIT && initialData) {
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

    const submitData: Partial<Course> = {
      title: formData.title?.trim() || '',
      description: formData.description?.trim() || '',
    };

    if (mode === CourseModalMode.EDIT && initialData) {
      submitData._id = initialData._id;
    }

    onSubmit(submitData).catch((error) => {
      setRequestError(
        extractErrorMessageFromError(error) || 'Failed to join section'
      );
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setRequestError('');
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
      data-cy="course-modal"
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
        {mode === CourseModalMode.CREATE ? 'Create New Course' : 'Edit Course'}
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
          {mode === CourseModalMode.CREATE
            ? 'Add a new course to your curriculum. You can add sections and assignments later.'
            : 'Update the course information below.'}
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            required
            label="Title"
            placeholder="e.g., Introduction to React"
            value={formData.title || ''}
            onChange={(e) => handleInputChange('title', e.target.value)}
            error={!!errors.title}
            helperText={errors.title}
            disabled={isLoading}
            data-cy="course-title-input"
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
            placeholder="Brief description of the course..."
            value={formData.description || ''}
            onChange={(e) => handleInputChange('description', e.target.value)}
            error={!!errors.description}
            helperText={errors.description}
            disabled={isLoading}
            data-cy="course-description-input"
            sx={{ mb: 3 }}
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
      {requestError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {requestError}
        </Alert>
      )}

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={onClose}
          disabled={isLoading}
          variant="outlined"
          data-cy="course-modal-cancel-button"
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
          data-cy="course-modal-submit-button"
          sx={{
            backgroundColor: '#1B6A9C',
            '&:hover': {
              backgroundColor: '#145a87',
            },
          }}
        >
          {isLoading
            ? 'Saving...'
            : mode === CourseModalMode.CREATE
            ? 'Create Course'
            : 'Update Course'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CourseModal;
