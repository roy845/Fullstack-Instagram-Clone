import { Link } from "react-router-dom";
import { User } from "../../types";
import { Avatar } from "@mui/material";
import { useUsers } from "../../context/users";
import Spinner from "../Spinner";
import { useEffect, useState } from "react";
import {
  followUser,
  getCurrentUserFollowingsList,
  unfollowUser,
} from "../../Api/serverAPI";
import toast from "react-hot-toast";
import { HTTP_403_FORBIDDEN } from "../../constants/httpStatusCodes";

interface SuggestedProfileProps {
  profile: User;
}

const SuggestedProfile: React.FC<SuggestedProfileProps> = ({ profile }) => {
  const { currentUserFollowings, setCurrentUserFollowings, activeUsers } =
    useUsers();
  const isUserActive = activeUsers.some((user) => user._id === profile?._id);
  const [loadingFollowUnfollowUser, setLoadingFollowUnfollowUser] =
    useState<boolean>(false);

  const handleFollow = async (): Promise<void> => {
    try {
      setLoadingFollowUnfollowUser(true);
      const { data } = await followUser(profile?._id);
      toast.success("User followed successfully", { position: "bottom-left" });
      setCurrentUserFollowings(data.currentUserFollowingsList);

      setLoadingFollowUnfollowUser(false);
    } catch (error: any) {
      if (error?.response?.status === HTTP_403_FORBIDDEN) {
        toast.error(error?.response?.data?.detail, {
          position: "bottom-left",
        });
      }
      setLoadingFollowUnfollowUser(false);
    }
  };

  const handleUnfollow = async (): Promise<void> => {
    try {
      setLoadingFollowUnfollowUser(true);
      const { data } = await unfollowUser(profile?._id);
      setCurrentUserFollowings(data.currentUserFollowingsList);

      setLoadingFollowUnfollowUser(false);
    } catch (err: any) {
      console.log(err);
      toast.error(err);
    }
    setLoadingFollowUnfollowUser(false);
  };

  useEffect(() => {
    const fetchCurrentUserFollowingsList = async (): Promise<void> => {
      try {
        const { data } = await getCurrentUserFollowingsList();
        setCurrentUserFollowings(data.followings);
      } catch (error: any) {
        console.log(error);
      }
    };
    fetchCurrentUserFollowingsList();
  }, []);

  return (
    <div className="flex flex-row items-center align-items justify-between">
      <div className="flex items-center justify-between">
        <div className="relative">
          <Link to={`/profile/${profile?.username}/${profile?._id}`}>
            <Avatar
              className="rounded-full w-8 flex mr-3"
              src={profile?.profilePic?.url}
              alt=""
            />
          </Link>

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
        <p className="font-bold text-sm">{profile?.username}</p>
        <button
          className={
            currentUserFollowings.some((u) => u?._id === profile?._id)
              ? "bg-red-primary font-bold text-sm rounded text-white w-20 h-8 mt-1 ml-2"
              : "bg-blue-medium font-bold text-sm rounded text-white w-20 h-8 mt-1 ml-2"
          }
          type="button"
          onClick={
            currentUserFollowings.some((u) => u?._id === profile?._id)
              ? handleUnfollow
              : handleFollow
          }
        >
          {loadingFollowUnfollowUser ? (
            <Spinner sm />
          ) : currentUserFollowings.some((u) => u?._id === profile?._id) ? (
            "Unfollow"
          ) : (
            "Follow"
          )}
        </button>
      </div>
    </div>
  );
};

export default SuggestedProfile;
