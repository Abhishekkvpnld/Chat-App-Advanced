
import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import toast from "react-hot-toast";

import AppLayout from "../components/layout/AppLayout";

import { FileText, Phone, Send, Smile, UserRound, Video } from "lucide-react";
import { motion } from "framer-motion";

import FileMenu from "../components/dialogs/FileMenu";
import MessageComponent from "../components/shared/MessageComponent";

import { getSocket } from "../socket";
import { NEW_MESSAGE } from "../../../server/constants/events";

import {
  useChatDetailsQuery,
  useGetMessagesQuery,
} from "../../redux/api/api";

import {
  useErrors,
  useSocketEvents,
} from "../hooks/hook";

import { useInfiniteScrollTop } from "6pp";

import { useDispatch } from "react-redux";

import {
  setIsFileMenu,
} from "../../redux/reducers/misc";

import {
  removeNewMessageAlert,
} from "../../redux/reducers/chat";

import {
  ALERT,
  CHAT_JOINED,
  CHAT_LEFT,
  START_TYPING,
  STOP_TYPING,
} from "../constants/events";

import { TypingLoader } from "../components/layout/LayoutLoader";

import { useNavigate } from "react-router-dom";

import { useCall } from "../hooks/useCall";
import IncomingCallDialog from "../components/call/IncomingCallDialog";
import CallScreen from "../components/call/CallScreen";
import CallButtons from "../components/call/CallButtons";

const Chat = ({ chatId, user }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const containerRef = useRef(null);
  const bottomRef = useRef(null);
  const typingTimeout = useRef(null);

  const socket = getSocket();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);

  const [fileMenuAnchor, setFileMenuAnchor] = useState(null);

  const [IamTyping, setIamTyping] = useState(false);
  const [userTyping, setUserTyping] = useState(false);

  // =========================
  // CALL SETUP
  // =========================

  const {
    callState,
    callUser,
    answerCall,
    endCall,
    myVideoRef,
    remoteVideoRef,
  } = useCall(socket);

  // =========================
  // API
  // =========================

  const chatDetails = useChatDetailsQuery({
    chatId,
    skip: !chatId,
  });

  const oldMessages = useGetMessagesQuery({
    chatId,
    page,
  });

  const errors = [
    {
      isError: chatDetails.isError,
      error: chatDetails.error,
    },
    {
      isError: oldMessages.isError,
      error: oldMessages.error,
    },
  ];

  const {
    data: allOldMessages,
    setData: setAllOldMessages,
  } = useInfiniteScrollTop(
    containerRef,
    oldMessages.data?.totalPages,
    page,
    setPage,
    oldMessages.data?.message
  );

  const members = chatDetails?.data?.chat?.members;

  // Safely derive the other member (handles array of ID strings, ObjectIds, or populated member objects)
  const otherMember = useMemo(() => {
    if (!members || !user?._id) return null;
    return members.find((m) => {
      const memberId = typeof m === "object" && m !== null ? (m._id || m) : m;
      return memberId?.toString() !== user._id.toString();
    });
  }, [members, user?._id]);

  const otherMemberId = useMemo(() => {
    if (!otherMember) return null;
    return typeof otherMember === "object" && otherMember !== null && otherMember._id
      ? otherMember._id.toString()
      : otherMember.toString();
  }, [otherMember]);

  const handleVoiceCall = () => {
    if (chatDetails?.data?.chat?.groupChat) {
      toast.error("Voice calls are only supported in 1-on-1 chats");
      return;
    }
    if (!otherMemberId) {
      toast.error("Contact details not ready yet");
      return;
    }
    callUser(otherMemberId, "audio", {
      name: user?.name,
      avatar: user?.avatar?.url || "",
    });
  };

  const handleVideoCall = () => {
    if (chatDetails?.data?.chat?.groupChat) {
      toast.error("Video calls are only supported in 1-on-1 chats");
      return;
    }
    if (!otherMemberId) {
      toast.error("Contact details not ready yet");
      return;
    }
    callUser(otherMemberId, "video", {
      name: user?.name,
      avatar: user?.avatar?.url || "",
    });
  };

  // =========================
  // TYPING
  // =========================

  const messageOnChange = (e) => {
    const value = e.target.value;

    setMessage(value);

    if (!IamTyping) {
      socket.emit(START_TYPING, {
        members,
        chatId,
      });

      setIamTyping(true);
    }

    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current);
    }

    typingTimeout.current = setTimeout(() => {
      socket.emit(STOP_TYPING, {
        members,
        chatId,
      });

      setIamTyping(false);
    }, 2000);
  };

  // =========================
  // FILE MENU
  // =========================

  const handleFileOpen = (e) => {
    dispatch(setIsFileMenu(true));
    setFileMenuAnchor(e.currentTarget);
  };

  // =========================
  // SEND MESSAGE
  // =========================

  const submitHandler = (e) => {
    e.preventDefault();

    const trimmedMessage = message.trim();

    if (!trimmedMessage) return;

    socket.emit(NEW_MESSAGE, {
      chatId,
      members,
      message: trimmedMessage,
    });

    setMessage("");

    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current);
    }

    socket.emit(STOP_TYPING, {
      members,
      chatId,
    });

    setIamTyping(false);
  };

  // =========================
  // JOIN / LEAVE CHAT
  // =========================

  useEffect(() => {
    if (!chatId || !members) return;

    socket.emit(CHAT_JOINED, {
      userId: user._id,
      members,
    });

    dispatch(removeNewMessageAlert(chatId));

    return () => {
      setMessages([]);
      setMessage("");
      setAllOldMessages([]);
      setPage(1);

      if (typingTimeout.current) {
        clearTimeout(typingTimeout.current);
      }

      socket.emit(CHAT_LEFT, {
        userId: user._id,
        members,
      });
    };
  }, [chatId, members]);

  // =========================
  // AUTO SCROLL
  // =========================

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [messages, userTyping]);

  // =========================
  // ERROR REDIRECT
  // =========================

  useEffect(() => {
    if (chatDetails.isError) {
      navigate("/");
    }
  }, [chatDetails.isError, navigate]);

  // =========================
  // SOCKET EVENTS
  // =========================

  const newMessageHandler = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;

      setMessages((prev) => [
        ...prev,
        data.message,
      ]);
    },
    [chatId]
  );

  const startTypingListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;

      setUserTyping(true);
    },
    [chatId]
  );

  const stopTypingListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;

      setUserTyping(false);
    },
    [chatId]
  );

  const alertListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;

      const messageForAlert = {
        content: data.message,
        sender: {
          _id: "admin",
          name: "admin",
        },
        chat: chatId,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [
        ...prev,
        messageForAlert,
      ]);
    },
    [chatId]
  );

  const eventHandler = {
    [ALERT]: alertListener,
    [NEW_MESSAGE]: newMessageHandler,
    [START_TYPING]: startTypingListener,
    [STOP_TYPING]: stopTypingListener,
  };

  useSocketEvents(socket, eventHandler);

  useErrors(errors);

  // =========================
  // MESSAGES
  // =========================

  const allMessages = [
    ...allOldMessages,
    ...messages,
  ];

  // =========================
  // LOADING
  // =========================

  if (chatDetails?.isLoading) {
    return (
      <div className="flex h-full flex-col bg-white">
        {/* Header Skeleton */}
        <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-3.5">
          <div className="h-10 w-10 animate-pulse rounded-full bg-slate-200" />

          <div className="space-y-2">
            <div className="h-3.5 w-32 animate-pulse rounded-full bg-slate-200" />
            <div className="h-2.5 w-20 animate-pulse rounded-full bg-slate-100" />
          </div>
        </div>

        {/* Message Skeleton */}
        <div className="flex flex-1 flex-col justify-end gap-4 overflow-hidden px-4 py-6 sm:px-6">
          {Array.from({ length: 8 }).map((_, index) => {
            const isRight = index % 3 === 0;

            return (
              <div
                key={index}
                className={`flex ${isRight
                    ? "justify-end"
                    : "justify-start"
                  }`}
              >
                <div
                  className={`h-10 animate-pulse rounded-2xl ${isRight
                      ? "rounded-br-md bg-blue-100"
                      : "rounded-bl-md bg-slate-100"
                    }`}
                  style={{
                    width: `${120 + ((index * 37) % 160)}px`,
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* Composer Skeleton */}
        <div className="border-t border-slate-100 p-3">
          <div className="h-12 animate-pulse rounded-2xl bg-slate-100" />
        </div>
      </div>
    );
  }

  // =========================
  // UI
  // =========================

  return (
    <Fragment>
      <div className="flex h-full min-h-0 flex-col bg-white">


        {/* =================================
    CHAT HEADER
================================= */}
        <header
          className="
    flex
    h-[68px]
    shrink-0
    items-center
    gap-3
    border-b
    border-stone-100
    bg-white/95
    px-4
    backdrop-blur
    sm:px-5
  "
        >
          {/* Avatar */}
          <div className="relative shrink-0">
            <div
              className="
        flex
        h-10
        w-10
        items-center
        justify-center
        overflow-hidden
        rounded-full
        bg-stone-100
        text-stone-600
        ring-1
        ring-stone-200
      "
            >
              {chatDetails?.data?.chat?.avatar ? (
                <img
                  src={chatDetails.data.chat.avatar}
                  alt={
                    chatDetails?.data?.chat?.name || "Chat"
                  }
                  className="h-full w-full object-cover"
                />
              ) : (
                <UserRound size={20} strokeWidth={1.8} />
              )}
            </div>

            {/* Online Indicator */}
            <span
              className="
        absolute
        bottom-0
        right-0
        h-2.5
        w-2.5
        rounded-full
        border-2
        border-white
        bg-emerald-500
      "
            />
          </div>

          {/* Chat Information */}
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-sm font-semibold text-stone-800">
              {chatDetails?.data?.chat?.name?.split("-")[0] ||
                "Conversation"}
            </h2>

            <p className="truncate text-xs text-stone-400">
              {userTyping ? "Typing..." : "Active conversation"}
            </p>
          </div>

          {/* Call Actions (1-on-1 chats) */}
          {!chatDetails?.data?.chat?.groupChat && (
            <CallButtons
              onVoiceCall={handleVoiceCall}
              onVideoCall={handleVideoCall}
              disabled={
                !otherMemberId ||
                callState?.isCalling ||
                callState?.callActive
              }
            />
          )}
        </header>

        {/* =================================
            MESSAGE AREA
        ================================= */}
        <div
          ref={containerRef}
          className="
            relative
            flex
            min-h-0
            flex-1
            flex-col
            gap-3
            overflow-x-hidden
            overflow-y-auto
            
            px-3
            py-4
            sm:px-5
            sm:py-5
          "
        >
          {/* Top subtle fade */}
          <div
            className="
              pointer-events-none
              absolute
              left-0
              right-0
              top-0
              z-10
              h-6
              bg-gradient-to-b
              from-slate-50
              to-transparent
            "
          />

          {allMessages.map((messageItem) => (
            <MessageComponent
              user={user}
              message={messageItem}
              key={messageItem._id}
            />
          ))}

          {/* Typing indicator */}
          {userTyping && (
            <motion.div
              initial={{
                opacity: 0,
                y: 5,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
            >
              <TypingLoader />
            </motion.div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* =================================
            MESSAGE COMPOSER
        ================================= */}
        <form
          onSubmit={submitHandler}
          className="
            shrink-0
            border-t
            border-slate-100
            bg-white
            px-3
            py-3
            sm:px-4
          "
        >
          <div
            className="
              flex
              items-end
              gap-2
              rounded-2xl
              border
              border-slate-200
              bg-slate-50
              p-1.5
              transition-all
              duration-200
              focus-within:border-blue-300
              focus-within:bg-white
              focus-within:shadow-[0_4px_20px_rgba(37,99,235,0.08)]
            "
          >
            {/* Attachment */}
            <motion.button
              type="button"
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
              onClick={handleFileOpen}
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-xl
                text-slate-500
                transition
                hover:bg-blue-50
                hover:text-blue-600
              "
              aria-label="Attach file"
            >
              <FileText size={19} />
            </motion.button>

            {/* Message Input */}
            <textarea
              value={message}
              onChange={messageOnChange}
              placeholder="Type a message..."
              rows={1}
              className="
                max-h-32
                min-h-10
                flex-1
                resize-none
                bg-transparent
                px-2
                py-2.5
                text-sm
                text-slate-800
                outline-none
                placeholder:text-slate-400
              "
              onKeyDown={(e) => {
                if (
                  e.key === "Enter" &&
                  !e.shiftKey
                ) {
                  e.preventDefault();
                  submitHandler(e);
                }
              }}
            />

            {/* Emoji */}
            <motion.button
              type="button"
              whileTap={{ scale: 0.9 }}
              className="
                hidden
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-xl
                text-slate-400
                transition
                hover:bg-blue-50
                hover:text-blue-600
                sm:flex
              "
              aria-label="Add emoji"
            >
              <Smile size={19} />
            </motion.button>

            {/* Send */}
            <motion.button
              type="submit"
              disabled={!message.trim()}
              whileTap={{ scale: 0.9 }}
              whileHover={{
                scale: message.trim() ? 1.04 : 1,
              }}
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-blue-600
                text-white
                shadow-sm
                transition
                duration-200
                hover:bg-blue-700
                disabled:cursor-not-allowed
                disabled:bg-slate-200
                disabled:text-slate-400
                disabled:shadow-none
              "
              aria-label="Send message"
            >
              <Send
                size={18}
                className="translate-x-[1px]"
              />
            </motion.button>
          </div>

          <p className="mt-1.5 hidden text-center text-[10px] text-slate-400 sm:block">
            Press Enter to send · Shift + Enter for a new line
          </p>
        </form>
      </div>

      {/* File Menu */}
      <FileMenu
        anchorE1={fileMenuAnchor}
        chatId={chatId}
      />

      {/* Incoming call notification */}
      <IncomingCallDialog
        callState={callState}
        onAnswer={answerCall}
        onReject={() => endCall(callState.caller?.id)}
      />

      {/* Call modal dialog */}
      <CallScreen
        callState={callState}
        myVideoRef={myVideoRef}
        remoteVideoRef={remoteVideoRef}
        onEndCall={() => endCall(otherMemberId)}
        contactName={
          callState.caller?.name ||
          chatDetails?.data?.chat?.name?.split("-")[0] ||
          "User"
        }
        contactAvatar={
          callState.caller?.avatar ||
          chatDetails?.data?.chat?.avatar ||
          ""
        }
      />
    </Fragment>
  );
};

export default AppLayout(Chat);
