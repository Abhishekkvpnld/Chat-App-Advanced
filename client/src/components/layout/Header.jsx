
import React, { Suspense, lazy, useEffect, useRef, useState } from "react";
import {
  Bell,
  LogOut,
  Menu,
  MessageCircle,
  Plus,
  Search,
  UserRound,
  UsersRound,
  X,
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
const Profile = lazy(() => import("../specific/Profile"));

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const menuRef = useRef(null);

  const { isSearch, isNotification, isNewGroup } = useSelector(
    (state) => state.misc
  );

  const { notificationCount } = useSelector(
    (state) => state.chat
  );

  // Change this path if your auth reducer uses a different key
  const { user } = useSelector((state) => state.auth);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  /* =========================================================
     Close menu when clicking outside
  ========================================================= */

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, [isMenuOpen]);

  /* =========================================================
     Close Profile with Escape
  ========================================================= */

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsProfileOpen(false);
      }
    };

    if (isProfileOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isProfileOpen]);

  /* =========================================================
     Menu handlers
  ========================================================= */

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleMobile = () => {
    closeMenu();
    dispatch(setIsMobile(true));
  };

  const openSearch = () => {
    closeMenu();
    dispatch(setIsSearch(true));
  };

  const openNewGroup = () => {
    closeMenu();
    dispatch(setIsNewGroup(true));
  };

  const openNotification = () => {
    closeMenu();
    dispatch(setIsNotification(true));
    dispatch(resetNotificationCount());
  };

  const openProfile = () => {
    closeMenu();
    setIsProfileOpen(true);
  };

  const closeProfile = () => {
    setIsProfileOpen(false);
  };

  const navigateToGroup = () => {
    closeMenu();
    navigate("/groups");
  };

  /* =========================================================
     Logout
  ========================================================= */

  const logoutHandler = async () => {
    try {
      const { data } = await axios.get(
        `${server}/api/v1/user/logout`,
        {
          withCredentials: true,
        }
      );

      closeMenu();
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
      {/* =====================================================
          HEADER
      ===================================================== */}

      <header
        className="
          sticky top-0 z-40
          h-16 w-full
          border-b border-stone-200/80
          bg-white/90
          backdrop-blur-xl
        "
      >
        <div className="flex h-full items-center px-3 sm:px-5 lg:px-6">

          {/* Mobile Chat Sidebar */}

          <button
            type="button"
            onClick={handleMobile}
            aria-label="Open chats"
            className="
              mr-2 flex h-10 w-10 shrink-0
              items-center justify-center
              rounded-xl
              text-stone-500
              transition-all duration-200
              hover:bg-stone-100
              hover:text-stone-800
              active:scale-95
              sm:hidden
            "
          >
            <MessageCircle
              size={20}
              strokeWidth={1.8}
            />
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
            <div
              className="
                relative flex h-9 w-9 shrink-0
                items-center justify-center
                rounded-xl
                bg-stone-900
                text-white
                shadow-sm
                transition-transform duration-200
                group-hover:scale-[1.03]
              "
            >
              <MessageCircle
                size={18}
                strokeWidth={1.9}
              />

              <span
                className="
                  absolute bottom-1 right-1
                  h-1.5 w-1.5
                  rounded-full
                  bg-emerald-400
                  ring-2 ring-stone-900
                "
              />
            </div>

            <div className="hidden text-left sm:block">
              <h1 className="text-[14px] font-semibold tracking-tight text-stone-800">
                Connect
              </h1>

              <p className="mt-0.5 text-[10px] font-medium tracking-wide text-stone-400">
                Stay connected
              </p>
            </div>
          </button>

          <div className="flex-1" />

          {/* =================================================
              RIGHT MENU
          ================================================= */}

          <div
            ref={menuRef}
            className="relative"
          >
            <button
              type="button"
              onClick={toggleMenu}
              aria-label="Open menu"
              aria-expanded={isMenuOpen}
              className={`
                flex h-10 w-10
                items-center justify-center
                rounded-xl
                transition-all duration-200
                active:scale-95
                ${
                  isMenuOpen
                    ? "bg-stone-900 text-white"
                    : "text-stone-500 hover:bg-stone-100 hover:text-stone-800"
                }
              `}
            >
              {isMenuOpen ? (
                <X
                  size={20}
                  strokeWidth={1.8}
                />
              ) : (
                <Menu
                  size={21}
                  strokeWidth={1.8}
                />
              )}
            </button>

            {/* =================================================
                DROPDOWN
            ================================================= */}

            {isMenuOpen && (
              <div
                className="
                  absolute right-0 top-[calc(100%+10px)]
                  z-[60]
                  w-[290px]
                  origin-top-right
                  animate-in
                  fade-in
                  zoom-in-95
                  duration-150
                "
              >
                <div
                  className="
                    overflow-hidden
                    rounded-2xl
                    border border-stone-200
                    bg-white
                    p-2
                    shadow-xl
                    shadow-stone-900/10
                  "
                >
                  <div className="px-3 pb-2 pt-2">
                    <p className="text-xs font-semibold text-stone-800">
                      Quick actions
                    </p>

                    <p className="mt-0.5 text-[10px] text-stone-400">
                      Manage your account and conversations
                    </p>
                  </div>

                  <div className="my-1 h-px bg-stone-100" />

                  {/* Profile */}

                  <MenuItem
                    icon={<UserRound size={17} />}
                    title="Profile"
                    description="View your profile"
                    onClick={openProfile}
                  />

                  {/* Search */}

                  <MenuItem
                    icon={<Search size={17} />}
                    title="Search"
                    description="Find people and conversations"
                    onClick={openSearch}
                  />

                  {/* New Group */}

                  <MenuItem
                    icon={<Plus size={18} />}
                    title="New Group"
                    description="Create a new group"
                    onClick={openNewGroup}
                  />

                  {/* Groups */}

                  <MenuItem
                    icon={<UsersRound size={17} />}
                    title="Groups"
                    description="Manage your groups"
                    onClick={navigateToGroup}
                  />

                  {/* Notifications */}

                  <MenuItem
                    icon={<Bell size={17} />}
                    title="Notifications"
                    description="View your notifications"
                    onClick={openNotification}
                    badge={notificationCount}
                  />

                  <div className="my-1.5 h-px bg-stone-100" />

                  {/* Logout */}

                  <button
                    type="button"
                    onClick={logoutHandler}
                    className="
                      group flex w-full items-center
                      gap-3 rounded-xl px-3 py-2.5
                      text-left
                      transition-colors duration-150
                      hover:bg-red-50
                    "
                  >
                    <div
                      className="
                        flex h-9 w-9 shrink-0
                        items-center justify-center
                        rounded-lg
                        bg-red-50
                        text-red-500
                        transition-colors
                        group-hover:bg-red-100
                      "
                    >
                      <LogOut
                        size={17}
                        strokeWidth={1.8}
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-red-600">
                        Logout
                      </p>

                      <p className="mt-0.5 text-[10px] text-stone-400">
                        Sign out of your account
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* =====================================================
          PROFILE DIALOG
      ===================================================== */}

      {isProfileOpen && (
        <Suspense fallback={<DialogLoader />}>
          <ProfileDialog
            user={user}
            onClose={closeProfile}
          >
            <Profile user={user} />
          </ProfileDialog>
        </Suspense>
      )}

      {/* =====================================================
          SEARCH
      ===================================================== */}

      {isSearch && (
        <Suspense fallback={<DialogLoader />}>
          <SearchDialog />
        </Suspense>
      )}

      {/* =====================================================
          NOTIFICATIONS
      ===================================================== */}

      {isNotification && (
        <Suspense fallback={<DialogLoader />}>
          <Notification />
        </Suspense>
      )}

      {/* =====================================================
          NEW GROUP
      ===================================================== */}

      {isNewGroup && (
        <Suspense fallback={<DialogLoader />}>
          <NewGroup />
        </Suspense>
      )}
    </>
  );
};

/* =========================================================
   Profile Dialog
========================================================= */

const ProfileDialog = ({ children, onClose }) => {
  return (
    <div
      className="
        fixed inset-0 z-[100]
        flex items-center justify-center
        bg-stone-950/20
        px-4 py-6
        backdrop-blur-sm
        animate-in fade-in duration-200
      "
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Profile"
        className="
          relative
          w-full max-w-md
          max-h-[90vh]
          overflow-hidden
          rounded-3xl
          border border-stone-200
          bg-white
          shadow-2xl
          shadow-stone-950/15
          animate-in
          zoom-in-95
          duration-200
        "
      >
        {/* Close */}

        <button
          type="button"
          onClick={onClose}
          aria-label="Close profile"
          className="
            absolute right-4 top-4 z-20
            flex h-9 w-9
            items-center justify-center
            rounded-full
            border border-stone-200
            bg-white/90
            text-stone-500
            shadow-sm
            backdrop-blur
            transition-all duration-200
            hover:bg-stone-100
            hover:text-stone-900
            active:scale-95
          "
        >
          <X
            size={17}
            strokeWidth={1.8}
          />
        </button>

        {/* Scrollable profile */}

        <div className="max-h-[90vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   Menu Item
========================================================= */

const MenuItem = ({
  icon,
  title,
  description,
  onClick,
  badge,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        group flex w-full items-center
        gap-3 rounded-xl px-3 py-2.5
        text-left
        transition-colors duration-150
        hover:bg-stone-50
      "
    >
      <div
        className="
          flex h-9 w-9 shrink-0
          items-center justify-center
          rounded-lg
          bg-stone-100
          text-stone-500
          transition-all duration-150
          group-hover:bg-stone-200
          group-hover:text-stone-800
        "
      >
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold text-stone-700">
          {title}
        </p>

        <p className="mt-0.5 truncate text-[10px] text-stone-400">
          {description}
        </p>
      </div>

      {badge > 0 && (
        <span
          className="
            flex h-5 min-w-5
            items-center justify-center
            rounded-full
            bg-red-500
            px-1.5
            text-[9px]
            font-bold
            text-white
          "
        >
          {badge > 99 ? "99+" : badge}
        </span>
      )}
    </button>
  );
};

/* =========================================================
   Dialog Loader
========================================================= */

const DialogLoader = () => {
  return (
    <div
      className="
        fixed inset-0 z-[110]
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

