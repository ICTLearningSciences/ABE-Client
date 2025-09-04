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
  FormControlLabel,
  Checkbox,
  FormLabel,
  Select,
  FormControl,
  MenuItem,
  Collapse,
} from '@mui/material';
import { Close as CloseIcon, ExpandMore as ExpandMoreIcon, ExpandLess as ExpandLessIcon } from '@mui/icons-material';
import {
  Assignment,
  Section,
} from '../../../store/slices/education-management/types';
import { useWithConfig } from '../../../exported-files';
import { aiServiceModelStringParse, aiServiceModelToString } from '../../../helpers';
import { useAppSelector } from '../../../store/hooks';

export enum AssignmentModalMode {
  CREATE = 'create',
  EDIT = 'edit',
}

interface AssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (assignmentData: Partial<Assignment>, mandatory: boolean) => void;
  mode: AssignmentModalMode;
  section: Section;
  initialData?: Assignment;
  isLoading?: boolean;
}

const AssignmentModal: React.FC<AssignmentModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  mode,
  section,
  initialData,
  isLoading = false,
}) => {
  const {availableAiServiceModels} = useWithConfig();
  const [formData, setFormData] = useState<Partial<Assignment>>({
    title: '',
    description: '',
    defaultLLM: undefined
  });
  const globalDefaultAiServiceModel = useAppSelector(
    (state) => state.config.config?.defaultAiModel
  );
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const _initialMandatory = section.assignments.find(
    (a) => a.assignmentId === initialData?._id
  )?.mandatory;
  const initialMandatory =
    _initialMandatory !== undefined ? _initialMandatory : true;
  const [mandatory, setMandatory] = useState<boolean>(initialMandatory);
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      if (mode === AssignmentModalMode.EDIT && initialData) {
        setFormData({
          title: initialData.title || '',
          description: initialData.description || '',
          defaultLLM: initialData.defaultLLM || undefined,
        });
        setMandatory(initialMandatory);
      } else {
        setFormData({
          title: '',
          description: '',
          defaultLLM: undefined,
        });
        setMandatory(initialMandatory);
      }
      setErrors({});
      setShowAdvanced(false);
    }
  }, [isOpen, mode, initialData, initialMandatory]);

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
      activityIds:
        mode === AssignmentModalMode.EDIT ? initialData?.activityIds || [] : [],
      defaultLLM: formData.defaultLLM || undefined,
    };

    if (mode === AssignmentModalMode.EDIT && initialData) {
      submitData._id = initialData._id;
    }

    onSubmit(submitData, mandatory);
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

  const handleDefaultLLMChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      defaultLLM: aiServiceModelStringParse(value),
    }));
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      data-cy="assignment-modal"
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
        data-cy="assignment-modal-title"
      >
        {mode === AssignmentModalMode.CREATE
          ? 'Create New Assignment'
          : 'Edit Assignment'}
        <IconButton
          onClick={onClose}
          disabled={isLoading}
          size="small"
          sx={{ color: 'grey.500' }}
          data-cy="assignment-modal-close-button"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent style={{
        display:"flex",
        flexDirection:"column",
        gap:2
      }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {mode === AssignmentModalMode.CREATE
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
            data-cy="assignment-modal-title-input"
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
            data-cy="assignment-modal-description-input"
          />

          {section && (
            <FormControlLabel
              control={
                <Checkbox
                  checked={mandatory}
                  onChange={(e) => setMandatory(e.target.checked)}
                  disabled={isLoading}
                  sx={{
                    color: '#1B6A9C',
                    '&.Mui-checked': {
                      color: '#1B6A9C',
                    },
                  }}
                />
              }
              label={
                <Typography variant="body2" color="text.primary">
                  Required Assignment
                </Typography>
              }
              sx={{ mb: 2.5 }}
              data-cy="assignment-modal-mandatory-checkbox"
            />
          )}

          <Button
          fullWidth
            variant="text"
            onClick={() => setShowAdvanced(!showAdvanced)}
            startIcon={showAdvanced ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            sx={{
              color: '#1B6A9C',
              textTransform: 'none',
              justifyContent: 'flex-start',
              mb: 1,
            }}
            data-cy="assignment-modal-advanced-toggle"
          >
            Advanced Options
          </Button>

          <Collapse in={showAdvanced}>
            <FormControl fullWidth sx={{ mt: 1 }}>
              <FormLabel>Default LLM</FormLabel>
              <Select
                value={formData.defaultLLM ? aiServiceModelToString(formData.defaultLLM) : globalDefaultAiServiceModel ? aiServiceModelToString(globalDefaultAiServiceModel) : ''}
                onChange={(e) => handleDefaultLLMChange(e.target.value)}
                data-cy="assignment-modal-default-llm-select"
              >
                {availableAiServiceModels.map((service) => {
                  return service.models.map((model) => {
                    const serviceString = aiServiceModelToString({
                      serviceName: service.serviceName,
                      model: model,
                    });
                    return <MenuItem key={serviceString} value={serviceString}>
                      {serviceString}
                    </MenuItem>
                });
                })}
              </Select>
            </FormControl>
          </Collapse>
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
          data-cy="assignment-modal-cancel-button"
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
          data-cy="assignment-modal-submit-button"
        >
          {isLoading
            ? 'Saving...'
            : mode === AssignmentModalMode.CREATE
            ? 'Create Assignment'
            : 'Update Assignment'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AssignmentModal;
