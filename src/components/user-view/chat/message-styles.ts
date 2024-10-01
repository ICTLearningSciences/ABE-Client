import styled, { css, keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`;

export const StyledFadingText = styled.div<{
  isFadingIn?: boolean;
  isFadingOut?: boolean;
}>`
  opacity: 0;
  transition: opacity 1s ease-in-out;

  ${(props) =>
    props.isFadingIn &&
    css`
      animation: ${fadeIn} 1s ease-in-out forwards;
    `}

  ${(props) =>
    props.isFadingOut &&
    css`
      animation: ${fadeOut} 1s ease-in-out forwards;
    `}
`;
