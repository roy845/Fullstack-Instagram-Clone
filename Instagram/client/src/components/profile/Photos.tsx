import React, { useState } from "react";
import { FaImages } from "react-icons/fa";
import { Post } from "../../types";
import Skeleton from "react-loading-skeleton";
import { NavigateFunction, useNavigate } from "react-router-dom";

interface PhotosProps {
  photos: Post[] | null;
  explore?: boolean;
}

const Photos: React.FC<PhotosProps> = ({ photos, explore }) => {
  const navigate: NavigateFunction = useNavigate();

  const renderMedia = (photo: Post) => {
    const fileType = photo?.files?.[0]?.type;
    const fileUrl = photo?.files?.[0]?.url as string;

    switch (fileType) {
      case "image":
        return (
          <img
            src={fileUrl}
            alt=""
            className="rounded-md w-[300px] h-[300px] object-cover border border-black-light"
          />
        );
      case "movie":
        return (
          <video controls className="rounded-md w-[300px] h-[300px]">
            <source src={fileUrl} type="video/mp4" />
          </video>
        );
      case "song":
        return (
          <audio controls className="rounded-md">
            <source src={fileUrl} type="audio/mp3" />
          </audio>
        );
      default:
        return null;
    }
  };
  return (
    <>
      <div
        className={
          explore
            ? "h-[75%]  mt-5 pt-4"
            : "h-[75%] border-t border-gray-primary mt-5 pt-4"
        }
      >
        <div className="grid grid-cols-3 gap-y-1 mt-1 mb-1 gap-x-1">
          {!photos
            ? new Array(12)
                .fill(0)
                .map((_, i) => <Skeleton key={i} width={320} height={400} />)
            : photos.length > 0
            ? photos.map((photo) => (
                <div key={photo._id} className="relative group cursor-pointer">
                  {renderMedia(photo)}

                  <div
                    onClick={() => {
                      navigate(`/post/${photo?._id}`);
                    }}
                    className="absolute bottom-0 left-0 bg-gray-200 z-12 w-full h-full justify-evenly items-center bg-black-faded group-hover:flex hidden rounded-md"
                  >
                    {photo?.files?.length! > 1 && (
                      <div className="absolute top-2 left-2 text-white">
                        <FaImages style={{ color: "white" }} size={24} />
                      </div>
                    )}

                    <p className="flex items-center text-white font-bold">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-8 mr-4"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {photo?.likes?.length}
                    </p>

                    <p className="flex items-center text-white font-bold">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-8 mr-4"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {photo?.comments?.length}
                    </p>
                  </div>
                </div>
              ))
            : null}
        </div>

        {!photos ||
          (photos.length === 0 && (
            <p className="text-center text-2xl">No Posts Yet</p>
          ))}
      </div>
    </>
  );
};

export default Photos;
