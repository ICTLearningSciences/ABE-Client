/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/

import React from "react";
import { CircularProgress, MenuItem, Select, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import type { EducationalRole, User } from "../../types";
import { fetchUsers, updateUserRole } from "../../hooks/api";
import { copyAndSet } from "../../helpers";
import type { UserRole } from "../../store/slices/login";

export default function AdminManageUsers(): React.ReactNode {
  const [users, setUsers] = React.useState<User[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  async function loadUsers() {
    setIsLoading(true);
    try {
      const users = await fetchUsers();
      setUsers(users);
      setIsLoading(false);
    } catch {
      setIsLoading(false);
    }
  }

  async function updateUser(
    id: string,
    userRole?: UserRole,
    educationalRole?: EducationalRole,
  ) {
    const user = await updateUserRole(id, userRole, educationalRole);
    const idx = users.findIndex((p) => p._id === user._id);
    if (idx !== -1) {
      setUsers(copyAndSet(users, idx, user));
    }
  }

  React.useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div style={{ width: "100%", height: "100%" }} className="column spacing">
      {isLoading ? (
        <CircularProgress />
      ) : (
        <DataGrid
          rows={users.map((p) => ({
            ...p,
            id: p._id,
          }))}
          columns={[
            { field: "id" },
            {
              field: "name",
              headerName: "Name",
              width: 300,
            },
            {
              field: "lastLoginAt",
              headerName: "Last Activity",
              width: 250,
              renderCell: (params) => (
                <Typography>
                  {params.row.lastLoginAt
                    ? new Date(params.row.lastLoginAt).toLocaleString()
                    : ""}
                </Typography>
              ),
            },
            {
              field: "userRole",
              headerName: "User Role",
              width: 150,
              renderCell: (params) => (
                <Select
                  label="User Role"
                  value={params.row.userRole}
                  onChange={(e) =>
                    updateUser(params.row.id, e.target.value as UserRole)
                  }
                >
                  {["NONE", "ADMIN", "CONTENT_MANAGER", "USER"].map((r) => (
                    <MenuItem value={r} key={r}>
                      {r}
                    </MenuItem>
                  ))}
                </Select>
              ),
            },
            {
              field: "educationalRole",
              headerName: "Educational Role",
              width: 200,
              renderCell: (params) => (
                <Select
                  label="Educational Role"
                  value={params.row.educationalRole}
                  onChange={(e) =>
                    updateUser(
                      params.row.id,
                      undefined,
                      e.target.value as EducationalRole,
                    )
                  }
                >
                  {["INSTRUCTOR", "STUDENT"].map((r) => (
                    <MenuItem value={r} key={r}>
                      {r}
                    </MenuItem>
                  ))}
                </Select>
              ),
            },
          ]}
          pageSizeOptions={[20]}
          initialState={{
            columns: {
              columnVisibilityModel: {
                id: false,
              },
            },
          }}
        />
      )}
    </div>
  );
}
