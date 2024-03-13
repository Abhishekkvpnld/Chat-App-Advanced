import React, { useState } from 'react';
import { Box, Drawer, Grid, IconButton, Tooltip } from "@mui/material";
import { KeyboardBackspace as KeyboardBackspaceIcon,Menu as MenuIcon } from "@mui/icons-material";
import { matBlack } from '../constants/color';
import {useNavigate } from "react-router-dom";

const Groups = () => {

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navigateBack = ()=>{
navigate("/")
  };

  const handleMobile = ()=>{
setIsMobileMenuOpen((prev)=>!prev)
  };

const handleMobileClose = ()=>setIsMobileMenuOpen(false);

  const IconBtn = (
    <>

<Box
sx={{
display:{
  xs:"block",
  sm:"none",
  position:"fixed",
  right:"1rem",
  top:"1rem"
}
}}
>
  <IconButton onClick={handleMobile}>
    <MenuIcon/>
  </IconButton>
</Box>

      <Tooltip title={"back"}>

        <IconButton
          sx={{
            position: "absolute",
            top: "2rem",
            left: "2rem",
            bgcolor: matBlack,
            color: 'white',
            ":hover":{
              bgcolor:"rgba(0,0,0,0.7)"
            }
          }}
          onClick={navigateBack}
        >
          <KeyboardBackspaceIcon />
        </IconButton>

      </Tooltip>
    </>
  )

  return (
    <Grid container height={"100vh"}>
      <Grid
        item
        sx={{
          display: {
            xs: 'none',
            sm: "block"
          }
        }}
        sm={4}
        bgcolor={"bisque"}
      >
        Groups List
      </Grid>

      <Grid item xs={12} sm={8}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
          padding: "1rem 3rem",
        }}
      >
       {IconBtn}
      </Grid>

      <Drawer open={isMobileMenuOpen} onClose={handleMobileClose}>

      </Drawer>

    </Grid>
  )
}

export default Groups;