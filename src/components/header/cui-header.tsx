/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React from 'react';
import { useAppSelector } from '../../store/hooks';

export function CuiHeader() {
  const config = useAppSelector((state) => state.config);
  const cuiBanner = config.config?.bannerConfig;
  const displayBanner =
    cuiBanner &&
    cuiBanner.bannerText &&
    cuiBanner.bannerBgColor &&
    cuiBanner.bannerTextColor;

  if (!displayBanner) {
    return null;
  }

  return (
    <div
      data-cy="cui-banner"
      style={{
        backgroundColor: cuiBanner.bannerBgColor,
        color: cuiBanner.bannerTextColor,
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 'clamp(14px, 2vw, 18px)',
        height: '3vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        padding: '0 10px',
        boxSizing: 'border-box',
      }}
    >
      {cuiBanner.bannerText}
    </div>
  );
}
