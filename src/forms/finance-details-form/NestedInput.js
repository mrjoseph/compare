import * as React from 'react'
import TextField from '@mui/material/TextField'
import { useFormContext, Controller } from 'react-hook-form'
import { FormControl } from '@mui/material'
import MenuItem from '@mui/material/MenuItem'
import { InputLabel } from '@mui/material'
import { Select } from '@mui/material'
export const NestedInput = ({
  name,
  text,
  type,
  inputMode,
  disabled,
  required,
  component,
  options,
}) => {
  console.log('options', options)
  const { control, register } = useFormContext() // retrieve all hook methods

  return (
    <Controller
      name={name}
      control={control}
      render={(props) => {
        const { field, formState } = props
        switch (component) {
          case 'input':
            return (
              <FormControl fullWidth sx={{ mb: 2 }}>
                <TextField
                  error={formState.errors[name] ? true : false}
                  helperText={
                    formState.errors[name] ? formState.errors[name].message : ''
                  }
                  size="small"
                  label={text}
                  {...field}
                  {...register(name, {
                    required,
                  })}
                  disabled={disabled}
                  inputProps={{
                    inputMode: inputMode,
                    style: { backgroundColor: '#fff' },
                  }}
                  id={name}
                  type={type}
                  required
                />
              </FormControl>
            )
          case 'select':
            return (
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id={name}>{text}</InputLabel>
                <Select
                  size="small"
                  {...register(name, {
                    required,
                  })}
                  error={formState.errors[name] ? true : false}
                  // helperText={
                  //   formState.errors[name] ? formState.errors[name].message : ''
                  // }
                  labelId={name}
                  label={text}
                  disabled={disabled}
                  inputProps={{
                    inputMode: inputMode,
                    style: { backgroundColor: '#fff' },
                  }}
                  id={name}
                  type={type}
                  required
                  {...field}
                >
                  {options.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )
          default: {
            return null
          }
        }
      }}
    />
  )
}
