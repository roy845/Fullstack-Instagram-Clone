import { makeStyles } from "@mui/styles";
import { Theme } from "@material-ui/core/styles";

import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";

import { useNavigate } from "react-router";
import TimelineIcon from "@mui/icons-material/Timeline";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
  },
  card: {
    minWidth: 300,
    maxWidth: 500,
    padding: "32px",
    textAlign: "center",
    [theme.breakpoints?.up("sm")]: {
      padding: "48px",
    },
    border: "2px solid blue", // add border and borderColor properties
    borderColor: "blue",
    backgroundColor: "white",
  },
  header: {
    textAlign: "center",
    paddingBottom: 0,
    color: "black",
  },
  icon: {
    fontSize: 64,
    marginBottom: "16px",
    color: "black",
  },
  button: {
    marginTop: "16px",
    backgroundColor: "#1775ee",
    color: "#fff",
    dialogContent: {
      overflowY: "auto",
    },
  },
}));

const NoAnalyticData = () => {
  const classes = useStyles();
  const navigate = useNavigate();

  const goBack = () => navigate(-1);

  return (
    <div className={classes.root}>
      <Card className={classes.card}>
        <CardHeader
          className={classes.header}
          title={<Typography variant="h4">No Analytic Data</Typography>}
        />
        <CardContent>
          <TimelineIcon className={classes.icon} />
          <Typography variant="body1" style={{ color: "black" }}>
            There are no analytics data to display yet
          </Typography>
          <Button
            className={classes.button}
            variant="contained"
            color="primary"
            onClick={goBack}
          >
            Go Back
          </Button>
          <CircularProgress
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "#1775ee",
              marginTop: 10,
              marginLeft: 125,
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default NoAnalyticData;
