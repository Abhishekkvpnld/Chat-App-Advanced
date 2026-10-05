
import { useState } from "react";
import {
  Camera,
  Lock,
  MessageCircle,
  User,
  UserPlus,
  Loader2,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Zap,
  Eye,
  EyeOff,
} from "lucide-react";

import {
  useFileHandler,
  useInputValidation,
  useStrongPassword,
} from "6pp";
import { usernameValidators } from "../utils/Validators";
import axios from "axios";
import { server } from "../constants/config";
import { useDispatch } from "react-redux";
import { userExists } from "../../redux/reducers/auth";
import toast from "react-hot-toast";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
const [showPassword, setShowPassword] = useState(false);


  const toggleLogin = () => setIsLogin((prev) => !prev);

  const name = useInputValidation("");
  const username = useInputValidation("user", usernameValidators);
  const bio = useInputValidation("");
  const password = useStrongPassword("");

  const dispatch = useDispatch();
  const avatar = useFileHandler("single");

  const handleSignup = async (e) => {
    e.preventDefault();

    const toastId = toast.loading("Signing Up...");
    setIsLoading(true);

    const formData = new FormData();

    formData.append("avatar", avatar.file);
    formData.append("name", name.value);
    formData.append("bio", bio.value);
    formData.append("username", username.value);
    formData.append("password", password.value);

    try {
      const { data } = await axios.post(
        `${server}/api/v1/user/register`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      dispatch(userExists(data.user));

      toast.success(data.message, {
        id: toastId,
      });
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Something Went Wrong...",
        {
          id: toastId,
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const toastId = toast.loading("Logging In...");
    setIsLoading(true);

    try {
      const { data } = await axios.post(
        `${server}/api/v1/user/login`,
        {
          username: username.value,
          password: password.value,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      dispatch(userExists(data.user));

      toast.success(data.message, {
        id: toastId,
      });
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Something Went Wrong...",
        {
          id: toastId,
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full bg-white">
      <div className="grid min-h-screen w-full lg:grid-cols-2">

        {/* =====================================================
            LEFT SIDE
        ===================================================== */}

        <section className="relative hidden overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-white lg:flex">
          
          {/* Decorative circles */}
          <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-blue-200/40 blur-3xl" />

          <div className="absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-indigo-200/40 blur-3xl" />

          {/* Decorative grid */}
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

          <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-20">

            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-600/20">
                <MessageCircle className="h-5 w-5 text-white" />
              </div>

              <span className="text-xl font-bold tracking-tight text-slate-900">
                Connect
              </span>
            </div>

            {/* Main content */}
            <div className="max-w-xl">

              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/70 px-3 py-1.5 text-xs font-medium text-blue-600 shadow-sm">
                <Sparkles className="h-3.5 w-3.5" />
                Modern real-time messaging
              </div>

              <h1 className="text-5xl font-bold leading-[1.08] tracking-tight text-slate-900 xl:text-6xl">
                Conversations
                <br />
                <span className="text-blue-600">
                  that feel alive.
                </span>
              </h1>

              <p className="mt-6 max-w-lg text-base leading-7 text-slate-500">
                Connect with friends, share moments, and stay close
                wherever you are. Experience simple and seamless
                real-time conversations.
              </p>

              {/* Features */}
              <div className="mt-10 flex flex-wrap gap-3">

                <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 shadow-sm">
                  <Zap className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-slate-600">
                    Real-time
                  </span>
                </div>

                <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 shadow-sm">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  <span className="text-sm font-medium text-slate-600">
                    Secure
                  </span>
                </div>

                <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 shadow-sm">
                  <MessageCircle className="h-4 w-4 text-indigo-500" />
                  <span className="text-sm font-medium text-slate-600">
                    Simple
                  </span>
                </div>

              </div>
            </div>

            {/* Footer */}
            <p className="text-xs text-slate-400">
              © {new Date().getFullYear()} Connect
            </p>

          </div>
        </section>

        {/* =====================================================
            RIGHT SIDE
        ===================================================== */}

        <section className="flex min-h-screen w-full items-center justify-center px-6 py-12 sm:px-10 lg:px-16 xl:px-24">

          <div className="w-full max-w-md">

            {/* Mobile logo */}
            <div className="mb-10 flex items-center justify-center gap-3 lg:hidden">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-600/20">
                <MessageCircle className="h-5 w-5 text-white" />
              </div>

              <span className="text-xl font-bold text-slate-900">
                Connect
              </span>

            </div>

            {/* Heading */}
            <div className="mb-8">

              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">

                {isLogin ? (
                  <User className="h-5 w-5" />
                ) : (
                  <UserPlus className="h-5 w-5" />
                )}

              </div>

              <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                {isLogin
                  ? "Welcome back"
                  : "Create your account"}
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                {isLogin
                  ? "Sign in to continue your conversations."
                  : "Join Connect and start chatting with your friends."}
              </p>

            </div>

            {/* =================================================
                LOGIN
            ================================================= */}

            {isLogin ? (

              <form
                onSubmit={handleLogin}
                className="space-y-5"
              >

                {/* Username */}
                <div>

                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Username
                  </label>

                  <div className="group relative">

                    <User className="absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400 transition group-focus-within:text-blue-600" />

                    <input
                      required
                      type="text"
                      value={username.value}
                      onChange={username.changeHandler}
                      placeholder="Enter your username"
                      className="h-13 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 hover:bg-white focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                    />

                  </div>

                </div>

                {/* Password */}
                <div>

                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Password
                  </label>

                  <div className="group relative">

                    <Lock className="absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400 transition group-focus-within:text-blue-600" />

                    <input
                      required
                      type="password"
                      value={password.value}
                      onChange={password.changeHandler}
                      placeholder="Enter your password"
                      className="h-13 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 hover:bg-white focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                    />

                  </div>

                </div>

                {/* Demo credentials */}
                <div className="rounded-xl border border-blue-100 bg-blue-50/60 px-4 py-3">

                  <p className="text-xs font-medium text-blue-600">
                    Demo credentials
                  </p>

                  <div className="mt-1.5 flex flex-wrap gap-x-5 gap-y-1 text-xs text-slate-500">

                    <span>
                      Username:{" "}
                      <span className="font-medium text-slate-700">
                        user
                      </span>
                    </span>

                    <span>
                      Password:{" "}
                      <span className="font-medium text-slate-700">
                        User@123
                      </span>
                    </span>

                  </div>

                </div>

                {/* Login */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                >

                  {isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    <>
                      Login
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}

                </button>

                {/* Divider */}
                <div className="flex items-center gap-4 py-1">

                  <div className="h-px flex-1 bg-slate-200" />

                  <span className="text-xs text-slate-400">
                    OR
                  </span>

                  <div className="h-px flex-1 bg-slate-200" />

                </div>

                {/* Signup */}
                <button
                  type="button"
                  onClick={toggleLogin}
                  disabled={isLoading}
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 disabled:opacity-50"
                >
                  Don't have an account?{" "}
                  <span className="font-semibold text-blue-600">
                    Sign up
                  </span>
                </button>

              </form>

            ) : (

              /* =================================================
                 SIGNUP
              ================================================= */

              <form
                onSubmit={handleSignup}
                className="space-y-4"
              >

                {/* Avatar */}
                <div className="mb-7 flex flex-col items-center">

                  <div className="relative">

                    <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-white bg-slate-100 shadow-md">

                      {avatar.preview ? (
                        <img
                          src={avatar.preview}
                          alt="Profile preview"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <User className="h-9 w-9 text-slate-400" />
                        </div>
                      )}

                    </div>

                    <label className="absolute bottom-0 right-0 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-4 border-white bg-blue-600 text-white shadow-md transition hover:bg-blue-700">

                      <Camera className="h-4 w-4" />

                      <input
                        type="file"
                        accept="image/*"
                        onChange={avatar.changeHandler}
                        className="hidden"
                      />

                    </label>

                  </div>

                  <p className="mt-2 text-xs text-slate-400">
                    Add profile picture
                  </p>

                  {avatar.error && (
                    <p className="mt-1 text-xs text-red-500">
                      {avatar.error}
                    </p>
                  )}

                </div>

                {/* Name */}
                <div>

                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Name
                  </label>

                  <input
                    required
                    value={name.value}
                    onChange={name.changeHandler}
                    placeholder="Your name"
                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  />

                </div>

                {/* Bio */}
                <div>

                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Bio
                  </label>

                  <input
                    required
                    value={bio.value}
                    onChange={bio.changeHandler}
                    placeholder="Tell us something about you"
                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  />

                </div>

                {/* Username */}
                <div>

                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Username
                  </label>

                  <input
                    required
                    value={username.value}
                    onChange={username.changeHandler}
                    placeholder="Choose a username"
                    className={`h-11 w-full rounded-xl border bg-slate-50 px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-4 ${
                      username.error
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500/10"
                        : "border-slate-200 focus:border-blue-500 focus:ring-blue-500/10"
                    }`}
                  />

                  {username.error && (
                    <p className="mt-1 text-xs text-red-500">
                      {username.error}
                    </p>
                  )}

                </div>

                {/* Password */}
                <div>

                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Password
                  </label>

                  <input
                    required
                    type="password"
                    value={password.value}
                    onChange={password.changeHandler}
                    placeholder="Create a strong password"
                    className={`h-11 w-full rounded-xl border bg-slate-50 px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-4 ${
                      password.error
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500/10"
                        : "border-slate-200 focus:border-blue-500 focus:ring-blue-500/10"
                    }`}
                  />

                  {password.error && (
                    <p className="mt-1 text-xs text-red-500">
                      {password.error}
                    </p>
                  )}

                </div>

                {/* Signup */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                >

                  {isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4" />
                      Create account
                    </>
                  )}

                </button>

                {/* Divider */}
                <div className="flex items-center gap-4 py-1">

                  <div className="h-px flex-1 bg-slate-200" />

                  <span className="text-xs text-slate-400">
                    OR
                  </span>

                  <div className="h-px flex-1 bg-slate-200" />

                </div>

                {/* Login */}
                <button
                  type="button"
                  onClick={toggleLogin}
                  disabled={isLoading}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 disabled:opacity-50"
                >
                  Already have an account?{" "}
                  <span className="font-semibold text-blue-600">
                    Login
                  </span>
                </button>

              </form>
            )}

            {/* Footer */}
            <p className="mt-8 text-center text-xs text-slate-400">
              Secure • Private • Real-time messaging
            </p>

          </div>
        </section>

      </div>
    </main>
  );
};

export default Login;

