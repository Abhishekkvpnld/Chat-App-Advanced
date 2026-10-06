import { motion } from "framer-motion";
import { Phone, Video } from "lucide-react";

const CallButtons = ({ onVoiceCall, onVideoCall, disabled = false }) => {
  return (
    <div className="flex items-center gap-2">
      {/* Voice Call Button */}
      <motion.button
        type="button"
        onClick={onVoiceCall}
        disabled={disabled}
        whileHover={!disabled ? { scale: 1.05, y: -1 } : {}}
        whileTap={!disabled ? { scale: 0.94 } : {}}
        title="Voice Call"
        aria-label="Start voice call"
        className="
          group relative flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center
          rounded-xl sm:rounded-2xl
          bg-emerald-50 text-emerald-600
          border border-emerald-200/80
          shadow-xs
          transition-all duration-200
          hover:bg-emerald-600 hover:text-white hover:border-emerald-600
          hover:shadow-md hover:shadow-emerald-500/20
          disabled:opacity-40 disabled:cursor-not-allowed
          cursor-pointer
        "
      >
        <Phone
          size={18}
          strokeWidth={2.2}
          className="transition-transform duration-200 group-hover:scale-110"
        />
      </motion.button>

      {/* Video Call Button */}
      <motion.button
        type="button"
        onClick={onVideoCall}
        disabled={disabled}
        whileHover={!disabled ? { scale: 1.05, y: -1 } : {}}
        whileTap={!disabled ? { scale: 0.94 } : {}}
        title="Video Call"
        aria-label="Start video call"
        className="
          group relative flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center
          rounded-xl sm:rounded-2xl
          bg-indigo-50 text-indigo-600
          border border-indigo-200/80
          shadow-xs
          transition-all duration-200
          hover:bg-indigo-600 hover:text-white hover:border-indigo-600
          hover:shadow-md hover:shadow-indigo-500/20
          disabled:opacity-40 disabled:cursor-not-allowed
          cursor-pointer
        "
      >
        <Video
          size={19}
          strokeWidth={2.2}
          className="transition-transform duration-200 group-hover:scale-110"
        />
      </motion.button>
    </div>
  );
};

export default CallButtons;
