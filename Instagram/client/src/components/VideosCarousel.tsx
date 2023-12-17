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

interface VideosCarouselProps {
  videos: FileData[];
  setVideos?: React.Dispatch<React.SetStateAction<FileData[]>>;
  setFileData?: React.Dispatch<React.SetStateAction<FileData[]>>;
}

const VideosCarousel: React.FC<VideosCarouselProps> = ({
  videos,
  setVideos,
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

    // Pause all video elements and play the video for the current slide
    videoRefs.current.forEach((video, index) => {
      if (video && index === swiper.realIndex) {
        video.play();
      } else if (video) {
        video.pause();
        video.currentTime = 0;
      }
    });

    // If autoplay is enabled, restart it after changing the slide
    if (isAutoplayEnabled) {
      swiperRef.current?.autoplay?.start();
    }
  };

  const handleRemoveFile = async (id: string) => {
    const fileToRemove = videos.find((file) => file.id === id);

    if (fileToRemove) {
      try {
        const storageRef: StorageReference = ref(
          storage,
          `${auth?.user?.username}/files/${fileToRemove.id}`
        );
        await deleteObject(storageRef);
        setVideos!((videoData) => videoData.filter((file) => file?.id !== id));
        setFileData &&
          setFileData((fileData) => fileData.filter((file) => file?.id !== id));

        toast.success("File deleted successfully");
      } catch (error) {
        console.error("Error deleting file:", error);
      }
    }
  };

  const videoRefs = useRef<HTMLVideoElement[]>([]);
  const handleVideoRef = (video: HTMLVideoElement, index: number) => {
    videoRefs.current = videoRefs.current!;
    videoRefs.current[index] = video;
  };

  return (
    <div style={{ position: "relative" }}>
      <Swiper
        ref={swiperRef as SwiperType}
        modules={[Navigation]}
        slidesPerView={1}
        navigation
        onSlideChange={handleSlideChange}
        style={{ width: "100%", height: "max-content" }}
        initialSlide={activeSlide}
      >
        {videos?.map((video, index) => (
          <SwiperSlide key={index}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {!video?.publish && (
                <CloseIcon
                  style={closeIconStyles}
                  onClick={() => handleRemoveFile(video.id!)}
                />
              )}

              <div>
                <video
                  ref={(video) => handleVideoRef(video!, index)}
                  autoPlay={index === activeSlide && isAutoplayEnabled} // Autoplay only for the active slide
                  onClick={handleContentClick}
                  onEnded={() => setIsAutoplayEnabled(true)}
                  className="postVideo"
                  controls
                >
                  <source src={video.url!} type="video/mp4" />
                </video>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default VideosCarousel;
