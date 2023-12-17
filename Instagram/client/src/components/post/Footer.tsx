import { Post, User } from "../../types";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { NavigateFunction, useNavigate } from "react-router";
import {
  addComment,
  followUser,
  getFriends,
  getPostById,
  getUsersByUsername,
  likePost,
  unfollowUser,
} from "../../Api/serverAPI";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import Spinner from "../Spinner";
import { useAuth } from "../../context/auth";
import NoLikes from "../NoLikes";
import { Link } from "react-router-dom";
import {
  Avatar,
  Box,
  Divider,
  Paper,
  Popper,
  TextField,
  Tooltip,
} from "@mui/material";
import { useUsers } from "../../context/users";
import BasicModal from "../BasicModal";
import {
  HTTP_403_FORBIDDEN,
  HTTP_404_NOT_FOUND,
} from "../../constants/httpStatusCodes";
import { IoMdSend } from "react-icons/io";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import EmojiEmotionsOutlinedIcon from "@mui/icons-material/EmojiEmotionsOutlined";
import { filterNamesWithAtSymbol } from "../../helpers/helpers";
import { useSocket } from "../../context/socket";

type FooterProps = {
  content: Post;
};

const Footer: React.FC<FooterProps> = ({ content }) => {
  const navigate: NavigateFunction = useNavigate();

  const [updatePostLikes, setUpdatePostLikes] = useState<boolean>(false);
  const [postLikes, setPostLikes] = useState<number>(content?.likes?.length!);
  const [postComments, setPostComments] = useState<number>(
    content?.comments?.length!
  );
  const [isUserLiked, setIsUserLiked] = useState<boolean>(false);
  const [openLikesModal, setOpenLikesModal] = useState<boolean>(false);
  const [post, setPost] = useState<Post>({} as Post);
  const [loadingFollowUnfollowUser, setLoadingFollowUnfollowUser] =
    useState<boolean>(false);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const { auth, setAuth } = useAuth();
  const { socket } = useSocket();
  const { currentUserFollowings, setCurrentUserFollowings, activeUsers } =
    useUsers();
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const isUserActive = activeUsers.some((u) => u?._id === content?.user?._id);
  const [comment, setComment] = useState<string>("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [friends, setFriends] = useState<User[]>([] as User[]);

  const handleEmojiModal = (): void => {
    setShowEmojiPicker(!showEmojiPicker);
  };
  const handleEmojiClick = (emoji: EmojiClickData): void => {
    setComment((prevComment) => (prevComment += emoji.emoji));
  };

  const handleClose = (): void => {
    setAnchorEl(null);
  };

  useEffect(() => {
    const fetchPostById = async (): Promise<void> => {
      try {
        const { data: post } = await getPostById(content?._id);
        setPost(post);
        setIsUserLiked(
          post?.likes?.some((u: User) => u._id === auth?.user?._id)
        );
      } catch (error: any) {
        toast.error(error);
      }
    };

    fetchPostById();
  }, []);

  useEffect(() => {
    const fetchUserFriends = async (): Promise<void> => {
      try {
        const {
          data: { friends },
        } = await getFriends(auth?.user?._id as string);

        setFriends(friends);
      } catch (error: any) {
        if (error?.response?.data?.detail === HTTP_404_NOT_FOUND) {
          setAuth(null);
          localStorage.removeItem("auth");
          navigate("/");
          toast.error(error?.response?.data?.detail, {
            position: "bottom-left",
          });
        }
      }
    };
    fetchUserFriends();
  }, []);

  const likeHandler = async (postId: string): Promise<void> => {
    try {
      setUpdatePostLikes(true);
      const { data: updatedPost } = await likePost(postId);
      setPost(updatedPost?.updated_post);
      setPostLikes(updatedPost?.updated_post?.likes?.length);
      setIsUserLiked(
        updatedPost?.updated_post?.likes?.some(
          (u: User) => u._id === auth?.user?._id
        )
      );
      setUpdatePostLikes(false);
      toast.success(updatedPost.message, { position: "bottom-left" });
    } catch (error: any) {
      toast.error(error);
      setUpdatePostLikes(false);
    }
  };

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

  const addCommentToPost = async (postId: string): Promise<void> => {
    try {
      const { data: post } = await addComment(postId, comment);
      toast.success("Comment added successfully", { position: "bottom-left" });

      if (comment.includes("@")) {
        const mentions: string[] = filterNamesWithAtSymbol(comment);
        const {
          data: { users },
        } = await getUsersByUsername(mentions);

        socket.emit("postMention", { users, auth, post });
      }
      setPostComments(post?.comments?.length);
      //  setPost(post);
      setComment("");
    } catch (error: any) {
      if (error?.response?.status === HTTP_404_NOT_FOUND) {
        toast.error(error?.response?.data?.detail, {
          position: "bottom-left",
        });
      }

      setComment("");
    }
  };

  let contentLikesModal = (
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
    <>
      <div className="p-4 pt-2 pb-1 flex justify-between items-center">
        <div className="flex items-center">
          <span className="mr-1 font-bold">{content?.user?.username}</span>
          <span className="italic">{content?.description}</span>
        </div>
        <div className="flex items-center">
          <div className="flex items-center">
            <button
              onClick={() => navigate(`/post/${content?._id}`)}
              className="flex items-center justify-start h-10"
            >
              <span className="mr-2">
                <Tooltip title="Show comments">
                  <ChatBubbleOutlineOutlinedIcon className="cursor-pointer hover:to-gray-slate300" />
                </Tooltip>
              </span>
            </button>
            <strong>
              <span
                className="cursor-pointer"
                onClick={() => navigate(`/post/${content?._id}`)}
              >
                {postComments} comments
              </span>
            </strong>
            <button
              onClick={() => likeHandler(content?._id)}
              className="flex items-center justify-start h-10 ml-2"
            >
              <span className="mr-2">
                {updatePostLikes ? (
                  <Spinner sm />
                ) : isUserLiked ? (
                  <FavoriteIcon color="error" />
                ) : (
                  <FavoriteBorderOutlinedIcon className="cursor-pointer" />
                )}
              </span>
            </button>
            <strong>
              <span
                className="cursor-pointer"
                onClick={() => setOpenLikesModal(true)}
              >
                {postLikes} likes
              </span>
            </strong>
          </div>
        </div>
      </div>
      <div className="p-4 flex items-center">
        {true && (
          <>
            <EmojiEmotionsOutlinedIcon
              className="text-panel-header-icon cursor-pointer text-xl mr-2"
              onClick={handleEmojiModal}
            />
            {showEmojiPicker && (
              <div
                className="relative
              "
              >
                <EmojiPicker onEmojiClick={handleEmojiClick} />
              </div>
            )}
          </>
        )}
        <TextField
          label="Add comment"
          margin="normal"
          fullWidth
          value={comment}
          variant="outlined"
          onChange={(
            e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
          ) => {
            const newValue: string = e.target.value;

            setComment(newValue);
            if (newValue.includes("@")) {
              setAnchorEl(e.currentTarget);
            } else {
              setAnchorEl(null);
            }
          }}
          onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              addCommentToPost(content?._id);
            }
          }}
          style={{ width: "100%" }}
        />
        {comment && (
          <IoMdSend
            className="ml-5 text-lg cursor-pointer text-blue-medium"
            onClick={() => addCommentToPost(content?._id)}
          />
        )}
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
                      setComment(
                        (prevComment) => prevComment + friend.username
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
      </div>
      {openLikesModal && (
        <BasicModal
          open={openLikesModal}
          setOpen={setOpenLikesModal}
          title="Likes"
          content={contentLikesModal}
        />
      )}
    </>
  );
};

export default Footer;
