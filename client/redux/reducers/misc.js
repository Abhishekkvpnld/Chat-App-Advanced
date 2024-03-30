import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isNewGroup: false,
    isAddMember: false,
    isNotification: false,
    isMobile: false,
    isSearch: false,
    isFileMenu: false,
    isDeleteMenu: false,
    isLoadingLoader: false,
    isSelectedDeleteChat: {
        chatId: "",
        groupChat: false
    },
};


const miscSlice = createSlice({
    name: "misc",
    initialState: initialState,
    reducers: {
        setIsNewGroup: (state, action) => {
            state.isNewGroup = action.payload;
        },
        setIsAddMember: (state, action) => {
            state.isAddMember = action.payload;
        },
        setIsNotification: (state, action) => {
            state.isNotification = action.payload;
        },
        setIsMobile: (state, action) => {
            state.isMobile = action.payload;
        },
        setIsSearch: (state, action) => {
            state.isSearch = action.payload;
        },
        setIsFileMenu: (state, action) => {
            state.isFileMenu = action.payload;
        },
        setIsDeleteMenu: (state, action) => {
            state.isDeleteMenu = action.payload;
        },
        setIsLoadingLoader: (state, action) => {
            state.isLoadingLoader = action.payload;
        },
        setIsSelectedDeleteChat: (state, action) => {
            state.isSelectedDeleteChat = action.payload;
        },
    },
});

export default miscSlice;
export const {
    setIsAddMember,
    setIsDeleteMenu,
    setIsFileMenu,
    setIsLoadingLoader,
    setIsMobile,
    setIsNewGroup,
    setIsNotification,
    setIsSearch,
    setIsSelectedDeleteChat,

} = miscSlice.actions;