import { Box, Typography } from "@mui/material";
import DynamicFeedIcon from "@mui/icons-material/DynamicFeed";

const NoPostsExplore: React.FC = () => {
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
      <DynamicFeedIcon fontSize="large" color="action" />
      <Typography variant="h6" color="textSecondary" gutterBottom>
        There are no posts to explore
      </Typography>
    </Box>
  );
};

export default NoPostsExplore;
