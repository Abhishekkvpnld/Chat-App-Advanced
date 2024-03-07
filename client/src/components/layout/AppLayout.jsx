import React from 'react';
import Header from './Header';
import Footer from './Footer';
import Title from '../shared/Title';
import { Grid } from '@mui/material';
import ChatList from '../specific/ChatList';
import { SampleChat } from '../../constants/SampleChat';
import { useParams } from 'react-router-dom';
import Profile from '../specific/Profile';

const AppLayout = (WrappedComponent) => {
  return (props) => {

const handleDeleteChat = (e,_id,groupChat)=>{
e.preventDafault();
console.log("deleteChat",_id,groupChat);
}

    const params = useParams();
    const chatId = params.chatId;

    return (
      <div>
        <Title />
        <Header />

        <Grid container height={"calc(100vh - 4rem)"}>

          <Grid item sm={4} md={3}
            sx={{ display: { xs: "none", sm: "block" } }}
            height={"100%"}
          >
           <ChatList 
           chats={SampleChat} 
           chatId={chatId}
           handleDeleteChat={handleDeleteChat}
           />  
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
           <Profile/>
          </Grid>

        </Grid>


        <Footer />
      </div>
    );
  };
};

export default AppLayout;