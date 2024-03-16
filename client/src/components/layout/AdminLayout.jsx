import { Box, Drawer, Grid, IconButton, Stack, Typography } from '@mui/material';
import React, { useState } from 'react';
import { greyColor, matBlack } from '../../constants/color';
import { Menu as MenuIcon, Close as CloseIcon, Group as GroupIcon, ManageAccounts as ManageAccountsIcon, Message as MessageIcon, ExitToApp as ExitToAppIcon } from "@mui/icons-material";
import { useLocation, Link as LinkComponent, Navigate } from "react-router-dom";
import { Dashboard as DashboardIcon } from "@mui/icons-material";
import { styled } from '@mui/material';


const Link = styled(LinkComponent)`
text-decoration: none;
border-radius: 2rem;
padding: 1rem 2rem;
color: black;
&:hover {
    color: rgba(0, 0, 0, 0.54);
}
`;


export const adminTabs = [
    {
        name: "Dashboard",
        path: "/admin/dashboard",
        icon: <DashboardIcon />
    },
    {
        name: "Users",
        path: "/admin/users",
        icon: <ManageAccountsIcon />
    },
    {
        name: "Chats",
        path: "/admin/chats",
        icon: <GroupIcon />
    },
    {
        name: "Messages",
        path: "/admin/messages",
        icon: <MessageIcon />
    },
]


const Sidebar = ({ w = "100%" }) => {

    const location = useLocation();

    const handleLogout = () => {
        console.log("logout");
    }

    return (
        <Stack width={w} direction={"column"} spacing={"3rem"} p={"3rem"}>
            <Typography variant='h5' textTransform={"uppercase"}>
                Admin
            </Typography>

            <Stack spacing={"1rem"}>

                {
                    adminTabs.map((tab) => (
                        <Link key={tab.path} to={tab.path}
                            sx={
                                location.pathname === tab.path && {
                                    bgcolor: matBlack,
                                    color: "white",
                                    ":hover": { color: greyColor }
                                }
                            }
                        >
                            <Stack direction={"row"} alignItems={"center"} spacing={"1rem"} >
                                {tab.icon}
                                <Typography fontSize={"1.2rem"}>{tab.name}</Typography>
                            </Stack>
                        </Link>
                    ))
                }

                <Link onClick={handleLogout} >
                    <Stack direction={"row"} alignItems={"center"} spacing={"1rem"} >
                        <ExitToAppIcon />
                        <Typography fontSize={"1.2rem"}>Logout</Typography>
                    </Stack>
                </Link>

            </Stack>

        </Stack>
    )
}

const isAdmin = true;

const AdminLayout = ({ children }) => {

    const [isMobile, setIsMobile] = useState(false);

    const handleMobile = () => setIsMobile(!isMobile);
    const handleClose = () => setIsMobile(false);

if(!isAdmin) return <Navigate to={"/admin"}/>

    return (
        <Grid container minHeight={"100vh"}>

            <Box sx={{
                display: { xs: "block", md: "none" },
                position: "fixed",
                top: "1rem",
                right: "1rem"
            }}>
                <IconButton onClick={handleMobile}>
                    {
                        isMobile ? <CloseIcon /> : <MenuIcon />
                    }
                </IconButton>
            </Box>

            <Grid item md={4} lg={3} sx={{ display: { xs: "none", md: "block" } }}>
                <Sidebar />
            </Grid>

            <Grid item xs={12} md={8} lg={9} sx={{ bgcolor: greyColor }}>
                {children}
            </Grid>

            <Drawer open={isMobile} onClose={handleClose}>
                <Sidebar w={"50vw"} />
            </Drawer>

        </Grid>
    )
}

export default AdminLayout;