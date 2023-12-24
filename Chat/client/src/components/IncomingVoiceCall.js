import React from "react";
import { useChat } from "../context/ChatProvider";
import { incommingCallSound, socket } from "../components/SingleChat";
import { Box, Button, Flex, Image } from "@chakra-ui/react";
import { useAuth } from "../context/auth";

function IncomingVoiceCall() {
  const {
    incomingVoiceCall,
    setIncomingVideoCall,
    setIncomingVoiceCall,
    setVoiceCall,
    setVideoCall,
  } = useChat();

  const { activeUsers } = useAuth();

  const acceptCall = () => {
    const sendUserSocket = activeUsers.find(
      (user) => user._id === incomingVoiceCall.id
    );
    setVoiceCall({ ...incomingVoiceCall, type: "in-coming" });
    socket?.emit("accept-incoming-call", { id: sendUserSocket.socketId });
    setIncomingVoiceCall(null);
  };

  const rejectCall = () => {
    const sendUserSocket = activeUsers.find(
      (user) => user._id === incomingVoiceCall.id
    );

    socket?.emit("reject-voice-call", { from: sendUserSocket.socketId });
    setVoiceCall(null);
    setVideoCall(null);
    setIncomingVideoCall(null);
    setIncomingVoiceCall(null);
  };

  return (
    <Box
      h="24"
      w="80"
      position="fixed"
      bottom="8"
      mb="0"
      right="6"
      zIndex="50"
      rounded="sm"
      display="flex"
      gap="5"
      alignItems="center"
      justifyContent="start"
      bg="#0b141a"
      color="white"
      boxShadow="2xl"
      border="2px"
      borderColor="green.500"
      py="14"
      p={4}
    >
      <Image
        src={
          incomingVoiceCall?.profilePic ||
          "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
        }
        alt="avatar"
        width={70}
        height={70}
        rounded="full"
      />

      <Flex flexDir="column" ml={2}>
        {incomingVoiceCall?.name}
        <Box fontSize="xs">Incoming Voice Call</Box>
      </Flex>

      <Flex gap={2} mt={2}>
        <Button
          bg="red.500"
          p={1}
          px={3}
          rounded="full"
          fontSize="sm"
          onClick={rejectCall}
        >
          Reject
        </Button>
        <Button
          bg="green.500"
          p={1}
          px={3}
          rounded="full"
          fontSize="sm"
          onClick={acceptCall}
        >
          Accept
        </Button>
      </Flex>
    </Box>
  );
}

export default IncomingVoiceCall;
