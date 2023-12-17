import { ViewIcon } from "@chakra-ui/icons";
import {
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  ModalFooter,
  Button,
  Image,
  Input,
  Tooltip,
  useToast,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { getChats, getUser, updateUser } from "../../Api/serverAPI";
import { useAuth } from "../../context/auth";
import { useChat } from "../../context/ChatProvider";

const ProfileModal = ({ user, children }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [showEditProfilePicture, setShowEditProfilePicture] = useState(false);
  const { auth, setAuth } = useAuth();
  const { setChats } = useChat();
  const [loading, setLoading] = useState(false);

  const toast = useToast();

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

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await getUser(user?._id);

        setName(data.name);
        setEmail(data.email);
        setCreatedAt(data.createdAt);
        setProfilePic(data.profilePic);
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: error.response.data.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
        });
      }
    };

    fetchUser();
  }, []);

  const showEditProfilePictureHandler = () => {
    setShowEditProfilePicture(!showEditProfilePicture);
  };

  const handleUpdateUser = async () => {
    try {
      const updatedUser = {
        name: name,
        email: email,
        password: password,
        profilePic: profilePic,
      };

      const { data } = await updateUser(user?._id, updatedUser);
      const updatedUserFromDB = data.user;

      setAuth((prev) => ({
        ...prev,
        name: updatedUserFromDB.name,
        email: updatedUserFromDB.email,
        isAdmin: updatedUserFromDB.isAdmin,
        profilePic: updatedUserFromDB.profilePic,
        createdAt: updatedUserFromDB.createdAt,
        token: user?.token,
        _id: updatedUserFromDB._id,
      }));
      let updatedAuthData = {
        name: updatedUserFromDB.name,
        email: updatedUserFromDB.email,
        isAdmin: updatedUserFromDB.isAdmin,
        profilePic: updatedUserFromDB.profilePic,
        createdAt: updatedUserFromDB.createdAt,
        token: user?.token,
        _id: updatedUserFromDB._id,
      };
      localStorage.setItem("userInfo", JSON.stringify(updatedAuthData));
      fetchChats();
      toast({
        title: "User updated successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      onClose();
    } catch (error) {
      console.log(error);
      toast({
        title: "Error Occured in updating user!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <div>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton d={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />
      )}

      <Modal size="lg" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent h="810px">
          <ModalHeader
            fontSize="40px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >
            {name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            flexDir="column"
            alignItems="center"
            justifyContent="space-between"
          >
            <Tooltip title="Click on the picture to update">
              <Image
                borderRadius="full"
                boxSize="150px"
                src={
                  profilePic ||
                  "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
                }
                alt={name}
                mb={5}
                onClick={showEditProfilePictureHandler}
                style={{ cursor: "pointer" }}
              />
            </Tooltip>

            {showEditProfilePicture && (
              <Input
                onChange={(e) => setProfilePic(e.target.value)}
                placeholder="Enter your profile picture url"
                value={profilePic}
                mb={4}
              />
            )}
            <Text mb={2} alignSelf="flex-start">
              {" "}
              Name
            </Text>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter Your Name"
              mb={4}
            />
            <Text mb={2} alignSelf="flex-start">
              Email
            </Text>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter Your Email"
              mb={4}
            />
            <Text mb={2} alignSelf="flex-start">
              Password
            </Text>
            <Input
              value={password}
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Your Password"
              mb={4}
            />
            <Text mb={2} alignSelf="flex-start">
              Created At
            </Text>
            <Input
              value={new Date(createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
              disabled
              onChange={(e) => setCreatedAt(e.target.value)}
              mb={4}
            />
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={handleUpdateUser}
              backgroundColor="#46c556"
              color="white"
            >
              Update
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ProfileModal;
