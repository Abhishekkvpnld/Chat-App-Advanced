
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useInputValidation } from "6pp";
import {
  ShieldCheck,
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
} from "lucide-react";

import {
  adminLogin,
  getAdmin,
} from "../../../redux/thunks/admin";

const AdminLogin = () => {
  const dispatch = useDispatch();
  const { isAdmin } = useSelector((state) => state.auth);

  const secretKey = useInputValidation("admin123", (value) => value.trim() !== "");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    dispatch(getAdmin());
  }, [dispatch]);

  const submitHandler = (e) => {
    e.preventDefault();

    if (secretKey.value.trim()) {
      dispatch(adminLogin(secretKey.value));
    }
  };

  if (isAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-4 py-10 sm:px-6">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-blue-200/40 blur-3xl" />
        <div className="absolute -bottom-40 -right-20 h-96 w-96 rounded-full bg-indigo-200/40 blur-3xl" />

        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "radial-gradient(#1e40af 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      <section className="relative z-10 w-full max-w-md">
        {/* Brand */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-xl shadow-blue-600/20">
            <ShieldCheck size={34} strokeWidth={1.8} />
          </div>

          <div className="mb-2 flex items-center justify-center gap-2">
            <Sparkles size={16} className="text-blue-600" />

            <span className="text-xs font-bold uppercase tracking-[0.24em] text-blue-600">
              Administration
            </span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Admin Portal
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            Sign in to manage your platform securely.
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-2xl shadow-slate-900/[0.06] sm:p-9">
          <div className="mb-7">
            <h2 className="text-xl font-bold text-slate-900">
              Welcome back
            </h2>

            <p className="mt-1.5 text-sm text-slate-500">
              Enter your administrator secret key to continue.
            </p>
          </div>

          <form onSubmit={submitHandler} className="space-y-5">
            <div>
              <label
                htmlFor="secretKey"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Secret key
              </label>

              <div className="group flex h-13 items-center rounded-xl border border-slate-200 bg-slate-50 transition-all focus-within:border-blue-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-500/10">
                <LockKeyhole
                  size={19}
                  className="ml-4 shrink-0 text-slate-400 transition-colors group-focus-within:text-blue-600"
                />

                <input
                  id="secretKey"
                  name="secretKey"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your secret key"
                  value={secretKey.value}
                  onChange={secretKey.changeHandler}
                  autoComplete="current-password"
                  required
                  className="h-full min-w-0 flex-1 bg-transparent px-3 py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={
                    showPassword ? "Hide secret key" : "Show secret key"
                  }
                  className="mr-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-200/70 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {showPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition duration-200 hover:-translate-y-0.5 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl hover:shadow-blue-600/25 focus:outline-none focus:ring-4 focus:ring-blue-500/25 active:translate-y-0"
            >
              Access Dashboard

              <ArrowRight
                size={18}
                className="transition-transform group-hover:translate-x-1"
              />
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-100" />

            <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
              Secure access
            </span>

            <div className="h-px flex-1 bg-slate-100" />
          </div>

          <div className="flex items-start gap-3 rounded-xl bg-emerald-50/80 p-3.5">
            <ShieldCheck
              size={19}
              className="mt-0.5 shrink-0 text-emerald-600"
            />

            <div>
              <p className="text-xs font-bold text-emerald-800">
                Protected administrator login
              </p>

              <p className="mt-1 text-xs leading-5 text-emerald-700/80">
                Authorized administrators only. Keep your secret key private.
              </p>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} Admin Portal. All rights reserved.
        </p>
      </section>
    </main>
  );
};

export default AdminLogin;

