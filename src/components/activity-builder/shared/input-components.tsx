import React, { useEffect } from 'react';
import {
  FormControl,
  InputLabel,
  Input,
  FormControlLabel,
  Checkbox,
  Select,
  MenuItem,
  IconButton,
  Typography,
  Box,
} from '@mui/material';
import { useDebouncedCallback } from '../../../hooks/use-debounced-callback';
import { Edit as EditIcon, Save as SaveIcon } from '@mui/icons-material';
import { RowDiv } from '../../../styled-components';
import { InfoTooltip } from '../../info-tooltip';

export function InputField(props: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onFocus?: () => void;
  width?: string;
  maxRows?: number;
  disabled?: boolean;
}): JSX.Element {
  const [localValue, setLocalValue] = React.useState(props.value);
  const debounceOnChange = useDebouncedCallback((v: string) => {
    props.onChange(v);
  }, 500);

  useEffect(() => {
    debounceOnChange(localValue);
  }, [localValue]);

  return (
    <FormControl
      variant="standard"
      sx={{ m: 1, minWidth: 120, width: props.width || '80%' }}
      data-cy={`input-field-${props.label.replace(/\s+/g, '-')}`}
    >
      <InputLabel>{props.label}</InputLabel>
      <Input
        value={localValue}
        multiline
        onFocus={props.onFocus}
        maxRows={props.maxRows ?? undefined}
        onChange={(e) => {
          setLocalValue(e.target.value);
        }}
        disabled={props.disabled}
      />
    </FormControl>
  );
}

export function CheckBoxInput(props: {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
  tooltip?: string;
}): JSX.Element {
  return (
    <RowDiv>
      <FormControlLabel
        label={props.label}
        style={{
          margin: 0,
        }}
        control={
          <Checkbox
            checked={Boolean(props.value)}
            indeterminate={false}
            onChange={(e) => {
              props.onChange(e.target.checked);
            }}
            disabled={props.disabled}
          />
        }
      />
      {props.tooltip && <InfoTooltip title={props.tooltip} />}
    </RowDiv>
  );
}

export function SelectInputField(props: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  disabled?: boolean;
}): JSX.Element {
  const { label, options, onChange, value, disabled } = props;
  return (
    <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
      <InputLabel id={'select-field-label'}>{label}</InputLabel>
      <Select
        data-cy={`select-field-${label.replace(/\s+/g, '-')}`}
        labelId="demo-simple-select-standard-label"
        id="demo-simple-select-standard"
        value={value}
        onChange={(e) => {
          onChange(e.target.value as string);
        }}
        label={label}
        disabled={disabled}
      >
        {options.map((option, i) => (
          <MenuItem key={i} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export function EditableText(props: {
  text: string;
  onSave: (newText: string) => Promise<void>;
  disabled?: boolean;
}): JSX.Element {
  const [isEditing, setIsEditing] = React.useState(false);
  const [localText, setLocalText] = React.useState(props.text);
  const [isSaving, setIsSaving] = React.useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await props.onSave(localText);
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };

  if (isEditing) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Input
          value={localText}
          onChange={(e) => setLocalText(e.target.value)}
          disabled={isSaving}
          autoFocus
          data-cy="editable-text-input"
        />
        <IconButton
          data-cy="editable-text-save-button"
          onClick={handleSave}
          disabled={isSaving || props.disabled}
          size="small"
        >
          <SaveIcon />
        </IconButton>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Typography>{props.text}</Typography>
      <IconButton
        onClick={() => setIsEditing(true)}
        disabled={props.disabled}
        size="small"
        data-cy="editable-text-edit-button"
      >
        <EditIcon />
      </IconButton>
    </Box>
  );
}
