import { Avatar, AvatarGroup, Box, Stack } from '@mui/material';
import React from 'react';
import { transformImage } from '../../lib/Features';

const AvatarCard = ({avatar=[],max=4}) => {
  return (
   <Stack spacing={0.5} direction={"row"}>

<AvatarGroup max={max}>
<Box width={"5rem"} height={"3rem"}>
    {
        avatar.map((src,index)=>(
            <Avatar
            src={transformImage(src)} 
            alt={`Avatar ${index}`}
            key={Math.random()*100}
            sx={{
                width:"3rem",
                height:"3rem",
                border:"2px solid white",
                position:"absolute",
                left:{
                    xs:`${0.5+index}rem`,
                    sm:`${index}rem`
                }
            }}
            />
        ))
    }
</Box>
</AvatarGroup>

   </Stack>
  )
}

export default AvatarCard;