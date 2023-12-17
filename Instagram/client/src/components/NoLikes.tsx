import { Box, Typography } from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";

interface NoLikesProps {
  post?: boolean;
}

const NoLikes: React.FC<NoLikesProps> = ({ post }) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      p={2}
      border={1}
      borderRadius={4}
      borderColor="grey.300"
      bgcolor="grey.100"
      textAlign="center"
    >
      <ThumbUpIcon fontSize="large" color="action" />
      <Typography variant="h6" color="textSecondary" gutterBottom>
        No likes yet
      </Typography>
      <Typography variant="body2" color="textSecondary">
        Be the first one to like this {post ? "post" : "comment"}.
      </Typography>
    </Box>
  );
};

export default NoLikes;
