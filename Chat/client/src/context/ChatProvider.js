import { useContext, createContext, useState } from "react";

export const ChatContext = createContext({});

const ChatProvider = ({ children }) => {
  const [selectedChat, setSelectedChat] = useState();
  const [chats, setChats] = useState([]);
  const [notification, setNotification] = useState([]);
  const [checked, setChecked] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [videoCall, setVideoCall] = useState(null);
  const [voiceCall, setVoiceCall] = useState(null);
  const [incomingVoiceCall, setIncomingVoiceCall] = useState(null);
  const [incomingVideoCall, setIncomingVideoCall] = useState(null);

  return (
    <ChatContext.Provider
      value={{
        selectedChat,
        setSelectedChat,
        chats,
        setChats,
        notification,
        setNotification,
        checked,
        setChecked,
        isSoundEnabled,
        setIsSoundEnabled,
        videoCall,
        setVideoCall,
        voiceCall,
        setVoiceCall,
        incomingVoiceCall,
        setIncomingVoiceCall,
        incomingVideoCall,
        setIncomingVideoCall,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

const useChat = () => useContext(ChatContext);

export { useChat, ChatProvider };
