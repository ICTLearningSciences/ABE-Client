/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/

import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Modal,
  TextField,
  Rating,
  Stack,
} from "@mui/material";
import { useWithEducationalManagement } from "../../../../store/slices/education-management/use-with-educational-management";
import {
  type Assignment,
  type StudentData,
  isInstructorData,
} from "../../../../store/slices/education-management";
import { extractErrorMessageFromError } from "../../../../helpers";

export interface AssignmentGraderProps {
  student: StudentData;
  assignment: Assignment;
}

export function AssignmentGrader({
  student,
  assignment,
}: AssignmentGraderProps) {
  const { gradeStudentAssignment, myData } = useWithEducationalManagement();
  const assignmentGrade = student.assignmentProgress.find(
    (a) => a.assignmentId === assignment._id,
  )?.instructorGrade;
  const [grade, setGrade] = useState(assignmentGrade?.grade || 5);
  const [comment, setComment] = useState(assignmentGrade?.comment || "");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleGrade = async () => {
    setIsLoading(true);
    setErrorMessage("");

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
        border: "2px dashed #000",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 1,
        margin: 2,
      }}
    >
      {assignmentGrade ? (
        <Box data-cy="graded-assignment">
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
          No Review
        </Typography>
      )}

      {myData && isInstructorData(myData) && (
        <Button
          variant="contained"
          onClick={() => setIsModalOpen(true)}
          disabled={isLoading}
          data-cy="grade-assignment-button"
        >
          Review
        </Button>
      )}

      <Modal open={isModalOpen} aria-labelledby="grade-assignment-modal">
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography
            id="grade-assignment-modal"
            variant="h6"
            component="h2"
            gutterBottom
            style={{ textAlign: "center" }}
          >
            Review Assignment
          </Typography>

          <Stack spacing={3}>
            <Box>
              <Typography component="legend">Grade</Typography>
              <Rating
                data-cy="grade-rating"
                name="grade-rating"
                value={grade}
                onChange={(_event, newValue) => {
                  setGrade(newValue || 5);
                }}
                max={5}
                size="large"
                disabled={isLoading}
              />
            </Box>

            <TextField
              data-cy="grade-comment-input"
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

            <Stack
              direction="row"
              spacing={2}
              style={{ justifyContent: "flex-end" }}
            >
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
                {isLoading ? "Submitting..." : "Submit Review"}
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Modal>
    </Box>
  );
}
