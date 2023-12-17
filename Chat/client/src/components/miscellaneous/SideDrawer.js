import {
  Box,
  Button,
  Tooltip,
  Text,
  Menu,
  MenuButton,
  MenuList,
  Avatar,
  MenuItem,
  MenuDivider,
  useToast,
  Drawer,
  useDisclosure,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Input,
  Spinner,
  Flex,
} from "@chakra-ui/react";
import { BellIcon, ChevronDownIcon, SettingsIcon } from "@chakra-ui/icons";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/auth";
import { useNavigate } from "react-router-dom";
import ProfileModal from "./ProfileModal";
import {
  createChat,
  getAllNotifications,
  removeNotificationApiCall,
  searchUsers,
} from "../../Api/serverAPI";
import ChatLoading from "../ChatLoading";
import UserListItem from "../UserAvatar/UserListItem";
import { useChat } from "../../context/ChatProvider";
import { getSender } from "../../config/ChatLogics";
import NotificationBadge, { Effect } from "react-notification-badge";
import SettingsModal from "./SettingsModal";
import { LogoutIcon, ProfileIcon } from "../../icons/icons";
import WhatsAppLogo from "../../WhatsApp.svg.png";

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { auth, setAuth } = useAuth();
  const { setSelectedChat, chats, setChats, notification, setNotification } =
    useChat();
  const navigate = useNavigate();
  const toast = useToast();

  const logout = () => {
    setAuth(null);
    localStorage.removeItem("userInfo");
    navigate("/");
    toast({
      title: "User logged out successfully",
      status: "success",
      duration: 5000,
      isClosable: true,
      position: "bottom-left",
    });
  };

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please enter something to search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      return;
    }

    try {
      setLoading(true);

      const { data } = await searchUsers(search);
      setLoading(false);
      setSearchResults(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const { data } = await createChat(userId);

      if (!chats?.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error fetching the chat!",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const fetchNotifications = async () => {
    try {
      const { data } = await getAllNotifications();
      setNotification(data);
    } catch (error) {
      toast({
        title: "Error fetching Notifications!",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const removeNotification = async (notificationId) => {
    try {
      const { data } = await removeNotificationApiCall(notificationId);
      toast({
        title: data.message,
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      fetchNotifications();
    } catch (error) {
      setNotification(
        notification.filter((noti) => noti._id !== notificationId)
      );
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px"
      >
        <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            <i class="fas fa-search"></i>
            <Text display={{ base: "none", md: "flex" }} px="4">
              Search User
            </Text>
          </Button>
        </Tooltip>

        <Flex alignItems="center" justifyContent="center" spacing={3}>
          <Text fontSize="2xl" fontFamily="Work sans">
            WhatsApp
          </Text>
          <img
            src={WhatsAppLogo}
            width="32px"
            height="32px"
            alt="WhatsApp Logo"
          />
        </Flex>

        <div>
          <Menu>
            <MenuButton P={1}>
              <NotificationBadge
                count={notification.length}
                effect={Effect.SCALE}
              />
              <BellIcon fontSize="2xl" m={1} />
            </MenuButton>
            <MenuList pl={2}>
              {!notification?.length && "No New Messages"}
              {notification &&
                notification?.map((noti) => (
                  <MenuItem
                    key={noti?._id}
                    onClick={() => {
                      setSelectedChat(noti?.chat);
                      removeNotification(noti?._id);
                    }}
                  >
                    {noti?.chat?.isGroupChat
                      ? `New Message in ${noti?.chat?.chatName}`
                      : `New Message from ${getSender(
                          auth,
                          noti?.chat?.users
                        )}`}
                  </MenuItem>
                ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar
                size="sm"
                cursor="pointer"
                name={auth?.name}
                src={auth?.profilePic}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={auth}>
                <MenuItem>
                  <ProfileIcon marginRight={3} color="black" boxSize="32px" />
                  My Profile
                </MenuItem>
              </ProfileModal>
              <MenuDivider />
              <SettingsModal>
                <MenuItem>
                  <SettingsIcon marginRight={3} color="black" boxSize="32px" />
                  Settings
                </MenuItem>
              </SettingsModal>

              <MenuDivider />
              <MenuItem onClick={logout}>
                <LogoutIcon marginRight={3} color="black" boxSize="32px" />
                Logout
              </MenuItem>
              <MenuDivider />
            </MenuList>
          </Menu>
        </div>
      </Box>

      <Drawer
        placement="left"
        onClose={() => {
          setSearchResults([]);
          setSearch("");
          onClose();
        }}
        isOpen={isOpen}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Box display="flex" paddingBottom={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button
                onClick={handleSearch}
                backgroundColor="#46c556"
                color="white"
              >
                Go
              </Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResults?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" display="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
