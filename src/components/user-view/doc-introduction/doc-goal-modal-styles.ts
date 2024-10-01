import styled, { keyframes } from 'styled-components';

const flash = keyframes`
  0% {
    background-color: white;
  }
  50% {
    background-color: rgba(46, 175, 255, 0.301);
  }
  100% {
    background-color: white;
  }
`;

export const GoalDisplay = styled.div`
  background-color: white;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  cursor: pointer;
  width: 300px;
  height: 250px;
  margin: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;

  &:hover {
    box-shadow: 0 0 3px 0 rgb(0, 0, 0);
  }

  &.goal-display-flash {
    animation: ${flash} 2s infinite;
  }

  @media only screen and (max-width: 1280px) {
    width: 250px;
    height: 200px;
  }

  @media only screen and (max-width: 850px) {
    width: 200px;
    height: 150px;
  }
`;
