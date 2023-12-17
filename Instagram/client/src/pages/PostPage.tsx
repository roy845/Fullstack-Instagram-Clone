import React, { useState, useEffect } from "react";
import {
  Link,
  NavigateFunction,
  useNavigate,
  useParams,
} from "react-router-dom";
import toast from "react-hot-toast";
import {
  HTTP_403_FORBIDDEN,
  HTTP_404_NOT_FOUND,
} from "../constants/httpStatusCodes";
import {
  addComment,
  deletePostById,
  followUser,
  getFriends,
  getPostById,
  getUsersByUsername,
  likePost,
  unfollowUser,
} from "../Api/serverAPI";
import { CommentType, FileData, Post, User } from "../types";
import {
  Button,
  Tooltip,
  Menu,
  MenuItem,
  IconButton,
  Box,
  Typography,
  Popper,
  Divider,
} from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { Avatar } from "@mui/material";
import Modal from "@mui/material/Modal";
import { useAuth } from "../context/auth";
import {
  Close,
  MoreVert as MoreVertIcon,
  Delete,
  Update,
} from "@mui/icons-material";
import Comment from "../components/Comment";
import NoComments from "../components/NoComments";
import Spinner from "../components/Spinner";
import AlertDialog from "../components/AlertDialog";
import CreateModalTabs from "../components/CreateModalTabs";
import { filterFilesByType, filterNamesWithAtSymbol } from "../helpers/helpers";
import ImageSlider from "../components/ImageSlider";
import SongsCarousel from "../components/SongsCarousel";
import VideosCarousel from "../components/VideosCarousel";
import { HEART_IMAGE, LIKE_IMAGE } from "../constants/paths";
import { format } from "timeago.js";
import { deleteObject, ref } from "firebase/storage";
import storage from "../config/firebase";
import BasicModal from "../components/BasicModal";
import NoLikes from "../components/NoLikes";
import { useUsers } from "../context/users";
import { IoMdSend } from "react-icons/io";
import { useSocket } from "../context/socket";
import EmojiEmotionsOutlinedIcon from "@mui/icons-material/EmojiEmotionsOutlined";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";

type Props = {};

const PostPage: React.FC<Props> = () => {
  const [post, setPost] = useState<Post>({} as Post);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [updatePostLikes, setUpdatePostLikes] = useState<boolean>(false);
  const [openDeletePostModal, setOpenDeletePostModal] =
    useState<boolean>(false);
  const [openLikesModal, setOpenLikesModal] = useState(false);
  const [loadingFollowUnfollowUser, setLoadingFollowUnfollowUser] =
    useState<boolean>(false);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const { postId } = useParams();
  const navigate: NavigateFunction = useNavigate();
  const { auth, setAuth } = useAuth();
  const { currentUserFollowings, setCurrentUserFollowings, activeUsers } =
    useUsers();
  const [friends, setFriends] = useState<User[]>([] as User[]);
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const { socket } = useSocket();

  const isUserActive = activeUsers.some((u) => u?._id === post?.user?._id);

  const handleLikesModal = (): void => {
    setOpenLikesModal(true);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>): void => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleEmojiModal = (): void => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleEmojiClick = (emoji: EmojiClickData): void => {
    setContent((prevContent) => (prevContent += emoji.emoji));
  };

  const handleMenuClose = (): void => {
    setMenuAnchorEl(null);
  };

  const handleUpdatePost = (): void => {
    navigate(`/editPost/${postId}`);
    handleMenuClose();
  };

  const handleDeletePost = (): void => {
    setOpenDeletePostModal(true);
  };

  const handleClose = (): void => {
    setAnchorEl(null);
  };

  const handleRemoveFile = async (id: string): Promise<void> => {
    const fileToRemove = post?.files?.find((file) => file.id === id);

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

  const handleDeleteAllPostFiles = async (): Promise<void> => {
    try {
      setLoading(true);

      for (const file of post?.files!) {
        await handleRemoveFile(file?.id);
      }

      setLoading(false);
    } catch (error: any) {
      toast.error(error, { position: "bottom-left" });
    }
  };

  const deletePost = async (): Promise<void> => {
    try {
      await deletePostById(postId as string);
      await handleDeleteAllPostFiles();
      toast.success("Post and files deleted successfully", {
        position: "bottom-left",
      });
      setOpenDeletePostModal(false);
      navigate(-1);
    } catch (error: any) {
      toast.error(error);
    }
  };

  useEffect(() => {
    const fetchPostById = async (): Promise<void> => {
      try {
        setLoading(true);
        const { data: post } = await getPostById(postId as string);

        setPost(post);
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

  useEffect(() => {
    const fetchUserFriends = async (): Promise<void> => {
      try {
        setLoading(true);
        const {
          data: { friends },
        } = await getFriends(auth?.user?._id as string);

        setFriends(friends);
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
    fetchUserFriends();
  }, []);

  const addCommentToPost = async (): Promise<void> => {
    try {
      const { data: post } = await addComment(postId as string, content);

      if (content.includes("@")) {
        const mentions: string[] = filterNamesWithAtSymbol(content);
        const {
          data: { users },
        } = await getUsersByUsername(mentions);

        socket.emit("postMention", { users, auth, post });
      }
      setPost(post);
      setContent("");
    } catch (error: any) {
      if (error?.response?.status === HTTP_404_NOT_FOUND) {
        toast.error(error?.response?.data?.detail, { position: "bottom-left" });
      }

      setContent("");
    }
  };

  const likeHandler = async (): Promise<void> => {
    try {
      setUpdatePostLikes(true);
      const { data: updatedPost } = await likePost(post?._id);
      setPost(updatedPost.updated_post);
      setUpdatePostLikes(false);
      toast.success(updatedPost.message, { position: "bottom-left" });
    } catch (error: any) {
      toast.error(error);
      setUpdatePostLikes(false);
    }
  };

  const images = filterFilesByType(post?.files as FileData[], "image");
  const songs = filterFilesByType(post?.files as FileData[], "song");
  const videos = filterFilesByType(post?.files as FileData[], "movie");

  const renderImages = (images: FileData[]): JSX.Element => (
    <div>
      <ImageSlider slides={images} />
    </div>
  );

  const renderSongs = (songs: FileData[]) => (
    <div>
      <SongsCarousel songs={songs} />
    </div>
  );

  const renderVideos = (videos: FileData[]) => (
    <div>
      <VideosCarousel videos={videos} />
    </div>
  );

  const handleFollow = async (userId: string): Promise<void> => {
    try {
      setLoadingFollowUnfollowUser(true);
      setSelectedUserId(userId);
      const { data } = await followUser(userId);
      toast.success("User followed successfully", { position: "bottom-left" });
      setCurrentUserFollowings(data.currentUserFollowingsList);

      setLoadingFollowUnfollowUser(false);
    } catch (error: any) {
      if (error?.response?.status === HTTP_403_FORBIDDEN) {
        toast.error(error?.response?.data?.detail, {
          position: "bottom-left",
        });
      }
      setLoadingFollowUnfollowUser(false);
    }
  };

  const handleUnfollow = async (userId: string): Promise<void> => {
    try {
      setLoadingFollowUnfollowUser(true);
      setSelectedUserId(userId);
      const { data } = await unfollowUser(userId);
      setCurrentUserFollowings(data.currentUserFollowingsList);

      setLoadingFollowUnfollowUser(false);
    } catch (err: any) {
      console.log(err);
      toast.error(err);
    }
    setLoadingFollowUnfollowUser(false);
  };

  let contentLikesModal: JSX.Element = (
    <>
      {post?.likes?.length === 0 && <NoLikes post />}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        {post?.likes?.map((like, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <Link to={`/profile/${like?.username}/${like?._id}`}>
              <Tooltip title={like?.username}>
                <div className="relative">
                  <Avatar src={like?.profilePic?.url} />
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
              </Tooltip>
            </Link>
            <span>{like?.username}</span>
            {auth?.user?._id !== like?._id && (
              <button
                className={
                  currentUserFollowings.some((u) => u?._id === like?._id)
                    ? "bg-red-primary font-bold text-sm rounded text-white w-20 h-8 mt-1 ml-2"
                    : "bg-blue-medium font-bold text-sm rounded text-white w-20 h-8 mt-1 ml-2"
                }
                type="button"
                onClick={() => {
                  currentUserFollowings.some((u) => u?._id === like?._id)
                    ? handleUnfollow(like?._id)
                    : handleFollow(like?._id);
                }}
              >
                {loadingFollowUnfollowUser && selectedUserId === like?._id ? (
                  <Spinner sm />
                ) : currentUserFollowings.some((u) => u?._id === like?._id) ? (
                  "Unfollow"
                ) : (
                  "Follow"
                )}
              </button>
            )}
          </div>
        ))}
      </div>
    </>
  );

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
          height="100vh"
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
              {auth?.user?._id === post?.user?._id && (
                <IconButton onClick={handleMenuOpen}>
                  <MoreVertIcon />
                </IconButton>
              )}
              <MoreVertIcon sx={{ color: "white" }} />
              {auth?.user?._id === post?.user?._id && (
                <Menu
                  anchorEl={menuAnchorEl}
                  open={Boolean(menuAnchorEl)}
                  onClose={handleMenuClose}
                >
                  <MenuItem onClick={handleUpdatePost}>
                    {" "}
                    <Update color="primary" /> Update
                  </MenuItem>
                  <MenuItem onClick={handleDeletePost}>
                    {" "}
                    <Delete color="error" />
                    Delete
                  </MenuItem>
                </Menu>
              )}

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
                  imagesLength={images?.length}
                  songsLength={songs?.length}
                  videosLength={videos?.length}
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
                    {post?.comments?.map((comment: CommentType) => (
                      <Comment
                        key={comment?._id!}
                        postId={post?._id}
                        comment={comment}
                        setPost={setPost}
                        friends={friends}
                      />
                    ))}

                    {post?.comments?.length === 0 && <NoComments />}
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
                    <strong>{post?.user?.username}:</strong> {post?.description}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginTop: "20px",
                      }}
                    >
                      <img
                        style={{
                          width: "24px",
                          height: "24px",
                          marginRight: "5px",
                          cursor: "pointer",
                        }}
                        src={LIKE_IMAGE}
                        alt=""
                        onClick={likeHandler}
                      />
                      <img
                        style={{
                          width: "24px",
                          height: "24px",
                          marginRight: "5px",
                          cursor: "pointer",
                        }}
                        src={HEART_IMAGE}
                        alt=""
                        onClick={likeHandler}
                      />
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        style={{ marginLeft: "4px", cursor: "pointer" }}
                        onClick={handleLikesModal}
                      >
                        {updatePostLikes ? (
                          <Spinner sm />
                        ) : (
                          post?.likes?.length + " people like it"
                        )}
                      </Typography>
                    </div>
                    <div className="text-sm mt-2">
                      {format(post?.createdAt)}
                    </div>
                    <div className="flex w-full items-center">
                      {true && (
                        <>
                          <EmojiEmotionsOutlinedIcon
                            className="text-panel-header-icon cursor-pointer text-xl mr-2"
                            onClick={handleEmojiModal}
                          />
                          {showEmojiPicker && (
                            <div className="relative">
                              <EmojiPicker onEmojiClick={handleEmojiClick} />
                            </div>
                          )}
                        </>
                      )}
                      <TextField
                        label="Add comment"
                        margin="normal"
                        value={content}
                        onChange={(
                          e: React.ChangeEvent<
                            HTMLInputElement | HTMLTextAreaElement
                          >
                        ) => {
                          const newValue: string = e.target.value;

                          setContent(newValue);
                          if (newValue.includes("@")) {
                            setAnchorEl(e.currentTarget);
                          } else {
                            setAnchorEl(null);
                          }
                        }}
                        onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            addCommentToPost();
                          }
                        }}
                        variant="outlined"
                        style={{ width: "100%" }}
                      />
                      {content && (
                        <IoMdSend
                          className="ml-5 text-lg cursor-pointer text-blue-medium"
                          onClick={addCommentToPost}
                        />
                      )}
                    </div>
                    <Paper style={{ position: "sticky", bottom: 0, zIndex: 1 }}>
                      <Box display="flex" alignItems="center">
                        <Popper
                          id="basic-menu"
                          anchorEl={anchorEl}
                          open={Boolean(anchorEl)}
                          onClick={handleClose}
                          style={{ zIndex: 99999, marginBottom: "100px" }}
                          placement="bottom-start"
                        >
                          <Paper>
                            {friends?.map((friend) => (
                              <li
                                className="list-none cursor-pointer hover:bg-gray-background mt-2"
                                key={friend.username}
                                onClick={() => {
                                  setContent(
                                    (prevContent) =>
                                      prevContent + friend.username
                                  );

                                  setAnchorEl(null);
                                }}
                              >
                                <div className="relative">
                                  <div className="flex">
                                    <Avatar
                                      className="rightbarProfileImg"
                                      src={friend.profilePic.url}
                                      alt=""
                                    />
                                    <span className="mx-auto ml-2 mt-2">
                                      <strong>{friend.username}</strong>
                                    </span>
                                  </div>

                                  <div className="absolute top-0 left-0">
                                    {activeUsers.some(
                                      (active) => active?._id === friend._id
                                    ) ? (
                                      <div
                                        className="absolute top-2 left-2 w-4 h-4 bg-green-primary rounded-full"
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
                                {friends.length > 0 && <Divider />}
                              </li>
                            ))}
                          </Paper>
                        </Popper>
                      </Box>
                    </Paper>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Card>
          {openDeletePostModal && (
            <AlertDialog
              open={openDeletePostModal}
              setOpen={setOpenDeletePostModal}
              title="Are you sure do you want to delete this post ?"
              content="This action will be irreversible"
              handleFunction={deletePost}
            />
          )}
          {openLikesModal && (
            <BasicModal
              open={openLikesModal}
              setOpen={setOpenLikesModal}
              title="Likes"
              content={contentLikesModal}
            />
          )}
        </>
      )}
    </Modal>
  );
};

export default PostPage;
