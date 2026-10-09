import { useMemo } from "react";
import moment from "moment";
import { useFetchData } from "6pp";
import {
  MessagesSquare,
  MessageCircle,
  Paperclip,
  UserRound,
  UsersRound,
  Clock3,
  FileText,
  Download,
  ExternalLink,
  ShieldAlert,
  RefreshCw,
} from "lucide-react";

import AdminLayout from "../../components/layout/AdminLayout";
import { fileFormat, transformImage } from "../../lib/Features";
import RenderAttachment from "../../components/shared/RenderAttachment";
import { server } from "../../constants/config";
import { useErrors } from "../../hooks/hook";

const MessageManagement = () => {
  const { loading, data, error } = useFetchData(
    `${server}/api/v1/admin/messages`,
    "dashboard-messages"
  );

  useErrors([{ isError: error, error }]);

  const messages = useMemo(
    () =>
      (data?.messages || []).map((message) => ({
        ...message,
        id: message._id,
        sender: {
          name: message.sender?.name || "Unknown user",
          avatar: message.sender?.avatar
            ? transformImage(message.sender.avatar, 80)
            : "",
        },
        createdAt: message.createdAt
          ? moment(message.createdAt).format("MMM D, YYYY · h:mm A")
          : "Unknown time",
      })),
    [data]
  );

  const totalAttachments = messages.reduce(
    (total, message) =>
      total + (message.attachment?.length || 0),
    0
  );

  const groupMessages = messages.filter(
    (message) =>
      message.groupChat === true ||
      message.groupChat === "true"
  ).length;

  return (
    <AdminLayout>
      <div className="min-h-screen bg-slate-50/70 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Page heading */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2 text-sm font-medium text-blue-600">
                <MessagesSquare size={17} />
                Administration
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Message Management
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Review messages, attachments, senders, and conversation activity.
              </p>
            </div>

            <div className="flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <MessageCircle size={19} className="text-blue-600" />
              <span className="text-sm font-medium text-slate-600">
                Total messages
              </span>
              <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-sm font-bold text-blue-700">
                {loading ? "..." : messages.length}
              </span>
            </div>
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <SummaryCard
              icon={MessagesSquare}
              label="Total Messages"
              value={messages.length}
              description="All retrieved messages"
              color="blue"
              loading={loading}
            />

            <SummaryCard
              icon={Paperclip}
              label="Attachments"
              value={totalAttachments}
              description="Files attached to messages"
              color="violet"
              loading={loading}
            />

            <SummaryCard
              icon={UsersRound}
              label="Group Messages"
              value={groupMessages}
              description="Messages in group chats"
              color="emerald"
              loading={loading}
            />
          </div>

          {/* Messages table */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col gap-2 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div>
                <h2 className="font-semibold text-slate-900">
                  All Messages
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Message history and attached files
                </p>
              </div>

              <span className="inline-flex w-fit items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-xs font-medium text-slate-500">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Message directory
              </span>
            </div>

            {loading ? (
              <MessageTableSkeleton />
            ) : error ? (
              <EmptyState
                icon={ShieldAlert}
                title="Unable to load messages"
                description="Something went wrong while retrieving message data."
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
            ) : messages.length === 0 ? (
              <EmptyState
                icon={MessagesSquare}
                title="No messages found"
                description="Messages will appear here when users start conversations."
              />
            ) : (
              <div className="w-full overflow-x-auto">
                <table className="w-full min-w-[1150px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/80">
                      <TableHeader>Sender</TableHeader>
                      <TableHeader>Message</TableHeader>
                      <TableHeader>Attachments</TableHeader>
                      <TableHeader>Chat</TableHeader>
                      <TableHeader>Type</TableHeader>
                      <TableHeader>Sent At</TableHeader>
                      <TableHeader>Message ID</TableHeader>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {messages.map((message) => {
                      const isGroup =
                        message.groupChat === true ||
                        message.groupChat === "true";

                      return (
                        <tr
                          key={message.id}
                          className="align-top transition-colors hover:bg-blue-50/40"
                        >
                          {/* Sender */}
                          <td className="px-5 py-5">
                            <div className="flex min-w-[150px] items-center gap-3">
                              {message.sender.avatar ? (
                                <img
                                  src={message.sender.avatar}
                                  alt={message.sender.name}
                                  loading="lazy"
                                  className="h-10 w-10 shrink-0 rounded-full border border-slate-200 object-cover"
                                />
                              ) : (
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                                  <UserRound size={18} />
                                </div>
                              )}

                              <div className="min-w-0">
                                <p className="max-w-[140px] truncate text-sm font-semibold text-slate-800">
                                  {message.sender.name}
                                </p>
                                <p className="mt-1 text-xs text-slate-400">
                                  Message sender
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Message content */}
                          <td className="max-w-[280px] px-5 py-5">
                            <div className="max-w-[260px]">
                              <p className="whitespace-pre-wrap break-words text-sm leading-6 text-slate-700">
                                {message.content || (
                                  <span className="italic text-slate-400">
                                    No text content
                                  </span>
                                )}
                              </p>
                            </div>
                          </td>

                          {/* Attachments */}
                          <td className="px-5 py-5">
                            {message.attachment?.length > 0 ? (
                              <div className="flex min-w-[160px] flex-col gap-2">
                                {message.attachment.map((attachment, index) => {
                                  const url = attachment.url;
                                  if (!url) return null;

                                  const format = fileFormat(url);

                                  return (
                                    <a
                                      key={`${url}-${index}`}
                                      href={url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      download
                                      className="group flex max-w-[200px] items-center gap-2.5 rounded-xl border border-slate-200 bg-white p-2.5 transition hover:border-blue-200 hover:bg-blue-50/60"
                                      title="Open attachment"
                                    >
                                      <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-blue-50 text-blue-600">
                                        <FileText size={17} />
                                      </div>

                                      <div className="min-w-0 flex-1">
                                        <p className="truncate text-xs font-semibold text-slate-700">
                                          {url.split("/").pop()?.split("?")[0] ||
                                            `Attachment ${index + 1}`}
                                        </p>
                                        <p className="mt-0.5 text-[10px] uppercase text-slate-400">
                                          {String(format || "File")}
                                        </p>
                                      </div>

                                      <ExternalLink
                                        size={14}
                                        className="shrink-0 text-slate-400 transition group-hover:text-blue-600"
                                      />
                                    </a>
                                  );
                                })}
                              </div>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-50 px-2.5 py-2 text-xs text-slate-400">
                                <Paperclip size={13} />
                                No attachments
                              </span>
                            )}
                          </td>

                          {/* Chat */}
                          <td className="px-5 py-5">
                            <div className="flex items-center gap-2">
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                                <MessagesSquare size={15} />
                              </div>
                              <span
                                title={String(message.chat ?? "")}
                                className="max-w-[130px] truncate text-sm text-slate-600"
                              >
                                {message.chat || "—"}
                              </span>
                            </div>
                          </td>

                          {/* Type */}
                          <td className="px-5 py-5">
                            <span
                              className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg px-2.5 py-1.5 text-xs font-semibold ${
                                isGroup
                                  ? "bg-violet-50 text-violet-700"
                                  : "bg-blue-50 text-blue-700"
                              }`}
                            >
                              {isGroup ? (
                                <UsersRound size={13} />
                              ) : (
                                <UserRound size={13} />
                              )}
                              {isGroup ? "Group" : "Direct"}
                            </span>
                          </td>

                          {/* Timestamp */}
                          <td className="px-5 py-5">
                            <div className="flex min-w-[150px] items-start gap-2">
                              <Clock3
                                size={15}
                                className="mt-0.5 shrink-0 text-slate-400"
                              />
                              <div>
                                <p className="whitespace-nowrap text-sm font-medium text-slate-700">
                                  {message.createdAt}
                                </p>
                                {message.createdAt !== "Unknown time" && (
                                  <p className="mt-1 text-xs text-slate-400">
                                    {moment(
                                      message.createdAt,
                                      "MMM D, YYYY · h:mm A"
                                    ).fromNow()}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* ID */}
                          <td className="px-5 py-5">
                            <span
                              title={message.id}
                              className="inline-block max-w-[140px] truncate rounded-md bg-slate-100 px-2.5 py-1.5 font-mono text-xs text-slate-600"
                            >
                              {message.id}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {!loading && !error && messages.length > 0 && (
              <div className="flex flex-col gap-2 border-t border-slate-100 bg-slate-50/50 px-5 py-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <p>
                  Showing{" "}
                  <span className="font-semibold text-slate-700">
                    {messages.length}
                  </span>{" "}
                  messages
                </p>
                <p>Message records from admin API</p>
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
      <div className={`absolute inset-y-0 left-0 w-1 ${style.accent}`} />

      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>

          {loading ? (
            <div className="mt-3 h-8 w-20 animate-pulse rounded-lg bg-slate-100" />
          ) : (
            <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
              {value.toLocaleString()}
            </p>
          )}

          <p className="mt-2 text-xs text-slate-400">{description}</p>
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

const MessageTableSkeleton = () => (
  <div className="animate-pulse">
    {Array.from({ length: 5 }).map((_, index) => (
      <div
        key={index}
        className="flex items-start gap-5 border-b border-slate-100 px-6 py-6 last:border-0"
      >
        <div className="h-10 w-10 shrink-0 rounded-full bg-slate-200" />

        <div className="flex flex-1 items-start gap-8">
          <div className="w-32 space-y-2">
            <div className="h-3 w-24 rounded bg-slate-200" />
            <div className="h-2.5 w-16 rounded bg-slate-100" />
          </div>

          <div className="hidden w-48 space-y-2 md:block">
            <div className="h-3 w-full rounded bg-slate-100" />
            <div className="h-3 w-3/4 rounded bg-slate-100" />
          </div>

          <div className="hidden h-12 w-36 rounded-xl bg-slate-100 lg:block" />
          <div className="ml-auto h-7 w-16 rounded-lg bg-slate-100" />
        </div>
      </div>
    ))}
  </div>
);

export default MessageManagement;

