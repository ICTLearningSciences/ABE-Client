/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/

import React from "react";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@mui/material";
import { Send } from "@mui/icons-material";
import type { ChatMessageTypes } from "../../../store/slices/chat";
import { CssTextField } from ".";

export function ChatInput(props: {
  sendMessage: (message: ChatMessageTypes) => void;
  disableInput: boolean;
}): React.ReactNode {
  const { sendMessage } = props;
  const [message, setMessage] = React.useState<string>("");
  function handleSendUserMessage(message: string) {
    sendMessage({
      id: uuidv4(),
      message: message,
      sender: "USER",
      displayType: "TEXT",
      userInputType: "FREE_INPUT",
    });
    setMessage("");
  }

  return (
    <div className="row spacing" style={{ width: "100%", padding: 10 }}>
      <CssTextField
        fullWidth
        multiline
        maxRows={5}
        value={message}
        disabled={props.disableInput}
        placeholder={props.disableInput ? "" : "Enter your response here..."}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            if (message) {
              handleSendUserMessage(message);
            }
          }
        }}
      />
      <Button
        variant="contained"
        disabled={props.disableInput}
        style={{ width: 150 }}
        endIcon={<Send />}
        onClick={() => {
          handleSendUserMessage(message);
        }}
      >
        Send
      </Button>
    </div>
  );
}
