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
      className={`group flex w-fit max-w-[90%] sm:max-w-[78%] lg:max-w-[68%] flex-col ${
        sameSender ? "self-end items-end" : "self-start items-start"
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

      {/* Bubble */}
      <div
        className={`relative overflow-hidden px-4 py-3 transition-all duration-200 ${
          sameSender
            ? "rounded-2xl rounded-br-md bg-stone-800 text-white shadow-sm hover:shadow-md"
            : "rounded-2xl rounded-bl-md border border-stone-200 bg-white text-stone-800 shadow-sm hover:border-stone-300 hover:shadow-md"
        }`}
      >
        {/* Content */}
        {content && (
          <p
            className={`whitespace-pre-wrap break-words text-[14px] leading-6 sm:text-[15px] ${
              sameSender ? "text-stone-50" : "text-stone-700"
            }`}
          >
            {content}
          </p>
        )}

        {/* Attachments */}
        {attachment.length > 0 && (
          <div
            className={`space-y-2 ${
              content
                ? `mt-3 border-t pt-3 ${
                    sameSender
                      ? "border-white/10"
                      : "border-stone-100"
                  }`
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
                  className={`group/file flex items-center gap-3 rounded-xl border p-2.5 transition-all ${
                    sameSender
                      ? "border-white/10 bg-white/10 hover:bg-white/15"
                      : "border-stone-200 bg-stone-50 hover:bg-stone-100"
                  }`}
                >
                  {/* File Icon */}
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                      sameSender
                        ? "bg-white/10 text-stone-200"
                        : "bg-white text-stone-500 shadow-sm ring-1 ring-stone-200"
                    }`}
                  >
                    <FileText size={17} strokeWidth={1.8} />
                  </div>

                  {/* File Details */}
                  <div className="min-w-0 flex-1">
                    <p
                      className={`truncate text-xs font-medium ${
                        sameSender
                          ? "text-stone-100"
                          : "text-stone-700"
                      }`}
                    >
                      Attachment {index + 1}
                    </p>

                    <p
                      className={`mt-0.5 text-[10px] ${
                        sameSender
                          ? "text-stone-400"
                          : "text-stone-400"
                      }`}
                    >
                      {file}
                    </p>
                  </div>

                  {/* Download */}
                  <Download
                    size={15}
                    strokeWidth={1.8}
                    className={`shrink-0 transition-transform duration-200 group-hover/file:translate-y-0.5 ${
                      sameSender
                        ? "text-stone-400"
                        : "text-stone-400"
                    }`}
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
        <div
          className={`mt-1.5 flex justify-end text-[10px] ${
            sameSender ? "text-stone-400" : "text-stone-400"
          }`}
        >
          <span>{timeAgo}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default memo(MessageComponent);

