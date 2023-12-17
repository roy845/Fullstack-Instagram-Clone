import React, { useEffect, useMemo, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/swiper-bundle.css";
import { LinearProgress } from "@mui/material";
import { format } from "timeago.js";
import { deleteObject, ref } from "firebase/storage";
import CloseIcon from "@mui/icons-material/Close";
import { Swiper as SwiperType } from "swiper";
import toast from "react-hot-toast";
import { StoryFileData, User } from "../types";
import { useAuth } from "../context/auth";
import storage from "../config/firebase";
import { deleteStory } from "../Api/serverAPI";

interface ImagesStoryCarouselProps {
  images: StoryFileData[];
  storyId: string;
  storyAuthor: User;
}

const ImagesStoryCarousel: React.FC<ImagesStoryCarouselProps> = ({
  images,
  storyId,
  storyAuthor,
}) => {
  const [isAutoplayEnabled, setIsAutoplayEnabled] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(5000);
  const [activeSlide, setActiveSlide] = useState(0);
  const [currentSlideDuration, setCurrentSlideDuration] = useState<number>(0);
  const { auth } = useAuth();

  const memoizedImages = useMemo(() => images, [images]);
  const memoizedActiveSlide = useMemo(() => activeSlide, [activeSlide]);

  const handleContentClick = () => {
    setIsAutoplayEnabled(false);
  };

  const handleContentRelease = () => {
    setIsAutoplayEnabled(true);
  };

  const handleSlideChange = (swiper: SwiperType) => {
    setActiveSlide(swiper.realIndex);

    const currentSlide = images[swiper.realIndex];

    const autoplayDelay = currentSlide?.duration
      ? currentSlide.duration * 1000
      : 5000;

    setTimeRemaining(autoplayDelay);
  };

  const handleRemoveFile = async (id: string) => {
    const fileToRemove = images.find((file) => file.id === id);

    if (fileToRemove) {
      try {
        const storageRef = ref(
          storage,
          `${auth?.user?.username}/files/${fileToRemove.id}`
        );
        await deleteObject(storageRef);
        await deleteStory(storyId, id);
        toast.success("Fle deleted from story successfully");
      } catch (error) {
        console.error("Error deleting file:", error);
      }
    }
  };

  useEffect(() => {
    let interval: string | number | NodeJS.Timeout | undefined;

    const currentSlide = images?.[activeSlide];
    const autoplayDelay = currentSlide?.duration
      ? currentSlide.duration * 1000
      : 5000;
    setCurrentSlideDuration(autoplayDelay);

    interval = setInterval(() => {
      setTimeRemaining((prevTimeRemaining) => {
        if (prevTimeRemaining <= 0) {
          setIsAutoplayEnabled(false);
          setActiveSlide((prevActiveSlide) =>
            prevActiveSlide === images.length - 1 ? 0 : prevActiveSlide + 1
          );
          return autoplayDelay; // Reset the timer based on the content's duration
        }
        return prevTimeRemaining - 100;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isAutoplayEnabled, memoizedActiveSlide, memoizedImages]);

  return (
    <div style={{ position: "relative" }}>
      <LinearProgress
        variant="determinate"
        value={((1 - timeRemaining / currentSlideDuration) as number) * 100}
      />

      <Swiper
        modules={[Autoplay, Navigation]}
        slidesPerView={1}
        autoplay={{
          delay: currentSlideDuration,
          disableOnInteraction: false,
        }}
        navigation
        onSlideChange={handleSlideChange}
        style={{ width: "100%", height: "max-content" }}
        initialSlide={memoizedActiveSlide}
      >
        {memoizedImages?.map((image, index) => (
          <SwiperSlide key={index}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div style={{ color: "white" }}>
                {format(image.createdAt as string)}
              </div>
              {storyAuthor._id === auth?.user?._id && (
                <CloseIcon
                  style={{ color: "red", cursor: "pointer" }}
                  onClick={() => handleRemoveFile(image.id)}
                />
              )}

              <img
                width="300px"
                height="300px"
                src={image.url}
                style={{
                  cursor: "pointer",
                }}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ImagesStoryCarousel;
