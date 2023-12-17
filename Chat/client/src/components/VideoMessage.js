import React, { useState, useEffect } from "react";
import { formatBytes } from "../utils/common";

const VideoMessage = ({ filename, filesize }) => {
  const [videoUrl, setVideoUrl] = useState("");

  useEffect(() => {
    const apiEndpoint = "http://localhost:8800/api/files/serveFile/";

    setVideoUrl(apiEndpoint + filename);
  }, [filename]);

  return (
    <div>
      <video
        controls
        height={300}
        width={300}
        src={videoUrl}
        alt="Uploaded Video"
      />
      {filesize && formatBytes(filesize)}
    </div>
  );
};

export default VideoMessage;
