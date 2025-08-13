# Education Management Redux Slice

This directory contains a modular Redux slice for managing educational data including courses, sections, assignments, students, and instructors.

## File Structure

```
education-management/
├── index.ts              # Main slice file - exports everything
├── types.ts              # TypeScript interfaces and types
├── state.ts              # State interfaces and initial state
├── thunks.ts             # Async thunks for API calls
├── reducers.ts           # Reducer logic organized by feature
├── educational-api.ts    # API functions (existing)
├── use-with-educational-management.ts # Custom hooks (existing)
└── README.md             # This file
```

## Modular Organization

### `types.ts`
Contains all TypeScript interfaces and types used throughout the slice:
- `Course`, `Assignment`, `Section`, `StudentData`, `Instructor`
- `ActivityCompletion`, `AssignmentProgress`
- `CourseOwnership` enum
- Type guards and utility types

### `state.ts`
Contains state-related definitions:
- `LoadStatus` enum for tracking async operation states
- `CourseManagementState` interface for view state
- `State` interface for the complete slice state
- `initialState` object

### `thunks.ts`
Contains all async thunks organized by feature:
- **Fetch thunks**: `fetchCourses`, `fetchAssignments`, `fetchSections`, etc.
- **Course thunks**: `createCourse`, `updateCourse`, `deleteCourse`
- **Section thunks**: `createSection`, `updateSection`, `deleteSection`
- **Assignment thunks**: `createAssignment`, `updateAssignment`, `deleteAssignment`
- **Enrollment thunks**: `enrollInSection`, `removeFromSection`, `updateStudentAssignmentProgress`
- **User data thunks**: `loadInstructorData`, `loadStudentData`
- **Course sharing thunks**: `shareCourseWithInstructor`, `unshareCourseWithInstructor`
- **Student ban/unban thunks**: `banStudentFromSection`, `unbanStudentFromSection`

### `reducers.ts`
Contains all reducer logic organized by feature:
- **Student ban/unban reducers**: Handle banning and unbanning students from sections
- **Instructor reducers**: Handle instructor data fetching
- **Course sharing reducers**: Handle course sharing with instructors
- **User data loading reducers**: Handle instructor and student data loading
- **Fetch reducers**: Handle data fetching operations
- **Course CRUD reducers**: Handle course creation, updates, and deletion
- **Section CRUD reducers**: Handle section creation, updates, and deletion
- **Assignment CRUD reducers**: Handle assignment creation, updates, and deletion
- **Enrollment reducers**: Handle student enrollment and progress updates

### `index.ts`
The main slice file that:
- Imports and combines all modular components
- Creates the Redux slice with basic reducers
- Uses the `buildExtraReducers` function for async thunk handling
- Re-exports all types, thunks, and actions for external use

## Benefits of This Structure

1. **Separation of Concerns**: Each file has a specific responsibility
2. **Maintainability**: Easier to find and modify specific functionality
3. **Readability**: Smaller, focused files are easier to understand
4. **Testability**: Individual modules can be tested in isolation
5. **Reusability**: Types and utilities can be imported independently
6. **Scalability**: Easy to add new features without cluttering existing files

## Usage

The slice maintains the same external API as before. You can import from the main index file:

```typescript
import {
  fetchCourses,
  createCourse,
  updateCourse,
  LoadStatus,
  Course,
  // ... other exports
} from './store/slices/education-management';
```

All existing functionality is preserved while the internal structure is now more organized and maintainable. 