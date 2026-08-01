/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/

import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { TextField, Button } from "@mui/material";
import type { ChatMessageTypes } from "../../../store/slices/chat";

export function ChatInput(props: {
  sendMessage: (message: ChatMessageTypes) => void;
  disableInput: boolean;
}): React.ReactNode {
  const { sendMessage } = props;
  const [message, setMessage] = useState<string>("");
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
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        width: "90%",
        justifyContent: "space-around",
        alignItems: "center",
        margin: "10px",
      }}
    >
      <TextField
        data-cy="chat-input"
        disabled={props.disableInput}
        fullWidth
        multiline
        placeholder={props.disableInput ? "" : "Enter your response here..."}
        style={{
          display: "flex",
          flexDirection: "column",
          height: "fit-content",
          minHeight: "20px",
          width: "100%",
          justifyContent: "space-around",
          alignItems: "center",
          borderRadius: "2rem",
          marginRight: "10px",
          opacity: props.disableInput ? 0.3 : 1,
        }}
        value={message}
        maxRows={5}
        onChange={(e) => {
          setMessage(e.target.value);
        }}
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
        variant="outlined"
        data-cy="send-input-button"
        disabled={props.disableInput}
        onClick={() => {
          handleSendUserMessage(message);
        }}
      >
        Send
      </Button>
    </div>
  );
}
