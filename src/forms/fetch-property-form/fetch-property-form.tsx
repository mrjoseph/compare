import type { NextPage } from 'next'
import React from 'react'
import { Box, Button, TextField, Typography } from '@mui/material'
import { Container } from '@mui/material'
import axios from 'axios'

type Response = {
  pageTitle: string
  price: string
  displayAddress: string
  propertyType: string
}
export const FetchPropertyForm = () => {
  const [response, setResponse] = React.useState<Response[]>([])
  const [url, setUrl] = React.useState<string>('')
  const fetchData = async (url: string) => {
    if (!url || url.length === 0) {
      return
    }
    const dataToSend = {
      url,
    }
    try {
      const results = await axios.get('/api/scrape', { params: dataToSend })

      setResponse([...response, results.data])
    } catch (error) {
      console.error('Error fetching scraped data:', error)
    }
  }
  return (
    <Box>
      {response && response.length > 0 ? (
        response.map((res, index) => (
          <Box key={index} sx={{ pt: 3 }}>
            <h3>{res.displayAddress}</h3>
            <Typography>Price: {res.price}</Typography>
            <Typography>Address: {res.displayAddress}</Typography>
            <Typography>Property type: {res.propertyType}</Typography>
          </Box>
        ))
      ) : (
        <Container sx={{ pt: 3 }}>
          <h1>Add properties from Rightmove</h1>
        </Container>
      )}
      <TextField
        id="outlined-basic"
        label="Property url"
        variant="outlined"
        sx={{ width: '100%' }}
        onChange={(e) => setUrl(e.target.value)}
        size="small"
        margin="normal"
      />
      <Button variant="contained" onClick={() => fetchData(url)}>
       Add
      </Button>
    </Box>
  )
}
