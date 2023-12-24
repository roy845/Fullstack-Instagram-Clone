import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  styled,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";

const UnauthorizedCard = styled(Card)({
  maxWidth: 400,
  margin: "auto",
  marginTop: 50,
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

interface UnauthorizedProps {
  follow?: boolean;
}

const Unauthorized: React.FC<UnauthorizedProps> = ({ follow }) => {
  return (
    <UnauthorizedCard>
      <UnauthorizedHeader
        title={<Typography variant="h4">Unauthorized</Typography>}
      />
      <UnauthorizedContent>
        <UnauthorizedIcon />
        <UnauthorizedMessage variant="body1">
          You do not have permission to access this page.
          {follow && <>Follow this user to see its content.</>}
        </UnauthorizedMessage>
      </UnauthorizedContent>
    </UnauthorizedCard>
  );
};

export default Unauthorized;
