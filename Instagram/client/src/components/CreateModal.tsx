import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import { useState } from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { FileData, PostCreate } from "../types";
import toast from "react-hot-toast";
import {
  StorageReference,
  UploadTask,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useAuth } from "../context/auth";
import storage from "../config/firebase";
import { getFileTypeFromExtension } from "../helpers/helpers";
import LinearProgressBar from "./LinearProgressBar";
import ImageSlider from "./ImageSlider";
import CreateModalTabs from "./CreateModalTabs";
import SongsCarousel from "./SongsCarousel";
import VideosCarousel from "./VideosCarousel";
import { createPost } from "../Api/serverAPI";
import { usePosts } from "../context/posts";
import { Backdrop, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

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
};

type CreateModalProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const CreateModal = ({ open, setOpen }: CreateModalProps) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [desc, setDesc] = useState<string>("");
  const [fileData, setFileData] = useState<FileData[]>([]); // Use an array to store file data
  const [progress, setProgress] = useState(0);
  const [showProgress, setShowProgress] = useState<boolean>(false);
  const [uploadState, setUploadState] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  const [images, setImages] = useState<FileData[]>([]);
  const [songs, setSongs] = useState<FileData[]>([]);
  const [videos, setVideos] = useState<FileData[]>([]);

  const { auth } = useAuth();
  const { setPosts } = usePosts();

  const handleNextStep = (): void => {
    setCurrentStep(currentStep + 1);
  };

  const handlePrevStep = (): void => {
    setCurrentStep(currentStep - 1);
  };

  const handleClose = (): void => {
    setOpen(false);
  };

  const uploadFiles = async (files: FileList): Promise<void> => {
    setShowProgress(true);
    const uploadPromises = [];

    for (const file of files) {
      if (file.size > 100 * 1024 * 1024) {
        toast.error(`File ${file.name} size exceeds the 100 MB limit.`, {
          position: "bottom-left",
        });
        continue;
      }

      const fileName = new Date().getTime() + file.name;

      const storageRef: StorageReference = ref(
        storage,
        `${auth?.user?.username}/files/${fileName}`
      );

      const uploadTask: UploadTask = uploadBytesResumable(storageRef, file);
      setFileName(file.name);

      const fileExtension: string = getFileTypeFromExtension(
        file.name.split(".").pop() as string
      );

      const fileObject: FileData = {
        id: fileName,
        url: null,
        type: fileExtension,
        publish: false,
      };

      uploadPromises.push(
        new Promise<void>((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const newProgress: number =
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
                fileObject.type === "image" &&
                  setImages(
                    (imageData) => [...imageData, fileObject] as FileData[]
                  );
                fileObject.type === "song" &&
                  setSongs(
                    (songData) => [...songData, fileObject] as FileData[]
                  );
                fileObject.type === "movie" &&
                  setVideos(
                    (videoData) => [...videoData, fileObject] as FileData[]
                  );

                resolve();
                handleNextStep();
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

  const handlePost = async (): Promise<void> => {
    try {
      type UpdatedFileData = {
        publish: boolean;
        id: string;
        url: string | null;
        type: string;
      }[];

      const updatedFileData: UpdatedFileData = [
        ...images,
        ...songs,
        ...videos,
      ].map((file) => ({
        ...file,
        publish: true,
      }));

      const postData: PostCreate = {
        files: updatedFileData,
        description: desc,
      };

      if (images.length === 0) {
        toast.error("Cannot post new post without images");
        return;
      }

      if (updatedFileData.length === 0) {
        toast.error("Cannot post new post without files");
        setOpen(false);
        return;
      }

      const { data } = await createPost(postData as PostCreate);

      setPosts(data.all_user_posts);
      toast.success(data?.message, { position: "bottom-left" });
      setOpen(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.detail, { position: "bottom-left" });
    }
  };

  const renderMoviesTab = (): JSX.Element => {
    return (
      <div>{<VideosCarousel videos={videos} setVideos={setVideos} />}</div>
    );
  };

  const renderSongsTab = (): JSX.Element => {
    return (
      <div>
        <SongsCarousel songs={songs} setSongs={setSongs} />
      </div>
    );
  };
  const renderImagesTab = (): JSX.Element => {
    return (
      <div>
        {/* Render the uploaded images */}
        {images.length > 0 && (
          <ImageSlider slides={images} setImages={setImages} />
        )}
      </div>
    );
  };

  const renderDescriptionStep = () => {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Your description input and other UI for step two */}
        <textarea
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="Enter your description"
          style={{ marginBottom: "10px", marginTop: "10px" }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <Button variant="contained" color="primary" onClick={handlePost}>
            Post
          </Button>
          <Button onClick={handlePrevStep} variant="contained">
            Back
          </Button>
        </div>
      </div>
    );
  };
  let content;

  if (currentStep === 1) {
    content = (
      <>
        <img
          src={"https://cdn-icons-png.flaticon.com/512/3342/3342137.png"}
          height={200}
          width={200}
          style={{ marginBottom: "10px" }}
        />
        <Typography
          id="modal-modal-title"
          sx={{ textAlign: "center", mb: 2 }}
          variant="h6"
          component="h2"
        >
          Upload images/videos from your computer
        </Typography>
        <input
          multiple
          accept=".png, .jpeg, .jpg, .mkv, .mp4, .avi, .mov, .webm, .flv, .wmv, .mkv, .3gp,.mp3"
          id="contained-button-file"
          type="file"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            uploadFiles(e.target.files!);
          }}
          style={{ display: "none" }}
        />
        {!showProgress ? null : (
          <>
            <LinearProgressBar progress={progress} />
            Status: {uploadState}
            <br />
            FileUploaded:{fileName}
          </>
        )}
        <label htmlFor="contained-button-file">
          <Button
            variant="contained"
            component="span"
            startIcon={<AddPhotoAlternateIcon />}
          >
            Upload files
          </Button>
        </label>
        <Button
          variant="contained"
          color="primary"
          onClick={handleNextStep}
          disabled={images.length === 0}
          style={{ marginLeft: "10px" }}
        >
          Next
        </Button>
      </>
    );
  }

  if (currentStep === 2) {
    content = (
      <>
        <CreateModalTabs
          imagesLength={images.length}
          videosLength={videos.length}
          songsLength={songs.length}
          images={renderImagesTab()}
          videos={renderMoviesTab()}
          songs={renderSongsTab()}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <Button variant="contained" color="primary" onClick={handleNextStep}>
            Next
          </Button>
          <Button onClick={handlePrevStep} variant="contained">
            Back
          </Button>
        </div>
      </>
    );
  }

  if (currentStep === 3) {
    content = <div>{renderDescriptionStep()}</div>;
  }

  if (!fileData && !images) {
    return null;
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Box sx={style}>
        <IconButton
          sx={{
            position: "absolute",
            top: -30,
            left: -30,
            zIndex: 1,
            color: "red",
            cursor: "pointer",
          }}
          onClick={() => setOpen(false)}
        >
          <CloseIcon />
        </IconButton>
        <Typography
          id="modal-modal-title"
          sx={{ textAlign: "center", mb: 2 }}
          variant="h6"
          component="h2"
        >
          {currentStep === 1
            ? "Upload Files"
            : currentStep === 2
            ? "Files Uploaded"
            : "Add Description and post"}
        </Typography>
        <Divider />
        <Grid container spacing={2} alignItems="center" justifyContent="center">
          <Grid item xs={12} container justifyContent="center">
            {content}
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};

export default CreateModal;
