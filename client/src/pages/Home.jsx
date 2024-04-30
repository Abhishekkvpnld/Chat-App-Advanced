import React from 'react';
import AppLayout from '../components/layout/AppLayout';
import { Box, Typography } from '@mui/material';
import { greyColor } from '../constants/color';
import robot from "./robot.gif";
import { Search as SearchIcon } from "@mui/icons-material"

const Home = () => {
  return (
    <Box bgcolor={greyColor} height={"100%"} display={"flex"} flexDirection={"column"} alignItems={"center"} justifyContent={"center"}>
      <img src={robot} alt="img" width={"250px"} />
      <Typography variant='h5' textAlign={"center"} >
        Select a friend to chat
        <SearchIcon color='success'/> </Typography>
    </Box>
  )
}

export default AppLayout(Home);