import React from 'react'
import {
  Avatar,
  Box,
  Button,
  Container,
  Input,
  Stack,
  Typography,
  useMediaQuery,
} from '@mui/material'
import { v4 as uuidv4 } from 'uuid'
import HouseRoundedIcon from '@mui/icons-material/HouseRounded'
import { NestedInput } from './NestedInput'
import { useForm, FormProvider } from 'react-hook-form'
import { FinanceDetails } from '@/pages/index'
import { useAppState } from './localstorage'
import { sortByProfitability } from '../../utils/calculate'
const createSelectOptions = (start: number, end: number) => {
  const options = []
  for (let i = start; i <= end; i++) {
    options.push({ value: `${i}`, label: `${i}` })
  }
  return options
}
type Props = {
  setFinanceDetails: React.Dispatch<React.SetStateAction<FinanceDetails[]>>
  setSteps: React.Dispatch<React.SetStateAction<number>>
  steps: number
}

export enum InputNodes {
  Numeric = 'numeric',
  Text = 'text',
}

export const InputForm = ({ setFinanceDetails, setSteps, steps }: Props) => {
  const methods = useForm({
    defaultValues: {
      deposit: '60000',
      monthlyOperatingCosts: '100',
      monthlyRentalIncome: '1200',
      loanInterest: '3.7',
      repaymentPeriod: '25',
      repaymentType: 'interestOnly',
      mortgageTerm: 5,
    },
  })

  const addAnotherProperty = () => {
    methods.handleSubmit(onSubmit)()
    setSteps(steps + 1)
  }

  const onSubmit = (data: any) => {
    setFinanceDetails(data)
  }

  const inputs = [
    {
      name: 'deposit',
      text: 'Deposit',
      type: 'number',
      inputMode: InputNodes.Numeric,
      component: 'input',
      required: 'This field is required',
    },

    {
      name: 'monthlyOperatingCosts',
      text: 'Monthly Operating Costs',
      type: 'number',
      inputMode: InputNodes.Numeric,
      component: 'input',
      required: 'This field is required',
    },
    {
      name: 'monthlyRentalIncome',
      text: 'Monthly Rental Income',
      type: 'number',
      inputMode: InputNodes.Numeric,
      component: 'input',
      required: 'This field is required',
    },
    {
      name: 'loanInterest',
      text: 'Loan Interest',
      type: 'number',
      inputMode: InputNodes.Numeric,
      component: 'input',
      required: 'This field is required',
    },
    {
      name: 'repaymentPeriod',
      text: 'Repayment Period',
      type: 'text',
      inputMode: InputNodes.Text,
      component: 'select',
      required: 'This field is required',
      options: createSelectOptions(1, 30),
    },
    {
      name: 'mortgageTerm',
      text: 'Mortgage term',
      type: 'text',
      inputMode: InputNodes.Text,
      component: 'select',
      required: 'This field is required',
      options: [
        { value: '2', label: '2' },
        { value: '3', label: '3' },
        { value: '5', label: '5' },
      ],
    },
    {
      name: 'repaymentType',
      text: 'Repayment Type',
      type: 'text',
      inputMode: InputNodes.Text,
      component: 'select',
      required: 'This field is required',
      options: [
        { value: 'interestOnly', label: 'Interest only' },
        { value: 'repayment', label: 'Repayment' },
      ],
    },
  ]
  return (
    <FormProvider {...methods}>
      <Box
        sx={{
          marginTop: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Box component="div" sx={{ mt: 2 }}>
          {inputs.map((input) => (
            <NestedInput
              key={input.name}
              {...input}
              options={(input.options || []).map((option) => ({
                value: option.value,
                label: option.label,
              }))}
            />
          ))}

          <Stack direction="row" spacing={2}>
            <Button
              disableElevation
              size="small"
              type="submit"
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={addAnotherProperty}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Box>
    </FormProvider>
  )
}
