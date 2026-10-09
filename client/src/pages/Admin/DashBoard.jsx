import { useEffect, useState } from "react";
import moment from "moment";
import {
  UsersRound,
  MessageCircle,
  MessagesSquare,
  Bell,
  CalendarDays,
  TrendingUp,
  ArrowUpRight,
  ShieldCheck,
  UserRound,
  Layers3,
  RefreshCw,
} from "lucide-react";

import AdminLayout from "../../components/layout/AdminLayout";
import { DoughnutChart, LineChart } from "../../components/specific/Chart";
import { useFetchData } from "6pp";
import { server } from "../../constants/config";
import { useErrors } from "../../hooks/hook";

const Dashboard = () => {
  const { loading, data, error } = useFetchData(
    `${server}/api/v1/admin/stats`,
    "dashboard-stats"
  );

  const { stats } = data || {};

  useErrors([
    {
      isError: error,
      error,
    },
  ]);

  const [currentTime, setCurrentTime] = useState(() => moment());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(moment());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const usersCount = stats?.usersCount ?? 0;
  const chatsCount = stats?.totalChatsCount ?? 0;
  const messagesCount = stats?.messagesCount ?? 0;
  const groupsCount = stats?.groupsCount ?? 0;
  const singleChatsCount = Math.max(0, chatsCount - groupsCount);

  return (
    <AdminLayout>
      <div className="mx-auto w-full max-w-[1600px] space-y-7">
        {/* Page heading */}
        <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-600" />
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
                Admin workspace
              </p>
            </div>

            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              Dashboard Overview
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Monitor your users, conversations, and platform activity.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm sm:self-auto">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <CalendarDays size={20} />
            </div>

            <div>
              <p className="text-sm font-bold text-slate-800">
                {currentTime.format("MMM Do, YYYY")}
              </p>
              <p className="mt-0.5 text-xs text-slate-500">
                {currentTime.format("hh:mm:ss A")}
              </p>
            </div>
          </div>
        </section>

        {loading ? (
          <DashboardSkeleton />
        ) : (
          <>
            {/* Statistics */}
            <section>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-800">
                  Platform Statistics
                </h2>

                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  Live overview
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <StatCard
                  title="Total Users"
                  value={usersCount}
                  description="Registered platform users"
                  icon={UsersRound}
                  color="blue"
                />

                <StatCard
                  title="Total Chats"
                  value={chatsCount}
                  description="Conversations on your platform"
                  icon={MessageCircle}
                  color="violet"
                />

                <StatCard
                  title="Total Messages"
                  value={messagesCount}
                  description="Messages exchanged"
                  icon={MessagesSquare}
                  color="emerald"
                />
              </div>
            </section>

            {/* Charts */}
            <section className="grid grid-cols-1 gap-5 xl:grid-cols-5">
              {/* Message activity */}
              <div className="min-w-0 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6 xl:col-span-3">
                <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                        <TrendingUp size={19} />
                      </div>

                      <h2 className="text-base font-bold text-slate-900">
                        Message Activity
                      </h2>
                    </div>

                    <p className="mt-2 text-sm text-slate-500">
                      Overview of recent messaging activity.
                    </p>
                  </div>

                  <span className="rounded-lg bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-500">
                    Last messages
                  </span>
                </div>

                <div className="h-[280px] w-full min-w-0 sm:h-[340px]">
                  {stats?.messagesChart?.length ? (
                    <LineChart value={stats.messagesChart} />
                  ) : (
                    <EmptyChart message="No message activity available yet." />
                  )}
                </div>
              </div>

              {/* Chat distribution */}
              <div className="min-w-0 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6 xl:col-span-2">
                <div className="mb-5">
                  <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                      <Layers3 size={19} />
                    </div>

                    <h2 className="text-base font-bold text-slate-900">
                      Chat Distribution
                    </h2>
                  </div>

                  <p className="mt-2 text-sm text-slate-500">
                    Individual and group conversations.
                  </p>
                </div>

                <div className="relative mx-auto h-[250px] w-full max-w-[320px]">
                  {chatsCount > 0 ? (
                    <>
                      <DoughnutChart
                        labels={["Single Chats", "Group Chats"]}
                        value={[singleChatsCount, groupsCount]}
                      />

                      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-xs font-medium text-slate-500">
                          Total chats
                        </span>

                        <span className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900">
                          {chatsCount.toLocaleString()}
                        </span>
                      </div>
                    </>
                  ) : (
                    <EmptyChart message="No chats available yet." />
                  )}
                </div>

                <div className="mt-5 space-y-3 border-t border-slate-100 pt-5">
                  <ChartLegend
                    color="bg-blue-500"
                    label="Single Chats"
                    value={singleChatsCount}
                    total={chatsCount}
                  />

                  <ChartLegend
                    color="bg-violet-500"
                    label="Group Chats"
                    value={groupsCount}
                    total={chatsCount}
                  />
                </div>
              </div>
            </section>

            {/* Summary banner */}
            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600 p-6 text-white shadow-lg shadow-blue-900/10 sm:p-8">
              <div className="pointer-events-none absolute -right-10 -top-20 h-56 w-56 rounded-full border-[35px] border-white/[0.07]" />
              <div className="pointer-events-none absolute -bottom-24 right-36 h-48 w-48 rounded-full bg-white/[0.05]" />

              <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10">
                    <ShieldCheck size={25} />
                  </div>

                  <div>
                    <h2 className="text-lg font-bold">
                      Your platform at a glance
                    </h2>

                    <p className="mt-1 max-w-xl text-sm leading-6 text-blue-100">
                      Keep track of your community, conversations, and
                      messaging activity from your admin workspace.
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2 self-start rounded-xl border border-white/15 bg-white/10 px-4 py-3 sm:self-auto">
                  <UserRound size={18} />

                  <span className="text-sm font-semibold">
                    {usersCount.toLocaleString()} users
                  </span>

                  <ArrowUpRight size={17} className="text-blue-100" />
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

// Statistic card
const StatCard = ({
  title,
  value,
  description,
  icon: Icon,
  color,
}) => {
  const themes = {
    blue: {
      icon: "bg-blue-50 text-blue-600",
      accent: "bg-blue-500",
      ring: "group-hover:ring-blue-100",
    },
    violet: {
      icon: "bg-violet-50 text-violet-600",
      accent: "bg-violet-500",
      ring: "group-hover:ring-violet-100",
    },
    emerald: {
      icon: "bg-emerald-50 text-emerald-600",
      accent: "bg-emerald-500",
      ring: "group-hover:ring-emerald-100",
    },
  };

  const theme = themes[color] || themes.blue;

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm ring-4 ring-transparent transition duration-200 hover:-translate-y-1 hover:shadow-lg ${theme.ring}`}
    >
      <div
        className={`absolute inset-x-0 top-0 h-1 ${theme.accent} opacity-0 transition group-hover:opacity-100`}
      />

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500">{title}</p>

          <p className="mt-3 break-words text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            {Number(value).toLocaleString()}
          </p>

          <p className="mt-2 text-xs leading-5 text-slate-400">
            {description}
          </p>
        </div>

        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${theme.icon}`}
        >
          <Icon size={24} strokeWidth={1.8} />
        </div>
      </div>
    </div>
  );
};

// Chart legend row
const ChartLegend = ({ color, label, value, total }) => {
  const percentage =
    total > 0 ? Math.round((value / total) * 100) : 0;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${color}`} />

          <span className="truncate text-sm font-medium text-slate-600">
            {label}
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <span className="text-sm font-bold text-slate-800">
            {value.toLocaleString()}
          </span>

          <span className="w-10 text-right text-xs text-slate-400">
            {percentage}%
          </span>
        </div>
      </div>

      <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

// Empty chart state
const EmptyChart = ({ message }) => (
  <div className="flex h-full min-h-[180px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/60 px-4 text-center">
    <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm">
      <MessagesSquare size={22} />
    </div>

    <p className="text-sm font-medium text-slate-500">{message}</p>
  </div>
);

// Loading skeleton
const DashboardSkeleton = () => (
  <div className="animate-pulse space-y-7">
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="rounded-2xl border border-slate-200 bg-white p-5"
        >
          <div className="flex items-start justify-between">
            <div className="space-y-3">
              <div className="h-4 w-24 rounded bg-slate-200" />
              <div className="h-9 w-32 rounded bg-slate-200" />
              <div className="h-3 w-40 rounded bg-slate-100" />
            </div>

            <div className="h-12 w-12 rounded-2xl bg-slate-100" />
          </div>
        </div>
      ))}
    </div>

    <div className="grid grid-cols-1 gap-5 xl:grid-cols-5">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 xl:col-span-3">
        <div className="mb-8 h-6 w-44 rounded bg-slate-200" />
        <div className="h-[280px] rounded-xl bg-slate-100 sm:h-[340px]" />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 xl:col-span-2">
        <div className="mb-8 h-6 w-40 rounded bg-slate-200" />
        <div className="mx-auto h-[220px] w-[220px] rounded-full border-[35px] border-slate-100" />
        <div className="mt-6 space-y-4">
          <div className="h-4 rounded bg-slate-100" />
          <div className="h-4 rounded bg-slate-100" />
        </div>
      </div>
    </div>
  </div>
);

export default Dashboard;

