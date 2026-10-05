
import React from "react";
import { MessageCircle } from "lucide-react";

const Footer = () => {
  return (
    <footer className="flex w-full items-center justify-center border-t border-slate-100 bg-white px-4 py-3">
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <MessageCircle size={13} strokeWidth={1.8} />

        <span>
          © {new Date().getFullYear()} Chat App
        </span>

        <span className="text-slate-300">•</span>

        <span>All rights reserved.</span>
      </div>
    </footer>
  );
};

export default Footer;
