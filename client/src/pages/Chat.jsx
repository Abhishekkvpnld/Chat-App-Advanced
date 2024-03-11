import React, { Fragment, useRef } from 'react';
import AppLayout from '../components/layout/AppLayout';
import { IconButton, Stack } from '@mui/material';
import { greyColor } from '../constants/color';
import {AttachFile as FileIcon, Send as SendIcon} from "@mui/icons-material";
import { InputBox } from '../components/styles/StyledComponents';
import { orange } from '../constants/color';


const Chat = () => {

  const containerRef = useRef(null)

  return (
    <Fragment>
<Stack
 ref={containerRef}
 boxSizing={"border-box"}
 padding={"1rem"}
 spacing={"1rem"}
 height={"90%"}
 bgcolor={greyColor}
>
{/*Message Render */}


</Stack>

<form style={{height:"10%"}}> 
<Stack
 direction={"row"}
  height={"100%"}
  padding={"0.5rem"}
  alignItems={"center"}
  position={"relative"}
  >

<IconButton sx={{
  position:"absolute",
  left:"1.5rem",
  rotate:"30deg"
}}>
<FileIcon/>
</IconButton>

<InputBox placeholder='Type Message Here...'/>

<IconButton type='submit'sx={{
  rotate:"-30deg",
  bgcolor:orange,
  color:"white",
  marginLeft:"1rem",
  padding:"0.5rem",
  "$:hover":{
    bgcolor:"green"
  }
}}>
<SendIcon/>
</IconButton>

</Stack>
</form>

    </Fragment>
  )
}

export default AppLayout(Chat)