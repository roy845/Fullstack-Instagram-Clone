import { Avatar } from "@chakra-ui/avatar";
import { Tooltip } from "@chakra-ui/tooltip";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/ChatLogics";
import { useAuth } from "../context/auth";

import animationDataPdf from "../animations/pdf.json";
import animationDataWord from "../animations/word.json";
import animationDataImage from "../animations/image.json";
import powerPointLogo from "../animations/pptx_icon.png";
import txtLogo from "../animations/txt.png";
import ZipLogo from "../animations/zip-icon.png";
import RarLogo from "../animations/rar-icon.png";
import excelLogo from "../animations/excel-icon.png";
import FileDownload from "./FileDownload";
import ImageMessage from "./ImageMessage";
import VideoMessage from "./VideoMessage";
import AudioMessage from "./AudioMessage";
import PdfMessage from "./PdfMessage";

const ScrollableChat = ({ messages, searchQuery }) => {
  const { auth } = useAuth();

  const defaultOptionsWord = {
    loop: true,
    autoplay: true,
    animationData: animationDataWord,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <ScrollableFeed>
      {messages &&
        messages?.map((m, i) => (
          <div style={{ display: "flex" }} key={m._id}>
            {(isSameSender(messages, m, i, auth?._id) ||
              isLastMessage(messages, i, auth?._id)) && (
              <Tooltip
                label={m?.sender?.name}
                placement="bottom-start"
                hasArrow
              >
                <Avatar
                  mt="7px"
                  mr={1}
                  size="sm"
                  cursor="pointer"
                  name={m?.sender?.name}
                  src={m?.sender?.profilePic}
                />
              </Tooltip>
            )}
            <span
              style={{
                backgroundColor: `${
                  m?.sender?._id === auth?._id ? "#BEE3F8" : "#B9F5D0"
                }`,
                marginLeft: isSameSenderMargin(messages, m, i, auth?._id),
                marginTop: isSameUser(messages, m, i, auth?._id) ? 3 : 10,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
              }}
            >
              {m.file && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {m.file.filetype === "application/octet-stream" && (
                    <FileDownload
                      filename={m.file.filename}
                      filesize={m.file.filesize}
                      imgSrc={RarLogo}
                    />
                  )}
                  {m.file.filetype === "application/x-zip-compressed" && (
                    <FileDownload
                      filename={m.file.filename}
                      filesize={m.file.filesize}
                      imgSrc={ZipLogo}
                    />
                  )}

                  {m.file.filetype === "application/pdf" && (
                    <PdfMessage
                      filename={m.file.filename}
                      filesize={m.file.filesize}
                    />
                  )}

                  {m.file.filetype ===
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document" && (
                    <FileDownload
                      filename={m.file.filename}
                      filesize={m.file.filesize}
                      options={defaultOptionsWord}
                    />
                  )}

                  {m.file.filetype === "image/jpeg" && (
                    <ImageMessage
                      filename={m.file.filename}
                      filesize={m.file.filesize}
                    />
                  )}
                  {m.file.filetype === "image/png" && (
                    <ImageMessage
                      filename={m.file.filename}
                      filesize={m.file.filesize}
                    />
                  )}
                  {m.file.filetype === "video/mp4" && (
                    <VideoMessage
                      filename={m.file.filename}
                      filesize={m.file.filesize}
                    />
                  )}
                  {m.file.filetype ===
                    "application/vnd.openxmlformats-officedocument.presentationml.presentation" && (
                    <FileDownload
                      filename={m.file.filename}
                      filesize={m.file.filesize}
                      imgSrc={powerPointLogo}
                    />
                  )}
                  {m.file.filetype === "text/plain" && (
                    <FileDownload
                      filename={m.file.filename}
                      imgSrc={txtLogo}
                      filesize={m.file.filesize}
                    />
                  )}
                  {m.file.filetype ===
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" && (
                    <FileDownload
                      filename={m.file.filename}
                      imgSrc={excelLogo}
                      filesize={m.file.filesize}
                    />
                  )}
                  {m.file.filetype === "audio/mpeg" && (
                    <AudioMessage
                      filename={m.file.filename}
                      filesize={m.file.filesize}
                    />
                  )}
                </div>
              )}

              {searchQuery
                ? m.content
                    .split(new RegExp(`(${searchQuery})`, "gi"))
                    .map((part, i) =>
                      part.toLowerCase() === searchQuery.toLowerCase() ? (
                        <span key={i} style={{ backgroundColor: "yellow" }}>
                          {part}
                        </span>
                      ) : (
                        part
                      )
                    )
                : m.content}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
