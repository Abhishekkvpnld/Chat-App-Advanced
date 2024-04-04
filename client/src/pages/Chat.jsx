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
import { useInfiniteScrollTop } from "6pp";
import { useDispatch } from 'react-redux';
import { setIsFileMenu } from '../../redux/reducers/misc';



const Chat = ({ chatId, user }) => {

  const dispatch = useDispatch();
  const containerRef = useRef(null);
  const socket = getSocket();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [fileMenuAnchor,setFileMenuAnchor] = useState(null);

  const chatDetails = useChatDetailsQuery({ chatId, skip: !chatId });
  const oldMessages = useGetMessagesQuery({ chatId, page });

  const errors = [
    { isError: chatDetails.isError, error: chatDetails.error },
    { isError: oldMessages.isError, error: oldMessages.error }
  ];

  const { data: allOldMessages, setData: setAllOldMessages } = useInfiniteScrollTop(
    containerRef,
    oldMessages.data?.totalPages,
    page,
    setPage,
    oldMessages.data?.message
  );

  const members = chatDetails?.data?.chat?.members;

  const handleFileOpen = (e) => {
    dispatch(setIsFileMenu(true));
    setFileMenuAnchor(e.currentTarget);
  };

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

  const allMessages = [...allOldMessages, ...messages];


  return chatDetails.isLoading ? <Skeleton /> : (
    <Fragment>
      <Stack
        ref={containerRef}
        boxSizing={"border-box"}
        padding={"1rem"}
        spacing={"1rem"}
        height={"90%"}
        bgcolor={greyColor}
        sx={{
          overflowX: "hidden",
          overflowY: "auto",
        }}
      >

        {
          allMessages.map((i) =>
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
            onClick={handleFileOpen}
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

      <FileMenu anchorE1={fileMenuAnchor} chatId={chatId}/>

    </Fragment>
  )
}

export default AppLayout(Chat)