import { Box, Button, IconButton, Modal, TextField } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useState } from "react";
import { Story, StoryFileData, User } from "../types";
import {
  createStory,
  getStoryByUserId,
  getUser,
  updateStory,
} from "../Api/serverAPI";
import toast from "react-hot-toast";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import storage from "../config/firebase";
import { getFileTypeFromExtension } from "../helpers/helpers";
import LinearProgressBar from "./LinearProgressBar";
import Spinner from "./Spinner";

interface CreateStoryModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedUserId: string;
}

const style = {
  position: "absolute" as const,
  top: "50%" as const,
  left: "50%" as const,
  transform: "translate(-50%, -50%)" as const,
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  maxHeight: "80vh",
  overflowY: "auto",
  "&::-webkit-scrollbar": {
    width: "4px",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "#888",
  },
};

const CreateStoryModal: React.FC<CreateStoryModalProps> = ({
  open,
  setOpen,
  selectedUserId,
}) => {
  const [user, setUser] = useState<User>({} as User);
  const [loading, setLoading] = useState<boolean>(false);
  const [fileData, setFileData] = useState<StoryFileData[]>(
    [] as StoryFileData[]
  ); // Use an array to store file data
  const [progress, setProgress] = useState(0);
  const [showProgress, setShowProgress] = useState<boolean>(false);
  const [uploadState, setUploadState] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileDurations, setFileDurations] = useState<Record<string, number>>(
    {}
  );

  const [story, setStory] = useState<Story>({} as Story);
  const [loadingStory, setLoadingStory] = useState<boolean>(false);

  const audioRefs: Record<string, HTMLAudioElement | null> = {};
  const videoRefs: Record<string, HTMLVideoElement | null> = {};
  const handleClose = (): void => {
    setOpen(false);
  };

  const handleDurationChange = (id: string, duration: number) => {
    setFileDurations((prevDurations) => ({
      ...prevDurations,
      [id]: duration,
    }));
  };

  const resetForm = () => {
    setFileData([]);
  };

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

  const handlePublish = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    const updatedFileData: StoryFileData[] = fileData.map((file) => ({
      ...file,
      publish: true,
      duration: fileDurations[file.id],
    }));

    try {
      setLoading(true);
      const { data } = await createStory(updatedFileData);
      toast.success(data.message, { position: "bottom-left" });
      setLoading(false);
      resetForm();
      setOpen(false);
    } catch (error: any) {
      toast.error(error);
      setLoading(false);
    }
  };

  const handleUpdateStory = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    const updatedFileData: StoryFileData[] = fileData.map((file) => ({
      ...file,
      publish: true,
      duration: fileDurations[file.id],
    }));

    try {
      setLoading(true);
      await updateStory(user?._id, updatedFileData);
      toast.success("Story updated successfully");
      setLoading(false);
      resetForm();
      setOpen(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const uploadFiles = async (files: FileList) => {
    setShowProgress(true);
    const uploadPromises = [];

    for (const file of files) {
      if (file.size > 100 * 1024 * 1024) {
        toast.error(`File ${file.name} size exceeds the 100 MB limit.`);
        continue;
      }

      const fileName = new Date().getTime() + file.name;

      const storageRef = ref(storage, `${user?.username}/files/${fileName}`);

      const uploadTask = uploadBytesResumable(storageRef, file);
      setFileName(file.name);

      const fileExtension = getFileTypeFromExtension(
        file.name.split(".").pop() as string
      );

      const fileObject = {
        id: fileName,
        url: "",
        type: fileExtension,
        publish: false,
      };

      uploadPromises.push(
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

                setFileData((prevFileData) => [...prevFileData, fileObject]);

                resolve();
              });
            }
          );
        })
      );
    }

    // Wait for all upload promises to complete before submitting the form
    await Promise.all(uploadPromises);
    setShowProgress(false);
  };

  const handleRemoveFile = async (id: string) => {
    const fileToRemove = fileData.find((file) => file.id === id);

    if (fileToRemove) {
      try {
        setFileData((prevFileData) =>
          prevFileData.filter((file) => file.id !== id)
        );

        const storageRef = ref(
          storage,
          `${user?.username}/files/${fileToRemove.id}`
        );
        await deleteObject(storageRef);
      } catch (error) {
        console.error("Error deleting file:", error);
      }
    }
  };

  useEffect(() => {
    const fetchStoryByUserId = async () => {
      try {
        setLoadingStory(true);
        const { data } = await getStoryByUserId(selectedUserId);
        setStory(data);
        setLoadingStory(false);
      } catch (error) {
        console.log(error);
        setLoadingStory(false);
      }
    };

    selectedUserId && fetchStoryByUserId();
  }, [selectedUserId]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        {loadingStory ? (
          <Spinner />
        ) : (
          <>
            <h1 className="text-center font-bold text-2xl">
              {Object.keys(story).length === 0
                ? "Create Story"
                : "Update Story"}
            </h1>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "10px",
              }}
            >
              {fileData.map((file, index) => (
                <div key={file.id}>
                  {file.type === "image" && (
                    <>
                      <CloseIcon
                        style={{ color: "red", cursor: "pointer" }}
                        onClick={() => handleRemoveFile(file.id)}
                      />
                      <img
                        className="postImg"
                        src={file.url}
                        alt=""
                        width="200px"
                        height="200px"
                      />
                    </>
                  )}
                  <div className="postFiles">
                    {file.type === "song" && (
                      <>
                        <CloseIcon
                          style={{ color: "red", cursor: "pointer" }}
                          onClick={() => handleRemoveFile(file.id)}
                        />
                        <div className="postSongContainer">
                          <audio
                            ref={(ref) =>
                              (audioRefs[file.id] = ref as HTMLAudioElement)
                            }
                            onLoadedMetadata={(e) =>
                              handleDurationChange(
                                file.id,
                                (e.target as HTMLAudioElement).duration
                              )
                            }
                            className="postSong"
                            controls
                          >
                            <source src={file.url} type="audio/mpeg" />
                          </audio>
                        </div>
                      </>
                    )}
                    {file.type === "movie" && (
                      <>
                        <CloseIcon
                          style={{ color: "red", cursor: "pointer" }}
                          onClick={() => handleRemoveFile(file.id)}
                        />
                        <div className="postMovieContainer">
                          <video
                            ref={(ref) =>
                              (videoRefs[file.id] = ref as HTMLVideoElement)
                            }
                            onLoadedMetadata={(e) =>
                              handleDurationChange(
                                file.id,
                                (e.target as HTMLVideoElement).duration
                              )
                            }
                            className="postMovie"
                            controls
                            width="300"
                          >
                            <source src={file.url} type="video/mp4" />
                          </video>
                        </div>
                      </>
                    )}
                  </div>
                  <TextField
                    label="Duration (seconds)"
                    type="number"
                    value={fileDurations[file.id] || ""}
                    onChange={(e) =>
                      handleDurationChange(file.id, +e.target.value)
                    }
                  />
                </div>
              ))}
              <label htmlFor="upload-input" className="cursor-pointer">
                <input
                  type="file"
                  id="upload-input"
                  accept=".png, .jpeg, .jpg, .mkv, .mp4, .avi, .mov, .webm, .flv, .wmv, .mkv, .3gp"
                  multiple
                  style={{ display: "none" }}
                  onChange={(e) => uploadFiles(e.target.files!)}
                />
                <IconButton component="span">
                  <CloudUploadIcon />
                </IconButton>
                Upload Images/Videos
              </label>

              {!showProgress ? null : (
                <>
                  <LinearProgressBar progress={progress} />
                  Status: {uploadState}
                  <br />
                  FileUploaded:{fileName}
                </>
              )}

              <Box
                display="flex"
                sx={{ marginTop: "20px" }}
                justifyContent="space-between"
                gap="20px"
              >
                <Button
                  disabled={loading}
                  variant="contained"
                  style={{ backgroundColor: "red" }}
                  onClick={() => {
                    handleClose();
                    setFileData([]);
                  }}
                >
                  Discard
                </Button>

                {Object.keys(story).length === 0 ? (
                  <Button
                    disabled={loading || fileData.length === 0}
                    variant="contained"
                    onClick={handlePublish}
                  >
                    Publish
                  </Button>
                ) : (
                  <Button
                    disabled={loading || fileData.length === 0}
                    variant="contained"
                    onClick={handleUpdateStory}
                  >
                    Update
                  </Button>
                )}
              </Box>
            </Box>
          </>
        )}
      </Box>
    </Modal>
  );
};

export default CreateStoryModal;
