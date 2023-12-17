import React from "react";
import { formatBytes } from "../utils/common";

const PdfMessage = ({ filename, filesize }) => {
  const apiEndpoint = `http://localhost:8800/api/files/serveFile/${filename}`;

  return (
    <div>
      <object
        data={apiEndpoint}
        type="application/pdf"
        width="300"
        height="300"
        style={{ marginBottom: "5px" }}
      >
        <p>
          Unable to display PDF file. <a href={apiEndpoint}>Download</a>{" "}
          instead.
        </p>
      </object>
      {filesize && formatBytes(filesize)}
    </div>
  );
};

export default PdfMessage;
