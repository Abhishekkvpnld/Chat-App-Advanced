
import React from "react";
import {
  ArrowRight,
  MessageCircle,
  Search,
  Sparkles,
} from "lucide-react";

import AppLayout from "../components/layout/AppLayout";

const Home = () => {
  return (
    <div className="relative flex h-full min-h-0 w-full items-center justify-center overflow-hidden bg-stone-50 px-5 sm:px-8">

      {/* =====================================================
          Background
      ===================================================== */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        {/* Soft glow */}
        <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white blur-3xl" />

        {/* Decorative circles */}
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full border border-stone-200/60" />

        <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full border border-stone-200/40" />

        <div className="absolute -bottom-32 -left-32 h-72 w-72 rounded-full border border-stone-200/50" />

        {/* Tiny decorative dots */}
        <div className="absolute left-[18%] top-[25%] h-1.5 w-1.5 rounded-full bg-stone-300" />
        <div className="absolute right-[20%] top-[32%] h-1 w-1 rounded-full bg-stone-300" />
        <div className="absolute bottom-[25%] left-[25%] h-1 w-1 rounded-full bg-stone-300" />
      </div>

      {/* =====================================================
          Main Content
      ===================================================== */}
      <div className="relative flex w-full max-w-lg flex-col items-center text-center">

        {/* Status */}
        <div
          className="
            mb-7 flex items-center gap-2
            rounded-full
            border border-stone-200
            bg-white/80
            px-3.5 py-1.5
            shadow-sm
            backdrop-blur-sm
          "
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>

          <span className="text-[11px] font-medium tracking-wide text-stone-500">
            You're ready to connect
          </span>
        </div>

        {/* Main Icon */}
        <div className="relative mb-7">

          {/* Outer ring */}
          <div
            className="
              absolute inset-[-14px]
              rounded-[2rem]
              border border-stone-200/70
            "
          />

          {/* Icon container */}
          <div
            className="
              relative flex h-24 w-24
              items-center justify-center
              rounded-[1.75rem]
              bg-stone-900
              text-white
              shadow-2xl
              shadow-stone-300/40
            "
          >
            <MessageCircle
              size={38}
              strokeWidth={1.6}
            />

            {/* Spark */}
            <div
              className="
                absolute -right-2 -top-2
                flex h-8 w-8
                items-center justify-center
                rounded-xl
                border-4 border-stone-50
                bg-white
                text-stone-700
                shadow-sm
              "
            >
              <Sparkles size={14} strokeWidth={1.8} />
            </div>
          </div>
        </div>

        {/* Heading */}
        <h1
          className="
            text-2xl font-semibold
            tracking-tight text-stone-900
            sm:text-3xl
          "
        >
          Start a conversation
        </h1>

        {/* Description */}
        <p
          className="
            mt-3 max-w-md
            text-sm leading-6
            text-stone-500
            sm:text-[15px]
          "
        >
          Select a conversation from your sidebar and
          start connecting with your friends.
        </p>

        {/* Search hint */}
        <div
          className="
            mt-7 flex items-center gap-3
            rounded-2xl
            border border-stone-200
            bg-white
            px-4 py-3
            shadow-sm
            transition-all duration-200
            hover:border-stone-300
            hover:shadow-md
          "
        >
          <div
            className="
              flex h-8 w-8
              items-center justify-center
              rounded-xl
              bg-stone-100
              text-stone-500
            "
          >
            <Search size={15} strokeWidth={1.8} />
          </div>

          <div className="text-left">
            <p className="text-xs font-medium text-stone-700">
              Looking for someone?
            </p>

            <p className="mt-0.5 text-[10px] text-stone-400">
              Use search to find a conversation
            </p>
          </div>

          <ArrowRight
            size={15}
            className="ml-2 text-stone-300"
          />
        </div>

        {/* Bottom hint */}
        <div className="mt-8 flex items-center gap-2 text-[10px] text-stone-400">
          <span className="h-px w-8 bg-stone-200" />
          <span>Choose a chat to get started</span>
          <span className="h-px w-8 bg-stone-200" />
        </div>
      </div>
    </div>
  );
};

export default AppLayout(Home);

