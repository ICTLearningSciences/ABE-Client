import React from 'react';
import { Delete } from '@mui/icons-material';
import { IconButton, Button } from '@mui/material';
import {
  ColumnCenterDiv,
  ColumnDiv,
  RowDiv,
} from '../../../../styled-components';
import {
  InputField,
  SelectInputField,
  CheckBoxInput,
} from '../../shared/input-components';
import { JsonResponseData, JsonResponseDataType } from '../../types';

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
    <ColumnCenterDiv
      style={{
        border: '1px dotted grey',
        marginBottom: '10px',
        marginTop: '10px',
        marginLeft: `${parentJsonResponseDataIds.length * 60}px`,
      }}
    >
      {!parentJsonResponseDataIds.length && <h3>Json Response Data</h3>}
      {jsonResponseData?.map((jsonResponseData, index) => {
        return (
          <ColumnDiv
            key={index}
            style={{
              border: '1px solid black',
              position: 'relative',
              width: '95%',
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
          </ColumnDiv>
        );
      })}
      <Button
        onClick={() => {
          addNewJsonResponseData(parentJsonResponseDataIds);
        }}
      >
        + Add Data Field
      </Button>
    </ColumnCenterDiv>
  );
}
