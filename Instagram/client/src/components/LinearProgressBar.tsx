import React from "react";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { makeStyles } from "@mui/styles";
import { Theme } from "@mui/material";

interface LinearProgressWithLabelProps {
  value: number;
}

function LinearProgressWithLabel(props: LinearProgressWithLabelProps) {
  return (
    <Box display="flex" alignItems="center">
      <Box width="100%" mr={1}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box minWidth={35}>
        <Typography
          variant="body2"
          color="textSecondary"
          style={{ color: "black" }}
        >{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
}

interface LinearProgressBarProps {
  progress: number;
}

const useStyles: any = makeStyles((theme: Theme) => ({
  root: {
    width: "50%",
    marginTop: "50px",
  },
}));

const LinearProgressBar: React.FC<LinearProgressBarProps> = ({ progress }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <LinearProgressWithLabel value={progress} />
    </div>
  );
};

export default LinearProgressBar;
