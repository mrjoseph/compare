import type { NextPage } from 'next'
import React, { use, useCallback } from 'react'
import {
  Avatar,
  Box,
  Button,
  FormControl,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material'
import { Container } from '@mui/material'
import axios from 'axios'
import HouseRoundedIcon from '@mui/icons-material/HouseRounded'
import CircularProgress from '@mui/material/CircularProgress'
import { Property } from '@/types'
import { Controller, set } from 'react-hook-form'
import { PropertyCard } from '@/components/property-card/property-card'
import { PropertyCardPreview } from '@/components/property-card-preview/property-card-preview'
import { ResultsTable } from '@/components/results-table/results-table'
import { useForm, FormProvider, useWatch } from 'react-hook-form'
import { InputNodes } from '@/types'
import { NestedInput } from '../finance-details-form/NestedInput'

type Response = {
  images: {
    url: string
  }[]
}

type Props = {
  setPropertyDetails: React.Dispatch<React.SetStateAction<Property[]>>
  propertyDetails: Response[]
}

const defaultInputs = [
  {
    name: 'monthlyRentalIncome',
    text: 'Monthly Rental Income',
    type: 'number',
    inputMode: InputNodes.Numeric,
    component: 'input',
    required: 'This field is required',
  },
  {
    name: 'url',
    text: 'url',
    type: 'text',
    inputMode: InputNodes.Text,
    component: 'input',
    required: 'This field is required',
    async: true,
  },
]
export const FetchPropertyForm = ({
  setPropertyDetails,
  propertyDetails,
}: Props) => {
  const methods = useForm({
    defaultValues: {
      monthlyOperatingCosts: '',
      monthlyRentalIncome: '',
      url: '',
    },
  })
  const [response, setResponse] = React.useState<Response[]>([])
  const [url, setUrl] = React.useState<string>('')
  const [inputs, setInputs] = React.useState<any>(defaultInputs)
  const [loading, setLoading] = React.useState<boolean>(false)
  const [disabled, setDisabled] = React.useState<boolean>(false)
  const urlValues = useWatch({
    control: methods.control,
    name: 'url',
  })

  React.useEffect(() => {
    if (response.length > 0) {
      setDisabled(true)
    } else {
      setDisabled(false)
    }
  }, [response])

  const fetchData = useCallback(async (url: string) => {
    if (!url || url.length === 0) return
    setLoading(true)
    try {
      const results = await axios.get('/api/scrape', {
        params: {
          url,
        },
      })
      if (results.data) {
        console.log(results.data)
        // remove images from inputs
        const newInputs = {
          price: results.data.price,
          displayAddress: results.data.displayAddress,
          propertyType: results.data.propertyType,
          annualServiceCharge: results.data.annualServiceCharge,
          annualGroundRent: results.data.annualGroundRent,
        }
        setInputs([
          ...defaultInputs,
          ...Object.keys(newInputs).map((key) => {
            console.log(results.data[key])
            return {
              defaultValue: results.data[key],
              name: key,
              text: key,
              type: 'text',
              inputMode: InputNodes.Text,
              component: 'input',
              required: 'This field is required',
            }
          }),
        ])
        setResponse({ ...results.data, url })
        setUrl('')
        setLoading(false)
      }
    } catch (error) {
      console.log(false)
    }
  }, [])

  React.useEffect(() => {
    if (urlValues.length > 0) fetchData(urlValues)
  }, [urlValues, fetchData])

  const onAdd = async (data: any) => {
    const property = { ...response, ...data }
    console.log(property)
    setPropertyDetails([...propertyDetails, property])
    methods.reset()
    setInputs(defaultInputs)
  }

  const addProperty = () => {
    methods.handleSubmit(onAdd)()
  }

  return (
    <FormProvider {...methods}>
      <Container maxWidth="sm">
        <Box>
          {inputs.map((input) => (
            <NestedInput key={input.name} {...input} loading={loading} />
          ))}
          <Box
            sx={{
              textAlign: 'center',
            }}
          >
            <Button
              disableElevation
              size="small"
              type="submit"
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={addProperty}
            >
              Add {propertyDetails.length > 0 && 'another'} property
            </Button>
          </Box>
        </Box>
      </Container>
    </FormProvider>
  )
}
