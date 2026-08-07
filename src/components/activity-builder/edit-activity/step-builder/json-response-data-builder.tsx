/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/

import React from "react";
import { IconButton, Button, Box } from "@mui/material";
import { Delete } from "@mui/icons-material";
import { RowDiv } from "../../../../styled-components";
import {
  InputField,
  SelectInputField,
  CheckBoxInput,
} from "../../shared/input-components";
import type { JsonResponseData } from "../../types";
import { InfoTooltip } from "../../../info-tooltip";

export function JsonResponseDataUpdater(props: {
  jsonResponseData: JsonResponseData[];
  addNewJsonResponseData: (parentJsonResponseDataIds: string[]) => void;
  editDataField: (
    clientId: string,
    field: string,
    value: string | boolean,
    parentJsonResponseDataIds: string[],
  ) => void;
  deleteJsonResponseData: (
    clientId: string,
    parentJsonResponseDataIds: string[],
  ) => void;
  parentJsonResponseDataIds: string[];
}): React.ReactNode {
  const {
    jsonResponseData,
    editDataField,
    deleteJsonResponseData,
    parentJsonResponseDataIds,
    addNewJsonResponseData,
  } = props;
  const isSubData = parentJsonResponseDataIds.length >= 1;
  const availableTypes = !isSubData
    ? ["string", "object", "array"]
    : ["string", "array"];

  return (
    <Box
      sx={{
        marginBottom: "10px",
        marginTop: "10px",
        marginLeft: `${parentJsonResponseDataIds.length * 60}px`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {!parentJsonResponseDataIds.length && (
        <h3
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          Json Response Data
          <InfoTooltip title="Define the fields for that AI's JSON response." />
        </h3>
      )}
      {jsonResponseData?.map((jsonResponseData, index) => {
        return (
          <Box
            key={index}
            sx={{
              position: "relative",
              width: "95%",
              mt: 2,
              borderRadius: 2,
              boxShadow: 1,
              backgroundColor: "white",
              border: "1px solid #e0e0e0",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <RowDiv
              style={{
                width: "100%",
                justifyContent: "space-between",
              }}
            >
              <RowDiv>
                <InputField
                  label="Variable Name"
                  value={jsonResponseData.name}
                  onChange={(e) => {
                    editDataField(
                      jsonResponseData.clientId,
                      "name",
                      e,
                      parentJsonResponseDataIds,
                    );
                  }}
                />
                <SelectInputField
                  label="Type"
                  value={jsonResponseData.type}
                  options={availableTypes}
                  onChange={(e) => {
                    editDataField(
                      jsonResponseData.clientId,
                      "type",
                      e,
                      parentJsonResponseDataIds,
                    );
                  }}
                />
                <CheckBoxInput
                  label="Is Required"
                  value={jsonResponseData.isRequired}
                  onChange={(e) => {
                    editDataField(
                      jsonResponseData.clientId,
                      "isRequired",
                      e,
                      parentJsonResponseDataIds,
                    );
                  }}
                />
              </RowDiv>

              <IconButton
                onClick={() => {
                  deleteJsonResponseData(
                    jsonResponseData.clientId,
                    parentJsonResponseDataIds,
                  );
                }}
              >
                <Delete />
              </IconButton>
            </RowDiv>
            <InputField
              label="Additional Info"
              maxRows={4}
              value={jsonResponseData.additionalInfo || ""}
              onChange={(e) => {
                editDataField(
                  jsonResponseData.clientId,
                  "additionalInfo",
                  e,
                  parentJsonResponseDataIds,
                );
              }}
            />
            {jsonResponseData.type === "object" && (
              <JsonResponseDataUpdater
                jsonResponseData={jsonResponseData.subData || []}
                editDataField={editDataField}
                deleteJsonResponseData={deleteJsonResponseData}
                parentJsonResponseDataIds={[
                  ...parentJsonResponseDataIds,
                  jsonResponseData.clientId,
                ]}
                addNewJsonResponseData={addNewJsonResponseData}
              />
            )}
          </Box>
        );
      })}
      <Button
        onClick={() => {
          addNewJsonResponseData(parentJsonResponseDataIds);
        }}
      >
        {isSubData ? "Add Subfield" : "+ Add JSON Field"}
      </Button>
    </Box>
  );
}
