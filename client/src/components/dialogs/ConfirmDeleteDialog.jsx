
import { motion } from "framer-motion";
import { AlertTriangle, X, Trash2 } from "lucide-react";

const ConfirmDeleteDialog = ({
  open,
  handleclose,
  deleteHandler,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleclose}
        className="absolute inset-0 bg-stone-950/20 backdrop-blur-sm"
      />

      {/* Dialog */}
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.96,
          y: 10,
        }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
        }}
        transition={{
          duration: 0.2,
          ease: "easeOut",
        }}
        role="dialog"
        aria-modal="true"
        className="relative z-10 w-full max-w-sm overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-2xl"
      >
        {/* Close */}
        <button
          type="button"
          onClick={handleclose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-700"
          aria-label="Close"
        >
          <X size={17} />
        </button>

        {/* Content */}
        <div className="px-6 pb-5 pt-7 text-center">
          {/* Icon */}
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
            <AlertTriangle size={26} strokeWidth={1.8} />
          </div>

          {/* Title */}
          <h2 className="mt-5 text-lg font-semibold tracking-tight text-stone-900">
            Delete group?
          </h2>

          {/* Description */}
          <p className="mx-auto mt-2 max-w-[280px] text-sm leading-6 text-stone-500">
            Are you sure you want to delete this group? This action cannot
            be undone.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 border-t border-stone-100 bg-stone-50/50 px-6 py-4">
          <button
            type="button"
            onClick={handleclose}
            className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-stone-200 bg-white text-sm font-medium text-stone-600 transition-all hover:border-stone-300 hover:bg-stone-50 hover:text-stone-900"
          >
            <X size={16} />
            Cancel
          </button>

          <button
            type="button"
            onClick={deleteHandler}
            className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-red-500 text-sm font-medium text-white shadow-sm transition-all hover:bg-red-600 active:scale-[0.98]"
          >
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ConfirmDeleteDialog;
