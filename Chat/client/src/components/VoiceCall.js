import React, { useEffect } from "react";
import { socket } from "../components/SingleChat";
import { useChat } from "../context/ChatProvider";
import { useAuth } from "../context/auth";
import Container from "./Container";

function VoiceCall() {
  const { voiceCall } = useChat();
  const { auth, activeUsers } = useAuth();

  useEffect(() => {
    if (voiceCall.type === "out-going") {
      const sendUserSocket = activeUsers.find(
        (user) => user._id === voiceCall._id
      );

      socket?.emit("outgoing-voice-call", {
        to: sendUserSocket?.socketId,
        from: {
          id: auth?._id,
          profilePic: auth?.profilePic,
          name: auth?.name,
        },
        callType: voiceCall.callType,
        roomId: voiceCall.roomId,
      });
    }
  }, [voiceCall]);
  return <Container data={voiceCall} />;
}

export default VoiceCall;
