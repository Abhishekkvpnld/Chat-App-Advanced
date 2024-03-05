import { AppBar, Box, IconButton, Toolbar, Tooltip, Typography } from '@mui/material';
import { orange } from "../../constants/color";
import React, { Suspense, lazy, useState } from 'react';
import { Menu as MenuIcon, Search as SearchIcon, Add as AddIcon, Group as GroupIcon,Logout as LogoutIcon,Notifications as NotificationIcon } from "@mui/icons-material";
import { useNavigate } from 'react-router-dom';
 
const Search = lazy(()=>import('../specific/Search'));
const Notification = lazy(()=>import('../specific/Notification'));
const NewGroup = lazy(()=>import('../specific/NewGroup'));

const Header = () => {

    const [isMobile,setIsmobile] = useState(false);
    const [isSearch,setIsSearch] = useState(false);
    const [isNewGroup,setIsNewGroup] = useState(false);
    const [isNotification,setIsNotification] = useState(false)

const Navigate = useNavigate();

    const handleMobile = () => {
        setIsmobile((prev)=>!prev)
    }

    const openSearch = () => {
        setIsSearch((prev)=>!prev)
    }

    const openNewGroup = ()=>{
        setIsNewGroup((prev)=>!prev)
    }

    const logoutHandler = ()=>{
console.log('logout');
    }

    const openNotification = ()=>{
        setIsNotification((prev)=>!prev)
    }

    const navigateToGroup = ()=>Navigate("/groups")
    return (
        <>
            <Box sx={{ flexGrow: 1 }} height={"4rem"} >

                <AppBar
                    position='static' sx={{ bgcolor: orange }}
                >
                    <Toolbar>

                        <Typography
                            variant='h6'
                            sx={{
                                display: { xs: "none", sm: 'block' }
                            }}
                        >
                            chat app
                        </Typography>


                        <Box sx={{
                            display: { xs: "block", sm: 'none' }
                        }}>
                            <IconButton color='inherit' onClick={handleMobile}>
                                <MenuIcon />
                            </IconButton>
                        </Box>


                        <Box sx={{ flexGrow: 1 }} />


                        <Box>

                            <BtnIcon title={"Search"} onClick={openSearch} icon={<SearchIcon/>} />
                            <BtnIcon title={"New Group"} onClick={openNewGroup} icon={<AddIcon/>} />
                            <BtnIcon title={"Manage Group"} onClick={navigateToGroup} icon={<GroupIcon/>} />
                            <BtnIcon title={"Logout"} onClick={logoutHandler} icon={<LogoutIcon/>} />
                            <BtnIcon title={"Notifications"} onClick={openNotification} icon={<NotificationIcon/>} />

                        </Box>

                    </Toolbar>
                </AppBar>

            </Box>

{ isSearch && (
    <Suspense fallback={<div>Loading...</div>}>
        <Search/>
    </Suspense>
) }

{ isNotification && (
    <Suspense fallback={<div>Loading...</div>}>
        <Notification/>
    </Suspense>
) }

{ isNewGroup && (
    <Suspense fallback={<div>Loading...</div>}>
        <NewGroup/>
    </Suspense>
) }

        </>
    )
}

const BtnIcon =({title,icon,onClick})=>{
    return(
        <Tooltip title={title}>
        <IconButton color='inherit' size='large' onClick={onClick}>
              {icon}
          </IconButton>
        </Tooltip>
    )
}

export default Header;