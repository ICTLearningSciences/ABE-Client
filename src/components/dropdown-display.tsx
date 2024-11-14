/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React, { useState } from 'react';
import { Button, Box } from '@mui/material';
import { ColumnDiv } from '../styled-components';

interface DropdownDisplayProps {
  buttonLabelOpen: string;
  buttonLabelClose: string;
  content: React.ReactNode;
}

const DropdownDisplay: React.FC<DropdownDisplayProps> = ({
  buttonLabelOpen,
  buttonLabelClose,
  content,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleContent = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <ColumnDiv
      style={{
        width: '100%',
        alignItems: 'center',
      }}
    >
      <Button onClick={toggleContent} variant="text">
        {isOpen ? buttonLabelClose : buttonLabelOpen}
      </Button>

      {isOpen && (
        <Box
          sx={{
            mt: 2,
            padding: 2,
            borderRadius: 2,
            boxShadow: 1,
            backgroundColor: 'white',
            maxWidth: 300,
            border: '1px solid #e0e0e0',
          }}
        >
          {content}
        </Box>
      )}
    </ColumnDiv>
  );
};

export default DropdownDisplay;
