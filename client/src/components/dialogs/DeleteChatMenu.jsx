
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogOut,
  Trash2,
} from "lucide-react";

import { useSelector } from "react-redux";
import { setIsDeleteMenu } from "../../../redux/reducers/misc";

import { useAsyncMutation } from "../../hooks/hook";
import {
  useDeleteChatMutation,
  useLeaveGroupMutation,
} from "../../../redux/api/api";

const DeleteChatMenu = ({ dispatch, deleteMenuAnchor }) => {
  const navigate = useNavigate();

  const { isDeleteMenu, selectedDeleteChat } = useSelector(
    (state) => state.misc
  );

  const [deleteChat, _, deleteChatData] = useAsyncMutation(
    useDeleteChatMutation
  );

  const [leaveGroup, __, leaveGroupData] = useAsyncMutation(
    useLeaveGroupMutation
  );

  const closeHandler = () => {
    dispatch(setIsDeleteMenu(false));
    deleteMenuAnchor.current = null;
  };

  const isGroup = selectedDeleteChat?.groupChat;

  const leaveGroupHandler = () => {
    closeHandler();

    if (selectedDeleteChat?.chatId) {
      leaveGroup(
        "Leaving Group...",
        selectedDeleteChat.chatId
      );
    }
  };

  const deleteChatHandler = () => {
    closeHandler();

    if (selectedDeleteChat?.chatId) {
      deleteChat(
        "Deleting Chat...",
        selectedDeleteChat.chatId
      );
    }
  };

  useEffect(() => {
    if (deleteChatData || leaveGroupData) {
      navigate("/");
    }
  }, [deleteChatData, leaveGroupData, navigate]);

  /*
   * Get the position of the original anchor element.
   * This keeps the menu close to the three-dot/delete trigger.
   */
  const anchor = deleteMenuAnchor?.current;

  let position = {};

  if (anchor) {
    const rect = anchor.getBoundingClientRect();

    position = {
      top: rect.bottom + 8,
      left: Math.max(12, rect.right - 190),
    };
  }

  return (
    <AnimatePresence>
      {isDeleteMenu && (
        <>
          {/* Invisible backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeHandler}
            className="fixed inset-0 z-[90]"
          />

          {/* Floating Menu */}
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.95,
              y: -5,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.95,
              y: -5,
            }}
            transition={{
              duration: 0.15,
              ease: "easeOut",
            }}
            style={position}
            className="fixed z-[100] w-[190px] overflow-hidden rounded-2xl border border-stone-200 bg-white p-1.5 shadow-xl shadow-stone-900/10"
          >
            <button
              type="button"
              onClick={
                isGroup
                  ? leaveGroupHandler
                  : deleteChatHandler
              }
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
                isGroup
                  ? "text-stone-700 hover:bg-stone-100"
                  : "text-red-500 hover:bg-red-50"
              }`}
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                  isGroup
                    ? "bg-stone-100 text-stone-600"
                    : "bg-red-50 text-red-500"
                }`}
              >
                {isGroup ? (
                  <LogOut size={16} strokeWidth={1.9} />
                ) : (
                  <Trash2 size={16} strokeWidth={1.9} />
                )}
              </div>

              <div className="min-w-0">
                <p className="text-sm font-medium">
                  {isGroup
                    ? "Leave Group"
                    : "Delete Chat"}
                </p>

                <p
                  className={`mt-0.5 text-[10px] ${
                    isGroup
                      ? "text-stone-400"
                      : "text-red-400"
                  }`}
                >
                  {isGroup
                    ? "Exit this group"
                    : "Remove this chat"}
                </p>
              </div>
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default DeleteChatMenu;
