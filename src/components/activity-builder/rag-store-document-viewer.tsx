/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/

import { CloudUpload } from "@mui/icons-material";
import { Button, CircularProgress, styled } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React from "react";
import { ColumnDiv } from "../../styled-components";
import {
  getRagStore,
  uploadRagFile,
  type S3File,
} from "../../helpers/s3-helpers";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export default function ViewRagDocuments(): React.ReactNode {
  const [documents, setDocuments] = React.useState<S3File[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [uploading, setUploading] = React.useState<boolean>(false);

  React.useEffect(() => {
    onLoad();
  }, []);

  async function onLoad() {
    setLoading(true);
    const documents = await getRagStore();
    if (documents) {
      setDocuments(documents);
    }
    setLoading(false);
  }

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files?.length) return;
    try {
      setUploading(true);
      const file = e.target.files[0];
      await uploadRagFile(file);
      await onLoad();
      setUploading(false);
    } catch {
      setUploading(false);
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
      <ColumnDiv style={{ width: "90%", maxWidth: "800px" }}>
        <h2>RAG Store</h2>
        {documents.length === 0 ? (
          <p>No documents found</p>
        ) : loading ? (
          <CircularProgress />
        ) : (
          <DataGrid
            sx={{ border: 0 }}
            pageSizeOptions={[5, 10, 20]}
            initialState={{
              pagination: { paginationModel: { page: 0, pageSize: 10 } },
              columns: {
                columnVisibilityModel: {
                  id: false,
                },
              },
            }}
            rows={documents.map((d) => ({
              id: d.Key,
              ...d,
            }))}
            columns={[
              { field: "id" },
              {
                field: "Key",
                headerName: "File Name",
                width: 500,
                renderCell: (params) => (
                  <a
                    href={`${import.meta.env.VITE_RAG_BUCKET}${params.value}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {params.value}
                  </a>
                ),
              },
              {
                field: "LastModified",
                headerName: "Last Modified",
                width: 300,
              },
            ]}
            hideFooterSelectedRowCount
            disableRowSelectionOnClick={true}
          />
        )}
        <Button
          component="label"
          variant="outlined"
          loading={uploading}
          startIcon={<CloudUpload />}
          style={{
            marginTop: "20px",
            width: "fit-content",
            alignSelf: "center",
          }}
        >
          Upload Media
          <VisuallyHiddenInput
            type="file"
            disabled={loading}
            onChange={onUpload}
          />
        </Button>
      </ColumnDiv>
    </ColumnDiv>
  );
}
