import {
  Box,
  Button,
  Checkbox,
  FormControl,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import {
  addUsersToBlockedList,
  searchUsers,
  searchBlockedListUsers,
  removeUsersFromBlockedList,
  getChats,
} from "../../Api/serverAPI";
import UserListItem from "../UserAvatar/UserListItem";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";
import { BlockIcon } from "../../icons/icons";
import { useChat } from "../../context/ChatProvider";

const SettingsModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [showUsersToBlock, setShowUsersToBlock] = useState(false);
  const [showUsersToUnblock, setShowUsersToUnblock] = useState(false);
  const [search, setSearch] = useState("");
  const [searchBlockedUsers, setSearchBlockedUsers] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchResultsBlockedUsers, setSearchResultsBlockedUsers] = useState(
    []
  );
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedUsersToUnblock, setSelectedUsersToUnblock] = useState([]);
  const [loading, setLoading] = useState(false);

  const showUsersToBlockHandler = () => {
    setShowUsersToBlock(!showUsersToBlock);
  };

  const showUsersToUnblockHandler = () => {
    setShowUsersToUnblock(!showUsersToUnblock);
  };

  const toast = useToast();
  const { setChats, checked, setChecked, isSoundEnabled, setIsSoundEnabled } =
    useChat();

  const fetchChats = async () => {
    try {
      setLoading(true);
      const { data } = await getChats();
      setChats(data);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      setLoading(false);
    }
  };

  const addUserToBlock = (userToBlock) => {
    if (selectedUsers.some((user) => user._id === userToBlock._id)) {
      toast({
        title: "User already addded",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      return;
    }

    setSelectedUsers([...selectedUsers, userToBlock]);
  };

  const addUserToUnblock = (userToUnblock) => {
    if (selectedUsersToUnblock.some((user) => user._id === userToUnblock._id)) {
      toast({
        title: "User already added",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      return;
    }

    setSelectedUsersToUnblock([...selectedUsersToUnblock, userToUnblock]);
  };

  const handleDelete = (userToDelete) => {
    setSelectedUsers(
      selectedUsers.filter(
        (selectedUser) => selectedUser._id !== userToDelete._id
      )
    );
  };

  const handleDeleteUsersFromBlockedList = (userToDelete) => {
    setSelectedUsersToUnblock(
      selectedUsersToUnblock.filter(
        (selectedUser) => selectedUser._id !== userToDelete._id
      )
    );
  };

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }

    try {
      setLoading(true);
      const { data } = await searchUsers(query);
      setLoading(false);
      setSearchResults(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      setLoading(false);
    }
  };

  const handleSearchBlockedUsers = async (query) => {
    setSearchBlockedUsers(query);
    if (!query) {
      return;
    }

    try {
      setLoading(true);
      const { data } = await searchBlockedListUsers(query);
      setLoading(false);
      setSearchResultsBlockedUsers(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      if (selectedUsers.length === 0) {
        onClose();
        return;
      }

      const { data } = await addUsersToBlockedList(selectedUsers);
      toast({
        title: data.message,
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      setSearchResults([]);
      setSelectedUsers([]);
      setSelectedUsersToUnblock([]);
      setSearchResultsBlockedUsers([]);
      setShowUsersToBlock(false);
      setShowUsersToUnblock(false);
      fetchChats();
      onClose();
    } catch (error) {
      toast({
        title: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const handleSubmitUsersToUnblock = async () => {
    try {
      if (selectedUsersToUnblock.length === 0) {
        onClose();
        return;
      }

      const { data } = await removeUsersFromBlockedList(selectedUsersToUnblock);
      toast({
        title: data.message,
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      setSearchResults([]);
      setSelectedUsers([]);
      setSelectedUsersToUnblock([]);
      setSearchResultsBlockedUsers([]);
      setShowUsersToBlock(false);
      setShowUsersToUnblock(false);
      fetchChats();
      onClose();
    } catch (error) {
      toast({
        title: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const fetchLast20Conversation = async (e) => {
    try {
      setChecked(e.target.checked);
      localStorage.setItem("checked", JSON.stringify(e.target.checked));
      const { data } = await getChats(e.target.checked);
      setChats(data);
    } catch (error) {
      toast({
        title: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    setChecked(JSON.parse(localStorage.getItem("checked")));
    setIsSoundEnabled(JSON.parse(localStorage.getItem("isSoundEnabled")));
  }, []);

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          setSearchResults([]);
          setSelectedUsers([]);
          setSelectedUsersToUnblock([]);
          setSearchResultsBlockedUsers([]);
          setShowUsersToBlock(false);
          setShowUsersToUnblock(false);
          onClose();
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >
            Settings
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" alignItems="center">
            <VStack spacing={4}>
              <Button
                leftIcon={<BlockIcon />}
                onClick={showUsersToBlockHandler}
              >
                Block Users
              </Button>
              <Button
                leftIcon={<BlockIcon />}
                onClick={showUsersToUnblockHandler}
              >
                Unblock Users
              </Button>

              <Checkbox onChange={fetchLast20Conversation} isChecked={checked}>
                Show the last 20 conversations
              </Checkbox>

              <Checkbox
                onChange={(e) => {
                  setIsSoundEnabled(!isSoundEnabled);

                  localStorage.setItem(
                    "isSoundEnabled",
                    JSON.stringify(e.target.checked)
                  );
                }}
                isChecked={isSoundEnabled}
              >
                Turn on/off messages received/sent sounds
              </Checkbox>
            </VStack>
            {showUsersToBlock && (
              <>
                <FormControl>
                  <Input
                    placeholder="Search users to block"
                    mt={5}
                    mb={5}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </FormControl>
                <Box w="100%" display="flex" flexWrap="wrap">
                  {selectedUsers.map((u) => (
                    <UserBadgeItem
                      key={u._id}
                      user={u}
                      handleFunction={() => handleDelete(u)}
                    />
                  ))}
                </Box>
                {loading ? (
                  <Spinner size="lg" />
                ) : (
                  searchResults?.map((user) => (
                    <UserListItem
                      key={user._id}
                      user={user}
                      handleFunction={() => addUserToBlock(user)}
                    />
                  ))
                )}
                <Button
                  colorScheme="green"
                  disabled={selectedUsers.length === 0}
                  onClick={handleSubmit}
                  icon
                >
                  Save
                </Button>
              </>
            )}
            {showUsersToUnblock && (
              <>
                <FormControl>
                  <Input
                    placeholder="Search users to unblock"
                    mt={5}
                    mb={5}
                    onChange={(e) => handleSearchBlockedUsers(e.target.value)}
                  />
                </FormControl>
                <Box w="100%" display="flex" flexWrap="wrap">
                  {selectedUsersToUnblock.map((u) => (
                    <UserBadgeItem
                      key={u._id}
                      user={u}
                      handleFunction={() => handleDeleteUsersFromBlockedList(u)}
                    />
                  ))}
                </Box>
                {loading ? (
                  <Spinner size="lg" />
                ) : (
                  searchResultsBlockedUsers?.map((user) => (
                    <UserListItem
                      key={user._id}
                      user={user}
                      handleFunction={() => addUserToUnblock(user)}
                    />
                  ))
                )}
                <Button
                  colorScheme="green"
                  disabled={selectedUsers.length === 0}
                  onClick={handleSubmitUsersToUnblock}
                  icon
                >
                  Save
                </Button>
              </>
            )}
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              onClick={() => {
                setSearchResults([]);
                setSelectedUsers([]);
                setSelectedUsersToUnblock([]);
                setSearchResultsBlockedUsers([]);
                setShowUsersToBlock(false);
                setShowUsersToUnblock(false);
                onClose();
              }}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default SettingsModal;
