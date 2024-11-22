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

export const ActivitiesContainer = styled.div`
  max-height: 75vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: auto;
  position: relative;
`;

export const ActivitiesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  width: fit-content;
  overflow-y: auto;
  overflow-x: hidden;

  /* Scrollbar styling */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }

  @media only screen and (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;
