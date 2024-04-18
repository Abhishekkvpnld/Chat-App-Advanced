import React from 'react';
import AppLayout from '../components/layout/AppLayout';
import { Box, Typography } from '@mui/material';
import { greyColor } from '../constants/color';
import robot from "./robot.gif";
import { Search as SearchIcon } from "@mui/icons-material"

const Home = () => {
  return (
    <Box bgcolor={greyColor} height={"100%"}>
      <img src={robot} alt="img" style={{ position: 'absolute' }} />
      <Typography variant='h5' textAlign={"center"} style={{ paddingTop: "25rem" }} >
        Select a friend to chat
        <SearchIcon color='error'/> </Typography>
    </Box>
  )
}

export default AppLayout(Home);