import React from "react";
import { Box } from "@mui/system";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  styled,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import { useCheckToken } from "../hooks/useCheckToken";

const UnauthorizedCard = styled(Card)({
  maxWidth: 400,
  margin: "auto",
  padding: 16,
  textAlign: "center",
});

const UnauthorizedHeader = styled(CardHeader)({
  backgroundColor: "#f44336", // Red background color
  color: "#fff", // White text color
});

const UnauthorizedContent = styled(CardContent)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
});

const UnauthorizedIcon = styled(LockIcon)({
  fontSize: 48,
  marginBottom: 2,
  color: "#f44336", // Red color for the LockIcon
});

const UnauthorizedMessage = styled(Typography)({
  marginTop: 8,
});

interface UnauthorizedPageProps {}

const UnauthorizedPage: React.FC<UnauthorizedPageProps> = () => {
  useCheckToken();
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <UnauthorizedCard>
        <UnauthorizedHeader
          title={<Typography variant="h4">Unauthorized</Typography>}
        />
        <UnauthorizedContent>
          <UnauthorizedIcon />
          <UnauthorizedMessage variant="body1">
            You do not have permission to access this page.
          </UnauthorizedMessage>
        </UnauthorizedContent>
      </UnauthorizedCard>
    </Box>
  );
};

export default UnauthorizedPage;
