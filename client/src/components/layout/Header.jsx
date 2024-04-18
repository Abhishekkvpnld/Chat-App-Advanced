import { AppBar, Backdrop, Badge, Box, IconButton, Toolbar, Tooltip, Typography } from '@mui/material';
import { orange } from "../../constants/color";
import React, { Suspense, lazy} from 'react';
import { Menu as MenuIcon, Search as SearchIcon, Add as AddIcon, Group as GroupIcon, Logout as LogoutIcon, Notifications as NotificationIcon } from "@mui/icons-material";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import toast from 'react-hot-toast';
import axios from 'axios';
import { server } from '../../constants/config';
import { userNotExists } from '../../../redux/reducers/auth';
import { setIsMobile, setIsNewGroup, setIsNotification, setIsSearch } from '../../../redux/reducers/misc';
import { resetNotificationCount } from '../../../redux/reducers/chat';

const Search = lazy(() => import('../specific/Search'));
const Notification = lazy(() => import('../specific/Notification'));
const NewGroup = lazy(() => import('../specific/NewGroup'));



const Header = () => {


    const { isSearch, isNotification,isNewGroup } = useSelector((state) => state.misc);
    const { notificationCount } = useSelector((state) => state.chat);

    const Navigate = useNavigate();
    const dispatch = useDispatch();

    const handleMobile = () => dispatch(setIsMobile(true));
    const openSearch = () => dispatch(setIsSearch(true));

    const openNewGroup = () => {
        dispatch(setIsNewGroup(true))
    };

    const logoutHandler = async () => {
        try {

            const { data } = await axios.get(`${server}/api/v1/user/logout`, { withCredentials: true });
            dispatch(userNotExists());
            toast.success(data.message);

        } catch (error) {
            toast.error(error?.response?.data?.message || "Something Went Wrong...");
        };
    };

    const openNotification = () =>{ 
        dispatch(setIsNotification(true));
        dispatch(resetNotificationCount())
    };

    const navigateToGroup = () => Navigate("/groups");


    return (
        <>
            <Box sx={{ flexGrow: 1 }} height={"4rem"} >

                <AppBar position='static' sx={{ bgcolor: orange }}>
                    <Toolbar>

                        <Typography
                            variant='h6'
                            sx={{ display: { xs: "none", sm: 'block' } }}
                        >
                            chat app
                        </Typography>


                        <Box sx={{ display: { xs: "block", sm: 'none' } }}>
                            <IconButton color='inherit' onClick={handleMobile}>
                                <MenuIcon />
                            </IconButton>
                        </Box>


                        <Box sx={{ flexGrow: 1 }} />


                        <Box>

                            <BtnIcon title={"Search"} onClick={openSearch} icon={<SearchIcon sx={{"&:hover":{transform: "scale(1.2)"}}} />} />
                            <BtnIcon title={"New Group"} onClick={openNewGroup} icon={<AddIcon sx={{"&:hover":{transform: "scale(1.2)"}}}/>} />
                            <BtnIcon title={"Manage Group"} onClick={navigateToGroup} icon={<GroupIcon  sx={{"&:hover":{transform: "scale(1.2)"}}} />} />
                            <BtnIcon title={"Notifications"} onClick={openNotification} icon={<NotificationIcon  sx={{"&:hover":{transform: "scale(1.2)"}}} />} value={notificationCount}/>
                            <BtnIcon title={"Logout"} onClick={logoutHandler} icon={<LogoutIcon  sx={{"&:hover":{transform: "scale(1.2)"}}} />} />

                        </Box>

                    </Toolbar>
                </AppBar>

            </Box>

            {isSearch && (
                <Suspense fallback={<Backdrop open />}>
                    <Search />
                </Suspense>
            )}

            {isNotification && (
                <Suspense fallback={<Backdrop open />}>
                    <Notification />
                </Suspense>
            )}

            {isNewGroup && (
                <Suspense fallback={<Backdrop open />}>
                    <NewGroup />
                </Suspense>
            )}

        </>
    )
}

const BtnIcon = ({ title, icon, onClick, value }) => {
    return (
        <Tooltip title={title}>
            <IconButton color='inherit' size='large' onClick={onClick}>
                {
                    value ? <Badge badgeContent={value} color='error'>{icon}</Badge> : icon
                }
            </IconButton>
        </Tooltip>
    )
}

export default Header;