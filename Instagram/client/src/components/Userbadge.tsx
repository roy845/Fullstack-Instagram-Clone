import React from "react";
import { Link } from "react-router-dom";
import { usePosts } from "../context/posts";
import { useUsers } from "../context/users";

interface UserBadgeProps {
  profilePic: string;
  fullName: string;
  username: string;
  userId: string;
  handleFunction?: () => Promise<void> | void;
  linkDisabled?: boolean;
}

const UserBadge: React.FC<UserBadgeProps> = ({
  profilePic,
  fullName,
  username,
  userId,
  handleFunction,
  linkDisabled,
}) => {
  const { activeUsers } = useUsers();
  const isUserActive = activeUsers.some((u) => u._id === userId);

  if (linkDisabled) {
    return (
      <div
        onClick={handleFunction}
        className="flex items-center space-x-4 p-4 mb-2 rounded-md shadow-md border border-gray-slate300 hover:bg-gray-slate300 hover:text-white cursor-pointer"
      >
        <div className="relative">
          <img
            src={profilePic}
            alt={`${fullName}'s profile`}
            className="w-12 h-12 rounded-full object-cover"
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
        <div>
          <h3 className="text-lg font-semibold">{fullName}</h3>
          <p className="text-gray-500">{username}</p>
        </div>
      </div>
    );
  } else {
    return (
      <Link to={`/profile/${username}/${userId}`}>
        <div className="flex items-center space-x-4 p-4 mb-2 rounded-md shadow-md border border-gray-slate300 hover:bg-gray-slate300 hover:text-white cursor-pointer">
          <div className="relative">
            <img
              src={profilePic}
              alt={`${fullName}'s profile`}
              className="w-12 h-12 rounded-full object-cover"
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
          <div>
            <h3 className="text-lg font-semibold">{fullName}</h3>
            <p className="text-gray-500">{username}</p>
          </div>
        </div>
      </Link>
    );
  }
};

export default UserBadge;
