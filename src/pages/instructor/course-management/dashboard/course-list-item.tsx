import React from 'react';
import { Card, CardContent, Typography, Stack } from '@mui/material';
import { Course } from '../../../../store/slices/education-management/types';

export function CourseListItem(props: {
  course: Course;
  onCourseSelect: (courseId: string) => void;
}) {
  const { course, onCourseSelect } = props;
  return (
    <Card
      variant="outlined"
      data-cy={`course-card-${course._id}`}
      sx={{
        width: '100%',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        '&:hover': {
          borderColor: '#1B6A9C',
          boxShadow: 2,
        },
      }}
      onClick={() => onCourseSelect(course._id)}
    >
      <CardContent>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ mb: 1.5 }}
        >
          <Stack direction="row" alignItems="center">
            <Typography sx={{ fontSize: '20px', mr: 1.5 }}>📚</Typography>
            <Typography
              variant="h6"
              sx={{
                color: '#1B6A9C',
                fontWeight: 600,
                fontSize: '1rem',
              }}
            >
              {course.title}
            </Typography>
          </Stack>
        </Stack>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 1.5, lineHeight: 1.4 }}
        >
          {course.description}
        </Typography>
      </CardContent>
    </Card>
  );
}
