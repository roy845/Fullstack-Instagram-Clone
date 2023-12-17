import { ReactElement, useEffect, useState } from "react";
import { Card, Modal, IconButton, Box, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useAuth } from "../context/auth";
import { MentionNotification } from "../types";
import { useNavigate } from "react-router";
import { Delete } from "@mui/icons-material";
import NoMentionsNotifications from "./NoMentionsNotifications";
import { HTTP_404_NOT_FOUND } from "../constants/httpStatusCodes";
import toast from "react-hot-toast";
import {
  deleteMentionsNotification,
  getMentionsNotifications,
} from "../Api/serverAPI";
import Spinner from "./Spinner";
import { useSocket } from "../context/socket";

interface MentionsNotificationsModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function MentionsNotificationsModal({
  open,
  setOpen,
}: MentionsNotificationsModalProps): ReactElement {
  const [notifications, setNotifications] = useState<MentionNotification[]>(
    [] as MentionNotification[]
  );

  const { setNotifications: setGlobalNotifications } = useSocket();
  const [selectedNotification, setSelectedNotification] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingNotifications, setLoadingNotifications] =
    useState<boolean>(false);
  const navigate = useNavigate();

  const { auth } = useAuth();

  useEffect(() => {
    const fetchMentionsNotifications = async () => {
      try {
        setLoadingNotifications(true);
        const { data } = await getMentionsNotifications();
        setNotifications(
          data.filter(
            (m: MentionNotification) => m.recipientId === auth?.user?._id
          )
        );
        setLoadingNotifications(false);
      } catch (error: any) {
        toast.error(error);
        setLoadingNotifications(false);
      }
    };

    fetchMentionsNotifications();
  }, []);

  const handleDeleteNotification = async (
    event: React.MouseEvent,
    notificationId: string
  ) => {
    event.stopPropagation();
    setSelectedNotification(notificationId);
    try {
      setLoading(true);
      const { data } = await deleteMentionsNotification(notificationId);
      setNotifications((prevNotifications) =>
        prevNotifications.filter(
          (notification) => notification?._id !== notificationId
        )
      );
      setGlobalNotifications(
        notifications.filter(
          (notification) => notification?._id !== notificationId
        )
      );

      toast.success("Notification deleted successfully", {
        position: "bottom-left",
      });
      setLoading(false);
    } catch (error: any) {
      if (error?.response?.status === HTTP_404_NOT_FOUND) {
        toast.error(error?.response?.data?.detail, {
          position: "bottom-left",
        });
      }
      setLoading(false);
    }
  };

  const handleBoxClick = (notificationId: string) => {
    navigate(`/post/${notificationId}`);
  };

  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <>
        {loadingNotifications ? ( // If loading is true, show the loading spinner
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            height="90vh" // You can adjust the height to fit your layout
          >
            <Spinner />
          </Box>
        ) : (
          <Card
            sx={{
              margin: "30px",
              height: "90vh",
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
            <h1 className="text-center font-bold mt-2">Notifications</h1>

            {notifications.length === 0 && <NoMentionsNotifications />}

            {notifications.map((notification: MentionNotification) =>
              loading && notification._id === selectedNotification ? (
                <Spinner sm key={notification?._id} />
              ) : (
                <Box
                  key={notification?._id}
                  sx={{
                    backgroundColor: "#272d38",
                    position: "relative",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    padding: "10px",
                    transition:
                      "background-color 0.3s ease, box-shadow 0.3s ease",
                    cursor: "pointer",
                    marginBottom: "10px",
                    "&:hover": {
                      backgroundColor: "#558dab",
                    },
                  }}
                  onClick={() => handleBoxClick(notification?.post?._id)}
                >
                  <IconButton
                    sx={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      color: "red",
                      zIndex: 50,
                      backgroundColor: "red",
                      "&:hover": {
                        backgroundColor: "red",
                      },
                    }}
                    onClick={(event) =>
                      handleDeleteNotification(event, notification?._id)
                    }
                  >
                    <Delete sx={{ color: "white", zIndex: 50 }} />
                  </IconButton>
                  <Typography
                    sx={{
                      color: "white",
                      fontSize: 18,
                      fontWeight: "bold",
                      textAlign: "center",
                      margin: "auto",
                    }}
                  >
                    {notification?.content}
                  </Typography>
                </Box>
              )
            )}
          </Card>
        )}
      </>
    </Modal>
  );
}

export default MentionsNotificationsModal;
