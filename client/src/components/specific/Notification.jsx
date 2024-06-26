import { Avatar, Dialog, DialogTitle, ListItem, Stack, Typography, Button, Skeleton } from '@mui/material';
import React, { memo } from 'react';
import { useAcceptFriendRequestMutation, useGetNotificationsQuery } from '../../../redux/api/api';
import { useAsyncMutation, useErrors } from '../../hooks/hook';
import { useDispatch, useSelector } from 'react-redux';
import { setIsNotification } from '../../../redux/reducers/misc';



const Notification = () => {

  const dispatch = useDispatch();
  const { isNotification } = useSelector((state) => state.misc);

  const { isLoading, data, error, isError } = useGetNotificationsQuery();

  const [acceptRequest] = useAsyncMutation(useAcceptFriendRequestMutation);

  const friendRequestHandler = async ({ _id, accept }) => {

    dispatch(setIsNotification(false));

    await acceptRequest("Accepting Request...", { requestId: _id, accept })

  };

  const closeHandler = () => dispatch(setIsNotification(false));

  useErrors([{ error, isError }]);


  return (
    <Dialog open={isNotification} onClose={closeHandler} >
      <Stack p={{ xs: "1rem", sm: "2rem" }} maxWidth={"25rem"}>
        <DialogTitle>Notifications</DialogTitle>

        {
          isLoading ? <Skeleton /> :
            <>
              {
                data?.allRequests.length > 0 ? (
                  data?.allRequests.map(({ sender, _id }) => <NotificationItems
                    sender={sender}
                    _id={_id}
                    handler={friendRequestHandler}
                    key={_id} />)
                ) : (
                  <Typography textAlign={"center"}>0 Notification</Typography>
                )
              }
            </>
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
        sx={{padding:"1rem",border:"1px solid black",borderRadius:"15px"}}
      >
        <Avatar src={avatar} />
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
          xs: "column",
          sm: "row"
        }}>
          <Button sx={{ border: "1px solid green",borderRadius:"10px" }} onClick={() => handler({ _id, accept: true })} >Accept</Button>
          <Button sx={{ border: "1px solid red",borderRadius:"10px",marginLeft:"5px"}} color="error" onClick={() => handler({ _id, accept: false })} >Reject</Button>
        </Stack>

      </Stack>
    </ListItem>
  )
}
)
export default Notification;