import type { NextPage } from 'next'
import React from 'react'
import { v4 as uuidv4 } from 'uuid'
import { useRouter } from 'next/router'
import { Container } from '@mui/material'
import { FetchPropertyForm } from '@/forms/fetch-property-form/fetch-property-form'
import { InputForm } from '@/forms/finance-details-form/finance-details-form'
import { Property } from '@/types'
import { PropertyPreviewCards } from '@/components/preview-cards/previewCards'
import { FinanceDetails } from '@/types'
import { useStateContext } from '@/state/stateContext'
import { Header } from '@/components/header/header'

const Home: NextPage = () => {
  const router = useRouter()
  const { state, setState } = useStateContext()
  const [propertyDetails, setPropertyDetails] = React.useState<Property[]>([])
  const [financeDetails, setFinanceDetails] = React.useState<FinanceDetails[]>(
    [],
  )
  const [steps, setSteps] = React.useState<number>(0)
  const [results, setResults] = React.useState<Property[]>([])

  const calculate = React.useCallback(() => {
    const merged = propertyDetails.map((property) => ({
      id: uuidv4(),
      ...property, 
      ...financeDetails[0],
    }))

    setResults([...results, ...merged])
  }, [propertyDetails, financeDetails, results])

  React.useEffect(() => {
    if (steps === 2 && results.length > 0) {
      console.log('results', results)
      setState(results)
      router.push('/results')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [results, steps])

  const StepForm = () => {
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
    }
  }
  return (
    <Container maxWidth="xl" sx={{ pt: 3 }}>
      <Header />
      <StepForm />
    </Container>
  )
}

export default Home
