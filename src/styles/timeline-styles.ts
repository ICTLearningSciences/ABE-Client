/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import { Paper } from '@mui/material';
import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  :root {
    --content-shadow: 0px 2px 15px 0px rgba(90, 82, 128, 0.2);
    --content-shadow-inner: 0px 2px 15px 0px rgba(114, 107, 147, 0.2);
    --timeline-bg: #fff;
    --content-revision-text-color-2: #4b4b4b;
    --content-revision-text-color-3: #5c5c5c;
    --content-revision-text-color-3-disable: #898989;
  }

  .footer-timeline-scroll-container {
    overflow-x: auto;
    white-space: nowrap;
  }

  .footer-timeline {
    max-width: 100vw;
    position: absolute;
    bottom: 0px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 90px;
    overflow-x: auto;
    overflow-y: hidden;
  }

  .footer-timeline-scroll {
    max-width: 100vw;
    position: absolute;
    bottom: 0px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 110px;
    overflow-x: auto;
    overflow-y: hidden;
  }

  .timeline-footer-wrapper {
    position: absolute;
    bottom: 0px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    width: 100%;
    height: 15px;
    padding: 0 0px;
    background-color: var(--timeline-bg);
    box-shadow: var(--content-shadow-inner);
  }

  .timeline-footer-wrapper-inner {
    position: absolute;
    bottom: 0px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    width: auto;
    height: 15px;
    padding: 0 0px;
    background-color: var(--timeline-bg);
  }

  .timeline-footer-item {
    max-width: 300px;
    min-width: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0px 10px 35px 10px;
    cursor: pointer;
  }

  .timeline-footer-item-hover {
    max-width: 300px;
    min-width: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0px 10px 55px 10px;
    cursor: pointer;
  }

  .timeline-footer-item-hover-no-content {
    max-width: 100px;
    min-width: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 50px;
    cursor: pointer;
  }

  .timeline-footer-wrapper-cards {
    display: flex;
    justify-content: space-around;
  }

  .timeline-item-dot {
    min-width: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 10px;
  }

  .selected-card {
    border: 2.5px solid #1b6a9c;
    border-radius: 15px;
    z-index: 1000;
  }

  .custom-timeline-dot-first,
  .custom-timeline-dot-last {
    height: 15px;
    width: 70px;
    margin-top: -3px;
    display: flex;
    align-items: center;
    border-radius: 10px;
    text-align: center;
    background-color: #eaeaf0;
  }

  .custom-timeline-dot-first {
    margin-left: -50px;
  }

  .custom-timeline-dot-last {
    margin-left: 50px;
  }

  .active-dot {
    background-color: #1b6a9c;
    color: white !important;
  }
`;

export const TimelineTestContainer = styled(Box)(() => ({
  height: '115px',
  position: 'absolute',
  bottom: '0px',
  maxWidth: '100%',
  overflowX: 'auto',
  overflowY: 'hidden',
  display: 'flex',
}));

export const TimelineBar = styled(Stepper)(() => ({
  position: 'absolute',
  display: 'flex',
  bottom: '60px',
  left: '0px',
  height: '15px',
}));

export const TimelineItemTest = styled('div')(() => ({
  display: 'flex',
  flexDirection: 'column',
  marginRight: '10px',
  justifyContent: 'center',
  alignItems: 'center',
}));

export const TimelineFooterItemCard = styled(Paper, {
  shouldForwardProp: (prop) => prop !== 'hovered',
})<{ hovered?: boolean }>(({ hovered }) => ({
  minWidth: hovered ? '150px' : '140px',
  padding: hovered ? '2px 10px !important' : '2px 0px !important',
  backgroundColor: 'var(--timeline-bg) !important',
  boxShadow: 'var(--content-shadow) !important',
  borderRadius: '15px !important',
  zIndex: 100,
  transition: 'min-width 0.9s ease, padding 0.9s ease, opacity 0.9s ease',
  opacity: 1,
}));
