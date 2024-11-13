import React from 'react';
import { Delete } from '@mui/icons-material';
import { IconButton, Button, Box } from '@mui/material';
import { RowDiv } from '../../../../styled-components';
import {
  InputField,
  SelectInputField,
  CheckBoxInput,
} from '../../shared/input-components';
import { JsonResponseData, JsonResponseDataType } from '../../types';
import { InfoTooltip } from '../../../info-tooltip';

export function JsonResponseDataUpdater(props: {
  jsonResponseData: JsonResponseData[];
  addNewJsonResponseData: (parentJsonResponseDataIds: string[]) => void;
  editDataField: (
    clientId: string,
    field: string,
    value: string | boolean,
    parentJsonResponseDataIds: string[]
  ) => void;
  deleteJsonResponseData: (
    clientId: string,
    parentJsonResponseDataIds: string[]
  ) => void;
  parentJsonResponseDataIds: string[];
}): JSX.Element {
  const {
    jsonResponseData,
    editDataField,
    deleteJsonResponseData,
    parentJsonResponseDataIds,
    addNewJsonResponseData,
  } = props;
  const availableTypes =
    parentJsonResponseDataIds.length !== 2
      ? [...Object.values(JsonResponseDataType)]
      : [JsonResponseDataType.STRING, JsonResponseDataType.ARRAY];

  return (
    <Box
      sx={{
        marginBottom: '10px',
        marginTop: '10px',
        marginLeft: `${parentJsonResponseDataIds.length * 60}px`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {!parentJsonResponseDataIds.length && (
        <h3
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
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
              position: 'relative',
              width: '95%',
              mt: 2,
              borderRadius: 2,
              boxShadow: 1,
              backgroundColor: 'white',
              border: '1px solid #e0e0e0',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <RowDiv
              style={{
                width: '100%',
                justifyContent: 'space-between',
              }}
            >
              <RowDiv>
                <InputField
                  label="Variable Name"
                  value={jsonResponseData.name}
                  onChange={(e) => {
                    editDataField(
                      jsonResponseData.clientId,
                      'name',
                      e,
                      parentJsonResponseDataIds
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
                      'type',
                      e,
                      parentJsonResponseDataIds
                    );
                  }}
                />
                <CheckBoxInput
                  label="Is Required"
                  value={jsonResponseData.isRequired}
                  onChange={(e) => {
                    editDataField(
                      jsonResponseData.clientId,
                      'isRequired',
                      e,
                      parentJsonResponseDataIds
                    );
                  }}
                />
              </RowDiv>

              <IconButton
                onClick={() => {
                  deleteJsonResponseData(
                    jsonResponseData.clientId,
                    parentJsonResponseDataIds
                  );
                }}
              >
                <Delete />
              </IconButton>
            </RowDiv>
            <InputField
              label="Additional Info"
              maxRows={4}
              value={jsonResponseData.additionalInfo || ''}
              onChange={(e) => {
                editDataField(
                  jsonResponseData.clientId,
                  'additionalInfo',
                  e,
                  parentJsonResponseDataIds
                );
              }}
            />
            {jsonResponseData.type === JsonResponseDataType.OBJECT && (
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
        + Add Data Field
      </Button>
    </Box>
  );
}
