import { Avatar, Stack, Typography } from '@mui/material';
import React from 'react';
import {
    Face as FaceIcon,
    AlternateEmail as UsernameIcon,
    CalendarMonth as CalendarIcon
} from "@mui/icons-material";
import moment from "moment";
import { transformImage } from '../../lib/Features';

const Profile = ({ user }) => {
    return (
        <Stack spacing={"2rem"} direction={"column"} alignItems={"center"} width={"100%"} >
            <Avatar
                src={transformImage(user?.avatar?.url)}
                sx={{
                    width: 200,
                    height: 200,
                    objectFit: "contain",
                    marginBottom: "1rem",
                    border: "3px solid white"
                }}
            />
            <ProfiileCard heading={"Bio"} text={user?.bio} />
            <ProfiileCard heading={"Username"} text={user?.username} Icon={<UsernameIcon style={{color:"black"}}/>} />
            <ProfiileCard heading={"Name"} text={user?.name} Icon={<FaceIcon style={{color:"green"}}/>} />
            <ProfiileCard heading={"Joined"} text={moment(user?.createdAt).fromNow()} Icon={<CalendarIcon style={{color:"red"}}/>} />
        </Stack>
    )
}

const ProfiileCard = ({ text, Icon, heading }) => (
    <Stack
        direction={"row"}
        alignItems={"center"}
        spacing={"1rem"}
        color={"white"}
        textAlign={"center"}
    >

        {Icon && Icon}

        <Stack>
            <Typography variant='body2'>{text}</Typography>
            <Typography color={"grey"} variant='caption'>{heading}</Typography>
        </Stack>

    </Stack>)

export default Profile;