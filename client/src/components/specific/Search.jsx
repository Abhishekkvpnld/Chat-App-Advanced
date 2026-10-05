import React, { useEffect, useState } from "react";
import {
  Search as SearchIcon,
  X,
  Users,
  UserPlus,
  UserRoundSearch,
} from "lucide-react";

import { useInputValidation } from "6pp";

import UserItem from "../shared/userItem";

import { useDispatch, useSelector } from "react-redux";
import { setIsSearch } from "../../../redux/reducers/misc";

import {
  useLazySearchUserQuery,
  useSendFriendRequestMutation,
} from "../../../redux/api/api";

import { useAsyncMutation } from "../../hooks/hook";

const Search = () => {
  const { isSearch } = useSelector((state) => state.misc);

  const [searchUser] = useLazySearchUserQuery();

  const [sendFriendRequest, isLoadingSendFriendRequest] =
    useAsyncMutation(useSendFriendRequestMutation);

  const dispatch = useDispatch();

  const search = useInputValidation("");

  const [users, setUsers] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const addFriendHandler = async (id) => {
    await sendFriendRequest(
      "Sending friend request...",
      {
        userId: id,
      }
    );
  };

  const searchCloseHandler = () => {
    dispatch(setIsSearch(false));
    setUsers([]);
  };

  useEffect(() => {
    const query = search.value.trim();

    if (!query) {
      setUsers([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    const timeoutId = setTimeout(() => {
      searchUser(query)
        .then(({ data }) => {
          setUsers(data?.users || []);
        })
        .catch((error) => {
          console.log(error);
          setUsers([]);
        })
        .finally(() => {
          setIsSearching(false);
        });
    }, 500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [search.value, searchUser]);

  const hasSearch = search.value.trim().length > 0;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-end justify-center px-0 transition-all duration-200 sm:items-center sm:px-4 ${
        isSearch
          ? "pointer-events-auto opacity-100"
          : "pointer-events-none opacity-0"
      }`}
    >
      {/* =========================
          BACKDROP
      ========================== */}
      <button
        type="button"
        aria-label="Close search"
        onClick={searchCloseHandler}
        className="absolute inset-0 cursor-default bg-slate-900/30 backdrop-blur-[3px]"
      />

      {/* =========================
          SEARCH MODAL
      ========================== */}
      <div
        className={`relative z-10 flex max-h-[90vh] w-full flex-col overflow-hidden bg-white shadow-2xl shadow-slate-900/10 transition-all duration-200 sm:max-w-lg sm:rounded-2xl sm:border sm:border-slate-200 ${
          isSearch
            ? "translate-y-0 scale-100"
            : "translate-y-6 scale-95"
        }`}
      >
        {/* =========================
            HEADER
        ========================== */}
        <div className="border-b border-slate-100 px-5 py-4 sm:px-6">

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <UserRoundSearch className="h-5 w-5" />
              </div>

              <div>
                <h2 className="text-base font-bold tracking-tight text-slate-900 sm:text-lg">
                  Find People
                </h2>

                <p className="mt-0.5 text-xs text-slate-500">
                  Search for people and connect with them
                </p>
              </div>

            </div>

            <button
              type="button"
              onClick={searchCloseHandler}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              aria-label="Close search"
            >
              <X className="h-5 w-5" />
            </button>

          </div>
        </div>

        {/* =========================
            SEARCH INPUT
        ========================== */}
        <div className="px-5 pt-5 sm:px-6">

          <div className="relative">

            <SearchIcon className="absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-400" />

            <input
              autoFocus
              type="text"
              value={search.value}
              onChange={search.changeHandler}
              placeholder="Search by name or username..."
              autoComplete="off"
              className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-10 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50"
            />

            {hasSearch && (
              <button
                type="button"
                onClick={() => search.changeHandler({ target: { value: "" } })}
                className="absolute right-2.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-200 hover:text-slate-600"
                aria-label="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}

          </div>

          {/* Search hint */}
          {!hasSearch && (
            <div className="mt-3 flex items-center gap-2 px-1">
              <SearchIcon className="h-3.5 w-3.5 text-slate-400" />

              <p className="text-[11px] text-slate-400">
                Start typing to find people
              </p>
            </div>
          )}

        </div>

        {/* =========================
            RESULTS
        ========================== */}
        <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-5 pt-4 sm:px-6">

          {/* Initial state */}
          {!hasSearch && (
            <div className="flex flex-col items-center justify-center px-5 py-12 text-center">

              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                <Users className="h-7 w-7" />
              </div>

              <h3 className="mt-5 text-sm font-semibold text-slate-800">
                Discover people
              </h3>

              <p className="mt-1.5 max-w-xs text-xs leading-5 text-slate-400">
                Search for someone by their name or username to send them a
                friend request.
              </p>

            </div>
          )}

          {/* Loading */}
          {hasSearch && isSearching && (
            <SearchSkeleton />
          )}

          {/* Results */}
          {hasSearch && !isSearching && users.length > 0 && (
            <div>

              <div className="mb-3 flex items-center justify-between px-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  People
                </p>

                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500">
                  {users.length} found
                </span>
              </div>

              <div className="space-y-1">
                {users.map((user) => (
                  <div
                    key={user._id}
                    className="rounded-xl transition hover:bg-slate-50"
                  >
                    <UserItem
                      user={user}
                      handler={addFriendHandler}
                      handlerIsLoading={isLoadingSendFriendRequest}
                    />
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* No results */}
          {hasSearch && !isSearching && users.length === 0 && (
            <div className="flex flex-col items-center justify-center px-5 py-12 text-center">

              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                <UserRoundSearch className="h-7 w-7" />
              </div>

              <h3 className="mt-5 text-sm font-semibold text-slate-800">
                No people found
              </h3>

              <p className="mt-1.5 max-w-xs text-xs leading-5 text-slate-400">
                We couldn't find anyone matching{" "}
                <span className="font-medium text-slate-600">
                  "{search.value}"
                </span>
                .
              </p>

              <p className="mt-2 text-[11px] text-slate-400">
                Try checking the spelling or using a username.
              </p>

            </div>
          )}

        </div>

        {/* =========================
            FOOTER
        ========================== */}
        <div className="border-t border-slate-100 bg-slate-50/70 px-5 py-3 sm:px-6">

          <div className="flex items-center justify-center gap-2">
            <UserPlus className="h-3.5 w-3.5 text-slate-400" />

            <p className="text-[11px] text-slate-400">
              Send a friend request to start connecting
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

/* =========================================================
   SEARCH SKELETON
========================================================= */

const SearchSkeleton = () => {
  return (
    <div className="space-y-2">

      <div className="mb-3 h-3 w-16 animate-pulse rounded bg-slate-200" />

      {[1, 2, 3, 4].map((item) => (
        <div
          key={item}
          className="flex items-center gap-3 rounded-xl p-3"
        >
          <div className="h-11 w-11 shrink-0 animate-pulse rounded-full bg-slate-200" />

          <div className="flex-1 space-y-2">
            <div className="h-3 w-32 animate-pulse rounded bg-slate-200" />
            <div className="h-2.5 w-20 animate-pulse rounded bg-slate-100" />
          </div>

          <div className="h-9 w-20 animate-pulse rounded-lg bg-slate-100" />
        </div>
      ))}

    </div>
  );
};

export default Search;
