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
import { getEmptyJsonResponseData } from './prompt-step-builder';

export function JsonResponseDataUpdater(props: {
  jsonResponseData: JsonResponseData[];
  addOrEdit: (jsonResponseData: JsonResponseData) => void;
  deleteJsonResponseData: (jsonResponseData: JsonResponseData) => void;
}): JSX.Element {
  const { jsonResponseData, addOrEdit, deleteJsonResponseData } = props;
  return (
    <ColumnCenterDiv
      style={{
        border: '1px dotted grey',
        marginBottom: '10px',
        marginTop: '10px',
      }}
    >
      <h3>Json Response Data</h3>
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
                    addOrEdit({
                      ...jsonResponseData,
                      name: e,
                    });
                  }}
                />
                <SelectInputField
                  label="Type"
                  value={jsonResponseData.type}
                  options={[...Object.values(JsonResponseDataType)]}
                  onChange={(e) => {
                    addOrEdit({
                      ...jsonResponseData,
                      type: e as JsonResponseDataType,
                    });
                  }}
                />
                <CheckBoxInput
                  label="Is Required"
                  value={jsonResponseData.isRequired}
                  onChange={(e) => {
                    addOrEdit({
                      ...jsonResponseData,
                      isRequired: e,
                    });
                  }}
                />
              </RowDiv>

              <IconButton
                onClick={() => {
                  deleteJsonResponseData(jsonResponseData);
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
                addOrEdit({
                  ...jsonResponseData,
                  additionalInfo: e,
                });
              }}
            />
            {jsonResponseData.type === JsonResponseDataType.OBJECT && (
              <JsonResponseDataUpdater
                jsonResponseData={jsonResponseData.subData || []}
                addOrEdit={(jsonResponseData) => {
                  addOrEdit({
                    ...jsonResponseData,
                    subData: jsonResponseData.subData || [],
                  });
                }}
                deleteJsonResponseData={(jsonResponseData) => {
                  deleteJsonResponseData(jsonResponseData);
                }}
              />
            )}
          </ColumnDiv>
        );
      })}
      <Button
        onClick={() => {
          addOrEdit(getEmptyJsonResponseData());
        }}
      >
        + Add Data Field
      </Button>
    </ColumnCenterDiv>
  );
}
