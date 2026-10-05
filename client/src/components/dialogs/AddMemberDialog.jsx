
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserPlus,
  Users,
  Check,
  X,
  UserRound,
} from "lucide-react";

import UserItem from "../shared/userItem";
import { useAsyncMutation, useErrors } from "../../hooks/hook";
import {
  useAddGroupMembersMutation,
  useAvailableFriendsQuery,
} from "../../../redux/api/api";

import { useSelector, useDispatch } from "react-redux";
import { setIsAddMember } from "../../../redux/reducers/misc";

const AddMemberDialog = ({ chatId }) => {
  const dispatch = useDispatch();

  const { isAddMember } = useSelector((state) => state.misc);

  const { isLoading, data, isError, error } =
    useAvailableFriendsQuery(chatId);

  const [selectedMembers, setSelectedMembers] = useState([]);

  const [addMembers, isLoadingAddMembers] = useAsyncMutation(
    useAddGroupMembersMutation
  );

  const selectMemberHandler = (id) => {
    setSelectedMembers((prev) =>
      prev.includes(id)
        ? prev.filter((currentElement) => currentElement !== id)
        : [...prev, id]
    );
  };

  const closeHandler = () => {
    dispatch(setIsAddMember(false));
    setSelectedMembers([]);
  };

  const addMemberSubmitHandler = () => {
    if (!selectedMembers.length) return;

    addMembers("Adding Members...", {
      members: selectedMembers,
      chatId,
    });

    closeHandler();
  };

  useErrors([{ error, isError }]);

  if (!isAddMember) return null;

  const friends = data?.friends || [];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={closeHandler}
        className="absolute inset-0 bg-stone-950/20 backdrop-blur-sm"
      />

      {/* Modal */}
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.96,
          y: 12,
        }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
        }}
        exit={{
          opacity: 0,
          scale: 0.96,
          y: 12,
        }}
        transition={{
          duration: 0.2,
          ease: "easeOut",
        }}
        role="dialog"
        aria-modal="true"
        className="relative z-10 flex max-h-[88vh] w-full max-w-md flex-col overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-2xl"
      >
        {/* Header */}
        <div className="border-b border-stone-100 px-5 py-5 sm:px-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-stone-100 text-stone-700">
                <UserPlus size={21} strokeWidth={1.8} />
              </div>

              <div>
                <h2 className="text-base font-semibold tracking-tight text-stone-900">
                  Add members
                </h2>

                <p className="mt-0.5 text-xs text-stone-500">
                  Select friends to add to this group
                </p>
              </div>
            </div>

            {/* Close */}
            <button
              type="button"
              onClick={closeHandler}
              className="flex h-9 w-9 items-center justify-center rounded-xl text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-700"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          {/* Selected count */}
          <AnimatePresence>
            {selectedMembers.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -5 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0, y: -5 }}
                className="mt-4"
              >
                <div className="flex items-center justify-between rounded-xl bg-stone-50 px-3.5 py-2.5">
                  <div className="flex items-center gap-2 text-xs font-medium text-stone-600">
                    <Users size={15} />
                    <span>
                      {selectedMembers.length}{" "}
                      {selectedMembers.length === 1
                        ? "member"
                        : "members"}{" "}
                      selected
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedMembers([])}
                    className="text-xs font-medium text-stone-500 hover:text-stone-900"
                  >
                    Clear
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Members */}
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4 sm:px-6">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="flex animate-pulse items-center gap-3 rounded-2xl border border-stone-100 p-3"
                >
                  <div className="h-10 w-10 rounded-full bg-stone-100" />

                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-28 rounded bg-stone-100" />
                    <div className="h-2.5 w-20 rounded bg-stone-100" />
                  </div>

                  <div className="h-5 w-5 rounded-full bg-stone-100" />
                </div>
              ))}
            </div>
          ) : friends.length > 0 ? (
            <div className="space-y-2">
              {friends.map((friend) => {
                const isSelected = selectedMembers.includes(friend._id);

                return (
                  <motion.button
                    key={friend._id}
                    type="button"
                    whileTap={{ scale: 0.99 }}
                    onClick={() => selectMemberHandler(friend._id)}
                    className={`group relative flex w-full items-center rounded-2xl border p-2 text-left transition-all duration-200 ${
                      isSelected
                        ? "border-stone-300 bg-stone-50 shadow-sm"
                        : "border-stone-100 bg-white hover:border-stone-200 hover:bg-stone-50/70"
                    }`}
                  >
                    {/* Existing UserItem */}
                    <div className="min-w-0 flex-1">
                      <UserItem
                        user={friend}
                        handler={() => selectMemberHandler(friend._id)}
                        isAdded={isSelected}
                      />
                    </div>

                    {/* Selection Indicator */}
                    <div
                      className={`mr-2 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-all ${
                        isSelected
                          ? "border-stone-800 bg-stone-800 text-white"
                          : "border-stone-300 bg-white text-transparent"
                      }`}
                    >
                      <Check size={14} strokeWidth={2.5} />
                    </div>
                  </motion.button>
                );
              })}
            </div>
          ) : (
            <div className="flex min-h-[220px] flex-col items-center justify-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-stone-100 text-stone-400">
                <UserRound size={25} strokeWidth={1.6} />
              </div>

              <h3 className="mt-4 text-sm font-semibold text-stone-800">
                No friends available
              </h3>

              <p className="mt-1 max-w-[230px] text-xs leading-5 text-stone-400">
                You don't have any friends available to add to this group.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-stone-100 bg-stone-50/50 px-5 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            {/* Cancel */}
            <button
              type="button"
              onClick={closeHandler}
              className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-stone-200 bg-white text-sm font-medium text-stone-600 transition-all hover:border-stone-300 hover:bg-stone-50 hover:text-stone-900"
            >
              <X size={16} />
              Cancel
            </button>

            {/* Submit */}
            <button
              type="button"
              onClick={addMemberSubmitHandler}
              disabled={
                isLoadingAddMembers || selectedMembers.length === 0
              }
              className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-stone-900 text-sm font-medium text-white shadow-sm transition-all hover:bg-stone-800 disabled:cursor-not-allowed disabled:bg-stone-200 disabled:text-stone-400 disabled:shadow-none"
            >
              {isLoadingAddMembers ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Adding...
                </>
              ) : (
                <>
                  <UserPlus size={16} />
                  Add{" "}
                  {selectedMembers.length > 0
                    ? `(${selectedMembers.length})`
                    : ""}
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AddMemberDialog;
