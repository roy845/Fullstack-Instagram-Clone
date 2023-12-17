import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { TextField } from "@mui/material";
import toast from "react-hot-toast";
import { getComment, updateComment } from "../Api/serverAPI";
import { CommentType, Post } from "../types";
import Spinner from "./Spinner";

interface EditCommentModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  comment: CommentType;
  setPost: React.Dispatch<React.SetStateAction<Post>>;
  postId: string;
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
};

const EditCommentModal: React.FC<EditCommentModalProps> = ({
  open,
  setOpen,
  comment,
  setPost,
  postId,
}) => {
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchComment = async () => {
      try {
        const { data } = await getComment(postId, comment?._id);
        setContent(data.content);
      } catch (error) {
        console.log(error);
      }
    };

    fetchComment();
  }, [comment?._id]);

  const handleSave = async () => {
    try {
      setLoading(true);
      const { data: post } = await updateComment(postId, comment?._id, content);
      setPost(post);
      setLoading(false);
      toast.success("Comment updated successfully");

      setOpen(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleClose = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Edit comment
          </Typography>
          <TextField
            label="content"
            value={content}
            onChange={(e) => {
              const newValue = e.target.value;
              setContent(newValue);
            }}
            sx={{ width: "100%", mt: "10px" }}
          />

          <Box
            display="flex"
            sx={{ marginTop: "20px" }}
            justifyContent="space-between"
            gap="200px"
          >
            <Button
              disabled={loading}
              variant="contained"
              style={{ backgroundColor: "red" }}
              onClick={() => {
                setOpen(false);
              }}
            >
              Discard
            </Button>
            <Button
              disabled={loading || !content}
              onClick={handleSave}
              variant="contained"
            >
              SAVE
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default EditCommentModal;
