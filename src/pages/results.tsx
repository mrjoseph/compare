import { Header } from '@/components/header/header'
import { ResultsTable } from '@/components/results-table/results-table'
import { useStateContext } from '@/state/stateContext'
import { CalculatedPropertyResults } from '@/types'
import { sortByProfitability } from '@/utils/calculate'
import { Container } from '@mui/material'
import type { NextPage } from 'next'
import React from 'react'

const Results: NextPage = () => {
  const [state, setState] = React.useState<CalculatedPropertyResults[]>()
  React.useEffect(() => {
    const results = JSON.parse(localStorage.getItem('results') || '[]') || []
    if (results.length > 0) {
      const calculated = sortByProfitability(results)
      setState(calculated)
    }
  }, [])

  const [selectedProperty, setSelectedProperty] = React.useState<string>('')
  const onDelete = (id: string) => {}
  const handleExpand = (id: string) => {
    setSelectedProperty(id)
  }

  console.log(state)
  return (
    <Container maxWidth="xl" sx={{ pt: 3 }}>
      <Header />

      {state && state.length > 0 && (
        <ResultsTable
          results={state}
          handleDelete={onDelete}
          handleExpand={handleExpand}
        />
      )}
    </Container>
  )
}

export default Results
