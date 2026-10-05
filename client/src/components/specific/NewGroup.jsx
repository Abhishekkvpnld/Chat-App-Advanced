import { useMemo, useState } from "react";
import {
  Check,
  Search,
  Users,
  UserPlus,
  X,
  ArrowLeft,
} from "lucide-react";

import UserItem from "../shared/userItem";

import { useInputValidation } from "6pp";

import { useDispatch, useSelector } from "react-redux";

import {
  useAvailableFriendsQuery,
  useNewGroupMutation,
} from "../../../redux/api/api";

import { useAsyncMutation, useErrors } from "../../hooks/hook";

import { setIsNewGroup } from "../../../redux/reducers/misc";

import { toast } from "react-hot-toast";

const NewGroup = () => {
  const dispatch = useDispatch();

  const { isNewGroup } = useSelector((state) => state.misc);

  const {
    isError,
    isLoading,
    error,
    data,
  } = useAvailableFriendsQuery();

  const [newGroup, isLoadingNewGroup] =
    useAsyncMutation(useNewGroupMutation);

  const groupName = useInputValidation("");

  const [selectedMembers, setSelectedMembers] = useState([]);
  const [search, setSearch] = useState("");

  const errors = [
    {
      isError,
      error,
    },
  ];

  useErrors(errors);

  const friends = data?.friends || [];

  const filteredFriends = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return friends;

    return friends.filter((friend) => {
      const name = friend.name?.toLowerCase() || "";
      const username = friend.username?.toLowerCase() || "";

      return (
        name.includes(query) ||
        username.includes(query)
      );
    });
  }, [friends, search]);

  const selectMemberHandler = (id) => {
    setSelectedMembers((prev) =>
      prev.includes(id)
        ? prev.filter((currentElement) => currentElement !== id)
        : [...prev, id]
    );
  };

  const submitHandler = () => {
    const trimmedName = groupName.value.trim();

    if (!trimmedName) {
      return toast.error("Group name is required");
    }

    if (selectedMembers.length < 2) {
      return toast.error("Please select at least 2 members");
    }

    newGroup("Creating New Group...", {
      name: trimmedName,
      members: selectedMembers,
    });

    closeHandler();
  };

  const closeHandler = () => {
    dispatch(setIsNewGroup(false));
  };

  const clearSearch = () => {
    setSearch("");
  };

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-end justify-center px-0 transition-all duration-200 sm:items-center sm:px-4 ${
        isNewGroup
          ? "pointer-events-auto opacity-100"
          : "pointer-events-none opacity-0"
      }`}
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close new group"
        onClick={closeHandler}
        className="absolute inset-0 cursor-default bg-slate-900/30 backdrop-blur-[3px]"
      />

      {/* Dialog */}
      <div
        className={`relative z-10 flex max-h-[92vh] w-full flex-col overflow-hidden bg-white shadow-2xl shadow-slate-900/10 transition-all duration-200 sm:max-w-lg sm:rounded-2xl sm:border sm:border-slate-200 ${
          isNewGroup
            ? "translate-y-0 scale-100"
            : "translate-y-6 scale-95"
        }`}
      >
        {/* =========================
            HEADER
        ========================== */}
        <div className="border-b border-slate-100 bg-white px-5 py-4 sm:px-6">

          <div className="flex items-center gap-3">

            {/* Mobile close */}
            <button
              type="button"
              onClick={closeHandler}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 sm:hidden"
              aria-label="Close"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Users className="h-5 w-5" />
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="text-base font-bold tracking-tight text-slate-900 sm:text-lg">
                Create new group
              </h2>

              <p className="mt-0.5 text-xs text-slate-500">
                Start a conversation with your friends
              </p>
            </div>

            {/* Desktop close */}
            <button
              type="button"
              onClick={closeHandler}
              className="hidden h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 sm:flex"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* =========================
            CONTENT
        ========================== */}
        <div className="flex-1 overflow-y-auto">

          <div className="space-y-6 p-5 sm:p-6">

            {/* Group name */}
            <div>
              <label
                htmlFor="group-name"
                className="mb-2 block text-sm font-semibold text-slate-800"
              >
                Group name
              </label>

              <input
                id="group-name"
                type="text"
                value={groupName.value}
                onChange={groupName.changeHandler}
                placeholder="e.g. Weekend Friends"
                maxLength={50}
                autoComplete="off"
                className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
              />

              <div className="mt-1.5 flex justify-end">
                <span className="text-[11px] text-slate-400">
                  {groupName.value.length}/50
                </span>
              </div>
            </div>

            {/* Member heading */}
            <div>

              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-slate-800">
                      Add members
                    </h3>

                    <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-600">
                      {selectedMembers.length} selected
                    </span>
                  </div>

                  <p className="mt-1 text-xs text-slate-400">
                    Select at least 2 people
                  </p>
                </div>

                {selectedMembers.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setSelectedMembers([])}
                    className="text-xs font-medium text-slate-400 transition hover:text-red-500"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {/* Search */}
              {friends.length > 3 && (
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search friends..."
                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-9 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50"
                  />

                  {search && (
                    <button
                      type="button"
                      onClick={clearSearch}
                      className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-200 hover:text-slate-600"
                      aria-label="Clear search"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Selected members summary */}
            {selectedMembers.length > 0 && (
              <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-3">

                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                    <UserPlus className="h-4 w-4" />
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-blue-800">
                      {selectedMembers.length}{" "}
                      {selectedMembers.length === 1
                        ? "member"
                        : "members"}{" "}
                      selected
                    </p>

                    <p className="text-[11px] text-blue-600/70">
                      They'll be added to the new group.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Friends list */}
            <div>
              {isLoading ? (
                <FriendsSkeleton />
              ) : filteredFriends.length > 0 ? (
                <div className="max-h-64 space-y-1 overflow-y-auto pr-1">
                  {filteredFriends.map((friend) => (
                    <div
                      key={friend._id}
                      className={`rounded-xl transition ${
                        selectedMembers.includes(friend._id)
                          ? "bg-blue-50 ring-1 ring-blue-100"
                          : "hover:bg-slate-50"
                      }`}
                    >
                      <UserItem
                        user={friend}
                        handler={selectMemberHandler}
                        isAdded={selectedMembers.includes(friend._id)}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 px-5 py-10 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                    <Users className="h-6 w-6" />
                  </div>

                  <p className="mt-4 text-sm font-semibold text-slate-700">
                    {search
                      ? "No friends found"
                      : "No friends available"}
                  </p>

                  <p className="mt-1 max-w-xs text-xs leading-5 text-slate-400">
                    {search
                      ? "Try searching with a different name."
                      : "Add some friends before creating a group."}
                  </p>

                  {search && (
                    <button
                      type="button"
                      onClick={clearSearch}
                      className="mt-3 text-xs font-semibold text-blue-600 hover:text-blue-700"
                    >
                      Clear search
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* =========================
            FOOTER ACTIONS
        ========================== */}
        <div className="border-t border-slate-100 bg-white p-4 sm:px-6">

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">

            <button
              type="button"
              onClick={closeHandler}
              disabled={isLoadingNewGroup}
              className="h-11 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={submitHandler}
              disabled={
                isLoadingNewGroup ||
                !groupName.value.trim() ||
                selectedMembers.length < 2
              }
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700 hover:shadow-xl disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none"
            >
              {isLoadingNewGroup ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Creating...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  Create group
                </>
              )}
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   LOADING SKELETON
========================================================= */

const FriendsSkeleton = () => {
  return (
    <div className="space-y-2">
      {[1, 2, 3, 4].map((item) => (
        <div
          key={item}
          className="flex items-center gap-3 rounded-xl p-3"
        >
          <div className="h-10 w-10 animate-pulse rounded-full bg-slate-200" />

          <div className="flex-1 space-y-2">
            <div className="h-3 w-32 animate-pulse rounded bg-slate-200" />
            <div className="h-2.5 w-20 animate-pulse rounded bg-slate-100" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default NewGroup;
