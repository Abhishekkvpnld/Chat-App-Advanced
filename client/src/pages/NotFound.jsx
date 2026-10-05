
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Home,
  MessageCircle,
  SearchX,
} from "lucide-react";

const NotFound = () => {
  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-6">

      {/* Background decoration */}
      <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-200/30 blur-3xl" />

      <div className="absolute -bottom-40 -right-32 h-[28rem] w-[28rem] rounded-full bg-indigo-200/30 blur-3xl" />

      {/* Subtle grid */}
      <div className="absolute inset-0 opacity-[0.035]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              "linear-gradient(#2563eb 1px, transparent 1px), linear-gradient(90deg, #2563eb 1px, transparent 1px)",
            backgroundSize: "45px 45px",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-xl text-center">

        {/* Logo */}
        <div className="mb-10 flex items-center justify-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-600/20">
            <MessageCircle className="h-5 w-5 text-white" />
          </div>

          <span className="text-xl font-bold tracking-tight text-slate-900">
            Connect
          </span>
        </div>

        {/* 404 Illustration */}
        <div className="mx-auto mb-8 flex h-28 w-28 items-center justify-center rounded-3xl border border-blue-100 bg-white shadow-xl shadow-blue-100/50">
          <SearchX className="h-14 w-14 text-blue-500" />
        </div>

        {/* 404 */}
        <div className="relative">
          <h1 className="text-[7rem] font-black leading-none tracking-tighter text-blue-600 sm:text-[9rem]">
            404
          </h1>

          <div className="absolute inset-x-0 top-1/2 -z-10 h-20 -translate-y-1/2 bg-blue-100/40 blur-3xl" />
        </div>

        {/* Message */}
        <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Page not found
        </h2>

        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500 sm:text-base">
          Looks like this conversation took a wrong turn. The page
          you're looking for doesn't exist or may have been moved.
        </p>

        {/* Actions */}
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">

          <Link
            to="/"
            className="group inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all duration-200 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/25 active:scale-[0.98]"
          >
            <Home className="h-4 w-4" />
            Go to Home
            <ArrowLeft
              className="h-4 w-4 rotate-180 transition-transform duration-200 group-hover:translate-x-1"
            />
          </Link>

          <button
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-600 transition-all duration-200 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 active:scale-[0.98]"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </button>

        </div>

        {/* Footer */}
        <p className="mt-10 text-xs text-slate-400">
          Secure • Private • Real-time messaging
        </p>

      </div>
    </main>
  );
};

export default NotFound;

