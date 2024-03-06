import React from 'react';
import Header from './Header';
import Footer from './Footer';
import Title from '../shared/Title';
import { Grid } from '@mui/material';
import ChatList from '../specific/ChatList';
import { SampleChat } from '../../constants/SampleChat';

const AppLayout = (WrappedComponent) => {
  return (props) => {
    return (
      <div>
        <Title />
        <Header />

        <Grid container height={"calc(100vh - 4rem)"}>

          <Grid item sm={4} md={3}
            sx={{ display: { xs: "none", sm: "block" } }}
            height={"100%"}
          >
           <ChatList chats={SampleChat} />  
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
            Third
          </Grid>

        </Grid>


        <Footer />
      </div>
    );
  };
};

export default AppLayout;