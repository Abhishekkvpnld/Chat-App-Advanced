import React from 'react';
import { Stack } from "@mui/material";
import ChatItem from '../shared/ChatItem';

const ChatList = ({ w = "100%",
  chats = [],
  chatId,
  onlineUsers = [],
  newMessagesAlert = [{ chatId: '1', count: 0 }],
  handleDeleteChat }) => {
    
  return (

    <Stack width={w} direction={"column"}
      sx={{ overflow: "auto",backgroundColor:"#e3e3e3",
      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)",      }}
      height={"100%"}
    >

      {
        chats?.map((chat, index) => {
          const { avatar, name, _id, groupChat, members } = chat;

          const newMessageAlert = newMessagesAlert.find(({ chatId }) => chatId === _id);

          const isOnline = members?.some((member) =>
            onlineUsers.includes(member));

            
          return (

            <ChatItem
              index={index}
              newMessageAlert={newMessageAlert}
              isOnline={isOnline}
              avatar={avatar}
              name={name}
              _id={_id}
              key={_id}
              groupChat={groupChat}
              sameSender={chatId === _id}
              handleDeleteChat={handleDeleteChat}
            />
          )
        })
      }

    </Stack>
  );
};

export default ChatList;