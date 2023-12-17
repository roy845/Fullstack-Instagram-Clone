import React, { useState, useEffect } from "react";
import { formatBytes } from "../utils/common";

const AudioMessage = ({ filename, filesize }) => {
  const [audioUrl, setAudioUrl] = useState("");

  useEffect(() => {
    const apiEndpoint = "http://localhost:8800/api/files/serveFile/";

    setAudioUrl(apiEndpoint + filename);
  }, [filename]);

  return (
    <div>
      <audio controls src={audioUrl} alt="Uploaded Audio" />
      <source src={audioUrl} type="audio/mpeg" />
      {filesize && formatBytes(filesize)}
    </div>
  );
};

export default AudioMessage;
