import styled from 'styled-components';
import { Card } from '@mui/material';

export const StyledActivityCard = styled(Card)`
  &:hover {
    cursor: pointer;
    background-color: #f0f0f0;
  }
`;

export const PromptItem = styled.div`
  text-align: left;
  border: 1px solid lightgrey;
  margin: 10px;
  width: 90%;

  &:hover {
    background-color: lightgrey;
  }
`;
