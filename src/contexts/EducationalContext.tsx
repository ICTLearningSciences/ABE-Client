/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React, { createContext, useContext, ReactNode } from 'react';

interface EducationalContextType {
  courseId: string;
  sectionId: string;
  assignmentId: string;
  activityId: string;
}

const EducationalContext = createContext<EducationalContextType | undefined>(
  undefined
);

interface EducationalProviderProps {
  children: ReactNode;
  initialCourseId?: string;
  initialSectionId?: string;
  initialAssignmentId?: string;
  initialActivityId?: string;
}

export const EducationalProvider: React.FC<EducationalProviderProps> = ({
  children,
  initialCourseId = '',
  initialSectionId = '',
  initialAssignmentId = '',
  initialActivityId = '',
}) => {
  const value: EducationalContextType = {
    courseId: initialCourseId,
    sectionId: initialSectionId,
    assignmentId: initialAssignmentId,
    activityId: initialActivityId,
  };

  return (
    <EducationalContext.Provider value={value}>
      {children}
    </EducationalContext.Provider>
  );
};

export const useEducationalContext = (): EducationalContextType | undefined => {
  const context = useContext(EducationalContext);
  if (!context) {
    return undefined;
  }
  return context;
};

// Convenience hooks for individual values
export const useCourseId = (): string => {
  const context = useEducationalContext();
  if (!context) {
    return '';
  }
  return context.courseId;
};

export const useSectionId = (): string => {
  const context = useEducationalContext();
  if (!context) {
    return '';
  }
  return context.sectionId;
};

export const useAssignmentId = (): string => {
  const context = useEducationalContext();
  if (!context) {
    return '';
  }
  return context.assignmentId;
};

export const useActivityId = (): string => {
  const context = useEducationalContext();
  if (!context) {
    return '';
  }
  return context.activityId;
};
