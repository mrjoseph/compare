import type { NextPage } from 'next'
import React from 'react'
import { Avatar, Box, Button, Container, Typography } from '@mui/material'
import HouseRoundedIcon from '@mui/icons-material/HouseRounded'
import { FetchPropertyForm } from '@/forms/fetch-property-form/fetch-property-form'
import { InputForm } from '@/forms/finance-details-form/finance-details-form'
import { sortByProfitability } from '@/utils/calculate'
import { PropertyCard } from '@/components/property-card/property-card'
import { ResultsTable } from '@/components/results-table/results-table'
import { PropertyPreviewCard } from '@/components/property-preview-card/property-preview-card'
import { Response, FinanceDetails, Property } from '.'

export const Home: NextPage = () => {
  const [propertyDetails, setPropertyDetails] = React.useState<Response[]>([])
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

    //  console.log('merged', merged)
    setResults([...results, ...sortByProfitability(merged)])
  }, [propertyDetails, financeDetails, results])

  // React.useEffect(() => {
  //   if (propertyDetails) {
  //     console.log('calculating', propertyDetails)
  //     //    calculate()
  //   }
  // }, [propertyDetails, calculate])
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
              steps={steps}
              setSteps={setSteps}
            />
            {propertyDetails &&
              propertyDetails.map((property, index) => {
                return (
                  <PropertyPreviewCard
                    property={property}
                    key={`${property.displayAddress}-${index}`}
                  />
                )
              })}
          </>
        )
      case 2:
        return (
          <>
            <Button onClick={calculate} variant="contained">
              Calculate
            </Button>{' '}
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
      <>
        {selectedResults && (
          <PropertyCard property={selectedResults} view="summary" />
        )}
      </>
    </Container>
  )
}
