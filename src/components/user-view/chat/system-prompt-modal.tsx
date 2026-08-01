/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/

import React from "react";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  IconButton,
  Input,
  Modal,
  type Theme,
} from "@mui/material";
import { makeStyles } from "tss-react/mui";
import { Delete } from "@mui/icons-material";
import { RowDivSB } from "../../../styled-components";
import { useAppSelector } from "../../../store/hooks";

const useStyles = makeStyles({ name: { SystemPromptModal } })(
  (theme: Theme) => ({
    inputField: {
      width: "100%",
      margin: 10,
    },
    modal: {},
    paper: {
      backgroundColor: theme.palette.background.paper,
      border: "2px solid #000",
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
      maxWidth: "50%",
    },
  }),
);

export interface EditingInfo {
  i: number;
  data: string;
}

export default function SystemPromptModal(props: {
  isSaving: boolean;
  setTargetSystemPrompt: (targetSystemPrompt: number) => void;
  targetSystemPrompt: number;
  isEdited: boolean;
  systemPrompts: string[];
  editSystemPrompts: (i: number, value: string) => void;
  deleteSystemPrompt: (i: number) => void;
  saveSystemPrompts: (data: string[]) => void;
  open: boolean;
  close: () => void;
}): React.ReactNode {
  const {
    systemPrompts,
    close,
    open,
    editSystemPrompts,
    saveSystemPrompts,
    deleteSystemPrompt,
    isEdited,
    isSaving,
    setTargetSystemPrompt,
    targetSystemPrompt,
  } = props;
  const { classes } = useStyles();
  const userRole = useAppSelector((state) => state.login.userRole);
  const isAdmin = userRole === "ADMIN";

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "70%",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  return (
    <div>
      <Modal open={open} className={classes.modal}>
        <Box sx={style}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              height: "100%",
            }}
          >
            {systemPrompts.map((prompt, index) => {
              return (
                <Input
                  key={index}
                  value={prompt}
                  multiline
                  readOnly={!isAdmin}
                  disableUnderline={!isAdmin}
                  title="System Prompt"
                  className={classes.inputField}
                  onChange={(e) => {
                    editSystemPrompts(index, e.target.value);
                  }}
                  startAdornment={
                    <FormControlLabel
                      label=""
                      style={{ height: "fit-content", textAlign: "center" }}
                      control={
                        <Checkbox
                          checked={targetSystemPrompt === index}
                          indeterminate={false}
                          onChange={() => {
                            setTargetSystemPrompt(index);
                          }}
                        />
                      }
                    />
                  }
                  endAdornment={
                    <>
                      {isAdmin && (
                        <IconButton
                          onClick={() => {
                            deleteSystemPrompt(index);
                          }}
                        >
                          <Delete />
                        </IconButton>
                      )}
                    </>
                  }
                />
              );
            })}
            {isAdmin && (
              <Button
                style={{
                  width: "fit-content",
                  alignSelf: "center",
                }}
                onClick={() => {
                  editSystemPrompts(systemPrompts.length, "");
                }}
              >
                Add Prompt
              </Button>
            )}
            <RowDivSB
              style={{
                alignSelf: "center",
                justifyContent: "space-around",
              }}
            >
              <Button onClick={close}>Close</Button>
              {isSaving ? (
                <CircularProgress />
              ) : (
                <>
                  {isAdmin ? (
                    <Button
                      disabled={!isEdited}
                      onClick={() => {
                        saveSystemPrompts(systemPrompts);
                      }}
                    >
                      Save
                    </Button>
                  ) : undefined}
                </>
              )}
            </RowDivSB>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
