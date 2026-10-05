
import React, { memo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MessageCircle, UsersRound } from "lucide-react";
import AvatarCard from "./AvatarCard";

const ChatItem = ({
  avatar = [],
  name,
  _id,
  groupChat = false,
  sameSender,
  isOnline,
  newMessageAlert,
  index = 0,
  handleDeleteChat,
}) => {
  const unreadCount = newMessageAlert?.count || 0;

  return (
    <Link
      to={`/chat/${_id}`}
      onContextMenu={(e) => handleDeleteChat(e, _id, groupChat)}
      className="block w-full select-none"
    >
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{
          duration: 0.25,
          delay: Math.min(index * 0.04, 0.2),
          ease: "easeOut",
        }}
        whileTap={{ scale: 0.985 }}
        className={`
          group
          relative
          mx-1
          flex
          cursor-pointer
          items-center
          gap-3
          overflow-hidden
          rounded-xl
          px-3
          py-3
          transition-all
          duration-200
          ease-out

          ${
            sameSender
              ? "bg-blue-600 text-white shadow-md shadow-blue-100"
              : "text-slate-700 hover:bg-slate-50 hover:shadow-sm"
          }
        `}
      >
        {/* Active chat indicator */}
        {sameSender && (
          <motion.div
            layoutId="active-chat"
            className="
              absolute
              left-0
              top-2
              bottom-2
              w-1
              rounded-r-full
              bg-white
            "
          />
        )}

        {/* Avatar */}
        <div className="relative shrink-0">
          <AvatarCard avatar={avatar} />

          {/* Online indicator */}
          {isOnline && (
            <span
              className={`
                absolute
                bottom-0
                right-0
                h-3
                w-3
                rounded-full
                border-2
                ${
                  sameSender
                    ? "border-blue-600 bg-emerald-400"
                    : "border-white bg-emerald-500"
                }
              `}
            >
              <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400 opacity-50" />
            </span>
          )}
        </div>

        {/* Chat information */}
        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 items-center gap-1.5">
            <h3
              className={`
                min-w-0
                flex-1
                truncate
                text-sm
                font-semibold
                leading-5
                ${
                  sameSender
                    ? "text-white"
                    : "text-slate-800 group-hover:text-slate-900"
                }
              `}
            >
              {name}
            </h3>

            {/* Group indicator */}
            {groupChat && (
              <UsersRound
                size={14}
                strokeWidth={2}
                className={
                  sameSender
                    ? "shrink-0 text-blue-100"
                    : "shrink-0 text-slate-400"
                }
              />
            )}
          </div>

          {/* Chat status / unread message */}
          <div className="mt-0.5 flex items-center gap-1.5">
            {unreadCount > 0 ? (
              <>
                <MessageCircle
                  size={12}
                  strokeWidth={2}
                  className={
                    sameSender ? "text-blue-100" : "text-blue-500"
                  }
                />

                <span
                  className={`
                    truncate
                    text-xs
                    font-medium
                    ${
                      sameSender
                        ? "text-blue-100"
                        : "text-blue-600"
                    }
                  `}
                >
                  {unreadCount}{" "}
                  {unreadCount === 1 ? "new message" : "new messages"}
                </span>
              </>
            ) : (
              <span
                className={`
                  text-xs
                  ${
                    sameSender
                      ? "text-blue-100"
                      : "text-slate-400"
                  }
                `}
              >
                {groupChat ? "Group conversation" : "Conversation"}
              </span>
            )}
          </div>
        </div>

        {/* Unread badge */}
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={`
              flex
              h-6
              min-w-6
              shrink-0
              items-center
              justify-center
              rounded-full
              px-1.5
              text-[10px]
              font-bold
              ${
                sameSender
                  ? "bg-white text-blue-600"
                  : "bg-blue-600 text-white shadow-sm shadow-blue-200"
              }
            `}
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </motion.span>
        )}

        {/* Hover background highlight */}
        {!sameSender && (
          <div
            className="
              pointer-events-none
              absolute
              inset-0
              -z-10
              rounded-xl
              bg-gradient-to-r
              from-blue-50
              to-transparent
              opacity-0
              transition-opacity
              duration-200
              group-hover:opacity-100
            "
          />
        )}
      </motion.div>
    </Link>
  );
};

export default memo(ChatItem);
