import type { NextPage } from 'next'
import React from 'react'

import { Container } from '@mui/material'

import { FetchPropertyForm } from '@/forms/fetch-property-form/fetch-property-form'

const Home: NextPage = () => {
  return (
    <Container maxWidth="sm" sx={{ pt: 3 }}>
      <FetchPropertyForm />
    </Container>
  )
}

export default Home
