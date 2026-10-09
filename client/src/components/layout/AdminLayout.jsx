import { useState } from "react";
import {
  Navigate,
  NavLink,
  Outlet,
  useLocation,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  LayoutDashboard,
  UsersRound,
  MessageCircle,
  MessagesSquare,
  ShieldCheck,
  LogOut,
  Menu,
  X,
  ChevronRight,
  PanelLeftClose,
} from "lucide-react";

import { adminLogout } from "../../../redux/thunks/admin";

export const adminTabs = [
  {
    name: "Dashboard",
    path: "/admin/dashboard",
    icon: LayoutDashboard,
    description: "Overview and analytics",
  },
  {
    name: "Users",
    path: "/admin/users",
    icon: UsersRound,
    description: "Manage platform users",
  },
  {
    name: "Chats",
    path: "/admin/chats",
    icon: MessageCircle,
    description: "Manage conversations",
  },
  {
    name: "Messages",
    path: "/admin/messages",
    icon: MessagesSquare,
    description: "View message activity",
  },
];

const Sidebar = ({ onNavigate }) => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    onNavigate?.();
    dispatch(adminLogout());
  };

  return (
    <aside className="flex h-full min-h-screen flex-col border-r border-slate-200/80 bg-white">
      {/* Brand */}
      <div className="flex h-[88px] shrink-0 items-center gap-3 border-b border-slate-100 px-6">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/20">
          <ShieldCheck size={25} strokeWidth={2} />
        </div>

        <div className="min-w-0">
          <h1 className="text-lg font-extrabold tracking-tight text-slate-900">
            Admin Panel
          </h1>

          <p className="mt-0.5 text-xs font-medium text-slate-500">
            Management Console
          </p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-4 py-7">
        <p className="mb-4 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
          Workspace
        </p>

        <nav className="space-y-1.5">
          {adminTabs.map((tab) => {
            const Icon = tab.icon;

            return (
              <NavLink
                key={tab.path}
                to={tab.path}
                end
                onClick={onNavigate}
                className={({ isActive }) =>
                  [
                    "group relative flex items-center gap-3 overflow-hidden rounded-xl px-3.5 py-3 transition-all duration-200",
                    isActive
                      ? "bg-blue-50 text-blue-700 shadow-sm shadow-blue-900/[0.02]"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900",
                  ].join(" ")
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span className="absolute bottom-2.5 left-0 top-2.5 w-[3px] rounded-r-full bg-blue-600" />
                    )}

                    <span
                      className={[
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors",
                        isActive
                          ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                          : "bg-slate-100/80 text-slate-500 group-hover:bg-white group-hover:text-blue-600",
                      ].join(" ")}
                    >
                      <Icon size={19} strokeWidth={1.9} />
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold">
                        {tab.name}
                      </span>

                      <span
                        className={[
                          "mt-0.5 block truncate text-[11px]",
                          isActive ? "text-blue-600/75" : "text-slate-400",
                        ].join(" ")}
                      >
                        {tab.description}
                      </span>
                    </span>

                    {isActive && (
                      <ChevronRight
                        size={17}
                        className="shrink-0 text-blue-500"
                      />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Security information */}
        <div className="mt-9 rounded-2xl border border-blue-100/80 bg-gradient-to-br from-blue-50/90 to-indigo-50/60 p-4">
          <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
            <ShieldCheck size={20} />
          </div>

          <h3 className="text-xs font-bold text-slate-800">
            Secure workspace
          </h3>

          <p className="mt-1.5 text-[11px] leading-5 text-slate-500">
            Your administrator workspace is ready. Manage your platform from one place.
          </p>

          <div className="mt-3 flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>

            <span className="text-[10px] font-semibold text-emerald-700">
              Admin session active
            </span>
          </div>
        </div>
      </div>

      {/* Account / Logout */}
      <div className="border-t border-slate-100 p-4">
        <div className="mb-3 flex items-center gap-3 rounded-xl bg-slate-50 p-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-slate-700 shadow-sm ring-1 ring-slate-200/70">
            <ShieldCheck size={21} />
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-slate-800">
              Administrator
            </p>
            <p className="mt-0.5 text-xs text-slate-500">
              System access
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-200"
        >
          <LogOut size={19} />
          <span>Sign out</span>
        </button>
      </div>

      <div className="border-t border-slate-100 px-6 py-3">
        <p className="text-center text-[10px] text-slate-400">
          Admin Console · v1.0
        </p>
      </div>
    </aside>
  );
};

const AdminLayout = ({ children }) => {
  const { isAdmin } = useSelector((state) => state.auth);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  if (!isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  const currentTab =
    adminTabs.find((tab) => tab.path === location.pathname) ||
    adminTabs.find((tab) => location.pathname.startsWith(`${tab.path}/`)) ||
    adminTabs[0];

  return (
    <div className="min-h-screen bg-[#f6f8fc] text-slate-800">
      {/* Desktop sidebar */}
      <div className="fixed inset-y-0 left-0 z-30 hidden w-[260px] lg:w-[275px] md:block">
        <Sidebar />
      </div>

      {/* Main application area */}
      <div className="min-h-screen md:pl-[260px] lg:pl-[275px]">
        {/* Top header */}
        <header className="sticky top-0 z-20 flex h-[76px] items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setIsMobile(true)}
              aria-label="Open navigation menu"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 md:hidden"
            >
              <Menu size={21} />
            </button>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="truncate text-sm font-bold text-slate-900 sm:text-base">
                  {currentTab.name}
                </p>
              </div>

              <p className="mt-1 hidden text-xs text-slate-500 sm:block">
                Manage your platform with confidence.
              </p>
            </div>
          </div>

          <div className="ml-3 flex shrink-0 items-center gap-3">
            <div className="hidden items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 sm:flex">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-xs font-semibold text-emerald-700">
                Admin
              </span>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-sm">
              <ShieldCheck size={21} />
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="min-h-[calc(100vh-76px)] p-4 sm:p-6 lg:p-8">
          {children ?? <Outlet />}
        </main>
      </div>

      {/* Mobile drawer */}
      {isMobile && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={() => setIsMobile(false)}
            className="absolute inset-0 cursor-default bg-slate-950/40 backdrop-blur-[2px]"
          />

          {/* Drawer panel */}
          <div className="absolute inset-y-0 left-0 w-[min(310px,85vw)] animate-in slide-in-from-left duration-200">
            <div className="relative h-full overflow-y-auto shadow-2xl">
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setIsMobile(false)}
                className="absolute right-3 top-5 z-10 flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-100"
              >
                <X size={18} />
              </button>

              <Sidebar onNavigate={() => setIsMobile(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLayout;
