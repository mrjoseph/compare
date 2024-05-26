import type { NextPage } from 'next'
import React from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { Avatar, Box, Button, Container, Typography } from '@mui/material'
import HouseRoundedIcon from '@mui/icons-material/HouseRounded'
import { FetchPropertyForm } from '@/forms/fetch-property-form/fetch-property-form'
import { InputForm } from '@/forms/finance-details-form/finance-details-form'
import { sortByProfitability } from '@/utils/calculate'
import { PropertyCard } from '@/components/property-card/property-card'
import { Property } from '@/types'
import { ResultsTable } from '@/components/results-table/results-table'

import { PropertyPreviewCards } from '@/components/preview-cards/previewCards'
import { FinanceDetails, Response } from '@/types'

const Home: NextPage = () => {
  const [propertyDetails, setPropertyDetails] = React.useState<Property[]>([])
  const [financeDetails, setFinanceDetails] = React.useState<FinanceDetails[]>(
    [],
  )
  const [steps, setSteps] = React.useState<number>(0)
  const [results, setResults] = React.useState<Property[]>([])
  const [selectedProperty, setSelectedProperty] = React.useState<string>('')

  const selectedResults = results.find(
    (result) => result.id === selectedProperty,
  )
  const calculate = React.useCallback(() => {
    const merged = propertyDetails.map((property) => {
      return {
        ...property,
        ...financeDetails[0],
      }
    })

    setResults([...results, ...sortByProfitability(merged)])
  }, [propertyDetails, financeDetails, results])

  const onDelete = (id: string) => {}
  const handleExpand = (id: string) => {
    setSelectedProperty(id)
  }

  const stepForm = () => {
    switch (steps) {
      case 0:
        return (
          <InputForm
            setFinanceDetails={setFinanceDetails}
            setSteps={setSteps}
            steps={steps}
          />
        )
      case 1:
        return (
          <>
            <FetchPropertyForm
              setPropertyDetails={setPropertyDetails}
              propertyDetails={propertyDetails}
            />

            {propertyDetails && (
              <PropertyPreviewCards
                propertyDetails={propertyDetails}
                setSteps={setSteps}
                steps={steps}
                calculate={calculate}
              />
            )}
          </>
        )
      case 2:
        return (
          <>
            {results.length > 0 && (
              <ResultsTable
                results={results}
                handleDelete={onDelete}
                handleExpand={handleExpand}
              />
            )}
          </>
        )
    }
  }
  return (
    <Container maxWidth="xl" sx={{ pt: 3 }}>
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
      <></>
    </Container>
  )
}

export default Home
