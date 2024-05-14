import {
  Avatar,
  Box,
  Button,
  Container,
  Stack,
  Typography,
} from '@mui/material'
import HouseRoundedIcon from '@mui/icons-material/HouseRounded'
import { NestedInput } from './NestedInput'
import React from 'react'

const createSelectOptions = (start, end) => {
  const options = []
  for (let i = start; i <= end; i++) {
    options.push({ value: i, label: i })
  }
  return options
}

export const InputForm = () => {
  const { properties, setProperties, results, setResults } = useAppState()
  const [expandView, setExpandView] = React.useState({})

  const methods = useForm({
    defaultValues: {
      id: '',
      propertyName: '',
      propertyValue: '',
      loan: '',
      deposit: '',
      monthlyOperatingCosts: '',
      monthlyRentalIncome: '',
      loanInterest: '',
      repaymentPeriod: '',
      repaymentType: 'interestOnly',
      mortgageTerm: 0,
      url: '',
    },
  })

  const { watch, setValue } = methods
  const propertyValue = watch('propertyValue')
  const deposit = watch('deposit')
  React.useEffect(() => {
    const loan = propertyValue - deposit
    setValue('loan', loan)
  }, [deposit, propertyValue, setValue])



  const addAnotherProperty = () => {
    methods.handleSubmit(onSubmit)()
  }

  const onSubmit = (data) => {
    // const id = uuidv4()
    data.id = uuidv4()
    console.log(data)
    // const newProperty = { ...methods.getValues(), id }

    setProperties((prevResults) => [...prevResults, data])
    // methods.setValue('propertyName', `Property ${properties.length + 2}`)
  }

  React.useEffect(() => {
    setOpen(false)
    setResults(sortByProfitability(properties))
  }, [properties, setResults])

  const onDelete = (ids) => {
    setResults((prevResults) =>
      prevResults.filter((result) => !ids.includes(result.id)),
    )
    setProperties((prevResults) =>
      prevResults.filter((result) => !ids.includes(result.id)),
    )
  }

  const handleExpand = (event, id) => {
    setExpandView(results.find((result) => result.id === id))
  }

  const closeView = () => {
    setExpandView({})
  }
  const [open, setOpen] = React.useState(false)

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen)
  }
  const isSmallScreen = useMediaQuery('(max-width:600px)') // Adjust the breakpoint as needed
  const inputs = [
    {
      name: 'propertyName',
      text: 'Property Name',
      type: 'text',
      inputMode: 'text',
      component: 'input',
      required: 'This field is required',
    },
    {
      name: 'url',
      text: 'URL',
      type: 'text',
      inputMode: 'text',
      component: 'input',
      required: 'This field is required',
    },
    {
      name: 'propertyValue',
      text: 'Value',
      type: 'number',
      inputMode: 'number',
      component: 'input',
      required: 'This field is required',
    },
    {
      name: 'deposit',
      text: 'Deposit',
      type: 'number',
      inputMode: 'number',
      component: 'input',
      required: 'This field is required',
    },
    {
      name: 'loan',
      text: 'Loan',
      type: 'text',
      inputMode: 'text',
      disabled: true,
      component: 'input',
      required: 'This field is required',
    },

    {
      name: 'monthlyOperatingCosts',
      text: 'Monthly Operating Costs',
      type: 'number',
      inputMode: 'numeric',
      component: 'input',
      required: 'This field is required',
    },
    {
      name: 'monthlyRentalIncome',
      text: 'Monthly Rental Income',
      type: 'number',
      inputMode: 'numeric',
      component: 'input',
      required: 'This field is required',
    },
    {
      name: 'loanInterest',
      text: 'Loan Interest',
      type: 'number',
      inputMode: 'numeric',
      component: 'input',
      required: 'This field is required',
    },
    {
      name: 'repaymentPeriod',
      text: 'Repayment Period',
      type: 'text',
      inputMode: 'text',
      component: 'select',
      required: 'This field is required',
      options: createSelectOptions(1, 30),
    },
    {
      name: 'mortgageTerm',
      text: 'Mortgage term',
      type: 'text',
      inputMode: 'text',
      component: 'select',
      required: 'This field is required',
      options: [
        { value: 2, label: '2' },
        { value: 3, label: '3' },
        { value: 5, label: '5' },
      ],
    },
    {
      name: 'repaymentType',
      text: 'Repayment Type',
      type: 'text',
      inputMode: 'text',
      component: 'select',
      required: 'This field is required',
      options: [
        { value: 'interestOnly', label: 'Interest only' },
        { value: 'repayment', label: 'Repayment' },
      ],
    },
  ]
  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <HouseRoundedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Add Property
        </Typography>
        <Box component="div" sx={{ mt: 2 }}>
          {inputs.map((input) => (
            <NestedInput key={input.name} {...input} />
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
              Add {properties?.length > 0 && properties?.length}
            </Button>
            <Button
              disableElevation
              size="small"
              variant="outlined"
              sx={{ mt: 3, mb: 2 }}
              onClick={toggleDrawer(false)}
            >
              Cancel
            </Button>
          </Stack>
        </Box>
      </Box>
    </Container>
  )
}
