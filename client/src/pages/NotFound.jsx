import React from 'react';
import { Link } from 'react-router-dom';
import { Error as ErrorIcon } from "@mui/icons-material";
import { Typography, Stack, Container } from "@mui/material";

const NotFound = () => {
  return (
    <Container maxWidth={"lg"} sx={{height:"100vh"}}>
      <Stack alignItems={"center"} justifyContent={"center"} spacing={"2rem"}  height="100%">
        <ErrorIcon sx={{ fontSize: "10rem" }} color='error' />
        <Typography style={{color:"blue"}} variant='h1'>404</Typography>
        <Typography variant='h3' >Not Found</Typography>
        <Link to={"/"}>Go back to home?</Link>
      </Stack>
    </Container>
  )
}

export default NotFound;