import { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  IconButton,
  Modal,
  TextField,
} from "@mui/material";
import { getUser, updateUser } from "../Api/serverAPI";
import { UpdateUser } from "../types";
import toast from "react-hot-toast";
import {
  HTTP_400_BAD_REQUEST,
  HTTP_404_NOT_FOUND,
} from "../constants/httpStatusCodes";
import Spinner from "./Spinner";
import {
  UploadTask,
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import storage from "../config/firebase";
import { useAuth } from "../context/auth";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import LinearProgressBar from "./LinearProgressBar";
import { defaultProfilePic } from "../constants/paths";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { useUsers } from "../context/users";

interface UpdateUserModalProps {
  fetchAgain: boolean;
  setFetchAgain: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  userId: string;
}

type FileData = {
  id: string;
  url: string;
  publish: boolean;
};

const UpdateUserModal: React.FC<UpdateUserModalProps> = ({
  open,
  setOpen,
  userId,
  fetchAgain,
  setFetchAgain,
}) => {
  const handleClose = (): void => {
    setOpen(false);
  };

  const [user, setUser] = useState<UpdateUser>({} as UpdateUser);
  const [loading, setLoading] = useState<boolean>(false);
  const [updatingUser, setUpdatingUser] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [showProgress, setShowProgress] = useState<boolean>(false);
  const [uploadState, setUploadState] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  const [file, setFile] = useState<FileData>({} as FileData);
  const { auth, setAuth } = useAuth();

  const { activeUsers } = useUsers();
  const isUserActive = activeUsers.some((u) => u._id === userId);

  const navigate: NavigateFunction = useNavigate();

  useEffect(() => {
    const fetchUserById = async (): Promise<void> => {
      try {
        setLoading(true);
        const { data: user } = await getUser(userId as string);
        setUser({ ...user, password: "" });
        setFile(user?.profilePic);
        setLoading(false);
      } catch (error: any) {
        if (error?.response?.status === HTTP_404_NOT_FOUND) {
          toast.error(error?.response?.data.detail, {
            position: "bottom-left",
          });
        }
        setLoading(false);
      }
    };
    fetchUserById();
  }, [userId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const uploadFile = async (file: File) => {
    setShowProgress(true);

    if (file.size > 100 * 1024 * 1024) {
      toast.error(`File ${file.name} size exceeds the 100 MB limit.`);
      return;
    }

    const fileName = new Date().getTime() + file.name;
    const fileObject: FileData = {
      url: "",
      id: fileName,
      publish: false,
    };

    const storageRef = ref(
      storage,
      `${auth?.user?.username}/files/${fileName}`
    );

    const uploadTask: UploadTask = uploadBytesResumable(storageRef, file);
    setFileName(file.name);

    new Promise<void>((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const newProgress =
            snapshot.totalBytes > 0
              ? Math.round(
                  (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                )
              : 0;
          setShowProgress(true);
          setProgress(newProgress);

          if (newProgress === 100) {
            setShowProgress(false);
          }

          switch (snapshot.state) {
            case "paused":
              setUploadState("Upload is paused");
              break;
            case "running":
              setUploadState("Upload is running");
              break;

            default:
              setUploadState("Something went wrong");
          }
        },
        (error) => {
          reject(error);
        },
        () => {
          setUploadState("Upload successful");

          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            fileObject.url = downloadURL;
            setUser({ ...user, profilePic: fileObject });

            setFile(fileObject);
            resolve();
          });
        }
      );
    });

    setShowProgress(false);
  };

  const handleRemoveFile = async () => {
    try {
      const storageRef = ref(
        storage,
        `${auth?.user?.username}/files/${file.id}`
      );
      await deleteObject(storageRef);

      setFile({
        id: user?.profilePic?.id,
        url: defaultProfilePic,
        publish: true,
      } as FileData);
      setUser({
        ...user,
        profilePic: {
          id: user?.profilePic?.id,
          url: defaultProfilePic,
          publish: true,
        },
      });
    } catch (error) {
      console.error("Error deleting file:", error);
      setLoading(false);
    }
  };

  const handleSave = async (): Promise<void> => {
    setUpdatingUser(true);

    try {
      setUser({
        ...user,
        profilePic: {
          id: user?.profilePic?.id,
          url: user?.profilePic?.url,
          publish: true,
        },
      });
      const { data } = await updateUser(user?._id, user);
      toast.success("User profile updated successfully");
      const currentUserFromLocalStorage = JSON.parse(
        localStorage.getItem("auth")!
      );

      const updatedUser = {
        access_token: currentUserFromLocalStorage.access_token,
        token_type: currentUserFromLocalStorage.token_type,
        user: {
          _id: data.user._id,
          username: data.user.username,
          emailAddress: data.user.emailAddress,
          followers: data.user.followers,
          followings: data.user.followings,
          isAdmin: data.user.isAdmin,
          fullName: data.user.fullName,
          createdAt: data.user.createdAt,
          updatedAt: data.user.updatedAt,
          profilePic: data.user.profilePic,
        },
      };

      setAuth(updatedUser);
      localStorage.setItem("auth", JSON.stringify(updatedUser));
      setLoading(false);
      setUpdatingUser(false);
      setOpen(false);
      setFetchAgain(!fetchAgain);
      navigate("/");
    } catch (error: any) {
      if (error?.response?.status === HTTP_400_BAD_REQUEST) {
        toast.error(error?.response?.data?.detail, { position: "bottom-left" });
      }
      if (error?.response?.status === HTTP_404_NOT_FOUND) {
        toast.error(error?.response?.data?.detail, {
          position: "bottom-left",
        });
      }
      setLoading(false);
      setUpdatingUser(false);
    }
  };

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
        {loading ? (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            height="100vh"
          >
            <Spinner />
          </Box>
        ) : (
          <>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div style={{ position: "relative", display: "inline-block" }}>
                {file?.url !== defaultProfilePic && (
                  <CloseIcon
                    onClick={handleRemoveFile}
                    style={{
                      color: "red",
                      cursor: "pointer",
                      position: "absolute",
                      top: 0,
                      right: 0,
                    }}
                  />
                )}
                <div className="relative">
                  <Avatar
                    sx={{
                      border: "1px solid black",
                      width: "100px",
                      height: "100px",
                      cursor: "pointer",
                      marginTop: "10px",
                    }}
                    src={!file?.url ? defaultProfilePic : file?.url}
                    alt=""
                  />
                  <div className="absolute top-0 left-2">
                    {isUserActive ? (
                      <div
                        className="absolute top-0 left-2 w-4 h-4 bg-green-primary rounded-full"
                        title="Online"
                      />
                    ) : (
                      <div
                        className="absolute top-0 left-2 w-4 h-4 bg-red-primary rounded-full"
                        title="Offline"
                      />
                    )}
                  </div>
                </div>
              </div>
              <label htmlFor="upload-input" style={{ cursor: "pointer" }}>
                <input
                  type="file"
                  id="upload-input"
                  style={{ display: "none" }}
                  onChange={(e) => uploadFile(e?.target?.files?.[0]!)}
                />
                <IconButton component="span">
                  <CloudUploadIcon />
                </IconButton>
                Upload Profile Image
              </label>{" "}
              {!showProgress ? null : (
                <>
                  <LinearProgressBar progress={progress} />
                  Status: {uploadState}
                  <br />
                  FileUploaded:{fileName}
                </>
              )}
              <TextField
                style={{ marginTop: "5px", width: "320px" }}
                variant="outlined"
                margin="normal"
                label="Username"
                id="username"
                name="username"
                autoComplete="username"
                autoFocus
                value={user?.username}
                onChange={handleChange}
              />
              <TextField
                style={{ marginTop: "5px", width: "320px" }}
                variant="outlined"
                margin="normal"
                label="Full Name"
                id="fullName"
                name="fullName"
                autoComplete="fullName"
                autoFocus
                value={user?.fullName}
                onChange={handleChange}
              />
              <TextField
                style={{ marginTop: "5px", width: "320px" }}
                variant="outlined"
                margin="normal"
                id="emailAddress"
                label="Email"
                name="emailAddress"
                autoComplete="emailAddress"
                autoFocus
                type="email"
                value={user?.emailAddress}
                onChange={handleChange}
              />
              <TextField
                style={{ marginTop: "5px", width: "320px" }}
                variant="outlined"
                margin="normal"
                id="password"
                label="Password"
                name="password"
                autoComplete="Password"
                autoFocus
                type="password"
                value={user?.password}
                onChange={handleChange}
              />
              <TextField
                style={{ marginTop: "5px", width: "320px" }}
                variant="outlined"
                margin="normal"
                disabled
                id="CreatedAt"
                label="CreatedAt"
                name="CreatedAt"
                autoComplete="CreatedAt"
                autoFocus
                type="text"
                value={user?.createdAt}
                onChange={handleChange}
              />
            </div>

            <Box
              display="flex"
              sx={{ marginTop: "20px", marginBottom: "20px" }}
              justifyContent="center"
              alignItems="center"
              gap="160px"
            >
              <Button
                disabled={updatingUser}
                variant="contained"
                style={{ backgroundColor: "red" }}
                onClick={() => {
                  setOpen(false);
                }}
              >
                Discard
              </Button>
              <Button
                disabled={updatingUser}
                variant="contained"
                onClick={handleSave}
              >
                Save
              </Button>
            </Box>
          </>
        )}
      </Card>
    </Modal>
  );
};

export default UpdateUserModal;
