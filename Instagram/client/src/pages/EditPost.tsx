import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Modal,
  Paper,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useState, useEffect } from "react";
import {
  Link,
  NavigateFunction,
  useNavigate,
  useParams,
} from "react-router-dom";
import { Close } from "@mui/icons-material";
import Spinner from "../components/Spinner";
import { getPostById, updatePost } from "../Api/serverAPI";
import { FileData, Post, PostCreate } from "../types";
import { useAuth } from "../context/auth";
import toast from "react-hot-toast";
import {
  HTTP_401_UNAUTHORIZED,
  HTTP_404_NOT_FOUND,
} from "../constants/httpStatusCodes";
import {
  filterFilesByType,
  getFileTypeFromExtension,
} from "../helpers/helpers";
import ImageSlider from "../components/ImageSlider";
import SongsCarousel from "../components/SongsCarousel";
import VideosCarousel from "../components/VideosCarousel";
import CreateModalTabs from "../components/CreateModalTabs";
import LinearProgressBar from "../components/LinearProgressBar";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import {
  StorageReference,
  UploadTask,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import storage from "../config/firebase";
import { useUsers } from "../context/users";
import { MoreVert as MoreVertIcon } from "@mui/icons-material";

type EditPostProps = {};

const EditPost: React.FC<EditPostProps> = ({}) => {
  const { postId } = useParams<string>();
  const navigate: NavigateFunction = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [post, setPost] = useState<Post>({} as Post);
  const [images, setImages] = useState<FileData[]>([]);
  const [songs, setSongs] = useState<FileData[]>([]);
  const [videos, setVideos] = useState<FileData[]>([]);
  const [progress, setProgress] = useState(0);
  const [showProgress, setShowProgress] = useState<boolean>(false);
  const [uploadState, setUploadState] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");

  const { auth, setAuth } = useAuth();

  const { activeUsers } = useUsers();

  const isUserActive = activeUsers.some((u) => u?._id === post?.user?._id);

  useEffect(() => {
    const fetchPostById = async (): Promise<void> => {
      try {
        setLoading(true);
        const { data: post } = await getPostById(postId as string);

        const updatedFiles = post.files.map((file: FileData) => ({
          ...file,
          publish: false,
        }));

        setImages(filterFilesByType(updatedFiles as FileData[], "image"));
        setSongs(filterFilesByType(updatedFiles as FileData[], "song"));
        setVideos(filterFilesByType(updatedFiles as FileData[], "movie"));

        // Update the post object with the modified files array
        const updatedPost = { ...post, files: updatedFiles };

        setPost(updatedPost);
        setLoading(false);
      } catch (error: any) {
        if (error?.response?.data?.detail === HTTP_404_NOT_FOUND) {
          setAuth(null);
          localStorage.removeItem("auth");
          navigate("/");
          toast.error(error?.response?.data?.detail, {
            position: "bottom-left",
          });
        }
        setLoading(false);
      }
    };
    fetchPostById();
  }, [postId]);

  const renderImages = (images: FileData[]) => (
    <div>
      <ImageSlider slides={images} setImages={setImages} />
    </div>
  );

  const renderSongs = (songs: FileData[]) => (
    <div>
      <SongsCarousel songs={songs} setSongs={setSongs} />
    </div>
  );

  const renderVideos = (videos: FileData[]) => (
    <div>
      <VideosCarousel videos={videos} setVideos={setVideos} />
    </div>
  );

  const handlePostChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setPost({ ...post, [name]: value });
  };

  const handleUpdatePost = async (): Promise<void> => {
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
        description: post?.description,
      };

      if (updatedFileData.length === 0) {
        toast.error("Cannot post new post without files");
        return;
      }

      const { data } = await updatePost(
        postId as string,
        postData as PostCreate
      );
      navigate(-1);
      toast.success(data?.message, { position: "bottom-left" });
    } catch (error: any) {
      if (error?.response?.status === HTTP_401_UNAUTHORIZED) {
        setAuth(null);
        localStorage.removeItem("auth");
        navigate("/");
      }
      toast.error(error?.response?.data?.detail, { position: "bottom-left" });
    }
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

  return (
    <Modal
      open={true}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {loading ? (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          height="100vh" // You can adjust the height to fit your layout
        >
          <Spinner />
        </Box>
      ) : (
        <>
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
            <section
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px",
              }}
            >
              <Button
                onClick={() => {
                  navigate(-1);
                }}
                sx={{
                  position: "absolute",
                  left: -15,
                  top: 65,
                  backgroundColor: "transparent",
                  color: "#000",
                  "&:hover": {
                    backgroundColor: "transparent",
                  },
                }}
              >
                <Close />
              </Button>

              {auth?.user?._id === post?.user?._id && (
                <MoreVertIcon sx={{ color: "white" }} />
              )}

              <Tooltip title={post?.user?.username}>
                <Link
                  to={`/profile/${post?.user?.username}/${post?.user?._id}`}
                >
                  <div className="relative">
                    <Avatar
                      src={post?.user?.profilePic?.url}
                      sx={{
                        marginTop: "10px",
                        marginBottom: "10px",
                        cursor: "pointer",
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
              </Tooltip>
            </section>

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <CreateModalTabs
                  imagesLength={images.length}
                  videosLength={videos.length}
                  songsLength={songs.length}
                  images={renderImages(images)}
                  videos={renderVideos(videos)}
                  songs={renderSongs(songs)}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Paper
                  sx={{
                    overflow: "auto",
                    maxHeight: "500px",
                    "&::-webkit-scrollbar": {
                      width: "4px",
                    },
                    "&::-webkit-scrollbar-thumb": {
                      backgroundColor: "#888",
                    },
                  }}
                >
                  <CardContent>
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
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          marginTop: "10px",
                        }}
                      >
                        {" "}
                        <Button
                          variant="contained"
                          component="span"
                          startIcon={<AddPhotoAlternateIcon />}
                        >
                          Upload files
                        </Button>
                      </div>
                    </label>
                  </CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      flexDirection: "column",

                      padding: "8px",
                      position: "sticky",
                      bottom: 0,
                      zIndex: "1",
                      backgroundColor: "white",
                    }}
                  >
                    <TextField
                      label="Description"
                      name="description"
                      onChange={handlePostChange}
                      placeholder="Post description"
                      value={post?.description}
                    />
                  </Box>
                </Paper>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: "10px",
                  }}
                >
                  <Button variant="contained" onClick={handleUpdatePost}>
                    Update Post
                  </Button>
                </div>
              </Grid>
            </Grid>
          </Card>
        </>
      )}
    </Modal>
  );
};

export default EditPost;
