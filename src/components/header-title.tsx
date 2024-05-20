/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React from 'react';
import { useAppSelector } from '../store/hooks';
import { RowDiv } from '../styled-components';

export const DEFAULT_HEADER_TITLE = 'USC Center for Generative AI and Society';

export function HeaderTitle(): JSX.Element {
  const config = useAppSelector((state) => state.config);
  const title = config.config?.headerTitle || DEFAULT_HEADER_TITLE;
  const goldTitleWord = title.split(' ').length > 0 ? title.split(' ')[0] : '';
  const restOfTitle =
    title.split(' ').length > 1 ? title.split(' ').slice(1).join(' ') : '';
  return (
    <RowDiv
      style={{
        height: '100%',
        fontSize: '2.5vw',
        fontFamily: 'serif',
      }}
    >
      <div
        style={{
          color: 'gold',
          marginRight: '5px',
        }}
      >
        {goldTitleWord}
      </div>
      <div>{restOfTitle}</div>
    </RowDiv>
  );
}
