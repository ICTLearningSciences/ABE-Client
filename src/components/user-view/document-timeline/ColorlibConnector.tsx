import React from 'react';

import { StepIconProps, styled } from '@mui/material';
import StepConnector, {
  stepConnectorClasses,
} from '@mui/material/StepConnector';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

/* The `const ColorlibConnector` declaration is using the `styled` function from Material-UI to create
a styled component for the `StepConnector` component. This styled component is defining the styles
for the connector line used in a `Stepper` component. */
export const ColorlibConnector = styled(StepConnector)(() => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 10,
    border: 0,
    backgroundColor: '#fff',
    boxShadow: '0px 2px 15px 0px rgba(90, 82, 128, 0.2)',
    borderRadius: 5,
  },
}));
/* The `const QontoStepIconRoot` is using Emotion's styled function to create a styled component for a
 `div` element. This styled component accepts props with a specific structure defined by `{
 ownerState: { active?: boolean } }`. */
export const QontoStepIconRoot = styled('div')<{
  ownerState: { active?: boolean };
}>(({ theme, ownerState }) => ({
  color: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#eaeaf0',
  display: 'flex',
  height: 22,
  alignItems: 'center',
  ...(ownerState.active && {
    color: '#1b6a9c',
  }),
  '& .QontoStepIcon-completedIcon': {
    color: '#784af4',
    zIndex: 1,
    fontSize: 18,
  },
  '& .QontoStepIcon-circle': {
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: 'currentColor',
  },
}));

/* The `StepperSx` constant is an object that contains styling properties using the syntax provided by
Emotion's CSS prop. In this case, it is defining styles for the `Stepper` component in the React
code snippet. */
export const StepperSx = {
  '& .MuiStepConnector-root': {
    left: 'calc(-50% + 15px)',
    right: 'calc(50% + 15px)',
  },
  '& .MuiStepConnector-line': {
    marginTop: '35px', // To position the line lower
  },
};

/* The `QontoStepIcon` function is a custom component used as the `StepIconComponent` in the
`StepLabel` component within the `Stepper` component. This custom component is responsible for
rendering the icons displayed for each step in the timeline. */
export function QontoStepIcon(props: StepIconProps) {
  const { active, className } = props;

  return (
    <QontoStepIconRoot
      ownerState={{ active }}
      className={className}
      style={{ marginTop: 8 }}
    >
      <FiberManualRecordIcon />
    </QontoStepIconRoot>
  );
}
