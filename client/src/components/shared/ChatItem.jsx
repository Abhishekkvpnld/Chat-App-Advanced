import { Box, Stack, Typography } from '@mui/material';
import React, { memo } from 'react';
import { Link } from "../styles/StyledComponents";
import AvatarCard from './AvatarCard';
import { motion } from "framer-motion";


const ChatItem = (
    {
        avatar = [],
        name,
        _id,
        groupChat = false,
        sameSender,
        isOnline,
        newMessageAlert,
        index = 0,
        handleDeleteChat,
    }
) => {
    return (
        <Link
            to={`/chat/${_id}`}
            onContextMenu={(e) => handleDeleteChat(e, _id, groupChat)}
            sx={{ padding: "0",backgroundColor:"#ffff","&:hover": {color:"white"} }}>

            <motion.div
                initial={{ opacity: 0, y: "-100%" }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                style={{
                    display: "flex",
                    gap: "1rem",
                    alignItems: "center",
                    padding: "1rem",
                    backgroundColor: sameSender ? '#82c182' : "unset",
                    color: sameSender ? 'white' : "unset",
                    position: "relative",
                    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                    transition: "background-color 0.3s, color 0.3s",
                    "&:hover": {
                        backgroundColor: sameSender ? '#6ca66c' : "unset",
                        color: sameSender ? 'white' : "unset", 
                    }
                }}>


                <AvatarCard avatar={avatar} />

                <Stack>

                    <Typography>{name}</Typography>
                    {
                        newMessageAlert && (
                            <Typography>{newMessageAlert?.count} New Message</Typography>
                        )
                    }

                </Stack>

                {
                    isOnline && (
                        <Box
                            sx={{
                                width: "10px",
                                height: "10px",
                                borderRadius: "50%",
                                backgroundColor: "#006622",
                                position: 'absolute',
                                top: "50%",
                                right: "1rem",
                                transform: "translateY(-50%)"
                            }} />
                    )
                }


            </motion.div>

        </Link>
    )
}

export default memo(ChatItem);