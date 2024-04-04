import { Box, Typography } from '@mui/material';
import React, { memo } from 'react';
import { lightBlue } from '../../constants/color';
import moment from 'moment';
import { fileFormat } from "../../lib/Features.js"
import RenderAttachment from './RenderAttachment.jsx';

const MessageComponent = ({ message, user }) => {

    const { sender, content, attachment = [], createdAt } = message;
    const sameSender = sender?._id === user?._id;

    const timeAgo = moment(createdAt).fromNow()

    return (
        <div
            style={{
                alignSelf: sameSender ? "flex-end" : "flex-start",
                backgroundColor: "white",
                color: "black",
                borderRadius: "5px",
                padding: "0.5rem",
                width: "fit-content"

            }}
        >
            {
                !sameSender && (
                    <Typography color={lightBlue} fontWeight={"600"} variant='caption'>
                        {sender.name}
                    </Typography>
                )
            }

            {content && <Typography>{content}</Typography>}


            {
                // attachments > 0 && 
                (
                    attachment.map((attachment, index) => {
                        const url = attachment.url;
                        const file = fileFormat(url);
                        return (<Box key={index}>
                            <a href={url}
                                download
                                target='_blank'
                                style={{ color: "black" }}
                            >
                                {RenderAttachment(file, url)}
                            </a>
                        </Box>)
                    })
                )
            }

            <Typography variant='caption' color={"text.secondary"} >{timeAgo}</Typography>

        </div>
    )
}

export default memo(MessageComponent);