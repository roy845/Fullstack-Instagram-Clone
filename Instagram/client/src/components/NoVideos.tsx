import { Box, Typography } from "@mui/material";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";

interface NoVideosProps {
  dark?: boolean;
}

const NoVideos: React.FC<NoVideosProps> = ({ dark }) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      p={2}
      border={1}
      borderRadius={4}
      borderColor={dark ? "white" : "grey.300"}
      bgcolor={dark ? "black" : "grey.100"}
      textAlign="center"
    >
      <VideocamOffIcon
        fontSize="large"
        style={{ color: dark ? "white" : "gray" }}
      />
      <Typography
        variant="h6"
        color={dark ? "white" : "textSecondary"}
        gutterBottom
      >
        No videos uploaded yet
      </Typography>
    </Box>
  );
};

export default NoVideos;
