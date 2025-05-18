import React from 'react';
import { FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';

export type DropdownComponentProps = {
  label: string;
  current: string;
  items: string[];
  handleSelect: (e: React.ChangeEvent<{ value: unknown }>) => void;
};

export const Dropdown = ({
  label,
  items,
  current,
  handleSelect,
}: DropdownComponentProps) => {
  return (
    <FormControl size="medium" fullWidth>
      <InputLabel>{label}</InputLabel>
      <Select
        value={current}
        onChange={handleSelect}
        // label={label}
      >
        <MenuItem value="">
          <em>All</em>
        </MenuItem>
        {items?.map((item: string, index: number) => (
          <MenuItem key={index} value={item}>
            {item}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
