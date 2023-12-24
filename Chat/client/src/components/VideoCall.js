import React, { useEffect } from "react";
import { socket } from "../components/SingleChat";
import { useChat } from "../context/ChatProvider";
import { useAuth } from "../context/auth";
import Container from "./Container";

function VideoCall() {
  const { videoCall } = useChat();
  const { auth, activeUsers } = useAuth();

  useEffect(() => {
    if (videoCall.type === "out-going") {
      const sendUserSocket = activeUsers.find(
        (user) => user._id === videoCall._id
      );

      socket?.emit("outgoing-video-call", {
        to: sendUserSocket?.socketId,
        from: {
          id: auth?._id,
          profilePic: auth?.profilePic,
          name: auth?.name,
        },
        callType: videoCall.callType,
        roomId: videoCall.roomId,
      });
    }
  }, [videoCall]);
  return <Container data={videoCall} />;
}

export default VideoCall;
