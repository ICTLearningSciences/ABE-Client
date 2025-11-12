/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved.
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const StyledFadingText = styled.span<{
  isFadingIn: boolean;
  isFadingOut: boolean;
}>`
  opacity: ${(props) => {
    if (props.isFadingIn) {
      return 1;
    }
    if (props.isFadingOut) {
      return 0;
    }
    return 1;
  }};
  transition: opacity 1s ease-in-out;
`;

export const FadingText: React.FC<{ strings: string[] }> = ({ strings }) => {
  const [currentStringIndex, setCurrentStringIndex] = useState(0);
  const [fadeState, setFadeState] = useState<'fading-out' | 'fading-in'>(
    'fading-in'
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (currentStringIndex !== strings.length - 1) {
        setFadeState('fading-out');
      }
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [currentStringIndex, strings.length]);

  useEffect(() => {
    if (
      fadeState === 'fading-out' &&
      currentStringIndex !== strings.length - 1
    ) {
      const timeoutId = setTimeout(() => {
        setCurrentStringIndex((prevIndex) => (prevIndex + 1) % strings.length);
        setFadeState('fading-in');
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [fadeState, strings.length, currentStringIndex]);

  return (
    <StyledFadingText
      isFadingIn={fadeState === 'fading-in'}
      isFadingOut={fadeState === 'fading-out'}
    >
      {strings[currentStringIndex]}
    </StyledFadingText>
  );
};
