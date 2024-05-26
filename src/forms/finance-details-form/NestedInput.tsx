import * as React from 'react'
import TextField from '@mui/material/TextField'
import { useFormContext, Controller, FieldValues } from 'react-hook-form'
import { CircularProgress, FormControl, InputAdornment } from '@mui/material'
import MenuItem from '@mui/material/MenuItem'
import { InputLabel } from '@mui/material'
import { Select } from '@mui/material'
import { InputNodes } from './finance-details-form'

type Props = {
  name: string
  text: string
  type: string
  inputMode: InputNodes
  disabled?: boolean
  required: string
  component: string
  options?: Array<{ value: string; label: string }>
  loading?: boolean
  async?: boolean
}

export const NestedInput = ({
  name,
  text,
  type,
  inputMode,
  disabled,
  required,
  component,
  options,
  loading,
  async,
}: Props) => {
  const { control, register } = useFormContext<FieldValues>() // retrieve all hook methods

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, formState }) => {
        switch (component) {
          case 'input':
            return (
              <FormControl fullWidth sx={{ mb: 2 }}>
                <TextField
                  error={formState.errors[name] ? true : false}
                  helperText={
                    (formState?.errors[name]?.message as string) || ''
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
                  InputProps={
                    async
                      ? {
                          startAdornment: loading && (
                            <InputAdornment position="start">
                              {loading && (
                                <CircularProgress color="success" size={20} />
                              )}
                            </InputAdornment>
                          ),
                        }
                      : {}
                  }
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
                  {options?.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )
          default: {
            return <></>
          }
        }
      }}
    />
  )
}
