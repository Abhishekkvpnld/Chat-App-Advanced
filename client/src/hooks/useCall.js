import { useEffect, useRef, useState, useCallback } from "react";
import SimplePeer from "simple-peer/simplepeer.min.js";
import toast from "react-hot-toast";

// ─── STUN Server Config ─────────────────────────────────────────────
const ICE_SERVERS = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
    { urls: "stun:stun2.l.google.com:19302" },
  ],
};

export const useCall = (socket) => {
  const [callState, setCallState] = useState({
    isReceivingCall: false,
    isCalling: false,
    callActive: false,
    callType: null, // "audio" | "video"
    caller: null, // { id, name, avatar }
    callerSignal: null,
  });

  const myVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerRef = useRef(null);
  const myStreamRef = useRef(null);
  const remoteStreamRef = useRef(null);

  // ── Sync video elements when call becomes active ───────────────────────────
  useEffect(() => {
    if (callState.callActive) {
      if (myVideoRef.current && myStreamRef.current) {
        myVideoRef.current.srcObject = myStreamRef.current;
      }
      if (remoteVideoRef.current && remoteStreamRef.current) {
        remoteVideoRef.current.srcObject = remoteStreamRef.current;
      }
    }
  }, [callState.callActive]);

  // ── Get local media stream ──────────────────────────────────────────────────
  const getMedia = async (callType) => {
    try {
      const constraints = {
        audio: true,
        video: callType === "video",
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      myStreamRef.current = stream;
      if (myVideoRef.current) {
        myVideoRef.current.srcObject = stream;
      }
      return stream;
    } catch (err) {
      console.error("Error accessing camera/microphone:", err);
      toast.error("Could not access camera/microphone. Please allow permissions.");
      throw err;
    }
  };

  // ── 📞 CALL USER (Initiator / Caller side) ─────────────────────────────────
  const callUser = useCallback(
    async (targetUserId, callType, callerInfo) => {
      try {
        if (!targetUserId) {
          toast.error("User ID not found");
          return;
        }

        const stream = await getMedia(callType);
        setCallState((prev) => ({ ...prev, isCalling: true, callType }));

        const peer = new SimplePeer({
          initiator: true,
          trickle: false,
          stream,
          config: ICE_SERVERS,
        });

        peer.on("signal", (signal) => {
          socket.emit("CALL_USER", {
            to: targetUserId,
            signal,
            callType,
            callerInfo,
          });
        });

        peer.on("stream", (remoteStream) => {
          remoteStreamRef.current = remoteStream;
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = remoteStream;
          }
        });

        peer.on("error", (err) => {
          console.error("Peer connection error:", err);
          toast.error("Call connection error");
          endCall(targetUserId);
        });

        peerRef.current = peer;
      } catch (err) {
        console.error("Failed to initiate call:", err);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [socket]
  );

  // ── ✅ ANSWER CALL (Receiver / Callee side) ────────────────────────────────
  const answerCall = useCallback(async () => {
    try {
      const stream = await getMedia(callState.callType);
      setCallState((prev) => ({
        ...prev,
        isReceivingCall: false,
        callActive: true,
      }));

      const peer = new SimplePeer({
        initiator: false,
        trickle: false,
        stream,
        config: ICE_SERVERS,
      });

      peer.on("signal", (signal) => {
        socket.emit("CALL_ACCEPTED", {
          to: callState.caller?.id,
          signal,
        });
      });

      peer.on("stream", (remoteStream) => {
        remoteStreamRef.current = remoteStream;
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream;
        }
      });

      peer.on("error", (err) => {
        console.error("Peer connection error:", err);
        toast.error("Call connection error");
        endCall(callState.caller?.id);
      });

      peer.signal(callState.callerSignal);
      peerRef.current = peer;
    } catch (err) {
      console.error("Failed to answer call:", err);
    }
  }, [socket, callState]);

  // ── 📵 END CALL ────────────────────────────────────────────────────────────
  const endCall = useCallback(
    (targetId) => {
      if (targetId) {
        socket?.emit("CALL_ENDED", { to: targetId });
      }
      if (peerRef.current) {
        try {
          peerRef.current.destroy();
        } catch (_) {}
        peerRef.current = null;
      }
      if (myStreamRef.current) {
        myStreamRef.current.getTracks().forEach((track) => track.stop());
        myStreamRef.current = null;
      }
      remoteStreamRef.current = null;

      setCallState({
        isReceivingCall: false,
        isCalling: false,
        callActive: false,
        callType: null,
        caller: null,
        callerSignal: null,
      });
    },
    [socket]
  );

  // ── 🎧 Listen for call signaling events ─────────────────────────────────────
  useEffect(() => {
    if (!socket) return;

    const handleIncomingCall = ({ from, signal, callType, callerInfo }) => {
      setCallState({
        isReceivingCall: true,
        isCalling: false,
        callActive: false,
        callType,
        caller: { id: from, ...callerInfo },
        callerSignal: signal,
      });
    };

    const handleCallAccepted = ({ signal }) => {
      if (peerRef.current) {
        peerRef.current.signal(signal);
      }
      setCallState((prev) => ({
        ...prev,
        isCalling: false,
        callActive: true,
      }));
    };

    const handleCallRejected = () => {
      toast.error("Call was declined or user is offline");
      endCall();
    };

    const handleCallEnded = () => {
      endCall();
    };

    socket.on("INCOMING_CALL", handleIncomingCall);
    socket.on("CALL_ACCEPTED", handleCallAccepted);
    socket.on("CALL_REJECTED", handleCallRejected);
    socket.on("CALL_ENDED", handleCallEnded);

    return () => {
      socket.off("INCOMING_CALL", handleIncomingCall);
      socket.off("CALL_ACCEPTED", handleCallAccepted);
      socket.off("CALL_REJECTED", handleCallRejected);
      socket.off("CALL_ENDED", handleCallEnded);
    };
  }, [socket, endCall]);

  return {
    callState,
    callUser,
    answerCall,
    endCall,
    myVideoRef,
    remoteVideoRef,
  };
};
