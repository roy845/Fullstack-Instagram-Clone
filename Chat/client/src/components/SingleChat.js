import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/auth";
import { useChat } from "../context/ChatProvider";
// import { ClickOutsideWrapper } from "react-click-outside";
import {
  Box,
  Button,
  Flex,
  FormControl,
  IconButton,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Stack,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { ArrowBackIcon, PhoneIcon, SearchIcon } from "@chakra-ui/icons";
import { getSender, getSenderFull } from "../config/ChatLogics";
import ProfileModal from "./miscellaneous/ProfileModal";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import {
  createNotification,
  getAllMessages,
  removeUsersFromBlockedList,
  sendNewMessage,
} from "../Api/serverAPI";
import "./styles/styles.css";
import ScrollableChat from "./ScrollableChat";
import io from "socket.io-client";
import Lottie from "react-lottie";
import animationData from "../animations/typing.json";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { SendIcon } from "../icons/icons";
import { AttachmentIcon } from "@chakra-ui/icons";
import { FaVideo, FaCamera, FaPlus, FaSmile, FaPhone } from "react-icons/fa";
import ChatProfileModal from "./miscellaneous/ChatProfileModal";
import { Icon } from "@chakra-ui/react";
import WebcamCapture from "./WebcamCapture";
import WebcamStreamCapture from "./WebcamStreamCapture";

const ENDPOINT = "http://localhost:8800";
let socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { auth, setActiveUsers, activeUsers } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setisTyping] = useState(false);
  const {
    selectedChat,
    setSelectedChat,
    notification,
    setNotification,
    isSoundEnabled,
  } = useChat();
  const [open, setOpen] = useState(false);

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isPressedSend, setIsPressedSend] = useState(false);
  const [file, setFile] = useState(null);
  const [isInputOpenChat, setIsInputOpenChat] = useState(false);
  const [isInputOpenGroupChat, setIsInputOpenGroupChat] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isWebCamOpen, setIsWebCamOpen] = useState(false);
  const [isWebCamStreamOpen, setIsWebCamStreamOpen] = useState(false);

  const emojiPickerRef = useRef(null);

  const toggleChatInput = () => {
    setIsInputOpenChat(!isInputOpenChat);
  };

  const toggleGroupChatInput = () => {
    setIsInputOpenGroupChat(!isInputOpenGroupChat);
  };

  const messageSentSound = new Audio(
    "/audio/Whatsapp Message - Sent - Sound.mp3"
  );
  const messageReceivedSound = new Audio("/audio/message_received.mp3");

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const addEmoji = (e) => {
    let emoji = e.native;
    setNewMessage((prevMessage) => prevMessage + emoji);
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", auth);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("getUsers", (users) => {
      localStorage.setItem("activeUsers", JSON.stringify(users));
      setActiveUsers(JSON.parse(localStorage.getItem("activeUsers")));
    });
    socket.on("typing", () => setisTyping(true));
    socket.on("stop typing", () => setisTyping(false));

    return () => {
      socket.disconnect();
      socket.on("getUsers", (users) => {
        localStorage.setItem("activeUsers", JSON.stringify(users));
        setActiveUsers(JSON.parse(localStorage.getItem("activeUsers")));
      });
    };
  }, []);

  const fetchMessages = async () => {
    if (!selectedChat) {
      return;
    }

    try {
      setLoading(true);
      const { data } = await getAllMessages(selectedChat._id);
      setMessages(data);
      setLoading(false);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to get Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const sendMessage = async (e) => {
    if ((e?.key === "Enter" && newMessage) || isPressedSend) {
      socket.emit("stop typing", selectedChat._id);
      const formData = new FormData();
      formData.append("sender", auth._id);
      formData.append("content", newMessage);
      formData.append("chatId", selectedChat._id);

      if (file) {
        formData.append("file", file);
      }
      try {
        setNewMessage("");
        setFile(null);
        const { data } = await sendNewMessage(formData);
        socket.emit("new message", data);
        setMessages([...messages, data]);
        if (isSoundEnabled) {
          messageSentSound.play();
        }
      } catch (error) {
        console.log(error);
        if (error?.response.status === 403) {
          toast({
            title: error?.response?.data,
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "top",
          });
          setOpen(true);
        }
        if (error?.response.status === 401) {
          toast({
            title: error?.response?.data,
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "top",
          });
        }
      }
      setIsPressedSend(false);
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    //Typing Indicator Logic
    if (!socketConnected) {
      return;
    }

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }

    let lastTypingTime = new Date().getTime();
    let timerLength = 3000;
    setTimeout(() => {
      let timeNow = new Date().getTime();
      let timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  const createNotificationFunc = async (newMessageReceived) => {
    try {
      const { data } = await createNotification({
        chat: newMessageReceived.chat._id,
        content: newMessageReceived.content,
        sender: newMessageReceived.sender._id,
      });
      return data;
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to create Notification",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  useEffect(() => {
    const handleMessageReceived = (newMessageReceived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        // give notification
        if (!notification.includes(newMessageReceived)) {
          createNotificationFunc(newMessageReceived).then((res) => {
            setNotification([res, ...notification]);
          });
          if (isSoundEnabled) {
            messageReceivedSound.play();
          }

          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageReceived]);
        messageReceivedSound.play();
      }
    };

    socket.on("message received", handleMessageReceived);

    // Cleanup the event listener on component unmount
    return () => {
      socket.off("message received", handleMessageReceived);
    };
  }, [selectedChatCompare, notification, messages, fetchAgain]);

  const removeUserFromBlock = async () => {
    const userIdToUnblock = selectedChat?.users?.find((user) =>
      user?.blockedUsers?.includes(auth?._id)
    )?._id;

    try {
      const { data } = await removeUsersFromBlockedList([userIdToUnblock]);
      toast({
        title: data.message,
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
      });

      setOpen(false);
    } catch (error) {
      toast({
        title: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      setNewMessage((prev) => `${prev} ${selectedFile.name}`);
      setFile(selectedFile);
    }
  };

  const onCapture = (pngFile) => {
    if (pngFile) {
      setNewMessage((prev) => `${prev} ${pngFile.name}`);
      setFile(pngFile);
    }
  };

  const onCaptureVideo = (mp4File) => {
    if (mp4File) {
      setNewMessage((prev) => `${prev} ${mp4File.name}`);
      setFile(mp4File);
    }
  };

  const searchMessages = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (event.target.id !== "emoji-open") {
        if (
          emojiPickerRef.current &&
          !emojiPickerRef.current.contains(event.target)
        ) {
          setShowEmojiPicker(false);
        }
      }
    };
    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(auth, selectedChat.users)}
                <br />

                {activeUsers?.find(
                  (user) =>
                    user._id === getSenderFull(auth, selectedChat.users)?._id
                ) ? (
                  <div className="status">
                    <span className="indicator online"></span>
                    Online
                  </div>
                ) : (
                  <div className="status">
                    <span className="indicator offline"></span>
                    Offline
                  </div>
                )}
                {isInputOpenChat ? (
                  <Stack direction="row">
                    <Tooltip label="Make Voice Call">
                      <IconButton icon={<PhoneIcon />} onClick={() => {}} />
                    </Tooltip>
                    <Tooltip label="Make Video Call">
                      <IconButton icon={<FaVideo />} onClick={() => {}} />
                    </Tooltip>
                    <Tooltip label="Search messages">
                      <IconButton
                        icon={<SearchIcon />}
                        onClick={toggleChatInput}
                      />
                    </Tooltip>
                    <Input
                      style={{ width: "auto" }}
                      type="search"
                      onBlur={toggleChatInput}
                      placeholder="Search Messages"
                      onChange={(e) => searchMessages(e)}
                    />
                  </Stack>
                ) : (
                  <Stack direction="row">
                    <Tooltip label="Make Voice Call">
                      <IconButton icon={<PhoneIcon />} onClick={() => {}} />
                    </Tooltip>
                    <Tooltip label="Make Video Call">
                      <IconButton icon={<FaVideo />} onClick={() => {}} />
                    </Tooltip>
                    <Tooltip label="Search messages">
                      <IconButton
                        icon={<SearchIcon />}
                        onClick={toggleChatInput}
                      />
                    </Tooltip>
                  </Stack>
                )}
                <ChatProfileModal
                  user={getSenderFull(auth, selectedChat.users)}
                />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <div style={{ fontSize: 20 }}>
                  {selectedChat?.users.length <= 4
                    ? selectedChat?.users?.map((user) => user.name).join(", ")
                    : selectedChat?.users
                        ?.map((user) => user.name)
                        .splice(0, 4)
                        .join(", ") + "...."}
                </div>
                {isInputOpenGroupChat ? (
                  <>
                    <IconButton
                      icon={<SearchIcon />}
                      onClick={toggleGroupChatInput}
                    />
                    <Input
                      style={{ width: "auto" }}
                      type="search"
                      onBlur={toggleGroupChatInput}
                      placeholder="Search Messages"
                      onChange={(e) => searchMessages(e)}
                    />
                  </>
                ) : (
                  <IconButton
                    icon={<SearchIcon />}
                    onClick={toggleGroupChatInput}
                  />
                )}
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              </>
            )}
          </Text>

          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
            backgroundImage={
              "https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png"
            }
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} searchQuery={searchQuery} />
              </div>
            )}
            {showEmojiPicker && (
              <div ref={emojiPickerRef}>
                <Picker
                  data={data}
                  onEmojiSelect={(e) => {
                    addEmoji(e);
                  }}
                />
              </div>
            )}
            <FormControl
              onKeyDown={sendMessage}
              id="first-name"
              isRequired
              mt={3}
            >
              {isTyping ? (
                <div>
                  <Lottie
                    options={defaultOptions}
                    width={70}
                    style={{ marginBottom: 15, marginLeft: 0 }}
                  />
                </div>
              ) : (
                <></>
              )}

              <Flex>
                <Menu>
                  <Tooltip label="Attach">
                    <MenuButton
                      mr={2}
                      as={IconButton}
                      icon={<Icon as={FaPlus} />}
                    />
                  </Tooltip>

                  <MenuList>
                    <MenuItem>
                      <Input
                        type="file"
                        id="file-input"
                        style={{ display: "none" }}
                        onChange={handleFileChange}
                      />
                      <label htmlFor="file-input">
                        <IconButton
                          style={{ cursor: "pointer" }}
                          as="span"
                          icon={
                            <AttachmentIcon style={{ cursor: "pointer" }} />
                          }
                        />
                      </label>

                      <Text marginLeft="2">Attach File</Text>
                    </MenuItem>
                    <MenuItem>
                      <IconButton
                        id="emoji-open"
                        icon={<Icon as={FaSmile} />}
                        onClick={() => setShowEmojiPicker((prev) => !prev)}
                      />

                      <Text marginLeft="2">Insert Emoji</Text>
                    </MenuItem>
                    <MenuItem>
                      <IconButton
                        icon={<Icon as={FaVideo} />}
                        onClick={() => setIsWebCamStreamOpen(true)}
                      />
                      <Text marginLeft="2">Send Video</Text>
                    </MenuItem>
                    <MenuItem>
                      <IconButton
                        onClick={() => setIsWebCamOpen(true)}
                        icon={<Icon as={FaCamera} />}
                      />
                      <Text marginLeft="2">Take Photo</Text>
                    </MenuItem>
                  </MenuList>
                </Menu>

                <Input
                  variant="filled"
                  bg="#ffffff"
                  placeholder="Enter a message.."
                  value={newMessage}
                  onChange={typingHandler}
                  flex="1"
                />

                {newMessage && (
                  <Tooltip label="Send Message">
                    <Button
                      ml={2}
                      onClick={() => {
                        setIsPressedSend(true);
                        sendMessage();
                      }}
                    >
                      <SendIcon />
                    </Button>
                  </Tooltip>
                )}
              </Flex>
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          background="#f8f9fa"
          padding="30px 0"
          textAlign="center"
          height="100%"
        >
          <Box padding="0 200px">
            <img
              marginTop="100"
              display="block"
              width="100%"
              height="100%"
              objectFit="contain"
              src={
                "https://i.gadgets360cdn.com/large/whatsapp_multi_device_support_update_image_1636207150180.jpg"
              }
            />
            <Text
              fontSize="32px"
              fontFamily="inherit"
              fontWeight="300"
              color="#41525d"
              marginTop="25px 0 10px 0"
            >
              WhatsApp Web
            </Text>
            <Text
              fontSize="14px"
              color="#667781"
              fontWeight="400"
              fontFamily="inherit"
            >
              Now send and receive messages without keeping your phone online.
            </Text>
            <Text
              fontSize="14px"
              color="#667781"
              fontWeight="400"
              fontFamily="inherit"
            >
              Use WhatsApp on up to 4 linked devices and 1 phone at the same
              time.
            </Text>
          </Box>
        </Box>
      )}

      <Modal isOpen={open} onClose={() => setOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >
            Remove User From Block
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            This user is blocked, you need to cancel the block of this user in
            order to send him a message
          </ModalBody>

          <ModalFooter>
            <Box display="flex" justifyContent="space-between" width="100%">
              <Button colorScheme="blue" onClick={removeUserFromBlock}>
                Cancel Block
              </Button>
              <Button colorScheme="blue" onClick={() => setOpen(false)}>
                Close
              </Button>
            </Box>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {isWebCamOpen && (
        <WebcamCapture
          onCapture={onCapture}
          isOpen={isWebCamOpen}
          setOpen={setIsWebCamOpen}
        />
      )}
      {isWebCamStreamOpen && (
        <WebcamStreamCapture
          onCaptureVideo={onCaptureVideo}
          isOpen={isWebCamStreamOpen}
          setOpen={setIsWebCamStreamOpen}
        />
      )}
    </>
  );
};

export default SingleChat;
