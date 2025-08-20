import ViewUserGoogleDocs from '../../../components/admin-view/admin-view-docs';
import DocView from '../../../components/doc-view';
import React, { useState } from 'react';
import { useWithEducationalManagement } from '../../../store/slices/education-management/use-with-educational-management';
import { ColumnDiv } from '../../../styled-components';
import { Typography, Box } from '@mui/material';
import { CheckCircle, RadioButtonUnchecked } from '@mui/icons-material';

export function ActivityView(props: {
  activityId: string;
  assignmentId: string;
}): JSX.Element {
  const { activityId, assignmentId } = props;
  const [selectedDocId, setSelectedDocId] = useState<string>();

  const educationManagement = useWithEducationalManagement();

  const haveICompletedActivity = educationManagement.haveICompletedActivity(
    assignmentId,
    activityId
  );

  if (!selectedDocId) {
    return (
      <ViewUserGoogleDocs
        goToDoc={(docId: string) => {
          setSelectedDocId(docId);
        }}
        onHistoryClicked={() => {
          console.log('history clicked');
        }}
      />
    );
  }

  return (
    <ColumnDiv style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          p: 2,
        }}
      >
        {haveICompletedActivity ? (
          <>
            <CheckCircle
              sx={{
                color: 'green',
                fontSize: '28px',
              }}
            />
            <Typography
              variant="body2"
              sx={{
                color: 'green',
                fontWeight: 500,
              }}
            >
              Complete
            </Typography>
          </>
        ) : (
          <>
            <RadioButtonUnchecked
              sx={{
                color: 'grey.400',
                fontSize: '28px',
              }}
            />
            <Typography
              variant="body2"
              sx={{
                color: 'grey.400',
                fontWeight: 500,
              }}
            >
              Incomplete
            </Typography>
          </>
        )}
      </Box>
      <DocView docId={selectedDocId} disableActivitySelector={true} />
    </ColumnDiv>
  );
}
