import { Box } from "@chakra-ui/layout";
import ChatBox from "../components/miscellaneous/ChatBox";
import MyChats from "../components/miscellaneous/MyChats";
import SideDrawer from "../components/miscellaneous/SideDrawer";
import { useAuth } from "../context/auth";
import { useState } from "react";
import { useChat } from "../context/ChatProvider";
import VoiceCall from "../components/VoiceCall";
import VideoCall from "../components/VideoCall";
import IncomingVoiceCall from "../components/IncomingVoiceCall";
import IncomingVideoCall from "../components/IncomingVideoCall";

const Chatpage = () => {
  const { auth } = useAuth();
  const [fetchAgain, setFetchAgain] = useState(false);
  const { voiceCall, videoCall, incomingVideoCall, incomingVoiceCall } =
    useChat();

  return (
    <div style={{ width: "100%" }}>
      {voiceCall && (
        <Box h="full" w="full" overflow="hidden">
          <VoiceCall />
        </Box>
      )}
      {videoCall && (
        <Box h="full" w="full" overflow="hidden">
          <VideoCall />
        </Box>
      )}

      {incomingVideoCall && <IncomingVideoCall />}
      {incomingVoiceCall && <IncomingVoiceCall />}
      {auth && <SideDrawer />}
      <Box
        display="flex"
        justifyContent="space-between"
        w="100%"
        h="91.5vh"
        p="10px"
      >
        {auth && <MyChats fetchAgain={fetchAgain} />}
        {auth && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  );
};

export default Chatpage;
