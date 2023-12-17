import { Box, Typography } from "@mui/material";
import { PeopleAlt } from "@mui/icons-material";

interface NoFollowProps {
  follower?: boolean;
}

const NoFollow: React.FC<NoFollowProps> = ({ follower }) => {
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
      <PeopleAlt fontSize="large" color="action" />
      <Typography variant="h6" color="textSecondary" gutterBottom>
        {follower ? "No Followers" : "No Followings"}
      </Typography>
    </Box>
  );
};

export default NoFollow;
