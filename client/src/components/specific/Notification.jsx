
import { memo } from "react";
import {
  Bell,
  Check,
  UserPlus,
  X,
  Inbox,
} from "lucide-react";

import {
  useAcceptFriendRequestMutation,
  useGetNotificationsQuery,
} from "../../../redux/api/api";

import { useAsyncMutation, useErrors } from "../../hooks/hook";

import { useDispatch, useSelector } from "react-redux";
import { setIsNotification } from "../../../redux/reducers/misc";

const Notification = () => {
  const dispatch = useDispatch();

  const { isNotification } = useSelector((state) => state.misc);

  const {
    isLoading,
    data,
    error,
    isError,
  } = useGetNotificationsQuery();

  const [acceptRequest] = useAsyncMutation(
    useAcceptFriendRequestMutation
  );

  const friendRequestHandler = async ({ _id, accept }) => {
    dispatch(setIsNotification(false));

    await acceptRequest(
      accept ? "Accepting Request..." : "Rejecting Request...",
      {
        requestId: _id,
        accept,
      }
    );
  };

  const closeHandler = () => {
    dispatch(setIsNotification(false));
  };

  useErrors([{ error, isError }]);

  const requests = data?.allRequests || [];

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-start justify-center px-4 pt-16 transition-all duration-200 sm:items-center sm:pt-0 ${
        isNotification
          ? "pointer-events-auto opacity-100"
          : "pointer-events-none opacity-0"
      }`}
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close notifications"
        onClick={closeHandler}
        className="absolute inset-0 cursor-default bg-slate-900/30 backdrop-blur-[3px]"
      />

      {/* Dialog */}
      <div
        className={`relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/10 transition-all duration-200 ${
          isNotification
            ? "translate-y-0 scale-100"
            : "-translate-y-3 scale-95"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">

          <div className="flex items-center gap-3">

            <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Bell className="h-5 w-5" />

              {requests.length > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-white bg-blue-600 px-1 text-[10px] font-bold text-white">
                  {requests.length > 9 ? "9+" : requests.length}
                </span>
              )}
            </div>

            <div>
              <h2 className="text-base font-bold tracking-tight text-slate-900">
                Notifications
              </h2>

              <p className="mt-0.5 text-xs text-slate-500">
                {requests.length > 0
                  ? `${requests.length} pending ${
                      requests.length === 1
                        ? "request"
                        : "requests"
                    }`
                  : "You're all caught up"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeHandler}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close notifications"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[70vh] overflow-y-auto p-4 sm:p-5">

          {/* Loading */}
          {isLoading ? (
            <div className="space-y-3">

              {[1, 2, 3].map((item) => (
                <NotificationSkeleton key={item} />
              ))}

            </div>
          ) : requests.length > 0 ? (
            <div className="space-y-3">
              {requests.map(({ sender, _id }) => (
                <NotificationItem
                  key={_id}
                  sender={sender}
                  _id={_id}
                  handler={friendRequestHandler}
                />
              ))}
            </div>
          ) : (
            <EmptyNotifications />
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-100 bg-slate-50/70 px-5 py-3">
          <p className="text-center text-[11px] text-slate-400">
            Friend requests will appear here
          </p>
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   NOTIFICATION ITEM
========================================================= */

const NotificationItem = memo(
  ({ sender, _id, handler }) => {
    const { name, avatar } = sender;

    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-blue-100 hover:bg-slate-50/60 hover:shadow-sm">

        {/* User info */}
        <div className="flex items-start gap-3">

          {/* Avatar */}
          <div className="relative shrink-0">
            <img
              src={avatar}
              alt={name}
              className="h-11 w-11 rounded-full object-cover ring-2 ring-white shadow-sm"
            />

            <span className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-blue-600 text-white">
              <UserPlus className="h-2.5 w-2.5" />
            </span>
          </div>

          {/* Message */}
          <div className="min-w-0 flex-1">
            <p className="text-sm leading-5 text-slate-600">
              <span className="font-semibold text-slate-900">
                {name}
              </span>{" "}
              sent you a friend request.
            </p>

            <p className="mt-1 text-[11px] text-slate-400">
              Would you like to connect?
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 grid grid-cols-2 gap-2">

          <button
            type="button"
            onClick={() =>
              handler({
                _id,
                accept: true,
              })
            }
            className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-3 text-xs font-semibold text-white shadow-sm shadow-blue-600/20 transition-all duration-200 hover:bg-blue-700 hover:shadow-md active:scale-[0.98]"
          >
            <Check className="h-3.5 w-3.5" />
            Accept
          </button>

          <button
            type="button"
            onClick={() =>
              handler({
                _id,
                accept: false,
              })
            }
            className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 transition-all duration-200 hover:border-red-200 hover:bg-red-50 hover:text-red-600 active:scale-[0.98]"
          >
            <X className="h-3.5 w-3.5" />
            Reject
          </button>

        </div>
      </div>
    );
  }
);

/* =========================================================
   LOADING SKELETON
========================================================= */

const NotificationSkeleton = () => {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4">
      <div className="flex gap-3">

        <div className="h-11 w-11 shrink-0 animate-pulse rounded-full bg-slate-200" />

        <div className="flex-1 space-y-2">
          <div className="h-3 w-3/4 animate-pulse rounded bg-slate-200" />
          <div className="h-3 w-1/2 animate-pulse rounded bg-slate-100" />
        </div>

      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="h-10 animate-pulse rounded-xl bg-slate-100" />
        <div className="h-10 animate-pulse rounded-xl bg-slate-100" />
      </div>
    </div>
  );
};

/* =========================================================
   EMPTY STATE
========================================================= */

const EmptyNotifications = () => {
  return (
    <div className="flex flex-col items-center justify-center px-5 py-10 text-center">

      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
        <Inbox className="h-7 w-7" />
      </div>

      <h3 className="mt-5 text-sm font-semibold text-slate-800">
        No new notifications
      </h3>

      <p className="mt-1.5 max-w-xs text-xs leading-5 text-slate-400">
        You don't have any pending friend requests right now.
      </p>
    </div>
  );
};

export default Notification;
