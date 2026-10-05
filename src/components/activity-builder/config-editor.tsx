/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/

import React from "react";
import { ColumnDiv, RowDiv } from "../../styled-components";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  TextField,
} from "@mui/material";
import { Edit } from "@mui/icons-material";
import { updateConfig } from "../../store/slices/config";

export default function EditConfig(): React.ReactNode {
  const dispatch = useAppDispatch();
  const { config } = useAppSelector((state) => state.config);
  const [key, setKey] = React.useState<string>();
  const [value, setValue] = React.useState<string>();
  const [saving, setSaving] = React.useState<boolean>(false);

  async function saveDialog() {
    if (!key) return;
    if (value === undefined) return;
    setSaving(true);
    try {
      await dispatch(
        updateConfig({
          key: key,
          value: JSON.parse(value),
        }),
      );
      setKey(undefined);
      setValue(undefined);
      setSaving(false);
    } catch {
      setSaving(false);
    }
  }

  return (
    <ColumnDiv
      style={{
        width: "100%",
        height: "100%",
        alignItems: "center",
        overflow: "auto",
        padding: "20px",
      }}
    >
      <h1>Config</h1>
      <ColumnDiv style={{ width: "90%" }}>
        <div>
          {config &&
            Object.entries(config).map((c) => {
              return (
                <div>
                  <Grid
                    className="column center-div"
                    container
                    spacing={2}
                    style={{ margin: 10 }}
                  >
                    <Grid
                      size={3}
                      className="row"
                      style={{ alignItems: "center" }}
                    >
                      {c[0]}
                      <IconButton
                        onClick={() => {
                          setKey(c[0]);
                          setValue(JSON.stringify(c[1]));
                        }}
                      >
                        <Edit />
                      </IconButton>
                    </Grid>
                    <Grid size={9} style={{ textWrap: "wrap" }}>
                      {JSON.stringify(c[1])}
                    </Grid>
                  </Grid>
                  <Divider />
                </div>
              );
            })}
        </div>
      </ColumnDiv>

      {config && key && (
        <Dialog open={Boolean(key)} fullWidth onClose={() => setKey(undefined)}>
          <DialogTitle style={{ textAlign: "center" }}>{key}</DialogTitle>
          <DialogContent
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TextField
              variant="outlined"
              multiline
              maxRows={10}
              fullWidth
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
            <RowDiv style={{ marginTop: 10 }}>
              <Button variant="contained" onClick={saveDialog} loading={saving}>
                Update
              </Button>
            </RowDiv>
          </DialogContent>
        </Dialog>
      )}
    </ColumnDiv>
  );
}
