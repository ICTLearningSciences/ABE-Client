import React from 'react';
import { Button } from "@mui/material";
import { useStickToBottomContext } from "use-stick-to-bottom";
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

export function GoToMostRecent() {
    const { scrollToBottom, isAtBottom } = useStickToBottomContext();

    if(isAtBottom){
      return null;
    }
    return (
      <Button
        variant="contained"
        onClick={() => {
          scrollToBottom();
        }}
        data-cy="scroll-to-bottom-button"
        style={{
          position: 'absolute',
          bottom: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10, // optional to stay above content
          borderRadius: "40px"
        }}
      >
        <ArrowDownwardIcon />
      </Button>
    );
}