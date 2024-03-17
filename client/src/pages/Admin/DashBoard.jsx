import React from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { Box, Container, Paper, Stack, Typography } from '@mui/material';
import { AdminPanelSettings as AdminPanelSettingsIcon, Group as GroupIcon, Notifications as NotificationsIcon, Person as PersonIcon,Message as MessageIcon } from '@mui/icons-material';
import moment from 'moment';
import { CurveButton, SearchField } from '../../components/styles/StyledComponents';
import { DoughnutChart, LineChart } from '../../components/specific/Chart';

const DashBoard = () => {

  const Appbar = (
    <Paper
      elevation={3}
      sx={{
        padding: "2rem", margin: "2rem 0", borderRadius: "1rem"
      }}
    >
      <Stack direction={"row"} spacing={"1rem"} alignItems={"center"}>

        <AdminPanelSettingsIcon sx={{ fontSize: "3rem" }} />
        <SearchField placeholder='Search...' />
        <CurveButton>Search</CurveButton>
        <Box flexGrow={1} />
        <Typography
          display={{
            xs: "none",
            lg: "block"
          }}
          color="rgba(0, 0, 0, 0.7)"
          textAlign="center"
        >
          {moment().format("MMMM Do YYYY, h:mm:ss a")}
        </Typography>
        <NotificationsIcon />
      </Stack>
    </Paper>
  )
  const Widgets = (
    <Stack direction={{ xs: "column", sm: "row" }}
      spacing={"2rem"}
      justifyContent={"space-between"}
      alignItems={"center"}
      margin={"2rem 0"}
    >
      <Widget title={"Users"} value={34} icon={<PersonIcon/>} />
      <Widget title={"Chats"} value={3} icon={<GroupIcon/>} />
      <Widget title={"Messages"} value={453}  icon={<MessageIcon/>}/>
    </Stack>)

  return (
    <AdminLayout>
      <Container component={"main"}>
        {Appbar}


        <Stack direction={"row"} spacing={"2rem"} flexWrap={"wrap"}>
          <Paper
            elevation={3}
            sx={{
              padding: "2rem 3.5rem",
              borderRadius: "1rem",
              width: "100%",
              maxWidth: "45rem",
              height: "25rem"
            }}
          >
            <Typography variant='h4' margin={"2rem 0"}>Last Messages</Typography>

           <LineChart/>

          </Paper>

          <Paper
            elevation={3}
            sx={{
              padding: "1rem",
              borderRadius: "1rem",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: { xs: "100%", sm: "50%" },
              position: "relative",
              width: "100%",
              maxWidth: "25rem",
              height: "25rem   "
            }}
          >
            <DoughnutChart/>

            <Stack
              position={"absolute"}
              direction={"row"}
              justifyContent={"center"}
              alignItems={"center"}
              width={"100%"}
              height={"100%"}
              spacing={"0.5rem"}
            >

              <GroupIcon />
              <Typography>Vs</Typography>
              <PersonIcon />

            </Stack>

          </Paper>

        </Stack>
        {Widgets}

      </Container>
    </AdminLayout>
  )
}

const Widget = ({ title, value, icon }) =>
  <Paper
  elevation={3}
  sx={{
    padding:"2rem",
    margin:"2rem 0",
    borderRadius:"1.5rem",
    width:"20rem"
  }}
  >
    <Stack alignItems={"center"} spacing={"1rem"}>
      <Typography
      sx={{
         color:"rgba(0,0,0,0.7)",
         borderRadius:"50%",
         border:"5px solid rgba(0,0,0,0.9)",
         width:"5rem",
         height:"5rem",
         display:"flex",
         justifyContent:"center",
         alignItems:"center"
      }}
      >
        {value}
      </Typography>
      <Stack direction={"row"} spacing={"1rem"} alignItems={"center"}>
        {icon}
        <Typography>{title}</Typography>
      </Stack>
    </Stack>
  </Paper>

export default DashBoard;