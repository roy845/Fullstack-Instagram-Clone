import { Box, Typography } from "@mui/material";
import NotificationsOffIcon from "@mui/icons-material/NotificationsOff";

interface NoMentionsNotificationsProps {
  dark?: boolean;
}

const NoMentionsNotifications: React.FC<NoMentionsNotificationsProps> = ({
  dark,
}) => {
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
      <NotificationsOffIcon
        fontSize="large"
        style={{ color: dark ? "white" : "gray" }}
      />
      <Typography
        variant="h6"
        color={dark ? "white" : "textSecondary"}
        gutterBottom
      >
        You have no notifications
      </Typography>
    </Box>
  );
};

export default NoMentionsNotifications;
