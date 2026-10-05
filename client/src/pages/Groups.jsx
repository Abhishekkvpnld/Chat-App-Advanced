
import React, {
  Suspense,
  lazy,
  memo,
  useEffect,
  useState,
} from "react";
import {
  ArrowLeft,
  Check,
  Edit3,
  Menu,
  Plus,
  Search,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";

import AvatarCard from "../components/shared/AvatarCard";
import UserItem from "../components/shared/userItem";

import {
  useChatDetailsQuery,
  useDeleteChatMutation,
  useMyGroupsQuery,
  useRemoveGroupMemberMutation,
  useRenameGroupMutation,
} from "../../redux/api/api";

import { useAsyncMutation, useErrors } from "../hooks/hook";
import { LayoutLoader } from "../components/layout/LayoutLoader";

import { useDispatch, useSelector } from "react-redux";
import { setIsAddMember } from "../../redux/reducers/misc";

const ConfirmDeleteDialog = lazy(
  () => import("../components/dialogs/ConfirmDeleteDialog")
);

const AddMemberDialog = lazy(
  () => import("../components/dialogs/AddMemberDialog")
);

const Groups = () => {
  const [searchParams] = useSearchParams();
  const chatId = searchParams.get("group");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isAddMember } = useSelector((state) => state.misc);

  const myGroups = useMyGroupsQuery("");

  const groupDetails = useChatDetailsQuery(
    {
      chatId,
      populate: true,
    },
    {
      skip: !chatId,
    }
  );

  const [updateGroup, isLoadingGroupName] = useAsyncMutation(
    useRenameGroupMutation
  );

  const [removeMember, isLoadingRemoveMember] = useAsyncMutation(
    useRemoveGroupMemberMutation
  );

  const [deleteGroup, isLoadingDeleteGroup] = useAsyncMutation(
    useDeleteChatMutation
  );

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupNameUpdatedValue, setGroupNameUpdatedValue] = useState("");
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false);
  const [members, setMembers] = useState([]);
  const [searchMember, setSearchMember] = useState("");

  const errors = [
    {
      isError: myGroups.isError,
      error: myGroups.error,
    },
    {
      isError: groupDetails.isError,
      error: groupDetails.error,
    },
  ];

  useErrors(errors);

  useEffect(() => {
    const groupData = groupDetails.data;

    if (groupData) {
      setGroupName(groupData.chat.name);
      setGroupNameUpdatedValue(groupData.chat.name);
      setMembers(groupData.chat.members);
    }

    return () => {
      setGroupName("");
      setGroupNameUpdatedValue("");
      setMembers([]);
      setIsEdit(false);
    };
  }, [groupDetails.data]);

  const navigateBack = () => {
    navigate("/");
  };

  const handleMobile = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const handleMobileClose = () => {
    setIsMobileMenuOpen(false);
  };

  const updateGroupName = () => {
    const trimmedName = groupNameUpdatedValue.trim();

    if (!trimmedName || trimmedName === groupName) {
      setIsEdit(false);
      setGroupNameUpdatedValue(groupName);
      return;
    }

    setIsEdit(false);

    updateGroup("Updating Group Name...", {
      chatId,
      name: trimmedName,
    });
  };

  const cancelEdit = () => {
    setGroupNameUpdatedValue(groupName);
    setIsEdit(false);
  };

  const openAddMemberHandler = () => {
    dispatch(setIsAddMember(true));
  };

  const openConfirmDeleteHandler = () => {
    setConfirmDeleteDialog(true);
  };

  const closeConfirmDeleteHandler = () => {
    setConfirmDeleteDialog(false);
  };

  const deleteHandler = () => {
    deleteGroup("Deleting Group...", chatId);
    closeConfirmDeleteHandler();
    navigate("/");
  };

  const removeMemberHandler = (userId) => {
    removeMember("Removing Member...", {
      chatId,
      userId,
    });
  };

  const filteredMembers = members.filter((member) => {
    const name = `${member.name || ""} ${member.username || ""}`.toLowerCase();

    return name.includes(searchMember.toLowerCase());
  });

  if (myGroups?.isLoading) {
    return <LayoutLoader />;
  }

  return (
    <main className="min-h-screen w-full bg-slate-50 text-slate-900">
      <div className="flex min-h-screen w-full">

        {/* =========================
            DESKTOP SIDEBAR
        ========================== */}
        <aside className="hidden w-[320px] shrink-0 border-r border-slate-200 bg-white sm:flex sm:flex-col">

          {/* Sidebar Header */}
          <div className="border-b border-slate-200 px-5 py-5">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={navigateBack}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                aria-label="Back to home"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>

              <div className="min-w-0">
                <h1 className="text-lg font-bold tracking-tight text-slate-900">
                  Groups
                </h1>

                <p className="text-xs text-slate-500">
                  {myGroups?.data?.groups?.length || 0}{" "}
                  {myGroups?.data?.groups?.length === 1
                    ? "conversation"
                    : "conversations"}
                </p>
              </div>
            </div>
          </div>

          {/* Group List */}
          <div className="flex-1 overflow-y-auto p-3">
            <GroupList
              myGroups={myGroups?.data?.groups}
              chatId={chatId}
            />
          </div>
        </aside>

        {/* =========================
            MOBILE MENU BUTTON
        ========================== */}
        <button
          type="button"
          onClick={handleMobile}
          className="fixed right-4 top-4 z-40 flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-lg shadow-slate-200/50 transition hover:bg-blue-50 hover:text-blue-600 sm:hidden"
          aria-label="Open groups"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* =========================
            MAIN CONTENT
        ========================== */}
        <section className="relative flex min-w-0 flex-1 flex-col">

          {/* Top Header */}
          <header className="border-b border-slate-200 bg-white px-5 py-5 sm:px-8">
            <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4">

              <div className="flex min-w-0 items-center gap-3">

                {/* Mobile Back */}
                <button
                  type="button"
                  onClick={navigateBack}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 sm:hidden"
                  aria-label="Back to home"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>

                {groupName ? (
                  <div className="min-w-0">
                    {isEdit ? (
                      <div className="flex items-center gap-2">

                        <input
                          autoFocus
                          value={groupNameUpdatedValue}
                          onChange={(e) =>
                            setGroupNameUpdatedValue(e.target.value)
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              updateGroupName();
                            }

                            if (e.key === "Escape") {
                              cancelEdit();
                            }
                          }}
                          disabled={isLoadingGroupName}
                          className="h-11 w-full max-w-xs rounded-xl border border-blue-300 bg-white px-3 text-base font-semibold text-slate-900 outline-none ring-4 ring-blue-50 transition focus:border-blue-500"
                        />

                        <button
                          type="button"
                          onClick={updateGroupName}
                          disabled={isLoadingGroupName}
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                          aria-label="Save group name"
                        >
                          <Check className="h-4 w-4" />
                        </button>

                        <button
                          type="button"
                          onClick={cancelEdit}
                          disabled={isLoadingGroupName}
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-700"
                          aria-label="Cancel editing"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">

                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                          <Users className="h-5 w-5" />
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h2 className="truncate text-lg font-bold text-slate-900 sm:text-xl">
                              {groupName}
                            </h2>

                            <button
                              type="button"
                              onClick={() => setIsEdit(true)}
                              disabled={isLoadingGroupName}
                              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-blue-50 hover:text-blue-600"
                              aria-label="Rename group"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>
                          </div>

                          <p className="text-xs text-slate-500">
                            {members.length}{" "}
                            {members.length === 1 ? "member" : "members"}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      Groups
                    </h2>

                    <p className="text-sm text-slate-500">
                      Select a group to manage it
                    </p>
                  </div>
                )}
              </div>

              {/* Desktop actions */}
              {groupName && (
                <div className="hidden items-center gap-2 sm:flex">

                  <button
                    type="button"
                    onClick={openAddMemberHandler}
                    className="inline-flex h-10 items-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition hover:bg-blue-700 hover:shadow-md"
                  >
                    <Plus className="h-4 w-4" />
                    Add member
                  </button>

                  <button
                    type="button"
                    onClick={openConfirmDeleteHandler}
                    disabled={isLoadingDeleteGroup}
                    className="inline-flex h-10 items-center gap-2 rounded-xl border border-red-200 bg-white px-4 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              )}
            </div>
          </header>

          {/* =========================
              EMPTY STATE
          ========================== */}
          {!groupName && (
            <div className="flex flex-1 items-center justify-center px-6 py-16">
              <div className="max-w-md text-center">

                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-50 text-blue-600">
                  <Users className="h-9 w-9" />
                </div>

                <h2 className="mt-6 text-2xl font-bold tracking-tight text-slate-900">
                  Manage your groups
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Select a group from the sidebar to view members, add new
                  people, rename the group, or manage the conversation.
                </p>

                <button
                  type="button"
                  onClick={handleMobile}
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 sm:hidden"
                >
                  <Menu className="h-4 w-4" />
                  Browse groups
                </button>
              </div>
            </div>
          )}

          {/* =========================
              GROUP CONTENT
          ========================== */}
          {groupName && (
            <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-8 sm:py-8">

              <div className="mx-auto w-full max-w-5xl">

                {/* Members heading */}
                <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Group members
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Manage people who are part of this conversation.
                    </p>
                  </div>

                  {/* Search */}
                  {members.length > 3 && (
                    <div className="relative w-full sm:w-64">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                      <input
                        type="text"
                        value={searchMember}
                        onChange={(e) => setSearchMember(e.target.value)}
                        placeholder="Search members..."
                        className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
                      />
                    </div>
                  )}
                </div>

                {/* Members Card */}
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                  {isLoadingRemoveMember ? (
                    <div className="flex min-h-48 items-center justify-center">
                      <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />
                    </div>
                  ) : filteredMembers.length > 0 ? (
                    <div className="divide-y divide-slate-100">
                      {filteredMembers.map((member) => (
                        <div
                          key={member._id}
                          className="group flex items-center gap-3 px-4 py-3 transition hover:bg-slate-50 sm:px-5"
                        >
                          <div className="min-w-0 flex-1">
                            <UserItem
                              user={member}
                              isAdded
                              styling={{
                                boxShadow: "none",
                                padding: "0",
                                borderRadius: "0",
                              }}
                              handler={removeMemberHandler}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex min-h-48 flex-col items-center justify-center px-6 text-center">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                        <Users className="h-6 w-6" />
                      </div>

                      <p className="mt-4 text-sm font-semibold text-slate-700">
                        {searchMember
                          ? "No members found"
                          : "No members in this group"}
                      </p>

                      {searchMember && (
                        <button
                          type="button"
                          onClick={() => setSearchMember("")}
                          className="mt-2 text-xs font-medium text-blue-600 hover:text-blue-700"
                        >
                          Clear search
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Mobile actions */}
                <div className="mt-5 grid grid-cols-1 gap-3 sm:hidden">

                  <button
                    type="button"
                    onClick={openAddMemberHandler}
                    className="flex h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4" />
                    Add member
                  </button>

                  <button
                    type="button"
                    onClick={openConfirmDeleteHandler}
                    disabled={isLoadingDeleteGroup}
                    className="flex h-12 items-center justify-center gap-2 rounded-xl border border-red-200 bg-white text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete group
                  </button>
                </div>

                {/* Group info */}
                <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                      <Users className="h-5 w-5" />
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-slate-800">
                        About this group
                      </h4>

                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        This conversation currently has{" "}
                        <span className="font-semibold text-slate-700">
                          {members.length}
                        </span>{" "}
                        {members.length === 1 ? "member" : "members"}.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* =========================
          MOBILE GROUP DRAWER
      ========================== */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 sm:hidden">

          {/* Overlay */}
          <button
            type="button"
            aria-label="Close groups"
            onClick={handleMobileClose}
            className="absolute inset-0 bg-slate-900/30 backdrop-blur-[2px]"
          />

          {/* Drawer */}
          <aside className="absolute left-0 top-0 flex h-full w-[86%] max-w-sm flex-col bg-white shadow-2xl">

            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-5">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Groups
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  {myGroups?.data?.groups?.length || 0} conversations
                </p>
              </div>

              <button
                type="button"
                onClick={handleMobileClose}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-50"
                aria-label="Close groups"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3">
              <GroupList
                chatId={chatId}
                myGroups={myGroups?.data?.groups}
                onSelect={handleMobileClose}
              />
            </div>
          </aside>
        </div>
      )}

      {/* =========================
          ADD MEMBER
      ========================== */}
      {isAddMember && (
        <Suspense
          fallback={
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/20 backdrop-blur-sm">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />
            </div>
          }
        >
          <AddMemberDialog chatId={chatId} />
        </Suspense>
      )}

      {/* =========================
          DELETE CONFIRMATION
      ========================== */}
      {confirmDeleteDialog && (
        <Suspense
          fallback={
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/20 backdrop-blur-sm">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-red-500" />
            </div>
          }
        >
          <ConfirmDeleteDialog
            open={confirmDeleteDialog}
            handleclose={closeConfirmDeleteHandler}
            deleteHandler={deleteHandler}
          />
        </Suspense>
      )}
    </main>
  );
};

const GroupList = memo(
  ({ myGroups = [], chatId, onSelect }) => {
    return (
      <div className="space-y-1">
        {myGroups.length > 0 ? (
          myGroups.map((group) => (
            <GroupListItem
              group={group}
              chatId={chatId}
              key={group._id}
              onSelect={onSelect}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center px-5 py-20 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <Users className="h-6 w-6" />
            </div>

            <p className="mt-4 text-sm font-semibold text-slate-700">
              No groups yet
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-400">
              Your group conversations will appear here.
            </p>
          </div>
        )}
      </div>
    );
  }
);

const GroupListItem = memo(({ group, chatId, onSelect }) => {
  const { name, avatar, _id } = group;

  const isActive = chatId === _id;

  return (
    <Link
      to={`?group=${_id}`}
      onClick={(e) => {
        if (chatId === _id) {
          e.preventDefault();
        }

        onSelect?.();
      }}
      className="block"
    >
      <div
        className={`group flex items-center gap-3 rounded-xl px-3 py-3 transition-all duration-200 ${
          isActive
            ? "bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-100"
            : "text-slate-700 hover:bg-slate-50"
        }`}
      >
        <div className="relative shrink-0">
          <AvatarCard avatar={avatar} />

          {isActive && (
            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-blue-600" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p
            className={`truncate text-sm font-semibold ${
              isActive ? "text-blue-700" : "text-slate-800"
            }`}
          >
            {name}
          </p>

          <p
            className={`mt-0.5 text-xs ${
              isActive ? "text-blue-500" : "text-slate-400"
            }`}
          >
            Group conversation
          </p>
        </div>
      </div>
    </Link>
  );
});

export default Groups;

