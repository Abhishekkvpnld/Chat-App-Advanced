import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PhoneOff,
  Mic,
  MicOff,
  Video,
  VideoOff,
  UserRound,
} from "lucide-react";

const CallScreen = ({
  callState,
  myVideoRef,
  remoteVideoRef,
  onEndCall,
  contactName = "User",
  contactAvatar = "",
}) => {
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(callState.callType === "video");

  const isVideo = callState.callType === "video";
  const isCalling = callState.isCalling && !callState.callActive;
  const isActive = callState.callActive;

  const toggleMic = () => {
    const stream = myVideoRef.current?.srcObject;
    if (stream) {
      stream.getAudioTracks().forEach((track) => {
        track.enabled = !micOn;
      });
      setMicOn(!micOn);
    }
  };

  const toggleCam = () => {
    const stream = myVideoRef.current?.srcObject;
    if (stream) {
      stream.getVideoTracks().forEach((track) => {
        track.enabled = !camOn;
      });
      setCamOn(!camOn);
    }
  };

  // If no call is ongoing or outgoing, render nothing
  if (!isCalling && !isActive) return null;

  const displayName = callState.caller?.name || contactName || "User";
  const displayAvatar = callState.caller?.avatar || contactAvatar || "";

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md">

        {/* ========================================================= */}
        {/* OUTGOING CALL MODAL DIALOG (Waiting for recipient to answer) */}
        {/* ========================================================= */}
        {isCalling && (
          <motion.div
            key="outgoing-modal"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 320 }}
            className="relative w-full max-w-sm sm:max-w-md rounded-3xl bg-stone-900/95 border border-white/10 shadow-2xl shadow-black/80 p-6 sm:p-8 backdrop-blur-xl flex flex-col items-center justify-center text-center overflow-hidden"
          >
            {/* Top subtle badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-stone-300 mb-6">
              <span className={`h-2 w-2 rounded-full animate-ping ${isVideo ? "bg-indigo-400" : "bg-emerald-400"}`} />
              <span>{isVideo ? "Outgoing Video Call" : "Outgoing Voice Call"}</span>
            </div>

            {/* Concentric Animated Sonar Rings */}
            <div className="relative flex items-center justify-center my-6">
              {[1, 2, 3].map((ring) => (
                <motion.div
                  key={ring}
                  animate={{ scale: [1, 2.1], opacity: [0.35, 0] }}
                  transition={{
                    duration: 2.2,
                    repeat: Infinity,
                    delay: ring * 0.55,
                    ease: "easeOut",
                  }}
                  className={`absolute rounded-full w-24 h-24 ${
                    isVideo ? "bg-indigo-500/30" : "bg-emerald-500/30"
                  }`}
                />
              ))}

              {/* Avatar / Icon Center */}
              <div
                className={`relative z-10 flex h-24 w-24 items-center justify-center rounded-full p-1 shadow-xl ring-2 ${
                  isVideo ? "ring-indigo-400/50" : "ring-emerald-400/50"
                } bg-gradient-to-tr from-stone-800 to-stone-700 overflow-hidden`}
              >
                {displayAvatar ? (
                  <img
                    src={displayAvatar}
                    alt={displayName}
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-stone-800 text-stone-200">
                    <UserRound size={36} strokeWidth={1.8} />
                  </div>
                )}
              </div>
            </div>

            {/* Recipient Name & Status */}
            <h3 className="text-xl font-semibold text-white mt-2 truncate max-w-full">
              {displayName}
            </h3>
            <p className="text-sm text-stone-400 mt-1 mb-6">
              Ringing... waiting for answer
            </p>

            {/* End / Cancel Call Button */}
            <motion.button
              type="button"
              onClick={onEndCall}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              title="Cancel call"
              className="flex h-14 w-14 items-center justify-center rounded-full bg-rose-600 text-white shadow-lg shadow-rose-600/40 hover:bg-rose-500 transition cursor-pointer"
            >
              <PhoneOff size={24} />
            </motion.button>
            <span className="text-xs text-stone-400 mt-2 font-medium">Cancel</span>
          </motion.div>
        )}

        {/* ========================================================= */}
        {/* ACTIVE CALL MODAL (Connected)                             */}
        {/* ========================================================= */}
        {isActive && (
          <motion.div
            key="active-modal"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 320 }}
            className={`relative w-full overflow-hidden rounded-3xl bg-stone-950 border border-white/10 shadow-2xl shadow-black/80 backdrop-blur-xl flex flex-col ${
              isVideo
                ? "max-w-2xl sm:max-w-3xl aspect-[16/10] sm:aspect-video h-[460px] sm:h-[500px]"
                : "max-w-sm sm:max-w-md p-6 sm:p-8 items-center text-center"
            }`}
          >
            {/* ── VIDEO CALL VIEW ── */}
            {isVideo ? (
              <div className="relative w-full h-full flex flex-col justify-between">
                {/* Remote Video Stream */}
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  playsInline
                  className="absolute inset-0 h-full w-full object-cover"
                />

                {/* Top Overlay Header */}
                <div className="relative z-10 flex items-center justify-between p-4 bg-gradient-to-b from-black/70 to-transparent">
                  <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-medium text-white">{displayName}</span>
                  </div>
                  <span className="text-xs font-medium text-stone-300 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                    Video Call
                  </span>
                </div>

                {/* Picture-in-Picture Local Video */}
                <div className="absolute top-16 right-4 z-20 w-32 h-24 sm:w-40 sm:h-28 rounded-2xl overflow-hidden border-2 border-white/20 shadow-xl bg-stone-900">
                  <video
                    ref={myVideoRef}
                    autoPlay
                    muted
                    playsInline
                    className={`h-full w-full object-cover ${camOn ? "block" : "hidden"}`}
                  />
                  {!camOn && (
                    <div className="flex h-full w-full flex-col items-center justify-center bg-stone-800 text-stone-400 gap-1 text-xs">
                      <VideoOff size={18} />
                      <span>Camera Off</span>
                    </div>
                  )}
                </div>

                {/* Bottom Floating Controls Pill */}
                <div className="relative z-20 flex items-center justify-center p-5 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                  <div className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-stone-900/80 backdrop-blur-xl border border-white/15 shadow-2xl">
                    {/* Toggle Mic */}
                    <motion.button
                      type="button"
                      onClick={toggleMic}
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.92 }}
                      title={micOn ? "Mute Microphone" : "Unmute Microphone"}
                      className={`flex h-11 w-11 items-center justify-center rounded-full transition cursor-pointer ${
                        micOn
                          ? "bg-white/15 text-white hover:bg-white/25"
                          : "bg-rose-500/30 text-rose-300 border border-rose-500/40"
                      }`}
                    >
                      {micOn ? <Mic size={20} /> : <MicOff size={20} />}
                    </motion.button>

                    {/* Toggle Camera */}
                    <motion.button
                      type="button"
                      onClick={toggleCam}
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.92 }}
                      title={camOn ? "Turn Camera Off" : "Turn Camera On"}
                      className={`flex h-11 w-11 items-center justify-center rounded-full transition cursor-pointer ${
                        camOn
                          ? "bg-white/15 text-white hover:bg-white/25"
                          : "bg-rose-500/30 text-rose-300 border border-rose-500/40"
                      }`}
                    >
                      {camOn ? <Video size={20} /> : <VideoOff size={20} />}
                    </motion.button>

                    {/* End Call */}
                    <motion.button
                      type="button"
                      onClick={onEndCall}
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.92 }}
                      title="End call"
                      className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-600 text-white shadow-lg shadow-rose-600/50 hover:bg-rose-500 transition cursor-pointer ml-1"
                    >
                      <PhoneOff size={22} />
                    </motion.button>
                  </div>
                </div>
              </div>
            ) : (
              /* ── AUDIO CALL VIEW ── */
              <div className="flex flex-col items-center w-full">
                {/* Audio stream element for voice call */}
                <audio ref={remoteVideoRef} autoPlay playsInline className="hidden" />
                {/* Top Status */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-medium text-emerald-400 mb-6">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Connected • Voice Call</span>
                </div>

                {/* Avatar with pulsing halo */}
                <div className="relative flex items-center justify-center my-4">
                  <div className="absolute h-28 w-28 rounded-full bg-emerald-500/20 blur-xl animate-pulse" />
                  <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-stone-800 p-1 ring-2 ring-emerald-400/40 shadow-xl overflow-hidden">
                    {displayAvatar ? (
                      <img
                        src={displayAvatar}
                        alt={displayName}
                        className="h-full w-full rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center rounded-full bg-stone-800 text-stone-200">
                        <UserRound size={36} strokeWidth={1.8} />
                      </div>
                    )}
                  </div>
                </div>

                {/* Contact Name */}
                <h3 className="text-xl font-semibold text-white mt-2 truncate max-w-full">
                  {displayName}
                </h3>

                {/* Simulated Audio Equalizer Bars */}
                <div className="flex items-center justify-center gap-1.5 h-6 my-4">
                  {[0.4, 0.8, 1, 0.6, 0.9, 0.5, 0.7].map((height, idx) => (
                    <motion.span
                      key={idx}
                      animate={{ scaleY: [0.3, height, 0.3] }}
                      transition={{
                        duration: 0.9,
                        repeat: Infinity,
                        delay: idx * 0.12,
                        ease: "easeInOut",
                      }}
                      className="w-1 rounded-full bg-emerald-400/80 h-full"
                    />
                  ))}
                </div>

                {/* Controls */}
                <div className="flex items-center gap-4 mt-4">
                  {/* Toggle Mic */}
                  <motion.button
                    type="button"
                    onClick={toggleMic}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    title={micOn ? "Mute Microphone" : "Unmute Microphone"}
                    className={`flex h-12 w-12 items-center justify-center rounded-full transition cursor-pointer ${
                      micOn
                        ? "bg-white/10 text-white hover:bg-white/20 border border-white/10"
                        : "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                    }`}
                  >
                    {micOn ? <Mic size={20} /> : <MicOff size={20} />}
                  </motion.button>

                  {/* End Call */}
                  <motion.button
                    type="button"
                    onClick={onEndCall}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    title="End Call"
                    className="flex h-14 w-14 items-center justify-center rounded-full bg-rose-600 text-white shadow-lg shadow-rose-600/40 hover:bg-rose-500 transition cursor-pointer"
                  >
                    <PhoneOff size={24} />
                  </motion.button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </AnimatePresence>
  );
};

export default CallScreen;
