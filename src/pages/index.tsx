import type { NextPage } from 'next'
import React from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { Avatar, Box, Button, Container, Typography } from '@mui/material'
import HouseRoundedIcon from '@mui/icons-material/HouseRounded'
import { FetchPropertyForm } from '@/forms/fetch-property-form/fetch-property-form'
import { InputForm } from '@/forms/finance-details-form/finance-details-form'
import { sortByProfitability } from '@/utils/calculate'
import { PropertyCard } from '@/components/property-card/property-card'
import { CalculatedPropertyResults } from '@/types'

type images = {
  url: string
}
export type Response = {
  displayAddress: string
  price: string
  propertyType: string
  url: string
  images: images[]
}

export type FinanceDetails = {
  id: string
  loan: string
  deposit: string
  monthlyOperatingCosts: string
  monthlyRentalIncome: string
  loanInterest: string
  repaymentPeriod: string
  repaymentType: string
  mortgageTerm: string
}

// combine Response and FinanceDetails types
export type Property = Response & FinanceDetails
const Home: NextPage = () => {
  const [propertyDetails, setPropertyDetails] = React.useState<Response[]>([])
  const [financeDetails, setFinanceDetails] = React.useState<FinanceDetails[]>(
    [],
  )
  const [steps, setSteps] = React.useState<number>(0)
  const [results, setResults] = React.useState<Property[]>([])
  const calculate = React.useCallback(() => {
    const merged = propertyDetails.map((property) => {
      return {
        ...property,
        ...financeDetails,
      }
    })

    setResults(sortByProfitability(merged))
  }, [propertyDetails, financeDetails])
  React.useEffect(() => {
    if (steps === 2) {
      calculate()
    }
  }, [financeDetails, calculate, steps])

  const stepForm = () => {
    switch (steps) {
      case 0:
        return (
          <FetchPropertyForm
            setPropertyDetails={setPropertyDetails}
            setSteps={setSteps}
            steps={steps}
          />
        )
      case 1:
        return (
          <InputForm
            setFinanceDetails={setFinanceDetails}
            setSteps={setSteps}
            steps={steps}
          />
        )
      default:
        return (
          <>
            {results.map((result) => {
              // @ts-ignore
              return (
                <PropertyCard
                  property={result}
                  key={result.id}
                  view="summary"
                />
              )
            })}
          </>
        )
    }
  }
  return (
    <Container maxWidth="lg" sx={{ pt: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <HouseRoundedIcon />
        </Avatar>
      </Box>
      <Box margin={2}>
        <Typography
          component="h1"
          variant="h5"
          sx={{ display: 'flex', justifyContent: 'center' }}
        >
          Buy to let comparison tool
        </Typography>
        <Typography
          component="p"
          sx={{ display: 'flex', justifyContent: 'center' }}
        >
          Copy and paste a Rightmove URL to get started
        </Typography>
      </Box>
      {stepForm()}
    </Container>
  )
}

export default Home
