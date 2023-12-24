import React, { useEffect, useState } from "react";
import StoryDialog from "../components/StoryDialog";
import {
  Avatar,
  BackdropProps,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { defaultProfilePic } from "../constants/paths";
import { Close } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { deleteAllStories, getStoryByUserId, getUser } from "../Api/serverAPI";
import { Story, User } from "../types";
import { useAuth } from "../context/auth";
import StorySlider from "./StorySlider";
import { DeleteOutline } from "@mui/icons-material";
import toast from "react-hot-toast";
import storage from "../config/firebase";
import { deleteObject, ref } from "firebase/storage";
import Spinner from "./Spinner";
import { useUsers } from "../context/users";

interface StorySliderModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedUserId: string;
}

const StorySliderModal: React.FC<StorySliderModalProps> = ({
  open,
  setOpen,
  selectedUserId,
}) => {
  const [story, setStory] = useState<Story>({} as Story);
  const [user, setUser] = useState<User>({} as User);
  const [loading, setLoading] = useState<boolean>(false);
  const { auth } = useAuth();

  const { activeUsers } = useUsers();

  const isUserActive = activeUsers.some((u) => u._id === selectedUserId);

  useEffect(() => {
    const fetchStoryByUserId = async () => {
      try {
        const { data } = await getStoryByUserId(selectedUserId);
        setStory(data);
      } catch (error) {
        console.log(error);
      }
    };

    selectedUserId && fetchStoryByUserId();
  }, [selectedUserId]);

  useEffect(() => {
    const fetchUserById = async () => {
      try {
        const { data } = await getUser(selectedUserId);
        setUser(data);
      } catch (error) {
        console.log(error);
      }
    };

    selectedUserId && fetchUserById();
  }, [selectedUserId]);

  const handleRemoveFile = async (id: string) => {
    const fileToRemove = story?.files.find((file) => file.id === id);

    if (fileToRemove) {
      try {
        const storageRef = ref(
          storage,
          `${auth?.user?.username}/files/${fileToRemove.id}`
        );
        await deleteObject(storageRef);
      } catch (error) {
        console.error("Error deleting file:", error);
      }
    }
  };

  const handleDeleteAllStoryFiles = async () => {
    try {
      setLoading(true);

      for (const file of story?.files!) {
        await handleRemoveFile(file?.id);
      }

      setLoading(false);
    } catch (error: any) {
      toast.error(error, { position: "bottom-left" });
    }
  };

  const deleteStory = async (): Promise<void> => {
    try {
      handleDeleteAllStoryFiles();
      await deleteAllStories(story?._id as string);
      setOpen(false);
      toast.success("Story deleted successfully", { position: "bottom-left" });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {Object.keys(story).length !== 0 ? (
        <StoryDialog open={open} setOpen={setOpen}>
          <IconButton
            onClick={() => {
              setOpen(false);
            }}
            sx={{
              position: "absolute",
              left: 0,
              top: 0,
              backgroundColor: "transparent",
              color: "red",
              "&:hover": {
                backgroundColor: "transparent",
              },
            }}
          >
            <Close />
          </IconButton>
          {loading ? (
            <Spinner />
          ) : (
            <>
              <div
                className="user-info"
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <div className="user-avatar">
                  <Link to={`/profile/${user?.username}/${user?._id}`}>
                    <div className="relative">
                      <Avatar
                        src={user?.profilePic?.url || defaultProfilePic}
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
                <div className="user-details">
                  <Typography
                    variant="h6"
                    style={{ color: "white", marginLeft: "10px" }}
                  >
                    {user?.username}
                  </Typography>
                </div>
                {auth?.user?._id === story?.userId && (
                  <Tooltip title="Delete Story">
                    <IconButton onClick={deleteStory}>
                      <DeleteOutline style={{ color: "red" }} />
                    </IconButton>
                  </Tooltip>
                )}
              </div>
              <StorySlider story={story} setOpen={setOpen} />
            </>
          )}
        </StoryDialog>
      ) : null}
    </>
  );
};

export default StorySliderModal;
