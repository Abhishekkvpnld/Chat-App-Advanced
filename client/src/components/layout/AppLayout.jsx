import React, { useCallback, useEffect, useRef, useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import Title from '../shared/Title';
import { Drawer, Grid, Skeleton } from '@mui/material';
import ChatList from '../specific/ChatList';
import { useParams } from 'react-router-dom';
import Profile from '../specific/Profile';
import { useMyChatsQuery } from '../../../redux/api/api';
import { useDispatch, useSelector } from 'react-redux';
import { setIsDeleteMenu, setIsMobile, setSelectedDeleteChat } from '../../../redux/reducers/misc';
import { useErrors, useSocketEvents } from '../../hooks/hook';
import { getSocket } from "../../socket"
import { NEW_MESSAGE_ALLERT, NEW_REQUEST, ONLINE_USERS, REFETCH_CHAT } from '../../constants/events';
import { incrementNotification, setNewMessagesAlert } from '../../../redux/reducers/chat';
import { getOrSaveFromStorage } from '../../lib/Features';
import { useNavigate } from "react-router-dom";
import DeleteChatMenu from '../dialogs/DeleteChatMenu';
import profileImg from "../../pages/whatsapp-background-wallpaper-s06.jpg";



const AppLayout = (WrappedComponent) => {
  return (props) => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const params = useParams();

    const chatId = params.chatId;

    const deleteMenuAnchor = useRef(null);

    const socket = getSocket();

    const [onlineUsers, setOnlineUsers] = useState([]);

    const { isMobile } = useSelector((state) => state.misc);
    const { newMessagesAlert } = useSelector((state) => state.chat);

    const { user } = useSelector((state) => state.auth);

    const { isLoading, data, isError, error, refetch } = useMyChatsQuery("");

    useErrors([{ isError, error }]);


    useEffect(() => {
      getOrSaveFromStorage({ key: NEW_MESSAGE_ALLERT, value: newMessagesAlert }); 
    }, [newMessagesAlert]);



    const handleDeleteChat = (e, _id, groupChat) => {
      dispatch(setIsDeleteMenu(true));
      dispatch(setSelectedDeleteChat({ chatId, groupChat }));
      deleteMenuAnchor.current = e.currentTarget;
    };


    const handleMobileClose = () => dispatch(setIsMobile(false));


    const newMessageAlertHandler = useCallback((data) => {
      if (data.chatId === chatId) return;
      dispatch(setNewMessagesAlert(data));

    }, [chatId]);


    const newRequestHandler = useCallback(() => {
      dispatch(incrementNotification());
    }, [dispatch]);


    const refetchListner = useCallback(() => {
      refetch();
      navigate("/");
    }, [refetch, navigate]);


    const onlineUsersListner = useCallback((data) => {
      setOnlineUsers(data)
    }, []);


    const eventHandlers = {
      [NEW_MESSAGE_ALLERT]: newMessageAlertHandler,
      [NEW_REQUEST]: newRequestHandler,
      [REFETCH_CHAT]: refetchListner,
      [ONLINE_USERS]: onlineUsersListner
    };


    useSocketEvents(socket, eventHandlers);


    return (
      <div>
        <Title />
        <Header />

        <DeleteChatMenu dispatch={dispatch} deleteMenuAnchor={deleteMenuAnchor} />

        {
          isLoading ? (<Skeleton />) : (
            <Drawer open={isMobile} onClose={handleMobileClose}>

              <ChatList
                w='70vw'
                chats={data?.chats}
                chatId={chatId}
                handleDeleteChat={handleDeleteChat}
                onlineUsers={onlineUsers}
              />

            </Drawer>
          )
        }

        <Grid container height={"calc(100vh - 4rem)"}>


          <Grid item sm={4} md={3}
            sx={{ display: { xs: "none", sm: "block" },
           }}
            height={"100%"}
          >
            {
              isLoading ? (<Skeleton />) : (
                <ChatList
                  chats={data?.chats}
                  chatId={chatId}
                  handleDeleteChat={handleDeleteChat}
                  newMessagesAlert={newMessagesAlert}
                  onlineUsers={onlineUsers}
                />
              )
            }
          </Grid>


          <Grid
            height={'100%'}
            item
            xs={12} sm={8} md={5} lg={6}
          >
            <WrappedComponent {...props} chatId={chatId} user={user} />
          </Grid >


          <Grid item
            md={4} lg={3}
            height={"100%"}
            sx={{
              display: { xs: "none", md: "block" },
              padding: "2rem", bgcolor: "#2F4F4F",
              backgroundImage: `url(${profileImg})`
            }}
          >
            <Profile user={user} />
          </Grid>


        </Grid>


        {/* <Footer /> */}
      </div>
    );
  };
};

export default AppLayout;