import type { NextPage } from 'next'
import React, { useCallback } from 'react'
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
import { Response } from '@/pages/index'
import { set } from 'react-hook-form'
import { PropertyCard } from '@/components/property-card/property-card'

type Props = {
  setPropertyDetails: React.Dispatch<React.SetStateAction<Response[]>>
  setSteps: React.Dispatch<React.SetStateAction<number>>
  steps: number
}

export const FetchPropertyForm = ({
  setPropertyDetails,
  steps,
  setSteps,
}: Props) => {
  const [response, setResponse] = React.useState<Response[]>([])
  const [url, setUrl] = React.useState<string>('')
  const [loading, setLoading] = React.useState<boolean>(false)
  const fetchData = useCallback(async (url: string) => {
    if (!url || url.length === 0) {
      return
    }
    const dataToSend = {
      url,
    }
    try {
      setLoading(true)
      const results = await axios.get('/api/scrape', { params: dataToSend })
      if (results.data) {
        setResponse((prevResponse) => [
          ...prevResponse,
          { ...results.data, url },
        ])
        setUrl('')
        setLoading(false)
      }
    } catch (error) {
      console.error('Error fetching scraped data:', error)
      setLoading(false)
    }
  }, [])
  const handlePaste = (event: React.ClipboardEvent<HTMLDivElement>) => {
    const pastedText = event.clipboardData.getData('text')
    fetchData(pastedText)
  }
  React.useEffect(() => {
    fetchData(url)
  }, [url, fetchData])

  React.useEffect(() => {
    setPropertyDetails(response)
  }, [response, setPropertyDetails])
  return (
    <Box>
      {response && response.length > 0 ? (
        response.map((res, index) => (
          <Box key={index} sx={{ pt: 3 }}>
            <PropertyCard property={res} view="fetch" />
          </Box>
        ))
      ) : (
        <Container sx={{ pt: 3 }}>
          <h4>No properties </h4>
        </Container>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <TextField
            id="outlined-basic"
            label="Property url"
            variant="outlined"
            sx={{ mb: 4 }}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            // onPaste={handlePaste}
            size="small"
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  {loading && <CircularProgress color="success" size={20} />}
                </InputAdornment>
              ),
            }}
          />
        </FormControl>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Button
          variant="contained"
          disabled={response && response?.length > 0 ? false : true}
          onClick={() => setSteps(steps + 1)}
        >
          Next
        </Button>
      </Box>
    </Box>
  )
}
