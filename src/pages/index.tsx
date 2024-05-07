import type { NextPage } from "next";
import React from "react";
import axios from 'axios';
import * as cheerio from 'cheerio';
import { TextField } from "@mui/material";
import { Container } from "@mui/material";

const Home: NextPage = () => {
  const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
const url = 'https://www.zoopla.co.uk/for-sale/details/66758408/?search_identifier=e26131ff98be2ade596a4bbc55a21be426631c703f1cc153a40149215f7c105d';
  axios.get(proxyUrl + url)
  .then(response => {
    if (response.status === 200) {
      // Load the HTML into Cheerio
      const $ = cheerio.load(response.data);

      // Now you can use Cheerio to select elements and extract data
      // For example, let's extract all the links on the page
      $('a').each((index, element) => {
        console.log($(element).attr('href'));
      });
    } else {
      console.log('Error loading the page');
    }
  })
  .catch(error => {
    console.log('Error loading the page:', error);
  });
  return (
      <Container
        maxWidth="md"
        sx={{
          paddingTop: "100px",
          margin: "0 auto",
        }}
      >
   <TextField id="outlined-basic" label="Outlined" variant="outlined" />
      </Container>
  );
};

export default Home;