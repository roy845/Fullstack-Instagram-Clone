import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { FileData } from "../types";
import NoVideos from "./NoVideos";
import NoSongs from "./NoSongs";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

interface CreateModalTabsProps {
  images?: JSX.Element;
  videos?: JSX.Element;
  songs?: JSX.Element;
  imagesLength: number;
  songsLength: number;
  videosLength: number;
}

const CreateModalTabs: React.FC<CreateModalTabsProps> = ({
  images,
  videos,
  songs,
  imagesLength,
  songsLength,
  videosLength,
}) => {
  const [value, setValue] = React.useState<number>(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          {<Tab label="Images" {...a11yProps(0)} />}
          {<Tab label="Videos" {...a11yProps(1)} />}
          {<Tab label="Songs" {...a11yProps(1)} />}
        </Tabs>
      </Box>
      {
        <CustomTabPanel value={value} index={0}>
          {images}
        </CustomTabPanel>
      }

      <CustomTabPanel value={value} index={1}>
        {videosLength !== 0 ? videos : <NoVideos />}
      </CustomTabPanel>

      <CustomTabPanel value={value} index={2}>
        {songsLength !== 0 ? songs : <NoSongs />}
      </CustomTabPanel>
    </Box>
  );
};

export default CreateModalTabs;
