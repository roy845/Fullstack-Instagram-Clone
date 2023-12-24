import {
  Box,
  Button,
  Card,
  FormControl,
  IconButton,
  Modal,
  Stack,
  Switch,
  TextField,
} from "@mui/material";
import { ReactElement, useEffect, useState } from "react";
import NotificationsIcon from "@mui/icons-material/Notifications";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import toast from "react-hot-toast";
import {
  addUsersToBlockedList,
  enableDisableNotifications,
  getNotificationsStatus,
  removeUsersFromBlockedList,
  searchBlockedListUsers,
  searchUsers,
} from "../Api/serverAPI";
import { useSocket } from "../context/socket";
import BlockIcon from "@mui/icons-material/Block";
import Spinner from "./Spinner";
import { User } from "../types";
import UserBadge from "./Userbadge";
import CloseIcon from "@mui/icons-material/Close";
import { HTTP_400_BAD_REQUEST } from "../constants/httpStatusCodes";

interface SettingsModal {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function SettingsModal({ open, setOpen }: SettingsModal): ReactElement {
  const { isNotificationsOn, setIsNotificationsOn } = useSocket();
  const [showUsersToBlock, setShowUsersToBlock] = useState<boolean>(false);
  const [showUsersToUnblock, setShowUsersToUnblock] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [searchBlockedUsers, setSearchBlockedUsers] = useState<string>("");
  const [searchResults, setSearchResults] = useState<User[]>([] as User[]);
  const [searchResultsBlockedUsers, setSearchResultsBlockedUsers] = useState<
    User[]
  >([] as User[]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([] as User[]);
  const [selectedUsersToBlock, setSelectedUsersToBlock] = useState<User[]>(
    [] as User[]
  );
  const [selectedUsersToUnblock, setSelectedUsersToUnblock] = useState<User[]>(
    [] as User[]
  );

  const [loading, setLoading] = useState<boolean>(false);

  const handleNotificationsChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    try {
      setIsNotificationsOn(!isNotificationsOn);

      const { data } = await enableDisableNotifications(e.target.checked);

      setIsNotificationsOn(data.checked);
      toast.success(data.message, { position: "bottom-left" });
    } catch (error: any) {
      toast.error(error);
    }
  };

  const handleClose = (): void => {
    setOpen(false);
  };

  const showUsersToBlockHandler = () => {
    setShowUsersToBlock(!showUsersToBlock);
  };

  const showUsersToUnblockHandler = () => {
    setShowUsersToUnblock(!showUsersToUnblock);
  };

  const handleSearch = async (query: string): Promise<void> => {
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
      toast.error("Error Occured!");
      setLoading(false);
    }
  };

  const addUserToUnblock = (userToUnblock: User) => {
    if (selectedUsersToUnblock.some((user) => user._id === userToUnblock._id)) {
      toast.error("User already added");
      return;
    }

    setSelectedUsersToUnblock([...selectedUsersToUnblock, userToUnblock]);
  };

  const handleDelete = (userToDelete: User) => {
    setSelectedUsersToBlock(
      selectedUsersToBlock.filter(
        (selectedUser: User) => selectedUser._id !== userToDelete._id
      )
    );
  };

  const handleDeleteUsersFromBlockedList = (userToDelete: User) => {
    setSelectedUsersToUnblock(
      selectedUsersToUnblock.filter(
        (selectedUser) => selectedUser._id !== userToDelete._id
      )
    );
  };

  const addUserToBlock = (userToBlock: User) => {
    if (
      selectedUsersToBlock.some((user: User) => user._id === userToBlock._id)
    ) {
      toast.error("User already addded");
      return;
    }

    setSelectedUsersToBlock([...selectedUsersToBlock, userToBlock]);
  };

  const handleSearchBlockedUsers = async (query: string) => {
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
      toast.error("Error Occured!");
      setLoading(false);
    }
  };

  const handleSubmitUsersToBlockedList = async () => {
    try {
      if (selectedUsersToBlock.length === 0) {
        setOpen(false);
        return;
      }

      const { data } = await addUsersToBlockedList(
        selectedUsersToBlock.map((user: User) => user?._id)
      );
      toast.success(data.message);
      setSearchResults([]);
      setSelectedUsers([]);
      setSelectedUsersToUnblock([]);
      setSearchResultsBlockedUsers([]);
      setShowUsersToBlock(false);
      setShowUsersToUnblock(false);

      setOpen(false);
    } catch (error: any) {
      if (error?.response?.data?.status === HTTP_400_BAD_REQUEST) {
        console.log(error);
        toast.error(error?.response?.data?.detail);
      }
    }
  };

  const handleSubmitUsersToUnblock = async () => {
    try {
      if (selectedUsersToUnblock.length === 0) {
        setOpen(false);
        return;
      }

      const { data } = await removeUsersFromBlockedList(
        selectedUsersToUnblock.map((user: User) => user?._id)
      );
      toast.success(data.message);
      setSearchResults([]);
      setSelectedUsers([]);
      setSelectedUsersToUnblock([]);
      setSearchResultsBlockedUsers([]);
      setShowUsersToBlock(false);
      setShowUsersToUnblock(false);

      setOpen(false);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    const fetchNotificationStatus = async () => {
      try {
        const { data } = await getNotificationsStatus();
        setIsNotificationsOn(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchNotificationStatus();
  }, []);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Card
        sx={{
          margin: "30px",
          maxHeight: "90vh",
          overflowY: "auto",
          "&::-webkit-scrollbar": {
            width: "4px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#888",
          },
        }}
      >
        <IconButton
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 1,
            color: "red",
            cursor: "pointer",
          }}
          onClick={() => setOpen(false)}
        >
          <CloseIcon />
        </IconButton>
        <h1 className="text-center font-bold mt-2 text-2xl">Settings</h1>
        <div className="flex items-center justify-center">
          <div>
            <h2
              style={{ marginBottom: "10px", fontWeight: "bold", fontSize: 28 }}
            >
              Notifications
            </h2>
            <Switch
              className="mr-2"
              checked={isNotificationsOn}
              onChange={handleNotificationsChange}
            />
            <label htmlFor="notifications">
              {!isNotificationsOn ? (
                <>
                  <NotificationsIcon />
                  Enable notifications
                </>
              ) : (
                <>
                  <NotificationsActiveIcon style={{ color: "#C3D825" }} />
                  Disable notifications
                </>
              )}
            </label>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <div>
            <h2
              style={{ marginBottom: "10px", fontWeight: "bold", fontSize: 28 }}
            >
              Block/Unblock Users
            </h2>
            <Stack>
              <Button
                startIcon={<BlockIcon />}
                onClick={showUsersToBlockHandler}
              >
                Block Users
              </Button>
              <Button
                startIcon={<BlockIcon sx={{ marginLeft: "20px" }} />}
                onClick={showUsersToUnblockHandler}
              >
                Unblock Users
              </Button>

              {showUsersToBlock && (
                <>
                  <FormControl>
                    <TextField
                      placeholder="Search users to block"
                      sx={{ marginTop: 5, marginBottom: 5 }}
                      onChange={(e) => handleSearch(e.target.value)}
                    />
                  </FormControl>
                  <Box
                    sx={{ width: "100%", display: "flex", flexWrap: "wrap" }}
                  >
                    {selectedUsersToBlock.map((user: User) => (
                      <UserBadge
                        username={user.username}
                        fullName={user.fullName}
                        profilePic={user.profilePic?.url}
                        userId={user?._id}
                        handleFunction={() => handleDelete(user)}
                        linkDisabled
                      />
                    ))}
                  </Box>
                  {loading ? (
                    <Spinner sm />
                  ) : (
                    search &&
                    searchResults?.map((user) => (
                      <UserBadge
                        username={user.username}
                        fullName={user.fullName}
                        profilePic={user.profilePic?.url}
                        userId={user?._id}
                        handleFunction={() => addUserToBlock(user)}
                        linkDisabled
                      />
                    ))
                  )}
                  <Button
                    sx={{
                      backgroundColor:
                        selectedUsersToBlock.length === 0 ? "gray" : "green",
                      color:
                        selectedUsersToBlock.length === 0 ? "black" : "white",
                      "&:hover": {
                        backgroundColor: "green", // Change the background color when hovered
                      },
                    }}
                    disabled={selectedUsersToBlock.length === 0}
                    onClick={handleSubmitUsersToBlockedList}
                  >
                    Save
                  </Button>
                </>
              )}
              {showUsersToUnblock && (
                <>
                  <FormControl>
                    <TextField
                      placeholder="Search users to unblock"
                      sx={{ marginTop: 5, marginBottom: 5 }}
                      onChange={(e) => handleSearchBlockedUsers(e.target.value)}
                    />
                  </FormControl>
                  <Box
                    sx={{ width: "100%", display: "flex", flexWrap: "wrap" }}
                  >
                    {selectedUsersToUnblock.map((user: User) => (
                      <UserBadge
                        username={user.username}
                        fullName={user.fullName}
                        profilePic={user.profilePic?.url}
                        userId={user?._id}
                        handleFunction={() =>
                          handleDeleteUsersFromBlockedList(user)
                        }
                        linkDisabled
                      />
                    ))}
                  </Box>
                  {loading ? (
                    <Spinner />
                  ) : (
                    searchResultsBlockedUsers?.map((user: User) => (
                      <UserBadge
                        username={user.username}
                        fullName={user.fullName}
                        profilePic={user.profilePic?.url}
                        userId={user?._id}
                        handleFunction={() => addUserToUnblock(user)}
                        linkDisabled
                      />
                    ))
                  )}
                  <Button
                    sx={{
                      backgroundColor:
                        selectedUsersToUnblock.length === 0 ? "gray" : "green",
                      color:
                        selectedUsersToUnblock.length === 0 ? "black" : "white",
                      "&:hover": {
                        backgroundColor: "green",
                      },
                    }}
                    disabled={selectedUsersToUnblock.length === 0}
                    onClick={handleSubmitUsersToUnblock}
                  >
                    Save
                  </Button>
                </>
              )}
            </Stack>
          </div>
        </div>
      </Card>
    </Modal>
  );
}

export default SettingsModal;
