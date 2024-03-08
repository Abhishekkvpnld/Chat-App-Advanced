import { Avatar, Dialog, DialogTitle, ListItem, Stack, Typography,Button } from '@mui/material';
import React, { memo } from 'react'
import { SampleNotifications } from '../../constants/SampleChat';




const Notification = () => {

  const friendRequestHandler = ({ _id, accept }) => {
    //add friend request handler


  }

  return (
    <Dialog open>
      <Stack p={{ xs: "1rem", sm: "2rem" }} maxWidth={"25rem"}>
        <DialogTitle>Notifications</DialogTitle>

        {
          SampleNotifications.length > 0 ? (
            SampleNotifications.map(({ sender, _id }) => <NotificationItems
              sender={sender}
              _id={_id}
              handler={friendRequestHandler}
              key={_id} />)
          ) : (
            <Typography textAlign={"center"}>0 Notification</Typography>
          )
        }

      </Stack>
    </Dialog>
  )
}

const NotificationItems = memo(({ sender, _id, handler }) => {

  const { name, avatar } = sender;

  return (
    <ListItem>
      <Stack
        direction={"row"}
        alignItems={"center"}
        width={"100%"}
        spacing={"1rem"}
      >
        <Avatar />
        <Typography
          variant='body1'
          sx={{
            flexGlow: 1,
            display: "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            width: "100%"
          }}
        >
          {`${name} send you a friend request.`}
        </Typography>
      
 <Stack direction={{
  xs:"column",
  sm:"row"
}}>
<Button onClick={()=>handler({_id,accept:true})} >Accept</Button>
<Button color="error" onClick={()=>handler({_id,accept:false})} >Reject</Button> 
</Stack> 

      </Stack>
    </ListItem>
  )
}
)
export default Notification;