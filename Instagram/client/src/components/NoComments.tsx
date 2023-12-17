import React from "react";
import { Box, Typography } from "@mui/material";
import { Comment as CommentIcon } from "@mui/icons-material";

const NoComments: React.FC = () => {
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
      <CommentIcon fontSize="large" color="action" />
      <Typography variant="h6" color="textSecondary" gutterBottom>
        No comments yet
      </Typography>
      <Typography variant="body2" color="textSecondary">
        Be the first one to comment on this post.
      </Typography>
    </Box>
  );
};

export default NoComments;
