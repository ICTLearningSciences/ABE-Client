/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/

import React from "react";
import {
  createTheme,
  Switch,
  ThemeProvider,
  FormControlLabel,
} from "@mui/material";
import { ColumnDiv } from "../../styled-components";
import { useAppSelector } from "../../store/hooks";
import { useWithState } from "../../store/slices/state/use-with-state";
import type { UserRole } from "../../store/slices/login";

export function AdminControls(): React.ReactNode {
  const { updateViewingUserRole, updateViewingAdvancedOptions, state } =
    useWithState();
  const viewingRole = useAppSelector((state) => state.state.viewingRole);
  const userRole = useAppSelector((state) => state.login.userRole);
  const isAdminOrContentManager =
    userRole === "ADMIN" || userRole === "CONTENT_MANAGER";
  function roleDisplayText(userRole: UserRole) {
    switch (userRole) {
      case "ADMIN":
        return "Admin";
      case "CONTENT_MANAGER":
        return "Content Manager";
      default:
        return "User";
    }
  }

  const roleSwitchChecked = viewingRole !== "USER";
  const switchTheme = () => createTheme({});

  return (
    <>
      {isAdminOrContentManager ? (
        <ColumnDiv
          style={{
            marginRight: 20,
            alignItems: "flex-start",
          }}
        >
          <ThemeProvider theme={() => switchTheme()}>
            <FormControlLabel
              data-cy="role-switch"
              labelPlacement="start"
              control={
                <Switch
                  size="small"
                  checked={roleSwitchChecked}
                  onChange={() => {
                    updateViewingUserRole(
                      viewingRole !== "USER" ? "USER" : userRole,
                    );
                  }}
                />
              }
              label={roleDisplayText(viewingRole)}
            />
          </ThemeProvider>
          <ThemeProvider theme={() => switchTheme()}>
            <FormControlLabel
              labelPlacement="start"
              control={
                <Switch
                  size="small"
                  color="primary"
                  checked={state.viewingAdvancedOptions}
                  onChange={(value) => {
                    updateViewingAdvancedOptions(value.target.checked);
                  }}
                />
              }
              label="Advanced"
            />
          </ThemeProvider>
        </ColumnDiv>
      ) : undefined}
    </>
  );
}
