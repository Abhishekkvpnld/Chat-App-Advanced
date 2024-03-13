import React, { memo, useState } from 'react';
import { Box, Drawer, Grid, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import { KeyboardBackspace as KeyboardBackspaceIcon, Menu as MenuIcon } from "@mui/icons-material";
import { matBlack } from '../constants/color';
import { useNavigate } from "react-router-dom";
import { Link } from "../components/styles/StyledComponents";
import AvatarCard from "../components/shared/AvatarCard";
import { SampleChat } from "../constants/SampleChat";


const Groups = () => {

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navigateBack = () => {
    navigate("/")
  };

  const handleMobile = () => {
    setIsMobileMenuOpen((prev) => !prev)
  };

  const handleMobileClose = () => setIsMobileMenuOpen(false);

  const IconBtn = (
    <>

      <Box
        sx={{
          display: {
            xs: "block",
            sm: "none",
            position: "fixed",
            right: "1rem",
            top: "1rem"
          }
        }}
      >
        <IconButton onClick={handleMobile}>
          <MenuIcon />
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
            ":hover": {
              bgcolor: "rgba(0,0,0,0.7)"
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
        <GroupList myGroups={SampleChat} />
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

      <Drawer open={isMobileMenuOpen} onClose={handleMobileClose}
        sx={{
          display: {
            xs: "block",
            sm: "none"
          }
        }}
      >
        <GroupList />
      </Drawer>

    </Grid>
  )
}

const GroupList = ({ w = "100%", myGroups = [], chatId }) => {
  return (
    <Stack>
      <Typography>group</Typography>
      {
        myGroups.length > 0 ? (
          myGroups.map((group) => <GroupListItem group={group} chatId={chatId} key={group._id} />)
        ) : (
          <Typography padding={"1rem"} textAlign={"center"} color={"blue"}>
            No groups
          </Typography>
        )
      }
    </Stack>
  )
};

const GroupListItem = memo(({ group, chatId }) => {
  const { name, avatar, _id } = group;
  return <Link>
    <Stack>
      <AvatarCard avatar={avatar} />
      <Typography>{name}</Typography>
    </Stack>
  </Link>
});

export default Groups;