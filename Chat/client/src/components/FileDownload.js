import React, { useState } from "react";
import { downloadMedia, formatBytes } from "../utils/common";
import Lottie from "react-lottie";
import { Spinner } from "@chakra-ui/react";

const FileDownload = ({ filename, options, imgSrc, filesize }) => {
  const [loading, setLoading] = useState(false);
  const containerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  return (
    <div>
      <a
        onClick={(e) => downloadMedia(e, filename, setLoading)}
        style={{ cursor: "pointer" }}
      >
        {imgSrc && <img src={imgSrc} width="48px" height="48px" />}
        {options && (
          <Lottie
            options={options}
            width={70}
            style={{
              marginBottom: 15,
              marginLeft: 0,
            }}
          />
        )}
      </a>
      {loading && (
        <div style={containerStyle}>
          <Spinner />
        </div>
      )}
      {filesize && formatBytes(filesize)}
    </div>
  );
};

export default FileDownload;
