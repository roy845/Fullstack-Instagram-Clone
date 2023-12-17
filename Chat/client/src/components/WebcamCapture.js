import React, { useRef } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Box,
  Button,
  IconButton,
} from "@chakra-ui/react";
import Webcam from "react-webcam";
import { FaCamera } from "react-icons/fa";

const WebcamCapture = ({ onCapture, isOpen, setOpen }) => {
  const webcamRef = useRef(null);

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();

    // Convert data URL to Blob
    fetch(imageSrc)
      .then((res) => res.blob())
      .then((blob) => {
        // Create a File object with MIME type image/png
        const pngFile = new File([blob], "captured-image.png", {
          type: "image/png",
        });

        // Pass the File object to the onCapture function
        onCapture(pngFile);
        setOpen(false);
      });
  };

  return (
    <Modal isOpen={isOpen} onClose={() => setOpen(false)}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign="center">Capture Image</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            p={2}
          >
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/png"
              mirrored={true}
              className="mb-2"
            />
            <IconButton
              onClick={capture}
              height="16"
              mt={5}
              width="16"
              bgColor="white"
              borderRadius="full"
              cursor="pointer"
              borderWidth="8"
              border="1px black solid"
              borderColor="teal.200"
              icon={<FaCamera />}
            />
          </Box>
        </ModalBody>
        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default WebcamCapture;
