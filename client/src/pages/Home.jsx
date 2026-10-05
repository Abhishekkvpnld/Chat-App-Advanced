import React from "react";
import { MessageCircle, Search } from "lucide-react";
import AppLayout from "../components/layout/AppLayout";
import robot from "./robot.gif";

const Home = () => {
  return (
    <div className="relative flex h-full min-h-0 w-full items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50/50 px-6">

      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-blue-100/40 blur-3xl" />

        <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-indigo-100/30 blur-3xl" />
      </div>


      <div className="relative flex max-w-md flex-col items-center text-center">

        {/* Robot */}
        <div className="mb-6 rounded-[2rem] bg-white p-5 shadow-xl shadow-slate-200/60 ring-1 ring-slate-100">
          <img
            src={robot}
            alt="Start chatting"
            className="h-44 w-44 object-contain sm:h-52 sm:w-52"
          />
        </div>


        {/* Icon */}
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-200">
          <MessageCircle size={23} strokeWidth={2} />
        </div>


        <h1 className="text-2xl font-bold tracking-tight text-slate-800">
          Welcome to your conversations
        </h1>


        <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
          Select a conversation from the sidebar to start messaging with your
          friends.
        </p>


        <div className="mt-5 flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-xs font-medium text-slate-500 shadow-sm">
          <Search
            size={14}
            className="text-blue-600"
          />

          <span>
            Choose a chat to get started
          </span>
        </div>

      </div>
    </div>
  );
};

export default AppLayout(Home);
