import React, { useEffect, useState } from "react";
import { Link, NavigateFunction, useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth";
import SearchDrawer from "./Search";
import ChatIcon from "@mui/icons-material/Chat";
import CreateModal from "./CreateModal";
import { Avatar, Badge } from "@mui/material";
import { useUsers } from "../context/users";
import { useSocket } from "../context/socket";
import { Notifications, Settings } from "@mui/icons-material";
import toast from "react-hot-toast";
import {
  createMentionNotification,
  getMentionsNotifications,
} from "../Api/serverAPI";
import { MentionNotification } from "../types";
import MentionsNotificationsModal from "./MentionsNotificationsModal";
import ExploreIcon from "@mui/icons-material/Explore";
import AddCircle from "@mui/icons-material/AddCircle";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsModal from "./SettingsModal";

export const RightBar = (): JSX.Element => {
  const navigate: NavigateFunction = useNavigate();
  const { auth, setAuth } = useAuth();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isOpenCreateModal, setIsOpenCreateModal] = useState<boolean>(false);
  const [isOpenSettingsModal, setIsOpenSettingsModal] =
    useState<boolean>(false);
  const [
    isOpenMentionsNotificationsModal,
    setIsOpenMentionsNotificationsModal,
  ] = useState<boolean>(false);

  const { activeUsers } = useUsers();
  const { socket, notifications, setNotifications, isNotificationsOn } =
    useSocket();

  const isUserActive: boolean = activeUsers.some(
    (user) => user._id === auth?.user?._id
  );

  const onClose = (): void => {
    setIsOpen(false);
  };

  useEffect(() => {
    socket.on("newMention", (message: MentionNotification) => {
      isNotificationsOn &&
        createMentionNotification(message)
          .then((res) => {
            setNotifications((prevNotifications) => [
              ...prevNotifications,
              res.data,
            ]);
            const notificationSound: HTMLAudioElement = new Audio(
              "/livechat-129007.mp3"
            );
            notificationSound.play();
          })
          .catch((err: any) => console.log(err));
    });

    return () => {
      socket.off("newMention");
    };
  }, [isNotificationsOn]);

  useEffect(() => {
    const fetchMentionsNotifications = async (): Promise<void> => {
      try {
        const { data } = await getMentionsNotifications();
        setNotifications(
          data.filter(
            (m: MentionNotification) => m.recipientId === auth?.user?._id
          )
        );
      } catch (error: any) {
        toast.error(error);
      }
    };

    fetchMentionsNotifications();
  }, []);

  return (
    <header className="h-screen bg-gray-background border-r z-10 border-gray-primary fixed top-0 right-0 border border-left-black-light">
      <div className="flex flex-col justify-between">
        <div className="text-gray-700 text-center flex items-end cursor-pointer">
          <div className="flex justify-end pr-4 mb-5 w-full">
            <Link to={"/"} aria-label="Instagram logo">
              <img
                src="/images/logo.png"
                alt="Instagram"
                className="mt-3 w-6/12 mx-auto"
              />
            </Link>
          </div>
        </div>
        <div className="text-gray-700 text-center flex flex-col items-end space-y-4 mr-10">
          <Link
            to={"/"}
            aria-label="Dashboard"
            className="flex items-center justify-end h-10 hover:text-white hover:bg-blue-primary rounded-lg w-full"
          >
            <span className="mr-2 hover:text-white">Home</span>
            <HomeIcon className="mr-2 hover:text-white" />
          </Link>

          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center justify-end h-10 hover:text-white hover:bg-blue-primary rounded-lg w-full"
          >
            <span className="mr-2 hover:text-white">Search</span>
            <SearchIcon className="mr-2 hover:text-white" />
          </button>
          <button
            onClick={() => navigate("/explore")}
            className="flex items-center justify-end h-10 hover:text-white hover:bg-blue-primary rounded-lg w-full"
          >
            <span className="mr-2 hover:text-white">Explore</span>
            <ExploreIcon className="mr-2 hover:text-white" />
          </button>
          <button
            onClick={() => setIsOpenCreateModal(true)}
            className="flex items-center justify-end h-10 hover:text-white hover:bg-blue-primary rounded-lg w-full"
          >
            <span className="mr-2 hover:text-white">Create</span>
            <AddCircle className="mr-2 hover:text-white" />
          </button>

          <button
            onClick={() => window.open("http://localhost:3001")}
            className="flex items-center justify-end h-10 hover:text-white hover:bg-blue-primary rounded-lg w-full"
          >
            <span className="mr-2 hover:text-white">Chats</span>
            <ChatIcon className="mr-2 hover:text-white" />
          </button>
          <button
            onClick={() => setIsOpenMentionsNotificationsModal(true)}
            className="flex items-center justify-end h-10 hover:text-white hover:bg-blue-primary rounded-lg w-full"
          >
            <span className="mr-2 hover:text-white">Notifications</span>
            <Badge badgeContent={notifications?.length} color="error">
              {" "}
              <Notifications className="mr-2 hover:text-white" />
            </Badge>
          </button>
          <button
            onClick={() => setIsOpenSettingsModal(true)}
            className="flex items-center justify-end h-10 hover:text-white hover:bg-blue-primary rounded-lg w-full"
          >
            <span className="mr-2 hover:text-white">Settings</span>

            <Settings className="mr-2 hover:text-white" />
          </button>
          <button
            type="button"
            className="flex items-center justify-end h-10 hover:text-white hover:bg-blue-primary rounded-lg w-full"
            onClick={() => {
              setAuth(null);
              localStorage.removeItem("auth");
              navigate("/");
            }}
          >
            <span className="mr-2 hover:text-white">Logout</span>
            <LogoutIcon className="mr-2 hover:text-white" />
          </button>

          <Link
            to={`/profile/${auth?.user?.username}/${auth?.user?._id}`}
            className="flex items-starts justify-start h-10"
          >
            <span className="mr-2 mt-1">{auth?.user?.username}</span>
            <div className="relative">
              <Avatar
                className="rounded-full h-8 w-8 flex"
                src={auth?.user?.profilePic?.url}
                alt={auth?.user?.profilePic?.url}
                onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                  const target = e.target as HTMLImageElement;
                  target.src = auth?.user?.profilePic?.url!;
                }}
              />
              <div className="absolute top-0 left-0">
                {isUserActive ? (
                  <div
                    className="absolute top-0 left-0 w-4 h-4 bg-green-primary rounded-full"
                    title="Online"
                  />
                ) : (
                  <div
                    className="absolute top-0 left-0 w-4 h-4 bg-red-primary rounded-full"
                    title="Offline"
                  />
                )}
              </div>
            </div>
          </Link>
        </div>
      </div>
      {isOpen && <SearchDrawer isOpen={isOpen} onClose={onClose} />}
      {isOpenCreateModal && (
        <CreateModal open={isOpenCreateModal} setOpen={setIsOpenCreateModal} />
      )}
      {isOpenMentionsNotificationsModal && (
        <MentionsNotificationsModal
          open={isOpenMentionsNotificationsModal}
          setOpen={setIsOpenMentionsNotificationsModal}
        />
      )}
      {isOpenSettingsModal && (
        <SettingsModal
          open={isOpenSettingsModal}
          setOpen={setIsOpenSettingsModal}
        />
      )}
    </header>
  );
};
