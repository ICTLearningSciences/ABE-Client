/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React from 'react';
import { Typography, Stack, TextField } from '@mui/material';

interface OptionalRequirementsProps {
  isStudentView: boolean;
  optionalAssignmentsRequired: number;
  totalOptionalAssignments: number;
  onRequiredChange: (value: number) => void;
  onRequiredUpdate: (value: number) => void;
}

const OptionalRequirements: React.FC<OptionalRequirementsProps> = ({
  isStudentView,
  optionalAssignmentsRequired,
  totalOptionalAssignments,
  onRequiredChange,
  onRequiredUpdate,
}) => {
  if (isStudentView) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        You are required to complete {optionalAssignmentsRequired} optional
        assignments
      </Typography>
    );
  }

  return (
    <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
      <Typography variant="body2" color="text.secondary">
        Students are required to complete
      </Typography>
      <TextField
        type="number"
        size="small"
        value={optionalAssignmentsRequired}
        onChange={(e) => {
          const value = Math.max(0, parseInt(e.target.value) || 0);
          onRequiredChange(value);
        }}
        onBlur={() => onRequiredUpdate(optionalAssignmentsRequired)}
        sx={{ width: 80 }}
        inputProps={{ min: 0, max: totalOptionalAssignments }}
      />
      <Typography variant="body2" color="text.secondary">
        optional assignments
      </Typography>
    </Stack>
  );
};

export default OptionalRequirements;
