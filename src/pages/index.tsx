import type { NextPage } from "next";
import React from "react";

import { Container } from "@mui/material";

const Home: NextPage = () => {

  return (
      <Container
        maxWidth="md"
        sx={{
          paddingTop: "100px",
          margin: "0 auto",
        }}
      >
   Hello World
      </Container>
  );
};

export default Home;