/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React, { useState } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { ContentCopy as CopyIcon } from '@mui/icons-material';

interface CopyUrlButtonProps {
  copyUrl: string;
  tooltip: string;
  size?: 'small' | 'medium' | 'large';
  color?: string;
  hoverBackgroundColor?: string;
}

const CopyUrlButton: React.FC<CopyUrlButtonProps> = ({
  copyUrl,
  tooltip,
  size = 'small',
  color = '#1B6A9C',
  hoverBackgroundColor = 'rgba(27, 106, 156, 0.1)',
}) => {
  const [showSuccessTooltip, setShowSuccessTooltip] = useState(false);

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(copyUrl);
      setShowSuccessTooltip(true);
      setTimeout(() => setShowSuccessTooltip(false), 2000);
    } catch (error) {
      console.error('Failed to copy URL:', error);
    }
  };

  return (
    <Tooltip title={showSuccessTooltip ? 'Copied URL!' : tooltip}>
      <IconButton
        onClick={handleCopyUrl}
        size={size}
        sx={{
          color: color,
          '&:hover': {
            backgroundColor: hoverBackgroundColor,
          },
        }}
      >
        <CopyIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  );
};

export default CopyUrlButton;
