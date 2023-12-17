import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/swiper-bundle.css";
import { LinearProgress } from "@mui/material";
import { format } from "timeago.js";
import { deleteObject, ref } from "firebase/storage";
// import { deleteStory } from "../../Api/ServerAPI";
import CloseIcon from "@mui/icons-material/Close";

import toast from "react-hot-toast";
import { Swiper as SwiperType } from "swiper";
import { StoryFileData, User } from "../types";
import { useAuth } from "../context/auth";
import storage from "../config/firebase";
import { deleteStory } from "../Api/serverAPI";

interface SongsStoryCarousel {
  songs: StoryFileData[];
  storyId: string;
  storyAuthor: User;
}

const SongsStoryCarousel: React.FC<SongsStoryCarousel> = ({
  songs,
  storyId,
  storyAuthor,
}) => {
  const [isAutoplayEnabled, setIsAutoplayEnabled] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(5000);
  const [activeSlide, setActiveSlide] = useState(0);
  const [currentSlideDuration, setCurrentSlideDuration] = useState<number>(0);
  const swiperRef = useRef(null);

  const { auth } = useAuth();

  const handleContentClick = () => {
    setIsAutoplayEnabled(false);
  };

  const handleContentRelease = () => {
    setIsAutoplayEnabled(true);
  };

  const handleSlideChange = (swiper: SwiperType) => {
    setActiveSlide(swiper.realIndex);

    const currentSlide = songs[swiper.realIndex];

    const autoplayDelay = currentSlide?.duration
      ? currentSlide.duration * 1000
      : 5000;

    setTimeRemaining(autoplayDelay);

    // Pause all audio elements and play the audio for the current slide
    audioRefs.current.forEach((audio, index) => {
      if (index === swiper.realIndex) {
        audio.play();
      } else {
        audio.pause();
        audio.currentTime = 0;
      }
    });
  };

  const handleRemoveFile = async (id: string) => {
    const fileToRemove = songs.find((file) => file.id === id);

    if (fileToRemove) {
      try {
        const storageRef = ref(
          storage,
          `${auth?.user?.username}/files/${fileToRemove.id}`
        );
        await deleteObject(storageRef);
        await deleteStory(storyId, id);
        toast.success("File deleted from story successfully");
      } catch (error) {
        console.error("Error deleting file:", error);
      }
    }
  };

  useEffect(() => {
    let interval: string | number | NodeJS.Timeout | undefined;

    const currentSlide = songs[activeSlide];
    const autoplayDelay = currentSlide?.duration
      ? currentSlide.duration * 1000
      : 5000;
    setCurrentSlideDuration(autoplayDelay);

    interval = setInterval(() => {
      setTimeRemaining((prevTimeRemaining) => {
        if (prevTimeRemaining <= 0) {
          setIsAutoplayEnabled(false);
          setActiveSlide((prevActiveSlide) =>
            prevActiveSlide === songs.length - 1 ? 0 : prevActiveSlide + 1
          );
          return autoplayDelay; // Reset the timer based on the content's duration
        }
        return prevTimeRemaining - 100;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isAutoplayEnabled, activeSlide, songs]);

  const audioRefs = useRef<HTMLAudioElement[]>([]);
  const handleAudioRef = (audio: HTMLAudioElement, index: number) => {
    audioRefs.current[index] = audio;
  };

  return (
    <div style={{ position: "relative" }}>
      <LinearProgress
        variant="determinate"
        value={(1 - timeRemaining / currentSlideDuration) * 100}
      />

      <Swiper
        ref={swiperRef as SwiperType}
        modules={[Autoplay, Navigation]}
        slidesPerView={1}
        autoplay={{
          delay: currentSlideDuration,
          disableOnInteraction: false,
        }}
        navigation
        onSlideChange={handleSlideChange}
        style={{ width: "100%", height: "max-content" }}
        initialSlide={activeSlide}
      >
        {songs?.map((song, index) => (
          <SwiperSlide key={index}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div style={{ color: "white" }}>
                {format(song.createdAt as string)}
              </div>
              {storyAuthor._id === auth?.user?._id && (
                <CloseIcon
                  style={{ color: "red", cursor: "pointer" }}
                  onClick={() => handleRemoveFile(song.id)}
                />
              )}
              <div>
                <audio
                  ref={(audio) => handleAudioRef(audio!, index)}
                  autoPlay
                  onClick={handleContentClick}
                  onEnded={() => setIsAutoplayEnabled(true)}
                  className="postSong"
                  controls
                >
                  <source src={song.url} type="audio/mpeg" />
                </audio>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default SongsStoryCarousel;
