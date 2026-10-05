import React, { Suspense, lazy } from "react";
import {
  Bell,
  LogOut,
  Menu,
  MessageCircle,
  Plus,
  Search,
  UsersRound,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import axios from "axios";

import { server } from "../../constants/config";
import { userNotExists } from "../../../redux/reducers/auth";
import {
  setIsMobile,
  setIsNewGroup,
  setIsNotification,
  setIsSearch,
} from "../../../redux/reducers/misc";
import { resetNotificationCount } from "../../../redux/reducers/chat";

const SearchDialog = lazy(() => import("../specific/Search"));
const Notification = lazy(() => import("../specific/Notification"));
const NewGroup = lazy(() => import("../specific/NewGroup"));

const Header = () => {
  const { isSearch, isNotification, isNewGroup } = useSelector(
    (state) => state.misc
  );

  const { notificationCount } = useSelector(
    (state) => state.chat
  );

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleMobile = () => {
    dispatch(setIsMobile(true));
  };

  const openSearch = () => {
    dispatch(setIsSearch(true));
  };

  const openNewGroup = () => {
    dispatch(setIsNewGroup(true));
  };

  const openNotification = () => {
    dispatch(setIsNotification(true));
    dispatch(resetNotificationCount());
  };

  const navigateToGroup = () => {
    navigate("/groups");
  };

  const logoutHandler = async () => {
    try {
      const { data } = await axios.get(
        `${server}/api/v1/user/logout`,
        {
          withCredentials: true,
        }
      );

      dispatch(userNotExists());
      toast.success(data.message);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Something Went Wrong..."
      );
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 h-16 w-full border-b border-stone-200/80 bg-white/90 backdrop-blur-xl">
        <div className="flex h-full items-center px-3 sm:px-5 lg:px-6">

          {/* Mobile Menu */}
          <button
            type="button"
            onClick={handleMobile}
            aria-label="Open menu"
            className="
              mr-2 flex h-10 w-10 shrink-0 items-center
              justify-center rounded-xl
              text-stone-500
              transition-all duration-200
              hover:bg-stone-100 hover:text-stone-800
              active:scale-95
              sm:hidden
            "
          >
            <Menu size={21} strokeWidth={1.9} />
          </button>

          {/* Brand */}
          <button
            type="button"
            onClick={() => navigate("/")}
            className="
              group flex items-center gap-3
              rounded-xl px-1.5 py-1
              transition-colors duration-200
              hover:bg-stone-50
            "
          >
            {/* Logo */}
            <div
              className="
                relative flex h-9 w-9 shrink-0
                items-center justify-center
                overflow-hidden rounded-xl
                bg-stone-900 text-white
                shadow-sm
                transition-transform duration-200
                group-hover:scale-[1.03]
              "
            >
              <MessageCircle
                size={18}
                strokeWidth={1.9}
              />

              {/* Small status dot */}
              <span
                className="
                  absolute bottom-1 right-1
                  h-1.5 w-1.5
                  rounded-full bg-emerald-400
                  ring-2 ring-stone-900
                "
              />
            </div>

            {/* Brand text */}
            <div className="hidden text-left sm:block">
              <h1 className="text-[14px] font-semibold tracking-tight text-stone-800">
                Connect
              </h1>

              <p className="mt-0.5 text-[10px] font-medium tracking-wide text-stone-400">
                Stay connected
              </p>
            </div>
          </button>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Actions */}
          <nav className="flex items-center gap-0.5 sm:gap-1">

            <HeaderButton
              title="Search"
              onClick={openSearch}
              icon={<Search size={18} />}
            />

            <HeaderButton
              title="New Group"
              onClick={openNewGroup}
              icon={<Plus size={19} />}
            />

            <HeaderButton
              title="Groups"
              onClick={navigateToGroup}
              icon={<UsersRound size={18} />}
            />

            <HeaderButton
              title="Notifications"
              onClick={openNotification}
              icon={<Bell size={18} />}
              value={notificationCount}
            />

            {/* Divider */}
            <div className="mx-1.5 hidden h-6 w-px bg-stone-200 sm:block" />

            <HeaderButton
              title="Logout"
              onClick={logoutHandler}
              icon={<LogOut size={18} />}
              danger
            />
          </nav>
        </div>
      </header>

      {/* Search Dialog */}
      {isSearch && (
        <Suspense fallback={<DialogLoader />}>
          <SearchDialog />
        </Suspense>
      )}

      {/* Notification Dialog */}
      {isNotification && (
        <Suspense fallback={<DialogLoader />}>
          <Notification />
        </Suspense>
      )}

      {/* New Group Dialog */}
      {isNewGroup && (
        <Suspense fallback={<DialogLoader />}>
          <NewGroup />
        </Suspense>
      )}
    </>
  );
};

/* =========================================================
   Header Button
========================================================= */

const HeaderButton = ({
  title,
  icon,
  onClick,
  value,
  danger = false,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={title}
      title={title}
      className={`
        group relative flex h-10 w-10
        items-center justify-center
        rounded-xl
        transition-all duration-200
        active:scale-90

        ${
          danger
            ? `
              text-stone-400
              hover:bg-red-50
              hover:text-red-500
            `
            : `
              text-stone-500
              hover:bg-stone-100
              hover:text-stone-800
            `
        }
      `}
    >
      {/* Icon */}
      <span
        className="
          transition-transform duration-200
          group-hover:scale-105
        "
      >
        {icon}
      </span>

      {/* Notification Badge */}
      {value > 0 && (
        <span
          className="
            absolute right-0.5 top-0.5
            flex h-[17px] min-w-[17px]
            items-center justify-center
            rounded-full
            border-2 border-white
            bg-red-500
            px-1
            text-[9px] font-bold
            leading-none text-white
            shadow-sm
          "
        >
          {value > 99 ? "99+" : value}
        </span>
      )}

      {/* Tooltip */}
      <span
        className="
          pointer-events-none absolute
          right-0 top-full z-50
          mt-2
          hidden whitespace-nowrap
          rounded-lg
          bg-stone-900
          px-2.5 py-1.5
          text-[10px] font-medium
          text-white
          opacity-0
          shadow-lg
          transition-opacity duration-150
          group-hover:opacity-100
          sm:block
        "
      >
        {title}
      </span>
    </button>
  );
};

/* =========================================================
   Lazy Loading Fallback
========================================================= */

const DialogLoader = () => {
  return (
    <div
      className="
        fixed inset-0 z-[100]
        flex items-center justify-center
        bg-stone-900/10
        backdrop-blur-sm
      "
    >
      <div
        className="
          flex items-center gap-3
          rounded-2xl
          border border-stone-200
          bg-white
          px-5 py-4
          shadow-xl
        "
      >
        <div
          className="
            h-5 w-5 animate-spin
            rounded-full
            border-2 border-stone-200
            border-t-stone-700
          "
        />

        <span className="text-sm font-medium text-stone-600">
          Loading...
        </span>
      </div>
    </div>
  );
};

export default Header;
