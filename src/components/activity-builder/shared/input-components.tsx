import React, { useEffect } from 'react';
import {
  FormControl,
  InputLabel,
  Input,
  FormControlLabel,
  Checkbox,
  Select,
  MenuItem,
} from '@mui/material';
import { useDebouncedCallback } from '../../../hooks/use-debounced-callback';

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
}): JSX.Element {
  return (
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
