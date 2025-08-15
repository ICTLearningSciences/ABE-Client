/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  Stack,
  Chip,
} from '@mui/material';
import { Section } from '../../../store/slices/education-management/types';

interface SectionListProps {
  sections: Section[];
  onSectionSelect: (sectionId: string) => void;
  selectedSectionId?: string;
  isLoading?: boolean;
}

const SectionList: React.FC<SectionListProps> = ({
  sections,
  onSectionSelect,
  selectedSectionId,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <Box sx={{ textAlign: 'center', py: 5 }}>
        <CircularProgress size={40} sx={{ color: '#1B6A9C' }} />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Loading sections...
        </Typography>
      </Box>
    );
  }

  if (sections.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 5 }}>
        <Typography sx={{ fontSize: '48px', color: 'grey.300', mb: 2 }}>
          📑
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ lineHeight: 1.5 }}
        >
          No sections yet
          <br />
          Create your first section to organize assignments
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', maxWidth: 800 }}>
      <Grid container spacing={2}>
        {sections.map((section) => (
          <Grid item xs={12} sm={6} key={section._id}>
            <Card
              variant="outlined"
              sx={{
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                border:
                  selectedSectionId === section._id
                    ? '2px solid #1B6A9C'
                    : '2px solid transparent',
                backgroundColor:
                  selectedSectionId === section._id ? '#e3f2fd' : 'white',
                boxShadow: selectedSectionId === section._id ? 2 : 1,
                '&:hover': {
                  borderColor: '#1B6A9C',
                  boxShadow: 3,
                },
              }}
              onClick={() => onSectionSelect(section._id)}
            >
              <CardContent sx={{ p: 2.5 }}>
                <Stack direction="row" alignItems="center" sx={{ mb: 1.5 }}>
                  <Typography sx={{ fontSize: '24px', mr: 1.5 }}>📑</Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      color: '#1B6A9C',
                      fontWeight: 600,
                      fontSize: '1.125rem',
                    }}
                  >
                    {section.title}
                  </Typography>
                </Stack>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1.5, lineHeight: 1.4 }}
                >
                  {section.description}
                </Typography>

                <Stack direction="row" spacing={1} alignItems="center">
                  <Chip
                    label={section.sectionCode}
                    size="small"
                    variant="outlined"
                    sx={{ fontSize: '11px' }}
                  />
                  <Typography variant="caption" color="text.disabled">
                    {section.assignments.length} assignment
                    {section.assignments.length !== 1 ? 's' : ''}
                  </Typography>
                  <Chip
                    label={`${section.numOptionalAssignmentsRequired} optional required`}
                    size="small"
                    color="secondary"
                    sx={{ fontSize: '10px' }}
                  />
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default SectionList;
