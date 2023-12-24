import React, { useEffect, useState } from "react";
import { Box, Flex, Text, Image, Circle } from "@chakra-ui/react";
import { MdOutlineCallEnd } from "react-icons/md";
import { useAuth } from "../context/auth";
import { useChat } from "../context/ChatProvider";
import { socket } from "../components/SingleChat";
import { generateToken } from "../Api/serverAPI";

function Container({ data }) {
  const { auth, activeUsers } = useAuth();
  const {
    setVoiceCall,
    setVideoCall,
    setIncomingVoiceCall,
    setIncomingVideoCall,
  } = useChat();
  
  const [callAccepted, setCallAccepted] = useState(false);
  const [token, setToken] = useState(undefined);
  const [zgVar, setZgVar] = useState(undefined);
  const [localStream, setLocalStream] = useState(undefined);
  const [publishStream, setPublishStream] = useState(undefined);

  useEffect(() => {
    if (data.type === "out-going") {
      socket.on("accept-call", () => setCallAccepted(true));
    } else {
      setTimeout(() => {
        setCallAccepted(true);
      }, 1000);
    }
  }, [data]);

  useEffect(() => {
    const getToken = async () => {
      try {
        const {
          data: { token: returnToken },
        } = await generateToken(auth?._id);
        setToken(returnToken);
      } catch (error) {
        console.log(error);
      }
    };

    getToken();
  }, [callAccepted]);

  console.log(
    typeof process.env.REACT_APP_ZEGO_APP_ID,
    process.env.REACT_APP_ZEGO_SERVER_ID
  );

  useEffect(() => {
    const startCall = async () => {
      import("zego-express-engine-webrtc").then(
        async ({ ZegoExpressEngine }) => {
          const zg = new ZegoExpressEngine(
            +process.env.REACT_APP_ZEGO_APP_ID,
            process.env.REACT_APP_ZEGO_SERVER_ID
          );
          setZgVar(zg);
          zg.on(
            "roomStreamUpdate",
            async (roomID, updateType, streamList, extendedData) => {
              if (updateType === "ADD") {
                const rmVideo = document.getElementById("remote-video");
                const vd = document.createElement(
                  data?.callType === "video" ? "video" : "audio"
                );
                vd.id = streamList[0].streamID;
                vd.autoplay = true;
                vd.playsInline = true;
                vd.muted = false;

                if (rmVideo) {
                  rmVideo.appendChild(vd);
                }
                zg.startPlayingStream(streamList[0].streamID, {
                  audio: true,
                  video: true,
                }).then((stream) => (vd.srcObject = stream));
              } else if (
                updateType === "DELETE" &&
                zg &&
                localStream &&
                streamList[0].streamID
              ) {
                zg.destroyStream(localStream);
                zg.stopPublishingStream(streamList[0].streamID);
                zg.logoutRoom(data.roomId.toString());
                setVoiceCall(null);
                setVideoCall(null);
                setIncomingVoiceCall(null);
                setIncomingVideoCall(null);
              }
            }
          );

          await zg.loginRoom(
            data.roomId.toString(),
            token,
            { userID: auth?._id, userName: auth?.name },
            { userUpdate: true }
          );

          const localStream = await zg.createStream({
            camera: {
              audio: true,
              video: data?.callType === "video" ? true : false,
            },
          });
          const localVideo = document.getElementById("local-video");
          const videoElement = document.createElement(
            data?.callType === "video" ? "video" : "audio"
          );
          videoElement.id = "video-local-zego";
          videoElement.className = "h-28 w-32";
          videoElement.autoplay = true;
          videoElement.muted = false;
          videoElement.playsInline = true;

          localVideo.appendChild(videoElement);
          const td = document.getElementById("video-local-zego");
          td.srcObject = localStream;
          const streamID = "123" + Date.now(); // unique string
          setPublishStream(streamID);
          setLocalStream(localStream);
          zg.startPublishingStream(streamID, localStream);
        }
      );
    };
    if (token) {
      startCall();
    }
  }, [token]);

  const endCall = () => {
    const id = data?._id;
    const id1 = data.id;
    const sendUserSocket = activeUsers.find((user) => user?._id === id);
    const sendUserSocket1 = activeUsers.find((user) => user?._id === id1);

    if (zgVar && localStream && publishStream) {
      zgVar?.destroyStream(localStream);
      zgVar?.stopPublishingStream(publishStream);
      zgVar?.logoutRoom(data.roomId.toString());
    }

    if (data.callType === "audio") {
      socket.emit("reject-voice-call", {
        from: sendUserSocket?.socketId,
      });
      socket.emit("reject-voice-call", {
        from: sendUserSocket1?.socketId,
      });
    } else {
      socket.emit("reject-video-call", {
        from: sendUserSocket?.socketId,
      });
      socket.emit("reject-video-call", {
        from: sendUserSocket1?.socketId,
      });
    }

    setVoiceCall(null);
    setVideoCall(null);
    setIncomingVoiceCall(null);
    setIncomingVideoCall(null);
  };

  return (
    <Box
      border="1px solid"
      borderColor="rgba(134,150,160,0.15)"
      borderLeftWidth="border-l"
      width="full"
      bg="#0b141a"
      display="flex"
      flexDir="column"
      height="100vh"
      overflow="hidden"
      alignItems="center"
      justifyContent="center"
      color="white"
    >
      <Flex flexDir="column" gap={3} alignItems="center" textAlign="center">
        <Text fontSize={{ base: "3xl", md: "5xl" }}>{data?.name}</Text>
        <Text fontSize={{ base: "sm", md: "lg" }}>
          {callAccepted && data?.callType !== "video"
            ? "On going call"
            : "Calling"}
        </Text>
      </Flex>
      {!callAccepted && data.callType === "audio" && (
        <Box my={{ base: 6, md: 14 }}>
          <Image
            src={
              data?.profilePic ||
              "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
            }
            alt="avatar"
            height={{ base: 150, md: 300 }}
            width={{ base: 150, md: 300 }}
            borderRadius="full"
          />
        </Box>
      )}
      <Flex
        my={{ base: 4, md: 5 }}
        position="relative"
        id="remote-local-container"
        flexDir={{ base: "column", md: "row" }}
        alignItems="center"
      >
        {/* Remote video */}
        <Box
          position="relative"
          id="remote-video"
          flex={{ base: 1, md: 1 / 3 }}
        >
          {/* Your remote video content here */}
        </Box>
        {/* Local video */}
        <Box
          position="relative"
          id="local-video"
          ml={{ base: 0, md: 2 }}
          mt={{ base: 2, md: 0 }}
          flex={{ base: 1, md: 1 / 3 }}
        ></Box>
      </Flex>
      <Circle
        size="16"
        bg="red.600"
        display="flex"
        alignItems="center"
        justifyContent="center"
        borderRadius="full"
        cursor="pointer"
        onClick={endCall}
        mt={{ base: 4, md: 0 }}
      >
        <MdOutlineCallEnd cursor="pointer" size="3xl" />
      </Circle>
    </Box>
  );
}

export default Container;
