import React, { useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import Title from '../shared/Title';
import { Drawer, Grid, Skeleton } from '@mui/material';
import ChatList from '../specific/ChatList';
import { useParams } from 'react-router-dom';
import Profile from '../specific/Profile';
import { useMyChatsQuery } from '../../../redux/api/api';
import { useDispatch, useSelector } from 'react-redux';
import { setIsMobile } from '../../../redux/reducers/misc';
import { useErrors } from '../../hooks/hook';

const AppLayout = (WrappedComponent) => {
  return (props) => {

    const dispatch = useDispatch();
    const params = useParams();
    const chatId = params.chatId;

    const { isMobile } = useSelector((state) => state.misc);
    const { user } = useSelector((state) => state.auth);

    const { isLoading, data, isError, error, refetch } = useMyChatsQuery("");


    useErrors([{ isError, error }]);


    const handleDeleteChat = (e, _id, groupChat) => {
      e.preventDafault();
      console.log("deleteChat", _id, groupChat);
    };

    const handleMobileClose = () => dispatch(setIsMobile(false));


    return (
      <div>
        <Title />
        <Header />

        {
          isLoading ? (<Skeleton />) : (
            <Drawer open={isMobile} onClose={handleMobileClose}>
              <ChatList
                w='70vw'
                chats={data?.chats}
                chatId={chatId}
                handleDeleteChat={handleDeleteChat}
              />
            </Drawer>
          )
        }

        <Grid container height={"calc(100vh - 4rem)"}>

          <Grid item sm={4} md={3}
            sx={{ display: { xs: "none", sm: "block" } }}
            height={"100%"}
          >
            {
              isLoading ? (<Skeleton />) : (
                <ChatList
                  chats={data?.chats}
                  chatId={chatId}
                  handleDeleteChat={handleDeleteChat}
                />
              )
            }
          </Grid>

          <Grid
            height={'100%'}
            item
            xs={12} sm={8} md={5} lg={6}
          >
            <WrappedComponent {...props} />
          </Grid >

          <Grid item
            md={4} lg={3}
            height={"100%"}
            sx={{
              display: { xs: "none", md: "block" },
              padding: "2rem", bgcolor: "rgba(0,0,0,0.85)"
            }}
          >
            <Profile user={user}/>
          </Grid>

        </Grid>


        <Footer />
      </div>
    );
  };
};

export default AppLayout;