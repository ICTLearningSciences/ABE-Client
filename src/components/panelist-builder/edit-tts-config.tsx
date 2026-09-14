/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/

import React from "react";
import {
  Button,
  Collapse,
  IconButton,
  MenuItem,
  TextField,
} from "@mui/material";
import { ExpandMore, ExpandLess, PlayCircle } from "@mui/icons-material";
import type { Panelist, TTSConfig } from "../../store/slices/panels/types";
import {
  getPollyTTS,
  getPollyVoiceOptions,
} from "../../pages/shark-tank/helpers";

export function TTSConfigEditor(props: {
  panelist: Panelist;
  setEditedPanelist: (v: Panelist) => void;
}): React.ReactNode {
  const [collapsed, setCollapsed] = React.useState<boolean>(true);
  const [text, setText] = React.useState<string>("");

  const [loading, setLoading] = React.useState<boolean>(false);

  async function textToSpeech() {
    setLoading(true);
    try {
      const stream = await getPollyTTS({
        text: text,
        ...props.panelist.ttsConfig,
      });
      const blob = await new Response(stream).blob();
      const audio = new Audio(URL.createObjectURL(blob));
      audio.play();
      setLoading(false);
    } catch {
      setLoading(false);
    }
  }

  function editConfig(d: Partial<TTSConfig>): void {
    props.setEditedPanelist({
      ...props.panelist,
      ttsConfig: {
        ...props.panelist.ttsConfig,
        ...d,
      },
    });
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        padding: "10px 0",
        border: "1px solid #ccc",
        borderRadius: "4px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <IconButton
          size="small"
          onClick={() => setCollapsed(!collapsed)}
          style={{ padding: "4px" }}
        >
          {collapsed ? <ExpandMore /> : <ExpandLess />}
        </IconButton>
        <h4 style={{ margin: 0 }}>TTS Configuration</h4>
      </div>
      <Collapse in={!collapsed}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            padding: "10px",
          }}
        >
          <TextField
            select
            label="Voice Engine"
            value={props.panelist.ttsConfig?.engine || "long-form"}
            onChange={(e) => editConfig({ engine: e.target.value })}
            fullWidth
          >
            <MenuItem value="generative">Generative</MenuItem>
            <MenuItem value="long-form">Long-Form</MenuItem>
            <MenuItem value="neural">Neural</MenuItem>
            <MenuItem value="standard">Standard</MenuItem>
          </TextField>
          <TextField
            select
            label="Panelist Voice"
            value={props.panelist.ttsConfig?.voice || "Danielle"}
            onChange={(e) => editConfig({ voice: e.target.value })}
            fullWidth
          >
            {getPollyVoiceOptions(
              props.panelist.ttsConfig?.engine || "long-form",
            ).map((v) => (
              <MenuItem key={v} value={v}>
                {v}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Voice Language"
            value={props.panelist.ttsConfig?.language || "en-US"}
            onChange={(e) => editConfig({ language: e.target.value })}
            fullWidth
          />
          <div className="row center">
            <TextField
              label="Test Voice Line"
              value={text}
              onChange={(e) => setText(e.target.value)}
              fullWidth
              multiline
            />
            <Button
              variant="contained"
              endIcon={<PlayCircle />}
              style={{ marginLeft: 10 }}
              loading={loading}
              onClick={textToSpeech}
            >
              Play
            </Button>
          </div>
        </div>
      </Collapse>
    </div>
  );
}
