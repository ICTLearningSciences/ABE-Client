import { Box, Stack } from '@mui/material';
import {
  Assignment,
  Section,
} from '../../../../store/slices/education-management/types';
import { Typography } from '@mui/material';
import OptionalRequirements from '../optional-requirements';
import { Grid } from '@mui/material';
import AssignmentCard from '../assignment-card';
import { UseWithEducationalManagement } from '../../../../store/slices/education-management/use-with-educational-management';
import React, { useEffect, useMemo, useState } from 'react';
import { reorderArray } from '../../helpers';

export function SectionAssignmentList(props: {
  assignments: Assignment[];
  title: string;
  getAssignmentGrade: (assignmentId: string) =>
    | {
        grade: number;
        comment: string;
      }
    | undefined;
  options: {
    showCompletionCounter?: boolean;
    completedCount?: number;
    showOptionalRequirements?: boolean;
  };
  section: Section;
  courseId: string;
  sectionId: string;
  isStudentView: boolean;
  onAssignmentSelect: (assignmentId: string) => void;
  educationManagement: UseWithEducationalManagement;
}) {
  const {
    assignments,
    title,
    getAssignmentGrade,
    options,
    section,
    courseId,
    sectionId,
    isStudentView,
    onAssignmentSelect,
    educationManagement,
  } = props;
  const myId = educationManagement.myData?.userId;
  const studentAssignmentProgress = useMemo(() => {
    if (!myId) return undefined;
    return educationManagement.allSectionsStudentsProgress[sectionId][myId];
  }, [educationManagement.allSectionsStudentsProgress, sectionId, myId]);
  const [optionalAssignmentsRequired, setOptionalAssignmentsRequired] =
    useState(0);
  const numOptionalAssignments = useMemo(
    () => section.assignments.filter((sa) => !sa.mandatory).length,
    [section]
  );
  const [updateInProgress, setUpdateInProgress] = useState(false);

  const getIsCompleted = useMemo(() => {
    return (assignment: Assignment) => {
      const assignmentProgress =
        studentAssignmentProgress?.requiredAssignmentsProgress[assignment._id];
      return assignmentProgress ?? false;
    };
  }, [educationManagement.myData, assignments]);

  // track number of mandatory, and how many are completed
  const assignmentCompletionData = useMemo(() => {
    const numMandatory = Object.keys(
      studentAssignmentProgress?.requiredAssignmentsProgress ?? {}
    ).length;
    const numMandatoryCompleted = Object.values(
      studentAssignmentProgress?.requiredAssignmentsProgress ?? {}
    ).filter((isCompleted) => isCompleted).length;
    const numOptional = Object.keys(
      studentAssignmentProgress?.optionalAssignmentsProgress ?? {}
    ).length;
    const numOptionalCompleted = Object.values(
      studentAssignmentProgress?.optionalAssignmentsProgress ?? {}
    ).filter((isCompleted) => isCompleted).length;
    return {
      numMandatory,
      numMandatoryCompleted,
      numOptional,
      numOptionalCompleted,
    };
  }, [studentAssignmentProgress]);

  useEffect(() => {
    if (section) {
      setOptionalAssignmentsRequired(
        section.numOptionalAssignmentsRequired || 0
      );
    }
  }, [section]);
  if (assignments.length === 0) return null;

  const handleOptionalRequiredChange = async (value: number) => {
    if (!section) return;
    try {
      await educationManagement.updateSection(courseId, {
        _id: sectionId,
        numOptionalAssignmentsRequired: value,
      });
      setOptionalAssignmentsRequired(value);
    } catch (error) {
      console.error('Failed to update optional assignments required:', error);
    }
  };

  const handleAssignmentOrderChange = async (
    assignmentId: string,
    direction: 'up' | 'down'
  ) => {
    if (!section || !section.assignmentOrder) return;
    setUpdateInProgress(true);

    const newAssignmentOrder = reorderArray(
      section.assignmentOrder,
      assignmentId,
      direction
    );

    try {
      await educationManagement.updateSection(courseId, {
        _id: sectionId,
        assignmentOrder: newAssignmentOrder,
      });
    } catch (error) {
      console.error('Failed to update assignment order:', error);
    } finally {
      setUpdateInProgress(false);
    }
  };

  const { showCompletionCounter = false, showOptionalRequirements = false } =
    options;

  return (
    <Box sx={{ mb: 4 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 2 }}
      >
        <Typography
          variant="h6"
          sx={{ fontWeight: 600, color: 'text.primary' }}
        >
          {title}
        </Typography>
        {showCompletionCounter ? (
          <Typography
            variant="body2"
            color="text.secondary"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
            }}
          >
            {assignmentCompletionData.numMandatory && (
              <Typography variant="body2" color="text.primary">
                Required Assignments completed:{' '}
                {assignmentCompletionData.numMandatoryCompleted}/
                {assignmentCompletionData.numMandatory}
              </Typography>
            )}
            {assignmentCompletionData.numOptional && (
              <Typography variant="body2" color="text.secondary">
                Optional Assignments completed:{' '}
                {assignmentCompletionData.numOptionalCompleted}/
                {assignmentCompletionData.numOptional}
              </Typography>
            )}
          </Typography>
        ) : (
          <Typography variant="body2" color="text.secondary">
            {assignments.length} assignment
            {assignments.length !== 1 ? 's' : ''}
          </Typography>
        )}
      </Stack>

      {showOptionalRequirements && (
        <OptionalRequirements
          isStudentView={isStudentView}
          optionalAssignmentsRequired={optionalAssignmentsRequired}
          totalOptionalAssignments={numOptionalAssignments}
          onRequiredChange={setOptionalAssignmentsRequired}
          onRequiredUpdate={handleOptionalRequiredChange}
        />
      )}

      <Grid container spacing={2}>
        {section.assignmentOrder.map((assignmentId, index) => {
          const assignment = assignments.find((a) => a._id === assignmentId);
          if (!assignment) return null;
          const sectionAssignment = section.assignments.find(
            (sa) => sa.assignmentId === assignmentId
          );
          if (!sectionAssignment) return null;

          const isFirst = index === 0;
          const isLast = index === section.assignmentOrder!.length - 1;

          return (
            <Grid item xs={12} key={assignment._id}>
              <AssignmentCard
                assignment={assignment}
                onClick={onAssignmentSelect}
                assignmentGrade={getAssignmentGrade(assignment._id)}
                isCompleted={getIsCompleted(assignment)}
                onAssignmentOrderChange={handleAssignmentOrderChange}
                isFirst={isFirst}
                isLast={isLast}
                isAssignmentMandatory={sectionAssignment.mandatory}
                onMandatoryChange={async (assignmentId, mandatory) => {
                  setUpdateInProgress(true);
                  return educationManagement
                    .updateAssignmentMandatory(assignmentId, mandatory)
                    .finally(() => {
                      setUpdateInProgress(false);
                    });
                }}
                updateInProgress={updateInProgress}
              />
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
