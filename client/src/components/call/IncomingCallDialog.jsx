import { motion, AnimatePresence } from "framer-motion";
import { Phone, PhoneOff, Video, UserRound } from "lucide-react";

const IncomingCallDialog = ({ callState, onAnswer, onReject }) => {
  const { isReceivingCall, caller, callType } = callState;
  const isVideo = callType === "video";

  return (
    <AnimatePresence>
      {isReceivingCall && (
        <motion.div
          initial={{ opacity: 0, y: -40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -40, scale: 0.95 }}
          transition={{ type: "spring", damping: 22, stiffness: 300 }}
          className="fixed top-5 right-5 z-[9999] min-w-[300px] max-w-sm rounded-3xl bg-stone-900/95 border border-white/10 p-5 shadow-2xl shadow-black/80 backdrop-blur-xl"
        >
          {/* Header & Caller info */}
          <div className="flex items-center gap-3.5 mb-5">
            <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-stone-800 ring-2 ring-emerald-500/30">
              {caller?.avatar ? (
                <img
                  src={caller.avatar}
                  alt={caller?.name || "Caller"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <UserRound size={24} className="text-stone-300" />
              )}
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-stone-900 bg-emerald-500 animate-pulse" />
            </div>

            <div className="min-w-0 flex-1">
              <h4 className="truncate text-sm font-semibold text-white">
                {caller?.name || "Incoming Caller"}
              </h4>
              <p className="truncate text-xs font-medium text-stone-400 mt-0.5">
                {isVideo ? "📹 Incoming Video Call" : "📞 Incoming Voice Call"}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-center gap-4">
            {/* Reject / Decline */}
            <motion.button
              type="button"
              onClick={onReject}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              title="Decline"
              className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-600 text-white shadow-lg shadow-rose-600/40 hover:bg-rose-500 transition cursor-pointer"
            >
              <PhoneOff size={20} />
            </motion.button>

            {/* Accept / Answer */}
            <motion.button
              type="button"
              onClick={onAnswer}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              title="Accept Call"
              className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg shadow-emerald-600/40 hover:bg-emerald-500 transition cursor-pointer"
            >
              {isVideo ? <Video size={20} /> : <Phone size={20} />}
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default IncomingCallDialog;
