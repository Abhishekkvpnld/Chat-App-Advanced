
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import Header from "./Header";
import Title from "../shared/Title";
import ChatList from "../specific/ChatList";
import DeleteChatMenu from "../dialogs/DeleteChatMenu";

import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { useMyChatsQuery } from "../../../redux/api/api";

import {
  setIsDeleteMenu,
  setIsMobile,
  setSelectedDeleteChat,
} from "../../../redux/reducers/misc";

import {
  incrementNotification,
  setNewMessagesAlert,
} from "../../../redux/reducers/chat";

import {
  useErrors,
  useSocketEvents,
} from "../../hooks/hook";

import { getSocket } from "../../socket";

import {
  NEW_MESSAGE_ALLERT,
  NEW_REQUEST,
  ONLINE_USERS,
  REFETCH_CHAT,
} from "../../constants/events";

import { getOrSaveFromStorage } from "../../lib/Features";


const AppLayout = (WrappedComponent) => {
  return function AppLayoutWrapper(props) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const params = useParams();

    const chatId = params.chatId;

    const deleteMenuAnchor = useRef(null);

    const socket = getSocket();

    const [onlineUsers, setOnlineUsers] = useState([]);

    const { isMobile } = useSelector(
      (state) => state.misc
    );

    const { newMessagesAlert } = useSelector(
      (state) => state.chat
    );

    const { user } = useSelector(
      (state) => state.auth
    );

    const {
      isLoading,
      data,
      isError,
      error,
      refetch,
    } = useMyChatsQuery("");

    useErrors([{ isError, error }]);


    /* ==========================================
       Persist unread messages
    ========================================== */

    useEffect(() => {
      getOrSaveFromStorage({
        key: NEW_MESSAGE_ALLERT,
        value: newMessagesAlert,
      });
    }, [newMessagesAlert]);


    /* ==========================================
       Delete chat
    ========================================== */

    const handleDeleteChat = (e, _id, groupChat) => {
      e.preventDefault();

      dispatch(setIsDeleteMenu(true));

      dispatch(
        setSelectedDeleteChat({
          chatId: _id,
          groupChat,
        })
      );

      deleteMenuAnchor.current = e.currentTarget;
    };


    /* ==========================================
       Mobile chat drawer
    ========================================== */

    const handleMobileClose = () => {
      dispatch(setIsMobile(false));
    };


    /* ==========================================
       Socket events
    ========================================== */

    const newMessageAlertHandler = useCallback(
      (data) => {
        if (data.chatId === chatId) return;

        dispatch(setNewMessagesAlert(data));
      },
      [chatId, dispatch]
    );


    const newRequestHandler = useCallback(() => {
      dispatch(incrementNotification());
    }, [dispatch]);


    const refetchListener = useCallback(() => {
      refetch();
      navigate("/");
    }, [refetch, navigate]);


    const onlineUsersListener = useCallback((data) => {
      setOnlineUsers(data);
    }, []);


    const eventHandlers = {
      [NEW_MESSAGE_ALLERT]: newMessageAlertHandler,
      [NEW_REQUEST]: newRequestHandler,
      [REFETCH_CHAT]: refetchListener,
      [ONLINE_USERS]: onlineUsersListener,
    };


    useSocketEvents(socket, eventHandlers);


    /* ==========================================
       Loading
    ========================================== */

    if (isLoading) {
      return (
        <div className="flex h-screen w-full flex-col overflow-hidden bg-slate-50">
          <Title />
          <Header />

          <LayoutSkeleton />
        </div>
      );
    }


    /* ==========================================
       Application
    ========================================== */

    return (
      <div className="flex h-screen w-full flex-col overflow-hidden bg-slate-50">
        <Title />

        <Header />

        <DeleteChatMenu
          dispatch={dispatch}
          deleteMenuAnchor={deleteMenuAnchor}
        />


        {/* ======================================
            Mobile Drawer
        ====================================== */}

        {isMobile && (
          <div className="fixed inset-0 z-[80] sm:hidden">

            {/* Backdrop */}
            <button
              type="button"
              aria-label="Close conversations"
              onClick={handleMobileClose}
              className="
                absolute
                inset-0
                bg-slate-950/30
                backdrop-blur-sm
              "
            />

            {/* Drawer */}
            <aside
              className="
                absolute
                left-0
                top-0
                flex
                h-full
                w-[85vw]
                max-w-[360px]
                flex-col
                overflow-hidden
                bg-white
                shadow-2xl
                animate-in
                slide-in-from-left
                duration-300
              "
            >
              <ChatList
                w="100%"
                chats={data?.chats || []}
                chatId={chatId}
                handleDeleteChat={handleDeleteChat}
                newMessagesAlert={newMessagesAlert}
                onlineUsers={onlineUsers}
              />
            </aside>
          </div>
        )}


        {/* ======================================
            Main Layout
        ====================================== */}

        <main className="flex min-h-0 flex-1 overflow-hidden">

          {/* ====================================
              Conversations Sidebar
          ==================================== */}

          <aside
            className="
              hidden
              h-full
              w-[300px]
              shrink-0
              border-r
              border-slate-200
              bg-white
              sm:block
              md:w-[320px]
              lg:w-[340px]
              xl:w-[360px]
            "
          >
            <ChatList
              chats={data?.chats || []}
              chatId={chatId}
              handleDeleteChat={handleDeleteChat}
              newMessagesAlert={newMessagesAlert}
              onlineUsers={onlineUsers}
            />
          </aside>


          {/* ====================================
              Chat Area
          ==================================== */}

          <section
            className="
              min-w-0
              flex-1
              overflow-hidden
              bg-white
            "
          >
            <WrappedComponent
              {...props}
              chatId={chatId}
              user={user}
            />
          </section>

        </main>
      </div>
    );
  };
};


/* ==============================================
   Loading Skeleton
============================================== */

const LayoutSkeleton = () => {
  return (
    <div className="flex min-h-0 flex-1 overflow-hidden bg-white">
      {/* ================= SIDEBAR ================= */}
      <aside
        className="
          hidden
          w-[300px]
          shrink-0
          border-r
          border-slate-200
          bg-white
          px-4
          py-5
          sm:block
          md:w-[320px]
          lg:w-[340px]
        "
      >
        {/* Sidebar Header */}
        <div className="mb-6 flex items-center gap-3">
          <div className="h-11 w-11 shrink-0 animate-pulse rounded-full bg-slate-200" />

          <div className="min-w-0 flex-1 space-y-2">
            <div className="h-3.5 w-28 animate-pulse rounded-full bg-slate-200" />
            <div className="h-2.5 w-20 animate-pulse rounded-full bg-slate-100" />
          </div>
        </div>

        {/* Search Skeleton */}
        <div className="mb-6 h-10 animate-pulse rounded-xl bg-slate-100" />

        {/* Chat List Skeleton */}
        <div className="space-y-5">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="flex items-center gap-3"
            >
              {/* Avatar */}
              <div className="h-11 w-11 shrink-0 animate-pulse rounded-full bg-slate-200" />

              {/* Content */}
              <div className="min-w-0 flex-1 space-y-2">
                <div
                  className="h-3 animate-pulse rounded-full bg-slate-200"
                  style={{
                    width: `${55 + ((index * 13) % 30)}%`,
                  }}
                />

                <div
                  className="h-2.5 animate-pulse rounded-full bg-slate-100"
                  style={{
                    width: `${45 + ((index * 9) % 25)}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* ================= CHAT AREA ================= */}
      <section className="flex min-w-0 flex-1 flex-col bg-white">
        {/* Chat Header */}
        <header className="flex shrink-0 items-center gap-3 border-b border-slate-100 px-4 py-3.5 sm:px-5">
          {/* Avatar */}
          <div className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-slate-200" />

          {/* User Info */}
          <div className="min-w-0 space-y-2">
            <div className="h-3.5 w-32 animate-pulse rounded-full bg-slate-200" />
            <div className="h-2.5 w-20 animate-pulse rounded-full bg-slate-100" />
          </div>
        </header>

        {/* Messages */}
        <div className="flex flex-1 flex-col justify-end gap-4 overflow-hidden px-4 py-5 sm:px-6 sm:py-6">
          {Array.from({ length: 9 }).map((_, index) => {
            const isRight = index % 3 === 0;

            return (
              <div
                key={index}
                className={`flex ${
                  isRight ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`
                    h-10
                    max-w-[75%]
                    animate-pulse
                    rounded-2xl
                    ${
                      isRight
                        ? "rounded-br-md bg-blue-100"
                        : "rounded-bl-md bg-slate-100"
                    }
                  `}
                  style={{
                    width: `${110 + ((index * 43) % 180)}px`,
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* Message Input */}
        <footer className="shrink-0 border-t border-slate-100 p-3 sm:p-4">
          <div className="h-12 animate-pulse rounded-2xl bg-slate-100" />
        </footer>
      </section>
    </div>
  );
};

export default AppLayout;
