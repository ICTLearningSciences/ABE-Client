/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/

import React from "react";
import ReactMarkdown from "react-markdown";
import { toast, ToastContainer } from "react-toastify";
import remarkBreaks from "remark-breaks";
import rehypeRaw from "rehype-raw";
import copy from "copy-to-clipboard";
import {
  Avatar,
  CircularProgress,
  IconButton,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";
import { ContentPaste, VolumeUp } from "@mui/icons-material";

import { ReferencesButton } from "./references-button";
import { getPollyTTS, stringAvatar, stringToColor } from "../helpers";
import BaseMessage, {
  DisplayOpenAiInfoButton,
  FadingText,
} from "../../../components/user-view/chat/message";
import { useWithPanels } from "../../../store/slices/panels/use-with-panels";
import type { ChatMessageTypes } from "../../../store/slices/chat";
import type { AiServiceStepDataTypes } from "../../../ai-services/ai-service-types";

export default function Message(props: {
  message: ChatMessageTypes;
  messageIndex: number;
  viewed?: boolean;
  setAiInfoToDisplay: (aiInfo?: AiServiceStepDataTypes[]) => void;
  onClicked?: (id: string) => void;
}): React.ReactNode {
  const { activePanel, panelists } = useWithPanels();
  const { message, messageIndex, setAiInfoToDisplay } = props;
  const [loading, setLoading] = React.useState<boolean>(false);
  const [playing, setPlaying] = React.useState<boolean>(false);

  const panelist = panelists.find(
    (p) =>
      activePanel?.panelists?.includes(p.clientId) &&
      p.panelistName === message.systemCustomName,
  );
  const userMessage = message.sender === "USER";

  function formatMessage(message: string) {
    // Preserve multiple blank lines by converting extra newlines to <br /> tags
    // \n\n = paragraph break (standard markdown, 1 blank line)
    // \n\n\n = paragraph break + 1 <br /> (2 blank lines)
    // \n\n\n\n = paragraph break + 2 <br /> (3 blank lines), etc.
    return message.replace(/\n{3,}/g, (match) => {
      const extraNewlines = match.length - 2;
      return "\n\n" + "<br />".repeat(extraNewlines);
    });
  }

  async function textToSpeech() {
    setLoading(true);
    try {
      const voice = panelist?.ttsConfig || {};
      const stream = await getPollyTTS({
        text: props.message.message,
        ...voice,
      });
      const blob = await new Response(stream).blob();
      const audio = new Audio(URL.createObjectURL(blob));
      setPlaying(true);
      audio.play();
      audio.onended = function () {
        setPlaying(false);
      };
      setLoading(false);
    } catch {
      setLoading(false);
      setPlaying(false);
    }
  }

  function copyToClipboard() {
    copy(props.message.message);
    toast("Copied to clipboard!");
  }

  if (message.message === "") {
    return <></>;
  }
  if (!panelist) {
    return (
      <div className="row">
        <BaseMessage
          message={message}
          setAiInfoToDisplay={setAiInfoToDisplay}
          messageIndex={messageIndex}
          displayMarkdown={true}
        />
        <div className="column center-div" style={{ marginRight: 5 }}>
          <Tooltip title="Text to speech">
            <IconButton onClick={textToSpeech} disabled={playing}>
              {loading ? (
                <CircularProgress style={{ width: 20, height: 20 }} />
              ) : (
                <VolumeUp
                  fontSize="small"
                  sx={{ color: playing ? "yellow" : "gray" }}
                />
              )}
            </IconButton>
          </Tooltip>
          <Tooltip title="Copy to clipboard">
            <IconButton onClick={copyToClipboard}>
              <ContentPaste fontSize="small" sx={{ color: "gray" }} />
            </IconButton>
          </Tooltip>
        </div>
        <ToastContainer />
      </div>
    );
  }
  if (!props.viewed) {
    return (
      <div
        id={message.id}
        style={{
          position: "relative",
          margin: 10,
        }}
        onClick={() => {
          if (props.onClicked) {
            props.onClicked(message.id);
          }
        }}
      >
        <Typography
          style={{ fontSize: 12, color: stringToColor(panelist.panelistName) }}
        >
          <FadingText
            strings={[
              `${panelist.panelistName} is thinking...`,
              `${panelist.panelistName} is typing...`,
              `${panelist.panelistName} is responding...`,
            ]}
          />
        </Typography>
      </div>
    );
  }
  return (
    <div
      id={message.id}
      style={{
        position: "relative",
        margin: 10,
      }}
    >
      {!userMessage && panelist && (
        <div className="row center-div">
          <Avatar
            {...stringAvatar(panelist.panelistName)}
            style={{ marginRight: 10 }}
          />
          <Typography style={{ flexGrow: 1, fontWeight: "bold" }}>
            {panelist?.panelistName}
          </Typography>
          <Typography
            style={{
              fontWeight: "bold",
              color: stringToColor(panelist.panelistName),
            }}
          >
            {panelist?.panelistDescription}
          </Typography>
        </div>
      )}

      <div className="row">
        <Paper
          square
          elevation={0}
          sx={{
            p: 3,
            whiteSpace: "normal",
            wordWrap: "break-word",
            backgroundColor: "rgb(180, 180, 180)",
            paddingLeft: "10%",
            paddingRight: "5%",
            clipPath:
              "polygon(0% 0%, 100% 0%, 100% 100%, calc(0% + 1em) 100%, calc(0% + 1em) calc(0% + 1em), 0% 0%)",
            borderBottomRightRadius: "1em",
            borderTopRightRadius: "1em",
            borderRight: `solid 8px ${stringToColor(panelist.panelistName)}`,
          }}
          style={{ marginTop: 10, marginLeft: 10 }}
        >
          <pre
            style={{
              margin: 0,
              whiteSpace: "pre-wrap",
              wordWrap: "break-word",
              overflowWrap: "break-word",
              fontFamily: "inherit",
              color: "black",
            }}
          >
            <ReactMarkdown
              remarkPlugins={[remarkBreaks]}
              rehypePlugins={[rehypeRaw]}
              components={{
                h1: ({ children }) => (
                  <h1
                    style={{
                      marginTop: "0",
                      marginBottom: "0",
                      lineHeight: "1",
                    }}
                  >
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 style={{ marginTop: "0", marginBottom: "0" }}>
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 style={{ marginTop: "0", marginBottom: "0" }}>
                    {children}
                  </h3>
                ),
                h4: ({ children }) => (
                  <h4 style={{ marginTop: "0", marginBottom: "0" }}>
                    {children}
                  </h4>
                ),
                h5: ({ children }) => (
                  <h5 style={{ marginTop: "0", marginBottom: "0" }}>
                    {children}
                  </h5>
                ),
                h6: ({ children }) => (
                  <h6 style={{ marginTop: "0", marginBottom: "0" }}>
                    {children}
                  </h6>
                ),
                p: ({ children }) => (
                  <p
                    style={{
                      marginTop: "0",
                      marginBottom: "0",
                      lineHeight: "1",
                    }}
                  >
                    {children}
                  </p>
                ),
                li: ({ children }) => (
                  <li
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      marginTop: "0",
                      marginBottom: "0",
                    }}
                  >
                    {children}
                  </li>
                ),
                ul: ({ children }) => (
                  <ul
                    style={{
                      marginTop: "0",
                      marginBottom: "0",
                      lineHeight: "1",
                      paddingLeft: "10px",
                    }}
                  >
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol
                    style={{
                      marginTop: "0",
                      marginBottom: "0",
                      lineHeight: "1",
                      paddingLeft: "10px",
                    }}
                  >
                    {children}
                  </ol>
                ),
              }}
            >
              {message.displayType === "TEXT"
                ? formatMessage(message.message).trim()
                : ""}
            </ReactMarkdown>
          </pre>
          {"sources" in message &&
            message.sources &&
            message.sources?.length > 0 && (
              <div className="row center-div">
                <ReferencesButton message={message} />
              </div>
            )}
        </Paper>
        <div className="column center-div" style={{ marginRight: 5 }}>
          <Tooltip title="Text to speech">
            <IconButton onClick={textToSpeech} disabled={playing}>
              {loading ? (
                <CircularProgress style={{ width: 20, height: 20 }} />
              ) : (
                <VolumeUp
                  fontSize="small"
                  sx={{ color: playing ? "yellow" : "gray" }}
                />
              )}
            </IconButton>
          </Tooltip>
          <Tooltip title="Copy to clipboard">
            <IconButton onClick={copyToClipboard}>
              <ContentPaste fontSize="small" sx={{ color: "gray" }} />
            </IconButton>
          </Tooltip>
        </div>
        <ToastContainer />
      </div>

      <DisplayOpenAiInfoButton
        chatMessage={message}
        setAiInfoToDisplay={setAiInfoToDisplay}
      />
    </div>
  );
}
