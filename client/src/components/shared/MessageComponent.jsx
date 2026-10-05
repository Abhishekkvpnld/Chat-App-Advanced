
import { memo } from "react";
import { motion } from "framer-motion";
import moment from "moment";
import { Download, FileText } from "lucide-react";

import { fileFormat } from "../../lib/Features.js";
import RenderAttachment from "./RenderAttachment.jsx";

const MessageComponent = ({ message, user }) => {
  const { sender, content, attachment = [], createdAt } = message;

  const sameSender = sender?._id === user?._id;
  const timeAgo = moment(createdAt).fromNow();

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 8,
        x: sameSender ? 8 : -8,
      }}
      animate={{
        opacity: 1,
        y: 0,
        x: 0,
      }}
      transition={{
        duration: 0.2,
        ease: "easeOut",
      }}
      className={`group flex w-fit max-w-[90%] flex-col sm:max-w-[78%] lg:max-w-[68%] ${
        sameSender
          ? "self-end items-end"
          : "self-start items-start"
      }`}
    >
      {/* Sender */}
      {!sameSender && (
        <div className="mb-1.5 ml-2 flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-stone-100 text-[10px] font-semibold text-stone-600 ring-1 ring-stone-200">
            {sender?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>

          <span className="text-xs font-medium text-stone-500">
            {sender?.name || "Unknown User"}
          </span>
        </div>
      )}

      {/* Message Bubble */}
      <div
        className={`relative overflow-hidden px-4 py-3 transition-all duration-200 ${
          sameSender
            ? "rounded-2xl rounded-br-md border border-stone-200 bg-stone-100 text-stone-800 shadow-sm hover:bg-stone-150 hover:shadow-md"
            : "rounded-2xl rounded-bl-md border border-stone-200 bg-white text-stone-800 shadow-sm hover:border-stone-300 hover:shadow-md"
        }`}
      >
        {/* Text */}
        {content && (
          <p className="whitespace-pre-wrap break-words text-[14px] leading-6 text-stone-700 sm:text-[15px]">
            {content}
          </p>
        )}

        {/* Attachments */}
        {attachment.length > 0 && (
          <div
            className={`space-y-2 ${
              content
                ? "mt-3 border-t border-stone-200 pt-3"
                : ""
            }`}
          >
            {attachment.map((item, index) => {
              const url = item.url;
              const file = fileFormat(url);

              return (
                <motion.a
                  key={`${url}-${index}`}
                  href={url}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className="group/file flex items-center gap-3 rounded-xl border border-stone-200 bg-white p-2.5 transition-all hover:bg-stone-50 hover:shadow-sm"
                >
                  {/* File Icon */}
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-stone-100 text-stone-500 ring-1 ring-stone-200">
                    <FileText size={17} strokeWidth={1.8} />
                  </div>

                  {/* File Details */}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium text-stone-700">
                      Attachment {index + 1}
                    </p>

                    <p className="mt-0.5 text-[10px] text-stone-400">
                      {file}
                    </p>
                  </div>

                  {/* Download */}
                  <Download
                    size={15}
                    strokeWidth={1.8}
                    className="shrink-0 text-stone-400 transition-transform duration-200 group-hover/file:translate-y-0.5 group-hover/file:text-stone-600"
                  />
                </motion.a>
              );
            })}

            {/* Attachment Preview */}
            <div className="mt-2 overflow-hidden rounded-xl">
              {attachment.map((item, index) => {
                const url = item.url;
                const file = fileFormat(url);

                return (
                  <div key={`preview-${url}-${index}`}>
                    {RenderAttachment(file, url)}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Timestamp */}
        <div className="mt-1.5 flex justify-end text-[10px] text-stone-400">
          <span>{timeAgo}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default memo(MessageComponent);
