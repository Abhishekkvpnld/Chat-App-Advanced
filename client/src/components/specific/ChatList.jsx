import ChatItem from "../shared/ChatItem";
import { MessageCircle, Sparkles } from "lucide-react";

const ChatList = ({
  w = "100%",
  chats = [],
  chatId,
  onlineUsers = [],
  newMessagesAlert = [{ chatId: "1", count: 0 }],
  handleDeleteChat,
}) => {
  return (
    <div
      style={{ width: w }}
      className="
        relative
        flex
        h-full
        min-h-0
        flex-col
        overflow-hidden
        bg-white
      "
    >
      {/* Top subtle fade */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-3 bg-gradient-to-b from-white to-transparent" />

      {/* Chat list */}
      <div
        className="
          flex-1
          min-h-0
          overflow-y-auto
          overscroll-contain
          px-2
          py-2
          scroll-smooth

          [scrollbar-width:thin]
          [scrollbar-color:#cbd5e1_transparent]

          [&::-webkit-scrollbar]:w-1.5
          [&::-webkit-scrollbar-track]:bg-transparent
          [&::-webkit-scrollbar-thumb]:rounded-full
          [&::-webkit-scrollbar-thumb]:bg-slate-300
          [&::-webkit-scrollbar-thumb:hover]:bg-slate-400
        "
      >
        {chats?.length > 0 ? (
          <div className="space-y-1">
            {chats.map((chat, index) => {
              const {
                avatar,
                name,
                _id,
                groupChat,
                members,
              } = chat;

              const newMessageAlert = newMessagesAlert.find(
                ({ chatId }) => chatId === _id
              );

              const isOnline = members?.some((member) =>
                onlineUsers.includes(member)
              );

              return (
                <div
                  key={_id}
                  className="
                    animate-in
                    fade-in
                    slide-in-from-left-1
                    duration-300
                  "
                  style={{
                    animationDelay: `${Math.min(index * 25, 200)}ms`,
                  }}
                >
                  <ChatItem
                    index={index}
                    newMessageAlert={newMessageAlert}
                    isOnline={isOnline}
                    avatar={avatar}
                    name={name}
                    _id={_id}
                    groupChat={groupChat}
                    sameSender={chatId === _id}
                    handleDeleteChat={handleDeleteChat}
                  />
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty state */
          <div className="flex h-full min-h-[320px] items-center justify-center px-6">
            <div className="flex max-w-xs flex-col items-center text-center">
              <div
                className="
                  mb-4
                  flex
                  h-16
                  w-16
                  items-center
                  justify-center
                  rounded-2xl
                  bg-blue-50
                  text-blue-600
                  shadow-sm
                  ring-1
                  ring-blue-100
                "
              >
                <MessageCircle size={28} strokeWidth={1.8} />
              </div>

              <h3 className="text-sm font-semibold text-slate-800">
                No conversations yet
              </h3>

              <p className="mt-1.5 text-xs leading-5 text-slate-500">
                Start a conversation with your friends and your chats will
                appear here.
              </p>

              <div className="mt-4 flex items-center gap-1.5 text-[11px] font-medium text-blue-600">
                <Sparkles size={13} />
                <span>Ready to connect</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom subtle fade */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-4 bg-gradient-to-t from-white to-transparent" />
    </div>
  );
};

export default ChatList;
