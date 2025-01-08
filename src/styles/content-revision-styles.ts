/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Popover from '@mui/material/Popover';
import CloseIcon from '@mui/icons-material/Close';
import { Box, Divider, Input } from '@mui/material';

export const ContentShadow = '0px 2px 15px 0px rgba(90, 82, 128, 0.2)';
export const ContentShadowInner = '0px 2px 15px 0px rgba(114, 107, 147, 0.2)';
export const ContentBg = '#fff';
export const ContentRevisionTextColor2 = '#4b4b4b';
export const ContentRevisionTextColor3 = '#5c5c5c';
export const ContentRevisionTextColor3Disable = '#898989';

export const Text3 = styled(Typography)(() => ({
  position: 'relative',
  fontSize: '0.8rem',
  fontWeight: 500,
  marginLeft: '10px',
  color: ContentRevisionTextColor3,
}));

export const Text3Bold = styled(Typography)(() => ({
  fontSize: '0.8rem',
  fontWeight: 600,
  marginLeft: '10px',
  color: ContentRevisionTextColor3,
}));

export const Text3NoIndent = styled(Typography)(() => ({
  fontSize: '0.8rem',
  fontWeight: 500,
  color: ContentRevisionTextColor3,
}));

export const SenderTag = styled(Typography)(() => ({
  position: 'absolute',
  bottom: '-25px',
  right: '0px',
  borderRadius: '10px', // 5 for the user tag
  fontSize: '10px',
  color: ContentRevisionTextColor3,
}));

export const MessageContainer = styled('div')(() => ({
  maxWidth: '70%',
  margin: '5px',
  marginBottom: '10px',
  padding: '10px',
  borderRadius: '10px',
}));

export const StyledPopover = styled(Popover)(() => ({
  '& .MuiPopover-paper': {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '50%',
    minWidth: '50%',
    maxHeight: '60%',
    padding: '10px',
    borderRadius: '15px',
    overflowY: 'auto',
  },
}));

export const StyledCloseIcon = styled(CloseIcon)(() => ({
  position: 'absolute',
  right: '10px',
  top: '10px',
  marginBottom: '10px',
  cursor: 'pointer',
}));

export const RevisionTimeHeaderBox = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: '10px',
}));

export const RevisionTimeHeaderTypography = styled(Typography)(() => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: '10px',
}));

export const Text2Styles = {
  fontSize: '0.9rem',
  fontWeight: 600,
  color: ContentRevisionTextColor2,
};

export const Text2Typography = styled(Typography)(() => ({
  ...Text2Styles,
}));

export const AIOutlineContainer = styled(Box)(() => ({
  marginBottom: '10px',
}));

export const Text3List = styled(Typography)(() => ({
  fontSize: '0.8rem',
  fontWeight: 500,
  marginLeft: '10px',
  color: ContentRevisionTextColor3,
}));

export const InputWrapper = styled('span')(() => ({
  width: '100%',
  margin: 'auto',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
}));

export const SummaryInput = styled(Input)(() => ({
  width: '95%',
  margin: 'auto',
  marginBottom: 'px', // Note: You might want to specify a value here
  padding: '5px 10px',
  border: '1px solid #e0e0e0a0',
  borderRadius: '5px',
  fontSize: '0.8rem',
  '&:focus-visible': {
    outline: `1px solid ${ContentRevisionTextColor3Disable}`,
  },
}));

export const InputContainer = styled(Box)(() => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: '10px',
}));

export const SummaryTitleContainer = styled(Box)(() => ({
  width: '50%',
  display: 'flex',
  alignItems: 'center',
}));

export const SupportingClaimsContainer = styled('div', {
  shouldForwardProp: (prop) => prop !== 'collapsed',
})<{ collapsed?: boolean }>(({ collapsed }) => ({
  margin: 'auto',
  height: 'auto',
  width: '97%',
  padding: '5px',
  borderRadius: '15px',
  boxShadow: ContentShadowInner,
  transition: 'max-height 0.5s ease',
  overflow: 'hidden',
  maxHeight: collapsed ? '0' : '500px', // Adjust 500px to your desired max-height
  display: collapsed ? 'none' : 'block',
}));

export const StyledDivider = styled(Divider)(() => ({
  width: '98%',
  margin: '5px 0px',
}));

export const ContentRevisionContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'hasOverflowX',
})<{ hasOverflowX?: boolean }>(({ hasOverflowX }) => ({
  height: hasOverflowX ? 'calc(100vh - 250px)' : 'calc(100vh - 205px)',
  width: '100%',
  padding: '20px 0px 40px 15px',
  margin: '10px 10px',
  borderRadius: '15px',
  boxShadow: ContentShadow,
  backgroundColor: ContentBg,
  marginBottom: '10px',
}));

export const ContentRevisionContainerLeft = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'hasOverflowX',
})<{ hasOverflowX?: boolean }>(({ hasOverflowX }) => ({
  height: hasOverflowX ? 'calc(100vh - 250px)' : 'calc(100vh - 205px)',
  width: '100%',
  padding: '20px 0px 40px 20px',
  margin: '10px 10px',
  borderRadius: '15px',
  boxShadow: ContentShadow,
  backgroundColor: ContentBg,
  marginBottom: '10px',
}));

export const ContentContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'hasOverflowX',
})<{ hasOverflowX?: boolean }>(({ hasOverflowX }) => ({
  height: hasOverflowX ? 'calc(100vh - 255px)' : 'calc(100vh - 215px)',
  width: '100%',
  margin: '0px 10px 10px 0px',
  overflowY: 'auto',
}));
