/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React, { useMemo, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  Grid,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Modal,
} from '@mui/material';
import {
  Add as AddIcon,
  TextSnippet as ViewDocumentTimelineIcon,
} from '@mui/icons-material';
import { ActivityBuilder } from '../../../components/activity-builder/types';
import {
  Assignment,
  isStudentData,
} from '../../../store/slices/education-management/types';
import { LLMSelector } from './assignment-view/llm-selector';
import { useWithEducationalManagement } from '../../../store/slices/education-management/use-with-educational-management';
import { AiServiceModel } from '../../../types';
import { getStudentActivityCompletionData, reorderArray } from '../helpers';
import { AssignmentActivityListItem } from './assignment-view/assignment-activity-list-item';

interface AssignmentActivitiesDisplayProps {
  assignment: Assignment;
  builtActivities: ActivityBuilder[];
  availableActivities: ActivityBuilder[];
  isStudentView: boolean;
  isAssignmentModifying?: boolean;
  onAddActivity: (activityId: string) => Promise<void>;
  onRemoveActivity: (activityId: string) => Promise<void>;
  onActivitySelect: (activityId: string) => void;
  activityIdToCompletionStatus: Record<string, boolean>;
  onViewDocumentTimeline: (studentId: string, assignmentId: string) => void;
}

const AssignmentActivitiesDisplay: React.FC<
  AssignmentActivitiesDisplayProps
> = ({
  assignment,
  builtActivities,
  availableActivities,
  isStudentView,
  isAssignmentModifying = false,
  onAddActivity,
  onRemoveActivity,
  onActivitySelect,
  activityIdToCompletionStatus,
  onViewDocumentTimeline,
}) => {
  const [selectedActivityId, setSelectedActivityId] = useState<string>('');
  const { myData, studentActivityDefaultLLMSet, viewState, updateAssignment } =
    useWithEducationalManagement();
  const [llmChangeLoading, setLlmChangeLoading] = useState(false);
  const [llmModalOpen, setLlmModalOpen] = useState(false);
  const [selectedActivityForLLM, setSelectedActivityForLLM] =
    useState<string>('');
  const hasRelevantGoogleDocs =
    myData &&
    isStudentData(myData) &&
    (myData.assignmentProgress.find((a) => a.assignmentId === assignment._id)
      ?.relevantGoogleDocs.length || 0) > 0;
  const selectedActivityForLLMDefaultLLM = useMemo(
    () =>
      myData && isStudentData(myData)
        ? getStudentActivityCompletionData(
            myData,
            assignment._id,
            selectedActivityForLLM
          )?.defaultLLM
        : undefined,
    [selectedActivityForLLM, myData, assignment._id]
  );
  const handleAddActivity = async () => {
    if (!selectedActivityId) return;

    try {
      await onAddActivity(selectedActivityId);
      setSelectedActivityId(''); // Reset selection
    } catch (error) {
      console.error('Failed to add activity to assignment:', error);
    }
  };

  const handleRemoveActivity = async (activityIdToRemove: string) => {
    try {
      await onRemoveActivity(activityIdToRemove);
    } catch (error) {
      console.error('Failed to remove activity from assignment:', error);
    }
  };

  async function handleLLMChange(defaultLLM: AiServiceModel) {
    if (!myData || !isStudentData(myData) || !selectedActivityForLLM) return;
    setLlmChangeLoading(true);
    try {
      if (
        !viewState.selectedCourseId ||
        !viewState.selectedSectionId ||
        !viewState.selectedAssignmentId
      )
        throw new Error('View state not found');
      await studentActivityDefaultLLMSet(
        myData.userId,
        viewState.selectedCourseId,
        viewState.selectedSectionId,
        viewState.selectedAssignmentId,
        selectedActivityForLLM,
        defaultLLM
      );
      setLlmModalOpen(false);
    } catch (error) {
      console.error('Failed to change activity default LLM:', error);
    } finally {
      setLlmChangeLoading(false);
    }
  }

  async function handleActivityOrderChange(
    activityId: string,
    upOrDown: 'up' | 'down'
  ) {
    if (!viewState.selectedCourseId || !assignment._id) return;
    const newActivityOrder = reorderArray(
      assignment.activityOrder,
      activityId,
      upOrDown
    );
    try {
      await updateAssignment(viewState.selectedCourseId, {
        _id: assignment._id,
        activityOrder: newActivityOrder,
      });
    } catch (error) {
      console.error('Failed to change activity order:', error);
    }
  }

  function handleOpenLLMModal(activityId: string) {
    setSelectedActivityForLLM(activityId);
    setLlmModalOpen(true);
  }

  return (
    <Box>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 2.5 }}
      >
        <Typography
          variant="h5"
          sx={{ fontWeight: 600, color: 'text.primary' }}
        >
          Activities
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {assignment.activityIds.length} activit
          {assignment.activityIds.length !== 1 ? 'ies' : 'y'}
        </Typography>
      </Stack>

      {/* View Document Timeline Button */}
      {isStudentView && (
        <Button
          variant="contained"
          disabled={
            !myData ||
            !myData.userId ||
            !isStudentData(myData) ||
            !hasRelevantGoogleDocs
          }
          style={{
            marginBottom: 10,
            textTransform: 'none',
          }}
          onClick={() => {
            if (!myData || !myData.userId) return;
            onViewDocumentTimeline(myData.userId, assignment._id);
          }}
        >
          <ViewDocumentTimelineIcon />
          View Document Timeline
        </Button>
      )}

      {/* Add Activity Section */}
      {!isStudentView && (
        <Card variant="outlined" sx={{ mb: 3, p: 2.5 }}>
          <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
            Add Activity
          </Typography>

          {availableActivities.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No more activities available to add to this assignment.
            </Typography>
          ) : (
            <Stack direction="row" spacing={2} alignItems="center">
              <FormControl fullWidth>
                <InputLabel id="activity-select-label">
                  Select Activity
                </InputLabel>
                <Select
                  labelId="activity-select-label"
                  value={selectedActivityId}
                  label="Select Activity"
                  onChange={(e) => setSelectedActivityId(e.target.value)}
                  disabled={isAssignmentModifying}
                  data-cy="activity-select-dropdown"
                >
                  {availableActivities.map((activity) => (
                    <MenuItem key={activity._id} value={activity._id}>
                      {activity.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddActivity}
                disabled={!selectedActivityId || isAssignmentModifying}
                data-cy="add-activity-to-assignment-button"
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
                Add
              </Button>
            </Stack>
          )}
        </Card>
      )}

      {assignment.activityIds.length === 0 ? (
        <Card
          variant="outlined"
          sx={{
            border: '2px dashed',
            borderColor: 'grey.300',
            textAlign: 'center',
            py: 5,
            px: 2.5,
          }}
        >
          <Typography sx={{ fontSize: '48px', color: 'grey.300', mb: 2 }}>
            🎯
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
            No activities yet
          </Typography>
          <Typography variant="body2" color="text.disabled">
            Add your first activity to create engaging learning experiences
          </Typography>
        </Card>
      ) : (
        <Grid container spacing={2}>
          {assignment.activityOrder.map((activityId, index) => {
            const activity = builtActivities.find((a) => a._id === activityId);
            if (!activity) {
              return null;
            }
            const isComplete = activityIdToCompletionStatus[activityId];
            const isFirst = index === 0;
            const isLast = index === assignment.activityOrder.length - 1;
            return (
              <AssignmentActivityListItem
                key={activity._id}
                activity={activity}
                onActivitySelect={onActivitySelect}
                onRemoveActivity={handleRemoveActivity}
                onOpenLLMModal={handleOpenLLMModal}
                onActivityOrderChange={handleActivityOrderChange}
                isComplete={isComplete}
                isStudentView={isStudentView}
                isAssignmentModifying={isAssignmentModifying}
                isFirst={isFirst}
                isLast={isLast}
              />
            );
          })}
        </Grid>
      )}

      {/* LLM Settings Modal */}
      <Modal
        open={llmModalOpen}
        onClose={() => setLlmModalOpen(false)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            backgroundColor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            minWidth: 300,
            maxWidth: 500,
          }}
        >
          {selectedActivityForLLM && (
            <LLMSelector
              selectedLLM={selectedActivityForLLMDefaultLLM}
              handleLLMChange={handleLLMChange}
              loading={llmChangeLoading}
            />
          )}
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
            <Button
              data-cy="llm-settings-modal-close-button"
              onClick={() => setLlmModalOpen(false)}
              disabled={llmChangeLoading}
            >
              Close
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default AssignmentActivitiesDisplay;
