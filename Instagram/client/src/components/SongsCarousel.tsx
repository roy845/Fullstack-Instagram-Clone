import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/swiper-bundle.css";
import { deleteObject, ref, StorageReference } from "firebase/storage";
import CloseIcon from "@mui/icons-material/Close";
import { useAuth } from "../context/auth";
import storage from "../config/firebase";
import toast from "react-hot-toast";
import { Swiper as SwiperType } from "swiper";
import { FileData } from "../types";

const closeIconStyles: React.CSSProperties = {
  color: "red",
  cursor: "pointer",
};

interface SongsCarouselProps {
  songs: FileData[];
  setSongs?: React.Dispatch<React.SetStateAction<FileData[]>>;
  setFileData?: React.Dispatch<React.SetStateAction<FileData[]>>;
}

const SongsCarousel: React.FC<SongsCarouselProps> = ({
  songs,
  setSongs,
  setFileData,
}) => {
  const [isAutoplayEnabled, setIsAutoplayEnabled] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);
  const swiperRef = useRef<SwiperType | null>(null);

  const { auth } = useAuth();

  const handleContentClick = () => {
    setIsAutoplayEnabled(false);
  };

  const handleSlideChange = (swiper: SwiperType) => {
    setActiveSlide(swiper.realIndex);

    // Pause all audio elements and play the audio for the current slide
    audioRefs.current.forEach((audio, index) => {
      if (audio && index === swiper.realIndex) {
        audio.play();
      } else if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    });

    // If autoplay is enabled, restart it after changing the slide
    if (isAutoplayEnabled) {
      swiperRef.current?.autoplay?.start();
    }
  };

  const handleRemoveFile = async (id: string) => {
    const fileToRemove = songs.find((file) => file.id === id);

    if (fileToRemove) {
      try {
        const storageRef: StorageReference = ref(
          storage,
          `${auth?.user?.username}/files/${fileToRemove.id}`
        );
        await deleteObject(storageRef);
        setSongs!((imageData) => imageData.filter((file) => file?.id !== id));
        setFileData &&
          setFileData((fileData) => fileData.filter((file) => file?.id !== id));

        toast.success("File deleted successfully");
      } catch (error) {
        console.error("Error deleting file:", error);
      }
    }
  };

  const audioRefs = useRef<HTMLAudioElement[]>([]);
  const handleAudioRef = (audio: HTMLAudioElement, index: number) => {
    audioRefs.current = audioRefs.current!;
    audioRefs.current[index] = audio;
  };

  return (
    <div style={{ position: "relative" }}>
      <Swiper
        modules={[Navigation]}
        slidesPerView={1}
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
              {!song.publish && (
                <CloseIcon
                  style={closeIconStyles}
                  onClick={() => handleRemoveFile(song.id!)}
                />
              )}

              <div>
                <audio
                  ref={(audio) => handleAudioRef(audio!, index)}
                  autoPlay={index === activeSlide && isAutoplayEnabled} // Autoplay only for the active slide
                  onClick={handleContentClick}
                  onEnded={() => setIsAutoplayEnabled(true)}
                  className="postSong"
                  controls
                >
                  <source src={song?.url!} type="audio/mpeg" />
                </audio>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default SongsCarousel;
