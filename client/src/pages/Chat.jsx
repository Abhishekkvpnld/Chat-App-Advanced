import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import AppLayout from '../components/layout/AppLayout';
import { IconButton, Skeleton, Stack } from '@mui/material';
import { greyColor } from '../constants/color';
import { AttachFile as FileIcon, Send as SendIcon } from "@mui/icons-material";
import { InputBox } from '../components/styles/StyledComponents';
import { orange } from '../constants/color';
import FileMenu from '../components/dialogs/FileMenu';
import MessageComponent from '../components/shared/MessageComponent';
import { getSocket } from '../socket';
import { NEW_MESSAGE } from '../../../server/constants/events';
import { useChatDetailsQuery, useGetMessagesQuery } from '../../redux/api/api';
import { useErrors, useSocketEvents } from '../hooks/hook';



const Chat = ({ chatId, user }) => {


  const containerRef = useRef(null);
  const socket = getSocket();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);

  const chatDetails = useChatDetailsQuery({ chatId, skip: !chatId });
  const oldMessages = useGetMessagesQuery({ chatId, page });
  console.log("oldmessages", oldMessages);

  const errors = [
    { isError: chatDetails.isError, error: chatDetails.error },
    { isError: oldMessages.isError, error: oldMessages.error }
  ];

  const members = chatDetails?.data?.chat?.members;

  const submitHandler = (e) => {
    e.preventDefault();

    if (!message.trim()) return;

    //Emitting message to the server
    socket.emit(NEW_MESSAGE, { chatId, members, message });
    setMessage("")
  };

  const newMessageHandler = useCallback((data) => {
    setMessages((prev) => [...prev, data.message])
  });

  const eventHandler = { [NEW_MESSAGE]: newMessageHandler };

  useSocketEvents(socket, eventHandler);

  useErrors(errors);

  // const allMessages = [...oldMessages.data.messages, ...messages];

  return chatDetails.isLoading ? <Skeleton /> : (
    <Fragment>
      <Stack
        ref={containerRef}
        boxSizing={"border-box"}
        padding={"1rem"}
        spacing={"1rem"}
        height={"90%"}
        bgcolor={greyColor}
      >

        {!oldMessages.isLoading &&
          oldMessages.data?.message.map((i) =>
            <MessageComponent user={user} message={i} key={i._id} />
          )
        }

        {
          messages.map((i) =>
            <MessageComponent user={user} message={i} key={i._id} />
          )
        }


      </Stack>

      <form style={{ height: "10%" }} onSubmit={submitHandler}>
        <Stack
          direction={"row"}
          height={"100%"}
          padding={"0.5rem"}
          alignItems={"center"}
          position={"relative"}
        >

          <IconButton sx={{
            position: "absolute",
            left: "1.5rem",
            rotate: "30deg"
          }}
          >
            <FileIcon />
          </IconButton>

          <InputBox placeholder='Type Message Here...' value={message} onChange={(e) => setMessage(e.target.value)} />

          <IconButton type='submit' sx={{
            rotate: "-30deg",
            bgcolor: orange,
            color: "white",
            marginLeft: "1rem",
            padding: "0.5rem",
            "$:hover": {
              bgcolor: "green"
            }
          }}>
            <SendIcon />
          </IconButton>

        </Stack>
      </form>
      <FileMenu />
    </Fragment>
  )
}

export default AppLayout(Chat)