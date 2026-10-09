import { useMemo } from "react";
import { useFetchData } from "6pp";
import {
  MessagesSquare,
  UsersRound,
  MessageCircle,
  UserRound,
  ShieldAlert,
  RefreshCw,
} from "lucide-react";

import AdminLayout from "../../components/layout/AdminLayout";
import AvatarCard from "../../components/shared/AvatarCard";
import { transformImage } from "../../lib/Features";
import { server } from "../../constants/config";
import { useErrors } from "../../hooks/hook";

const ChatManagement = () => {
  const { loading, data, error } = useFetchData(
    `${server}/api/v1/admin/chats`,
    "dashboard-chats"
  );

  useErrors([{ isError: error, error }]);

  const chats = useMemo(
    () =>
      (data?.chats || []).map((chat) => ({
        ...chat,
        id: chat._id,
        avatar: (chat.avatar || []).map((image) =>
          transformImage(image, 50)
        ),
        members: (chat.members || []).map((member) =>
          transformImage(member.avatar, 50)
        ),
        creator: {
          name: chat.creator?.name || "Unknown",
          avatar: chat.creator?.avatar
            ? transformImage(chat.creator.avatar, 50)
            : "",
        },
      })),
    [data]
  );

  const totalMembers = chats.reduce(
    (total, chat) => total + (chat.members?.length || 0),
    0
  );

  const totalMessages = chats.reduce(
    (total, chat) => total + (chat.totalMessages || 0),
    0
  );

  return (
    <AdminLayout>
      <div className="min-h-screen bg-slate-50/70 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Heading */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2 text-sm font-medium text-blue-600">
                <MessagesSquare size={17} />
                Administration
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Chat Management
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Monitor group conversations, members, and activity.
              </p>
            </div>

            <div className="flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <MessagesSquare size={19} className="text-blue-600" />
              <span className="text-sm font-medium text-slate-600">
                Total chats
              </span>
              <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-sm font-bold text-blue-700">
                {loading ? "..." : chats.length}
              </span>
            </div>
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <SummaryCard
              icon={MessagesSquare}
              label="Total Chats"
              value={chats.length}
              description="All conversations"
              color="blue"
              loading={loading}
            />

            <SummaryCard
              icon={UsersRound}
              label="Total Members"
              value={totalMembers}
              description="Across all chats"
              color="violet"
              loading={loading}
            />

            <SummaryCard
              icon={MessageCircle}
              label="Total Messages"
              value={totalMessages}
              description="Messages across chats"
              color="emerald"
              loading={loading}
            />
          </div>

          {/* Chat table */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col gap-2 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div>
                <h2 className="font-semibold text-slate-900">
                  All Chats
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Conversation details and group membership
                </p>
              </div>

              <span className="inline-flex w-fit items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-xs font-medium text-slate-500">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Chat directory
              </span>
            </div>

            {loading ? (
              <ChatTableSkeleton />
            ) : error ? (
              <EmptyState
                icon={ShieldAlert}
                title="Unable to load chats"
                description="Something went wrong while retrieving chat data."
                action={
                  <button
                    onClick={() => window.location.reload()}
                    className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                  >
                    <RefreshCw size={15} />
                    Refresh page
                  </button>
                }
              />
            ) : chats.length === 0 ? (
              <EmptyState
                icon={MessagesSquare}
                title="No chats found"
                description="Group conversations will appear here when available."
              />
            ) : (
              <div className="w-full overflow-x-auto">
                <table className="w-full min-w-[1050px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/80">
                      <TableHeader>Chat</TableHeader>
                      <TableHeader>Chat ID</TableHeader>
                      <TableHeader>Type</TableHeader>
                      <TableHeader>Members</TableHeader>
                      <TableHeader>Total Messages</TableHeader>
                      <TableHeader>Created By</TableHeader>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {chats.map((chat) => {
                      const isGroup =
                        chat.groupChat === true ||
                        chat.groupChat === "true";

                      return (
                        <tr
                          key={chat.id}
                          className="transition-colors hover:bg-blue-50/40"
                        >
                          {/* Chat avatar and name */}
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-blue-50">
                                {chat.avatar.length > 0 ? (
                                  <AvatarCard
                                    avatar={chat.avatar}
                                    max={3}
                                  />
                                ) : (
                                  <MessagesSquare
                                    size={20}
                                    className="text-blue-600"
                                  />
                                )}
                              </div>

                              <div>
                                <p className="max-w-[170px] truncate text-sm font-semibold text-slate-800">
                                  {chat.name || "Unnamed chat"}
                                </p>
                                <p className="mt-0.5 text-xs text-slate-400">
                                  Conversation
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* ID */}
                          <td className="px-5 py-4">
                            <span
                              title={chat.id}
                              className="inline-block max-w-[150px] truncate rounded-md bg-slate-100 px-2.5 py-1.5 font-mono text-xs text-slate-600"
                            >
                              {chat.id}
                            </span>
                          </td>

                          {/* Chat type */}
                          <td className="px-5 py-4">
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold ${
                                isGroup
                                  ? "bg-violet-50 text-violet-700"
                                  : "bg-blue-50 text-blue-700"
                              }`}
                            >
                              {isGroup ? (
                                <UsersRound size={14} />
                              ) : (
                                <UserRound size={14} />
                              )}
                              {isGroup ? "Group" : "Direct"}
                            </span>
                          </td>

                          {/* Members */}
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex max-w-[145px] items-center">
                                {chat.members.length > 0 ? (
                                  <AvatarCard
                                    avatar={chat.members}
                                    max={4}
                                  />
                                ) : (
                                  <span className="text-xs text-slate-400">
                                    No members
                                  </span>
                                )}
                              </div>

                              <span className="whitespace-nowrap rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">
                                {chat.totalMembers ??
                                  chat.members.length}
                              </span>
                            </div>
                          </td>

                          {/* Message count */}
                          <td className="px-5 py-4">
                            <span className="inline-flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">
                              <MessageCircle size={15} />
                              {chat.totalMessages ?? 0}
                            </span>
                          </td>

                          {/* Creator */}
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              {chat.creator.avatar ? (
                                <img
                                  src={chat.creator.avatar}
                                  alt={chat.creator.name}
                                  loading="lazy"
                                  className="h-10 w-10 rounded-full border border-slate-200 object-cover"
                                />
                              ) : (
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                                  <UserRound size={18} />
                                </div>
                              )}

                              <span className="max-w-[150px] truncate text-sm font-medium text-slate-700">
                                {chat.creator.name}
                              </span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {!loading && !error && chats.length > 0 && (
              <div className="flex flex-col gap-2 border-t border-slate-100 bg-slate-50/50 px-5 py-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <p>
                  Showing{" "}
                  <span className="font-semibold text-slate-700">
                    {chats.length}
                  </span>{" "}
                  conversations
                </p>
                <p>Chat statistics from admin API</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

const SummaryCard = ({
  icon: Icon,
  label,
  value,
  description,
  color,
  loading,
}) => {
  const styles = {
    blue: {
      icon: "bg-blue-50 text-blue-600",
      accent: "bg-blue-500",
    },
    violet: {
      icon: "bg-violet-50 text-violet-600",
      accent: "bg-violet-500",
    },
    emerald: {
      icon: "bg-emerald-50 text-emerald-600",
      accent: "bg-emerald-500",
    },
  };

  const style = styles[color] || styles.blue;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div
        className={`absolute inset-y-0 left-0 w-1 ${style.accent}`}
      />

      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {label}
          </p>

          {loading ? (
            <div className="mt-3 h-8 w-20 animate-pulse rounded-lg bg-slate-100" />
          ) : (
            <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
              {value.toLocaleString()}
            </p>
          )}

          <p className="mt-2 text-xs text-slate-400">
            {description}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${style.icon}`}
        >
          <Icon size={21} />
        </div>
      </div>
    </div>
  );
};

const TableHeader = ({ children }) => (
  <th className="whitespace-nowrap px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
    {children}
  </th>
);

const EmptyState = ({
  icon: Icon,
  title,
  description,
  action,
}) => (
  <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
      <Icon size={26} />
    </div>

    <h3 className="font-semibold text-slate-900">{title}</h3>

    <p className="mt-2 max-w-sm text-sm text-slate-500">
      {description}
    </p>

    {action}
  </div>
);

const ChatTableSkeleton = () => (
  <div className="animate-pulse">
    {Array.from({ length: 5 }).map((_, index) => (
      <div
        key={index}
        className="flex items-center gap-5 border-b border-slate-100 px-6 py-5 last:border-0"
      >
        <div className="h-11 w-11 shrink-0 rounded-xl bg-slate-200" />

        <div className="flex flex-1 items-center gap-8">
          <div className="w-32 space-y-2">
            <div className="h-3 w-24 rounded bg-slate-200" />
            <div className="h-2.5 w-16 rounded bg-slate-100" />
          </div>

          <div className="hidden h-5 w-28 rounded bg-slate-100 md:block" />
          <div className="hidden h-6 w-16 rounded-lg bg-slate-100 lg:block" />
          <div className="ml-auto h-8 w-16 rounded-lg bg-slate-100" />
          <div className="hidden h-9 w-28 rounded-full bg-slate-100 sm:block" />
        </div>
      </div>
    ))}
  </div>
);

export default ChatManagement;

