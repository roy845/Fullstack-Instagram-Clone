import { Box, Typography } from "@mui/material";
import MusicOffIcon from "@mui/icons-material/MusicOff";

interface NoSongsProps {
  dark?: boolean;
}

const NoSongs: React.FC<NoSongsProps> = ({ dark }) => {
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
      <MusicOffIcon
        fontSize="large"
        style={{ color: dark ? "white" : "gray" }}
      />
      <Typography
        variant="h6"
        color={dark ? "white" : "textSecondary"}
        gutterBottom
      >
        No songs uploaded yet
      </Typography>
    </Box>
  );
};

export default NoSongs;
