import React, { useState, useEffect } from "react";
import { formatBytes } from "../utils/common";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  Box,
  Image,
} from "@chakra-ui/react";

const ImageMessage = ({ filename, filesize }) => {
  const [imageUrl, setImageUrl] = useState("");
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  useEffect(() => {
    const apiEndpoint = "http://localhost:8800/api/files/serveFile/";

    setImageUrl(apiEndpoint + filename);
  }, []);

  return (
    <>
      <div>
        <Image
          cursor="pointer"
          height={300}
          width={300}
          src={imageUrl}
          alt="Uploaded Image"
          onClick={() => setIsImageModalOpen(true)}
        />
        {filesize && formatBytes(filesize)}
      </div>
      {isImageModalOpen && (
        <Modal
          isOpen={isImageModalOpen}
          onClose={() => setIsImageModalOpen(false)}
        >
          <ModalOverlay />
          <ModalContent
            display="flex"
            alignItems="flex-end"
            justifyContent="flex-end"
            borderRadius="8px"
            bg="black"
            p={2}
          >
            <Box>
              <Image
                src={imageUrl}
                className="rounded-lg cursor-pointer"
                alt="asset"
                height={500}
                width={500}
              />
            </Box>
          </ModalContent>
        </Modal>
      )}
    </>
  );
};

export default ImageMessage;
