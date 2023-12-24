import { Box, Flex, IconButton, Text, Tooltip } from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import {
  FaMicrophone,
  FaPauseCircle,
  FaPlay,
  FaStop,
  FaTrash,
} from "react-icons/fa";
import { MdSend } from "react-icons/md";
import WaveSurfer from "wavesurfer.js";

function CaptureAudio({ hide, onCaptureRecording }) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [waveForm, setWaveForm] = useState(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [currentPlaybackTime, setCurrentPlaybackTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [renderedAudio, setRenderedAudio] = useState(false);

  const audioRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const waveFormRef = useRef(null);

  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingDuration((prevDuration) => {
          setTotalDuration(prevDuration + 1);
          return prevDuration + 1;
        });
      }, 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [isRecording]);

  useEffect(() => {
    const wavesurfer = WaveSurfer.create({
      container: waveFormRef.current,
      waveColor: "#ccc",
      progressColor: "#4a9eff",
      cursorColor: "#7ae3c3",
      barWidth: 2,
      height: 30,
      responsive: true,
    });

    setWaveForm(wavesurfer);

    wavesurfer.on("finish", () => {
      setIsPlaying(false);
    });

    return () => {
      wavesurfer.destroy();
    };
  }, []);

  useEffect(() => {
    if (waveForm) {
      handleStartRecording();
    }
  }, [waveForm]);

  const handleStartRecording = () => {
    setRecordingDuration(0);
    setRecordingDuration(0);
    setTotalDuration(0);
    setIsRecording(true);
    setRecordedAudio(null);
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioRef.current.srcObject = stream;

        const chunks = [];
        mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
          const audioURL = URL.createObjectURL(blob);
          const audio = new Audio(audioURL);
          setRecordedAudio(audio);

          waveForm.load(audioURL);
        };

        mediaRecorder.start();
      })
      .catch((error) => {
        console.log("Error accessing the microphone:", error);
      });
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      waveForm.stop();

      const audioChunks = [];

      mediaRecorderRef.current.addEventListener("dataavailable", (event) => {
        audioChunks.push(event.data);
      });

      mediaRecorderRef.current.addEventListener("stop", () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/mp3" });
        const audioFile = new File([audioBlob], "recording.mp3");

        setRenderedAudio(audioFile);
      });
    }
  };

  useEffect(() => {
    if (recordedAudio) {
      const updatePlaybackTime = () => {
        setCurrentPlaybackTime(recordedAudio.currentTime);
      };

      recordedAudio.addEventListener("timeupdate", updatePlaybackTime);

      return () => {
        recordedAudio.removeEventListener("timeupdate", updatePlaybackTime);
      };
    }
  }, [recordedAudio]);

  const handlePlayRecording = () => {
    if (recordedAudio) {
      waveForm.stop();
      waveForm.play();
      recordedAudio.play();
      setIsPlaying(true);
    }
  };

  const handlePauseRecording = () => {
    waveForm.stop();
    recordedAudio.pause();
    setIsPlaying(false);
  };

  const sendRecording = () => {
    onCaptureRecording(renderedAudio);
    hide(false);
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <Flex align="center" justify="end" w="full" fontSize="2xl">
      <Box pt="1">
        <IconButton
          icon={<FaTrash />}
          colorScheme="red"
          onClick={() => hide(false)}
        />
      </Box>
      <Flex
        mx="4"
        py="2"
        px="4"
        color="white"
        fontSize="lg"
        align="center"
        justify="center"
        bg="white"
        rounded="full"
        boxShadow="lg"
      >
        {isRecording ? (
          <Box color="red.500" className="animate-pulse">
            Recording <span>{recordingDuration}s</span>
          </Box>
        ) : (
          <Box>
            {recordedAudio && (
              <>
                {!isPlaying ? (
                  <IconButton icon={<FaPlay />} onClick={handlePlayRecording} />
                ) : (
                  <IconButton
                    icon={<FaStop />}
                    onClick={handlePauseRecording}
                  />
                )}
              </>
            )}
          </Box>
        )}
        <Box
          w="60"
          ref={waveFormRef}
          display={isRecording ? "none" : "block"}
        />
        {recordedAudio && isPlaying && (
          <Text>{formatTime(currentPlaybackTime)}</Text>
        )}
        {recordedAudio && !isPlaying && (
          <Text>{formatTime(totalDuration)}</Text>
        )}
        <audio ref={audioRef} display="none" />
      </Flex>
      <Box mr="4">
        {!isRecording ? (
          <IconButton
            icon={<FaMicrophone />}
            colorScheme="red"
            onClick={handleStartRecording}
          />
        ) : (
          <IconButton
            icon={<FaPauseCircle />}
            colorScheme="red"
            onClick={handleStopRecording}
          />
        )}
      </Box>
      <Tooltip label="Send recording">
        <IconButton
          icon={<MdSend size={28} />}
          title="Send"
          onClick={sendRecording}
          className="text-panel-header-icon"
        />
      </Tooltip>
    </Flex>
  );
}

export default CaptureAudio;
