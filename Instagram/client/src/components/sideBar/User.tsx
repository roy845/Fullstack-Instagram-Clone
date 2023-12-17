import React from "react";
import Skeleton from "react-loading-skeleton";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/auth";
import { usePosts } from "../../context/posts";
import { Avatar } from "@mui/material";
import { useUsers } from "../../context/users";

interface UserProps {
  userId: string;
  username: string;
  fullName: string;
  profilePic: string;
}

export const User: React.FC<UserProps> = ({
  userId,
  username,
  fullName,
  profilePic,
}) => {
  const { auth } = useAuth();
  const { activeUsers } = useUsers();

  const isUserActive = activeUsers.some((user) => user._id === userId);

  return !username || !fullName ? (
    <Skeleton count={1} height={61} />
  ) : (
    <Link
      to={`/profile/${username}/${userId}`}
      className="grid grid-cols-4 mb-6 items-center"
    >
      <div className="relative">
        <Avatar
          className="rounded-full w-16 h-16 flex mr-3"
          src={profilePic}
          alt=""
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = auth?.user?.profilePic?.url!;
          }}
        />
        <div className="absolute top-0 left-0">
          {isUserActive ? (
            <div
              className="absolute top-0 left-0 w-4 h-4 bg-green-primary rounded-full"
              title="Online"
            />
          ) : (
            <div
              className="absolute top-0 left-0 w-4 h-4 bg-red-primary rounded-full"
              title="Offline"
            />
          )}
        </div>
      </div>
      <div className="col-span-3">
        <p className="font-bold text-sm">{username}</p>
        <p className="text-sm">{fullName}</p>
      </div>
    </Link>
  );
};
