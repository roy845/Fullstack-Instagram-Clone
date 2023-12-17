import React, { useState, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBack from "@mui/icons-material/ArrowBack";
import ArrowForward from "@mui/icons-material/ArrowForward";
import { useAuth } from "../context/auth";
import { deleteObject, ref, StorageReference } from "firebase/storage";
import storage from "../config/firebase";
import { FileData } from "../types";
import { NavigateFunction, useNavigate } from "react-router-dom";

interface ImageSliderProps {
  slides: FileData[];
  setImages?: React.Dispatch<React.SetStateAction<FileData[]>>;
  setFileData?: React.Dispatch<React.SetStateAction<FileData[]>>;
  postId?: string;
}

const arrowIconStyles: React.CSSProperties = {
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  fontSize: "45px",
  color: "rgba(255, 255, 255, 0.7)", // White color with 70% transparency
  backgroundColor: "rgba(128, 128, 128, 0.5)", // Gray background with 50% transparency
  borderRadius: "50%", // Optional: Add border-radius for a circular background
  zIndex: 1,
  cursor: "pointer",
  padding: "10px", //
};

const closeIconStyles: React.CSSProperties = {
  position: "absolute",
  top: "0",
  left: "0",
  fontSize: "30px",
  color: "red",
  cursor: "pointer",
};

const sliderStyles: React.CSSProperties = {
  position: "relative",
  height: "100%",
};

const dotsContainerStyles: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
};

const dotStyle: React.CSSProperties = {
  margin: "0 3px",
  cursor: "pointer",
  fontSize: "20px",
};

const ImageSlider: React.FC<ImageSliderProps> = ({
  slides,
  setImages,
  setFileData,
  postId,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { auth } = useAuth();
  const navigate: NavigateFunction = useNavigate();

  useEffect(() => {
    // Ensure currentIndex is within bounds when slides change
    if (currentIndex >= slides?.length) {
      setCurrentIndex(slides?.length - 1);
    }
  }, [slides, currentIndex]);

  const handleRemoveFile = async (id: string) => {
    const fileToRemove = slides.find((file) => file?.id === id);

    if (fileToRemove) {
      try {
        const storageRef: StorageReference = ref(
          storage,
          `${auth?.user?.username}/files/${fileToRemove?.id}`
        );

        await deleteObject(storageRef);

        setImages!((imageData) => imageData.filter((file) => file?.id !== id));
        setFileData &&
          setFileData((fileData) => fileData.filter((file) => file?.id !== id));

        if (slides?.length > 1) {
          // If there are remaining slides, adjust the currentIndex
          const newIndex =
            currentIndex === slides?.length - 1
              ? currentIndex - 1
              : currentIndex;
          setCurrentIndex(newIndex);
        }
      } catch (error) {
        console.error("Error deleting file:", error);
      }
    }
  };

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? slides?.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastSlide = currentIndex === slides?.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const goToSlide = (slideIndex: number) => {
    setCurrentIndex(slideIndex);
  };

  const currentSlide = slides?.[currentIndex];

  return (
    <div style={sliderStyles}>
      <div>
        {slides?.length > 1 && (
          <ArrowBack
            onClick={goToPrevious}
            style={{ ...arrowIconStyles, left: "32px" }}
          />
        )}
        {slides?.length > 1 && (
          <ArrowForward
            onClick={goToNext}
            style={{ ...arrowIconStyles, right: "32px" }}
          />
        )}
        {!currentSlide?.publish && (
          <CloseIcon
            className="removeIcon"
            onClick={() => handleRemoveFile(currentSlide.id)}
            style={closeIconStyles}
          />
        )}
      </div>
      <div>
        {currentSlide?.url && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {currentSlide?.url && (
              <img
                onClick={() => postId && navigate(`/post/${postId}`)}
                src={currentSlide?.url}
                alt="Current Slide"
                style={{
                  width: "50%",
                  height: "50%",
                  cursor: postId && "pointer",
                }}
              />
            )}
          </div>
        )}
      </div>
      <div style={dotsContainerStyles}>
        {slides?.length > 1 &&
          slides.map((slide, slideIndex) => (
            <div
              key={slideIndex}
              style={dotStyle}
              onClick={() => goToSlide(slideIndex)}
            >
              {currentIndex === slideIndex ? "●" : "◦"}
            </div>
          ))}
      </div>
    </div>
  );
};

export default ImageSlider;
