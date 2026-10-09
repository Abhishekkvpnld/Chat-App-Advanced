import React from "react";
import { useFetchData } from "6pp";
import {
  UsersRound,
  UserRound,
  Users,
  Search,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

import AdminLayout from "../../components/layout/AdminLayout";
import { transformImage } from "../../lib/Features";
import { server } from "../../constants/config";
import { useErrors } from "../../hooks/hook";

const UserManagement = () => {
  const { loading, data, error } = useFetchData(
    `${server}/api/v1/admin/users`,
    "dashboard-users"
  );

  useErrors([
    {
      isError: error,
      error,
    },
  ]);

  const users = (data?.users || []).map((user) => ({
    ...user,
    id: user._id,
    avatar: user.avatar ? transformImage(user.avatar, 80) : "",
  }));

  return (
    <AdminLayout>
      <div className="min-h-screen bg-slate-50/70 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Page heading */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2 text-sm font-medium text-blue-600">
                <UsersRound size={17} />
                Administration
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                User Management
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                View and manage all registered users on your platform.
              </p>
            </div>

            <div className="flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm">
              <UsersRound size={18} className="text-blue-600" />
              <span className="text-sm font-medium text-slate-600">
                Total users
              </span>
              <span className="rounded-lg bg-blue-50 px-2 py-1 text-sm font-bold text-blue-700">
                {loading ? "..." : users.length}
              </span>
            </div>
          </div>

          {/* User table card */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div>
                <h2 className="text-base font-semibold text-slate-900">
                  All Users
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  User profiles and connection statistics
                </p>
              </div>

              <div className="flex items-center gap-2 self-start rounded-lg bg-slate-50 px-3 py-2 text-xs font-medium text-slate-500 sm:self-auto">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                User directory
              </div>
            </div>

            {loading ? (
              <UserTableSkeleton />
            ) : error ? (
              <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                  <AlertCircle size={26} />
                </div>
                <h3 className="font-semibold text-slate-900">
                  Unable to load users
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  Please try refreshing the page.
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  <RefreshCw size={15} />
                  Refresh page
                </button>
              </div>
            ) : users.length === 0 ? (
              <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                  <UsersRound size={26} />
                </div>
                <h3 className="font-semibold text-slate-900">
                  No users found
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  Registered users will appear here.
                </p>
              </div>
            ) : (
              <div className="w-full overflow-x-auto">
                <table className="w-full min-w-[850px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/80">
                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        User
                      </th>
                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        User ID
                      </th>
                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Username
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Friends
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Groups
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {users.map((user) => (
                      <tr
                        key={user.id}
                        className="transition-colors hover:bg-blue-50/40"
                      >
                        {/* Avatar and name */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-blue-50">
                              {user.avatar ? (
                                <img
                                  src={user.avatar}
                                  alt={user.name || "User"}
                                  loading="lazy"
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <UserRound
                                  size={20}
                                  className="text-blue-600"
                                />
                              )}
                            </div>

                            <div className="min-w-0">
                              <p className="max-w-[180px] truncate text-sm font-semibold text-slate-800">
                                {user.name || "Unnamed user"}
                              </p>
                              <p className="mt-0.5 text-xs text-slate-400">
                                Registered user
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* ID */}
                        <td className="px-6 py-4">
                          <span
                            title={user.id}
                            className="inline-block max-w-[160px] truncate rounded-md bg-slate-100 px-2.5 py-1.5 font-mono text-xs text-slate-600"
                          >
                            {user.id}
                          </span>
                        </td>

                        {/* Username */}
                        <td className="px-6 py-4">
                          <span className="text-sm text-slate-600">
                            {user.username
                              ? `@${user.username}`
                              : "—"}
                          </span>
                        </td>

                        {/* Friends */}
                        <td className="px-6 py-4 text-center">
                          <span className="inline-flex min-w-12 items-center justify-center gap-1.5 rounded-lg bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700">
                            <UserRound size={14} />
                            {Array.isArray(user.friends)
                              ? user.friends.length
                              : user.friends ?? 0}
                          </span>
                        </td>

                        {/* Groups */}
                        <td className="px-6 py-4 text-center">
                          <span className="inline-flex min-w-12 items-center justify-center gap-1.5 rounded-lg bg-violet-50 px-3 py-2 text-sm font-semibold text-violet-700">
                            <Users size={14} />
                            {Array.isArray(user.groups)
                              ? user.groups.length
                              : user.groups ?? 0}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {!loading && !error && users.length > 0 && (
              <div className="flex flex-col gap-2 border-t border-slate-100 bg-slate-50/50 px-5 py-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <p>
                  Showing{" "}
                  <span className="font-semibold text-slate-700">
                    {users.length}
                  </span>{" "}
                  registered users
                </p>
                <p className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Data from admin API
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

const UserTableSkeleton = () => (
  <div className="animate-pulse">
    {Array.from({ length: 6 }).map((_, index) => (
      <div
        key={index}
        className="flex items-center gap-5 border-b border-slate-100 px-6 py-5 last:border-0"
      >
        <div className="h-11 w-11 shrink-0 rounded-full bg-slate-200" />
        <div className="flex min-w-0 flex-1 items-center gap-8">
          <div className="w-32 space-y-2">
            <div className="h-3 w-24 rounded bg-slate-200" />
            <div className="h-2.5 w-16 rounded bg-slate-100" />
          </div>
          <div className="hidden h-5 w-28 rounded bg-slate-100 md:block" />
          <div className="hidden h-5 w-24 rounded bg-slate-100 lg:block" />
          <div className="ml-auto h-8 w-14 rounded-lg bg-slate-100" />
          <div className="h-8 w-14 rounded-lg bg-slate-100" />
        </div>
      </div>
    ))}
  </div>
);

export default UserManagement;

