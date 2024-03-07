import { Avatar, Stack, Typography } from '@mui/material';
import React from 'react';
import {Face as FaceIcon,
     AlternateEmail as UsernameIcon,
      CalendarMonth as CalendarIcon} from "@mui/icons-material";
import moment from "moment";

const Profile = () => {
    return (
        <Stack spacing={"2rem"} direction={"column"} alignItems={"center"} >
            <Avatar
                sx={{
                    width: 200,
                    height: 200,
                    objectFit: "contain",
                    marginBottom: "1rem",
                    border: "5px solid white"
                }}
            />
            <ProfiileCard heading={"Bio"} text={"dfjsfkfsfs sfdlslfsf"} />
            <ProfiileCard heading={"Username"} text={"meAbhi"} Icon={<UsernameIcon/>}/>
            <ProfiileCard heading={"Name"} text={"Abhishek"} Icon={<FaceIcon/>} />
            <ProfiileCard heading={"Joined"} text={moment('2024-01-09T18:30:00.000Z').fromNow()} Icon={<CalendarIcon/>}/>
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

        { Icon && Icon }

<Stack>
    <Typography variant='body2'>{text}</Typography>
    <Typography color={"grey"} variant='caption'>{heading}</Typography>
</Stack>

    </Stack>)

export default Profile;