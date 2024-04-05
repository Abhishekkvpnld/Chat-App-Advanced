import { createSlice } from "@reduxjs/toolkit";
import { getOrSaveFromStorage } from "../../src/lib/Features";
import { NEW_MESSAGE_ALLERT } from "../../../server/constants/events";

const initialState = {
    notificationCount: 0,
    newMessagesAlert: getOrSaveFromStorage({key:NEW_MESSAGE_ALLERT,get:true}) ||
     [
        {
            chatId: "",
            count: 0
        }
    ]
};


const chatSlice = createSlice({
    name: "chat",
    initialState: initialState,
    reducers: {
        incrementNotification: (state) => {
            state.notificationCount += 1;
        },
        resetNotificationCount: (state) => {
            state.notificationCount = 0;
        },

        setNewMessagesAlert: (state, action) => {
            const chatId = action.payload.chatId;
            const index = state.newMessagesAlert.findIndex((item) => item.chatId === chatId);

            if (index !== -1) {
                state.newMessagesAlert[index].count += 1;
            } else {
                state.newMessagesAlert.push({
                    chatId,
                    count: 1
                });
            };
        },

        removeNewMessageAlert: (state, action) => {
            state.newMessagesAlert = state.newMessagesAlert.filter(
                (item) => item.chatId !== action.payload);
        }
    },
});

export default chatSlice;
export const {
    incrementNotification,
    resetNotificationCount,
    setNewMessagesAlert,
    removeNewMessageAlert
} = chatSlice.actions;