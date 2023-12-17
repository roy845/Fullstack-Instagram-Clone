import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import {
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  IconButton,
  Flex,
} from "@chakra-ui/react";
import { formatTimeCaptureVideo } from "../utils/common";

const WebcamStreamCapture = ({ isOpen, setOpen, onCaptureVideo }) => {
  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [timer, setTimer] = useState(0);
  const [recording, setRecording] = useState(false);

  const handleStartCaptureClick = () => {
    setRecordedChunks([]);
    setRecording(true);
    setTimer(0);
    mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
      mimeType: "video/webm",
    });

    mediaRecorderRef.current.ondataavailable = (e) => {
      if (e.data.size > 0) {
        mediaRecorderRef.current.onstop = () => {
          const blob = new Blob([e.data], {
            type: "video/mp4",
          });
          const videoFile = new File([blob], "captured-video.mp4", {
            type: "video/mp4",
          });

          onCaptureVideo(videoFile);
          setOpen(false);
          setRecording(false);
          setTimer(0);
        };
      }
    };

    mediaRecorderRef.current.start();

    const timerInterval = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timerInterval);
  };

  const handleStopCaptureClick = () => {
    if (mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={() => setOpen(false)}>
      <ModalOverlay />
      <ModalContent
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        p={2}
        outline="none"
        bgColor="black"
        borderRadius="8px"
      >
        <ModalHeader textAlign="center" />
        <ModalCloseButton color="white" />
        <ModalBody>
          <Webcam audio={true} ref={webcamRef} mirrored={true} />
          {recording && (
            <Text color="white" align="center" justify="center" mt={2}>
              {formatTimeCaptureVideo(timer)}
            </Text>
          )}
          <Flex align="center" justify="center" direction="column" mt="2">
            <IconButton
              size="lg"
              h="16"
              w="16"
              rounded="full"
              cursor="pointer"
              p="2"
              transition="all 0.2s"
              mt="5"
              className={`${
                mediaRecorderRef.current?.state === "recording"
                  ? "animate-pulse "
                  : ""
              }`}
              bg={
                mediaRecorderRef.current?.state === "recording" ? "red.500" : ""
              }
              border="1px red solid"
              borderColor="red.500"
              _hover={{ bg: "red.500", borderColor: "white" }}
              onClick={
                mediaRecorderRef.current?.state === "recording"
                  ? handleStopCaptureClick
                  : handleStartCaptureClick
              }
            />
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default WebcamStreamCapture;
