
import React from "react";
import { MessageCircle } from "lucide-react";

/* ---------------------------------------------
   Layout Loader
--------------------------------------------- */

export const LayoutLoader = () => {
  return (
    <div className="flex h-[calc(100vh-4rem)] w-full gap-4 overflow-hidden bg-slate-50 p-4">
      {/* Left sidebar */}
      <div className="hidden h-full w-[25%] max-w-sm sm:block">
        <div className="h-full animate-pulse rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          {/* Sidebar header */}
          <div className="mb-5 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-slate-200" />

            <div className="flex-1 space-y-2">
              <div className="h-3 w-28 rounded-full bg-slate-200" />
              <div className="h-2.5 w-20 rounded-full bg-slate-100" />
            </div>
          </div>

          {/* Search */}
          <div className="mb-5 h-10 rounded-xl bg-slate-100" />

          {/* Chat previews */}
          <div className="space-y-3">
            {Array.from({ length: 7 }).map((_, index) => (
              <div
                key={index}
                className="flex items-center gap-3 rounded-xl p-2"
              >
                <div className="h-11 w-11 shrink-0 rounded-full bg-slate-200" />

                <div className="flex-1 space-y-2">
                  <div
                    className="h-3 rounded-full bg-slate-200"
                    style={{
                      width: `${55 + ((index * 11) % 30)}%`,
                    }}
                  />
                  <div className="h-2.5 w-2/3 rounded-full bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex h-full min-w-0 flex-1 flex-col rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* Chat header */}
        <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-3">
          <div className="h-10 w-10 animate-pulse rounded-full bg-slate-200" />

          <div className="flex-1 space-y-2">
            <div className="h-3.5 w-32 animate-pulse rounded-full bg-slate-200" />
            <div className="h-2.5 w-20 animate-pulse rounded-full bg-slate-100" />
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 space-y-5 overflow-hidden p-5">
          {Array.from({ length: 10 }).map((_, index) => {
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
                    animate-pulse
                    rounded-2xl
                    ${
                      isRight
                        ? "rounded-br-md bg-blue-100"
                        : "rounded-bl-md bg-slate-100"
                    }
                  `}
                  style={{
                    width: `${100 + ((index * 37) % 150)}px`,
                    height: `${38 + ((index * 13) % 25)}px`,
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* Message input */}
        <div className="border-t border-slate-100 p-4">
          <div className="h-11 animate-pulse rounded-xl bg-slate-100" />
        </div>
      </div>

      {/* Right panel */}
      <div className="hidden h-full w-[25%] max-w-sm md:block">
        <div className="h-full animate-pulse rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mx-auto mb-5 h-20 w-20 rounded-full bg-slate-200" />

          <div className="mx-auto mb-2 h-4 w-32 rounded-full bg-slate-200" />

          <div className="mx-auto h-3 w-20 rounded-full bg-slate-100" />

          <div className="mt-8 space-y-3">
            <div className="h-10 rounded-xl bg-slate-100" />
            <div className="h-10 rounded-xl bg-slate-100" />
            <div className="h-10 rounded-xl bg-slate-100" />
          </div>
        </div>
      </div>
    </div>
  );
};


/* ---------------------------------------------
   Typing Loader
--------------------------------------------- */

export const TypingLoader = () => {
  return (
    <div className="flex items-center gap-1.5 px-3 py-2">
      <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md bg-slate-100 px-3 py-2.5 shadow-sm">
        <span className="typing-dot" />
        <span className="typing-dot [animation-delay:150ms]" />
        <span className="typing-dot [animation-delay:300ms]" />
      </div>
    </div>
  );
};
