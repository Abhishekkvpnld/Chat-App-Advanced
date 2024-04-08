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
import { removeNewMessageAlert } from '../../redux/reducers/chat';
import { ALERT, START_TYPING, STOP_TYPING } from '../constants/events';
import { TypingLoader } from '../components/layout/LayoutLoader';
import { useNavigate } from "react-router-dom";


const Chat = ({ chatId, user }) => {

  const navigate = useNavigate()
  const dispatch = useDispatch();
  const containerRef = useRef(null);
  const socket = getSocket();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [fileMenuAnchor, setFileMenuAnchor] = useState(null);

  const [IamTyping, setIamTyping] = useState(false);
  const [userTyping, setUserTyping] = useState(false);

  const typingTimeout = useRef(null);
  const bottomRef = useRef(null);

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

  const messageOnChange = (e) => {
    setMessage(e.target.value);

    if (!IamTyping) {
      socket.emit(START_TYPING, { members, chatId });
      setIamTyping(true)
    }

    if (typingTimeout.current) clearTimeout(typingTimeout.current);

    typingTimeout.current = setTimeout(() => {
      socket.emit(STOP_TYPING, { members, chatId });
      setIamTyping(false);
    }, [2000]);

  };

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

  useEffect(() => {

    dispatch(removeNewMessageAlert(chatId));

    return () => {
      setMessages([]);
      setMessage("");
      setAllOldMessages([]);
      setPage(1);
    }

  }, [chatId]);


  useEffect(() => {
    if (bottomRef.current) bottomRef.current.scrollIntoView({
      behavior: "smooth"
    });

  }, [messages]);


  useEffect(() => {
    if (chatDetails.isError) return navigate("/");
  }, [chatDetails.isError]);


  const newMessageHandler = useCallback((data) => {
    if (data.chatId !== chatId) return;
    setMessages((prev) => [...prev, data.message])

  }, [chatId]);


  const startTypingListner = useCallback((data) => {
    if (data.chatId !== chatId) return;
    setUserTyping(true);
  }, [chatId]);


  const stopTypingListner = useCallback((data) => {
    if (data.chatId !== chatId) return;
    setUserTyping(false);
  }, [chatId]);


  const alertListner = useCallback((data) => {

    if(data.chatId !== chatId) return;

    const messageForAlert = {
      content: data.message,
      sender: {
        _id: "dsffsffgfgfdgggfg",
        name: "admin"
      },
      chat: chatId,
      createdAt: new Date().toISOString()
    }

    setMessages((prev) => [...prev, messageForAlert]);

  }, [chatId]);


  const eventHandler = {
    [ALERT]: alertListner,
    [NEW_MESSAGE]: newMessageHandler,
    [START_TYPING]: startTypingListner,
    [STOP_TYPING]: stopTypingListner
  };

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

        {
          userTyping && <TypingLoader />
        }
        <div ref={bottomRef} />

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

          <InputBox placeholder='Type Message Here...' value={message} onChange={messageOnChange} />

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

      <FileMenu anchorE1={fileMenuAnchor} chatId={chatId} />

    </Fragment>
  )
}

export default AppLayout(Chat)