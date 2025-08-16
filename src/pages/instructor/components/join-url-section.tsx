import {
  Box,
  Modal,
  Typography,
  Button,
  Paper,
  Stack,
  Divider,
} from '@mui/material';
import {
  isInstructorData,
  LoadStatus,
} from '../../../store/slices/education-management';
import { useWithEducationalManagement } from '../../../store/slices/education-management/use-with-educational-management';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export const queryParamSectionCode = 'sectionCode';

export function JoinUrlSection() {
  // 1. On login, check if student, then for sectionCode
  // 2. Check if user is already in that section (it will be within sections, because onlys pulls ones that the student is in)
  // 3. If they are not in that section, display modal for joining that section
  // 4. If accept, then enroll student in that section, done!
  const [urlParams] = useSearchParams();

  const {
    myData,
    sectionsLoadState,
    isLoading,
    sections,
    enrollStudentInSection,
  } = useWithEducationalManagement();
  const [checkResults, setCheckResults] = useState<
    { inSection: boolean; targetSectionCode: string } | undefined
  >(undefined);
  const [checkedOnce, setCheckedOnce] = useState(false);
  const [open, setOpen] = useState(false);
  const [isJoining, setIsJoining] = useState(false);

  useEffect(() => {
    // Wait for everything to be loaded first
    if (
      sectionsLoadState !== LoadStatus.SUCCEEDED ||
      !myData ||
      !urlParams ||
      checkResults !== undefined
    ) {
      return;
    }
    // Get section code from URL
    const targetSectionCode = urlParams.get(queryParamSectionCode);
    if (!targetSectionCode) {
      return;
    }
    // Find the target section
    const targetSection = sections.find(
      (section) => section.sectionCode === targetSectionCode
    );
    // Check if user is already in the section
    const inSection =
      !isInstructorData(myData) &&
      targetSection &&
      myData.enrolledSections.some(
        (sectionId) => sectionId === targetSection._id
      );
    // remove the section code from the url
    setCheckResults({ inSection: inSection ?? false, targetSectionCode });
  }, [sectionsLoadState, isLoading, myData, urlParams, sections]);

  useEffect(() => {
    // Only check once after everything is loaded
    if (
      checkResults === undefined ||
      !myData ||
      isInstructorData(myData) ||
      checkedOnce
    ) {
      return;
    }
    setCheckedOnce(true);
    if (!checkResults.inSection) {
      setOpen(true);
    }
  }, [checkResults, myData]);

  const handleJoinSection = async () => {
    if (!myData || isInstructorData(myData) || !checkResults?.targetSectionCode)
      return;

    setIsJoining(true);
    try {
      await enrollStudentInSection(
        myData.userId,
        checkResults.targetSectionCode
      );
      setOpen(false);
    } catch (error) {
      console.error('Failed to join section:', error);
    } finally {
      setIsJoining(false);
    }
  };

  const handleDecline = () => {
    setOpen(false);
  };

  return (
    <Modal
      open={open}
      onClose={handleDecline}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Paper
        elevation={8}
        sx={{
          maxWidth: 500,
          width: '100%',
          p: 4,
          borderRadius: 2,
          position: 'relative',
        }}
      >
        <Stack spacing={3}>
          {/* Header */}
          <Box textAlign="center">
            <Typography
              variant="h5"
              component="h2"
              fontWeight="bold"
              color="primary"
            >
              Join Section
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              You&apos;ve been invited to join a course section
            </Typography>
          </Box>

          <Divider />

          {/* Section Details */}
          {checkResults?.targetSectionCode && (
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Section Code: <strong>{checkResults.targetSectionCode}</strong>
              </Typography>
            </Box>
          )}

          {/* Description */}
          <Box>
            <Typography variant="body1" paragraph>
              By joining this section, you&apos;ll have access to:
            </Typography>
            <Box component="ul" sx={{ pl: 2, m: 0 }}>
              <Typography component="li" variant="body2" color="text.secondary">
                Course materials and assignments
              </Typography>
              <Typography component="li" variant="body2" color="text.secondary">
                Interactive learning activities
              </Typography>
              <Typography component="li" variant="body2" color="text.secondary">
                Progress tracking
              </Typography>
            </Box>
          </Box>

          <Divider />

          {/* Action Buttons */}
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button
              variant="outlined"
              onClick={handleDecline}
              disabled={isJoining}
              sx={{ minWidth: 120 }}
            >
              Decline
            </Button>
            <Button
              variant="contained"
              onClick={handleJoinSection}
              disabled={isJoining}
              sx={{ minWidth: 120 }}
            >
              {isJoining ? 'Joining...' : 'Join Section'}
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Modal>
  );
}
