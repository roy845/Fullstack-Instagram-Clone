import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Grid,
  IconButton,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import {
  DeleteOutline as DeleteIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import { format } from "timeago.js";
import { HEART_IMAGE, LIKE_IMAGE } from "../constants/paths";
import { useAuth } from "../context/auth";
import { CommentType, Post, User } from "../types";
import toast from "react-hot-toast";
import AlertDialog from "./AlertDialog";
import {
  deleteComment,
  followUser,
  getCommentLikes,
  likeComment,
  unfollowUser,
} from "../Api/serverAPI";
import EditCommentModal from "./EditCommentModal";
import BasicModal from "./BasicModal";
import NoLikes from "./NoLikes";
import Spinner from "./Spinner";
import { useUsers } from "../context/users";
import { HTTP_403_FORBIDDEN } from "../constants/httpStatusCodes";

interface CommentProps {
  comment: CommentType;
  postId: string;
  friends: User[];
  setPost: React.Dispatch<React.SetStateAction<Post>>;
}

const Comment: React.FC<CommentProps> = ({
  comment,
  postId,
  setPost,
  friends,
}) => {
  const [likes, setLikes] = useState<User[]>([] as User[]);
  const [loading, setLoading] = useState<boolean>(false);
  const [openLikesModal, setOpenLikesModal] = useState(false);
  const [openDeleteCommentDialog, setOpenDeleteCommentDialog] = useState(false);
  const [openEditCommentDialog, setOpenEditCommentDialog] = useState(false);
  const [loadingFollowUnfollowUser, setLoadingFollowUnfollowUser] =
    useState<boolean>(false);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const { auth } = useAuth();

  const { currentUserFollowings, setCurrentUserFollowings, activeUsers } =
    useUsers();
  const isUserActive = activeUsers.some((u) => u?._id === comment?.user?._id);

  const handleLikesModal = () => {
    setOpenLikesModal(true);
  };

  const deleteCommentFromPost = async (): Promise<void> => {
    try {
      const { data: post } = await deleteComment(postId, comment?._id);
      setPost(post);
      setOpenDeleteCommentDialog(false);
      toast.success("Comment deleted successfully", {
        position: "bottom-left",
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchCommentLikes = async (): Promise<void> => {
      try {
        setLoading(true);
        const { data } = await getCommentLikes(postId, comment?._id);
        setLoading(false);
        setLikes(data);
      } catch (error: any) {
        toast.error(error);
        setLoading(false);
      }
    };

    postId && fetchCommentLikes();
  }, [postId]);

  const likeHandler = async () => {
    try {
      setLoading(true);
      const { data } = await likeComment(postId, comment?._id);
      setLikes(data.updated_comment_likes);
      setLoading(false);
      toast.success(data.message, { position: "bottom-left" });
    } catch (error: any) {
      toast.error(error);
      setLoading(false);
    }
  };

  const handleEditComment = () => {
    setOpenEditCommentDialog(true);
  };

  const handleDeleteComment = () => {
    setOpenDeleteCommentDialog(true);
  };

  const renderContentWithMentions = (
    content: string
  ): (string | JSX.Element)[] => {
    const contentArray = content?.split(" ");
    return contentArray?.map((word, index) => {
      if (word.startsWith("@")) {
        // This is a mention, let's extract the username
        const username = word?.slice(1);
        const friend = friends.find((friend) => friend.username === username);
        // Check if the username is in your friends list
        const isFriend = friends?.find(
          (friend) => friend.username === username
        );
        if (isFriend) {
          return (
            <Link
              to={`/profile/${username}/${friend?._id as string}`}
              key={index}
              style={{ textDecoration: "none", color: "blue" }}
            >
              {word}{" "}
            </Link>
          );
        } else {
          return word + " ";
        }
      } else {
        return word + " ";
      }
    });
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

  let contentLikesModal = (
    <>
      {likes.length === 0 && <NoLikes />}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        {likes?.map((like, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <Link to={`/profile/${like.username}/${like._id}`}>
              <Tooltip title={like.username}>
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
    <Paper
      elevation={3}
      key={comment?._id}
      style={{
        padding: "16px",
        marginBottom: "15px",
      }}
    >
      <Grid
        container
        spacing={2}
        key={comment?._id}
        style={{
          padding: "10px",
        }}
      >
        <Grid item>
          <Link
            style={{ textDecoration: "none", cursor: "pointer" }}
            to={`/profile/${comment?.user?.username}/${comment?.user?._id}`}
          >
            <Avatar
              alt={comment?.user?.username}
              src={comment?.user?.profilePic?.url}
            />
          </Link>
        </Grid>

        <Grid item xs>
          <Typography variant="subtitle1" component="div">
            <strong>{comment?.user?.username}</strong>
          </Typography>

          <Typography variant="h5">
            {renderContentWithMentions(comment?.content)}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {format(comment?.createdAt)}
          </Typography>

          <div style={{ display: "flex", alignItems: "center" }}>
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
              {loading ? <Spinner sm /> : likes?.length + " people like it"}
            </Typography>
          </div>

          <Box display="flex" alignItems="center" justifyContent="flex-end">
            {auth?.user?._id === comment?.user?._id || auth?.user?.isAdmin ? (
              <IconButton color="primary" onClick={handleEditComment}>
                <EditIcon />
              </IconButton>
            ) : null}
            {auth?.user?._id === comment?.user?._id || auth?.user?.isAdmin ? (
              <IconButton color="error" onClick={handleDeleteComment}>
                <DeleteIcon />
              </IconButton>
            ) : null}
          </Box>
        </Grid>
      </Grid>
      {openDeleteCommentDialog && (
        <AlertDialog
          open={openDeleteCommentDialog}
          setOpen={setOpenDeleteCommentDialog}
          title="Delete comment"
          content="Are you sure do you want to delete this comment ?"
          handleFunction={deleteCommentFromPost}
        />
      )}
      {openEditCommentDialog && (
        <EditCommentModal
          setPost={setPost}
          open={openEditCommentDialog}
          setOpen={setOpenEditCommentDialog}
          comment={comment}
          postId={postId}
        />
      )}
      <BasicModal
        open={openLikesModal}
        setOpen={setOpenLikesModal}
        title="Likes"
        content={contentLikesModal}
      />
    </Paper>
  );
};

export default Comment;
