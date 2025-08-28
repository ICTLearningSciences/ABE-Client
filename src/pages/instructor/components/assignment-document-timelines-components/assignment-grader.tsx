import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Modal,
  TextField,
  Rating,
  Stack,
} from '@mui/material';
import { useWithEducationalManagement } from '../../../../store/slices/education-management/use-with-educational-management';
import {
  Assignment,
  StudentData,
} from '../../../../store/slices/education-management';
import { extractErrorMessageFromError } from '../../../../helpers';

export interface AssignmentGraderProps {
  student: StudentData;
  assignment: Assignment;
}

export function AssignmentGrader({
  student,
  assignment,
}: AssignmentGraderProps) {
  const { gradeStudentAssignment } = useWithEducationalManagement();
  const assignmentGrade = student.assignmentProgress.find(
    (a) => a.assignmentId === assignment._id
  )?.instructorGrade;
  const [grade, setGrade] = useState(assignmentGrade?.grade || 5);
  const [comment, setComment] = useState(assignmentGrade?.comment || '');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleGrade = async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      await gradeStudentAssignment(grade, comment);
      setIsModalOpen(false);
    } catch (error) {
      setErrorMessage(extractErrorMessageFromError(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      style={{
        border: '2px dashed #000',
        borderRadius: 2,
        padding: 10,
      }}
    >
      {assignmentGrade ? (
        <Box sx={{ mb: 2 }} data-cy="graded-assignment">
          <Typography variant="body2" color="darkgreen">
            Grade: {assignmentGrade.grade}/5
          </Typography>
        </Box>
      ) : (
        <Typography
          variant="body2"
          color="textSecondary"
          sx={{ mb: 2, fontWeight: 600 }}
          data-cy="not-graded-assignment"
        >
          Not graded
        </Typography>
      )}

      <Button
        variant="contained"
        onClick={() => setIsModalOpen(true)}
        disabled={isLoading}
        data-cy="grade-assignment-button"
      >
        Grade
      </Button>

      <Modal open={isModalOpen} aria-labelledby="grade-assignment-modal">
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography
            id="grade-assignment-modal"
            variant="h6"
            component="h2"
            gutterBottom
            textAlign="center"
          >
            Grade Assignment
          </Typography>

          <Stack spacing={3}>
            <Box>
              <Typography component="legend">Grade</Typography>
              <Rating
                data-cy="grade-rating"
                name="grade-rating"
                value={grade}
                onChange={(event, newValue) => {
                  setGrade(newValue || 5);
                }}
                max={5}
                size="large"
                disabled={isLoading}
              />
            </Box>

            <TextField
              inputProps={{
                'data-cy': 'grade-comment-input',
              }}
              fullWidth
              label="Comment"
              multiline
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              disabled={isLoading}
            />

            {errorMessage && (
              <Typography color="error" variant="body2">
                {errorMessage}
              </Typography>
            )}

            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button
                onClick={() => setIsModalOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleGrade}
                disabled={isLoading}
                data-cy="grade-assignment-submit-button"
              >
                {isLoading ? 'Grading...' : 'Submit Grade'}
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Modal>
    </Box>
  );
}
