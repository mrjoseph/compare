import type { NextPage } from "next";
import React from "react";
import { Box, Button, TextField } from "@mui/material";
import { Container } from "@mui/material";
import axios from 'axios';

type Response = {
  pageTitle: string;
  price: string;
}
const Home: NextPage = () => {

const [response, setResponse] = React.useState<Response>();

  const fetchData = async (url:string) => {
    const dataToSend = {
       url,
    };
    try {
      const response = await axios.get('/api/scrape',{ params: dataToSend });
      console.log('Scraped data:', response.data);
      setResponse(response.data);
    } catch (error) {
      console.error('Error fetching scraped data:', error);
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{pt:3}}
    >
      <TextField id="outlined-basic" label="Property url" variant="outlined" sx={{width:'100%'}} 
      onChange={(e) => fetchData(e.target.value)}
      />

      <Box>{response?.pageTitle}</Box>
    </Container>
  );
};

export default Home;