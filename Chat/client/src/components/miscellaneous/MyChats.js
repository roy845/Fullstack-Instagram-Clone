import React, { useEffect, useState } from "react";
import { useChat } from "../../context/ChatProvider";
import {
  Box,
  Button,
  Stack,
  useToast,
  Text,
  Input,
  InputGroup,
  InputLeftElement,
  Spinner,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { getChats } from "../../Api/serverAPI";
import { AddIcon } from "@chakra-ui/icons";
import ChatLoading from "../ChatLoading";
import { getSender } from "../../config/ChatLogics";
import GroupChatModal from "./GroupChatModal";

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const [loading, setLoading] = useState(false);
  const { selectedChat, setSelectedChat, chats, setChats, checked } = useChat();
  const [searchTerm, setSearchTerm] = useState("");
  const toast = useToast();

  const fetchChats = async () => {
    try {
      setLoading(true);
      const { data } = await getChats(checked);
      setChats(data);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain, checked]);

  const filteredChats = chats?.filter(
    (chat) =>
      chat?.chatName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getSender(loggedUser, chat?.users)
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        <GroupChatModal>
          <Button
            d="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>
      <InputGroup>
        <InputLeftElement
          pointerEvents="none"
          children={<SearchIcon color="gray.300" />}
        />
        <Input
          variant="filled"
          bg="#E0E0E0"
          type="text"
          placeholder="Search chats"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </InputGroup>
      {loading ? <Spinner /> : filteredChats?.length + " chats"}
      <Box
        d="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats && !loading ? (
          <Stack height="calc(100vh - 60px)" overflowY="auto">
            {filteredChats?.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat?._id}
              >
                <Text>
                  {!chat?.isGroupChat
                    ? getSender(loggedUser, chat?.users)
                    : chat?.chatName}
                </Text>
                {chat?.latestMessage && (
                  <Text fontSize="xs">
                    <b>{chat?.latestMessage?.sender?.name} : </b>
                    {chat?.latestMessage?.content?.length > 50
                      ? chat?.latestMessage?.content?.substring(0, 51) + "..."
                      : chat?.latestMessage?.content}
                  </Text>
                )}
              </Box>
            ))}
          </Stack>
        ) : (
          <>
            <Spinner
              size="xl"
              w={20}
              h={20}
              alignSelf="center"
              margin="auto"
              display="flex"
              mt={5}
            />
            <Text textAlign="center">Loading chats</Text>
          </>
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
