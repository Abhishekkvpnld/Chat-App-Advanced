import { Avatar, IconButton, ListItem, Stack, Typography } from '@mui/material';
import React, { memo } from 'react';
import {Add as AddIcon} from '@mui/icons-material';

const userItem = ({user,handler,handlerIsLoading}) => {

    const {name,_id,avatar} = user;

  return (
   <ListItem>
    <Stack
    direction={"row"}
    alignItems={"center"}
    width={"100%"}
    spacing={"1rem"}
    >
        <Avatar/>
        <Typography
        variant='body1'
        sx={{
            flexGlow:1,
            display:"-webkit-box",
            WebkitLineClamp:1,
            WebkitBoxOrient:"vertical",
            overflow:"hidden",
            textOverflow:"ellipsis",
            width:"100%"
        }}
        >
            {name}
        </Typography>
        <IconButton 
        size='small'
        sx={{
            bgcolor:"primary.main",
            color:"white",
            "&:hover":{
                bgcolor:"primary.dark"
            },
        }}
        onClick={()=>handler(_id)} disabled={handlerIsLoading}>
<AddIcon/>
        </IconButton>
    </Stack>
   </ListItem>
  )
}

export default memo(userItem);