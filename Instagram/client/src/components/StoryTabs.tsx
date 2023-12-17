import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import NoSongs from "./NoSongs";
import NoVideos from "./NoVideos";

function CustomTabPanel(props: {
  [x: string]: any;
  children: React.ReactNode;
  value: number;
  index: number;
}) {
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

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

interface StoryTabsProps {
  imagesCarousel: JSX.Element;
  songsCarousel: JSX.Element;
  videosCarousel: JSX.Element;
  imagesLength: number;
  songsLength: number;
  videosLength: number;
}

const StoryTabs: React.FC<StoryTabsProps> = ({
  imagesCarousel,
  songsCarousel,
  videosCarousel,
  imagesLength,
  songsLength,
  videosLength,
}) => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: any, newValue: React.SetStateAction<number>) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
          sx={{
            "& .MuiTabs-indicator": {
              backgroundColor: "white", // White underline color
            },
            "& .MuiTab-root": {
              color: "white", // White text color
            },
          }}
        >
          {<Tab label="Images" {...a11yProps(0)} />}
          {<Tab label="Songs" {...a11yProps(1)} />}
          {<Tab label="Videos" {...a11yProps(2)} />}
        </Tabs>
      </Box>
      {
        <CustomTabPanel value={value} index={0}>
          {imagesCarousel}
        </CustomTabPanel>
      }
      {
        <CustomTabPanel value={value} index={1}>
          {songsLength !== 0 ? songsCarousel : <NoSongs dark />}
        </CustomTabPanel>
      }
      {
        <CustomTabPanel value={value} index={2}>
          {videosLength !== 0 ? videosCarousel : <NoVideos dark />}
        </CustomTabPanel>
      }
    </Box>
  );
};

export default StoryTabs;
