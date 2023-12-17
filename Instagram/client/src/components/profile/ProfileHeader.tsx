import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { useAuth } from "../../context/auth";
import { Post, User } from "../../types";
import toast from "react-hot-toast";
import {
  followUser,
  getCurrentUserFollowingsList,
  getUserFollowersList,
  unfollowUser,
} from "../../Api/serverAPI";
import { HTTP_403_FORBIDDEN } from "../../constants/httpStatusCodes";
import { useUsers } from "../../context/users";
import { Link } from "react-router-dom";
import { Avatar, Tooltip } from "@mui/material";
import BasicModal from "../BasicModal";
import Spinner from "../Spinner";
import NoFollow from "../NoFollow";
import UpdateUserModal from "../UpdateUserModal";

type HeaderProps = {
  user: User;
  posts: Post[];
  fetchAgain: boolean;
  setFetchAgain: React.Dispatch<React.SetStateAction<boolean>>;
};

const ProfileHeader: React.FC<HeaderProps> = ({
  user,
  posts,
  fetchAgain,
  setFetchAgain,
}) => {
  const { auth } = useAuth();

  const activeBtnFollow = auth?.user?.username !== user?.username;

  const [isFollowingProfile, setIsFollowingProfile] = useState<boolean>(false);
  const { currentUserFollowings, setCurrentUserFollowings, activeUsers } =
    useUsers();

  const [userFollowersList, setUserFollowersList] = useState<User[]>(
    [] as User[]
  );
  const [openCurrentUserFollowingsModal, setOpenCurrentUserFollowingsModal] =
    useState(false);
  const [openUserFollowersListModal, setOpenUserFollowersListModal] =
    useState(false);
  const [openUpdateUserModal, setOpenUpdateUserModal] =
    useState<boolean>(false);

  const [loadingFollowUnfollowUser, setLoadingFollowUnfollowUser] =
    useState<boolean>(false);

  const isUserActive = activeUsers.some((u) => u._id === user?._id);

  const handleFollow = async (): Promise<void> => {
    try {
      setLoadingFollowUnfollowUser(true);
      const { data } = await followUser(user?._id);
      toast.success("User followed successfully", { position: "bottom-left" });
      setCurrentUserFollowings(data.currentUserFollowingsList);
      setUserFollowersList(data.userFollowersList);
      setIsFollowingProfile(!isFollowingProfile);
      setFetchAgain(!fetchAgain);
      setLoadingFollowUnfollowUser(false);
    } catch (error: any) {
      if (error?.response?.status === HTTP_403_FORBIDDEN) {
        toast.error(error?.response?.data?.detail, { position: "bottom-left" });
      }
      setLoadingFollowUnfollowUser(false);
    }
  };

  const handleUnfollow = async (): Promise<void> => {
    try {
      setLoadingFollowUnfollowUser(true);
      const { data } = await unfollowUser(user?._id);
      setCurrentUserFollowings(data.currentUserFollowingsList);
      setUserFollowersList(data.userFollowersList);
      setIsFollowingProfile(!isFollowingProfile);
      setFetchAgain(!fetchAgain);
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
  }, [auth?.user?._id]);

  useEffect(() => {
    const fetchUserFollowersList = async (): Promise<void> => {
      try {
        const { data } = await getUserFollowersList(user?._id);
        setUserFollowersList(data.userFollowers);
      } catch (error: any) {
        console.log(error);
      }
    };
    user?._id && fetchUserFollowersList();
  }, [user?._id]);

  let contentCurrentUserFollowingsModal = (
    <>
      {user?.followings?.length === 0 && <NoFollow />}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        {user?.followings?.map((following, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <Link to={`/profile/${following?.username}/${following?._id}`}>
              <Tooltip title={following?.username}>
                <div className="relative">
                  <Avatar src={following?.profilePic?.url} />
                  <div className="absolute top-0 left-0">
                    {activeUsers.some((u) => u._id === following?._id) ? (
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
              </Tooltip>
            </Link>
            <span>{following?.username}</span>
          </div>
        ))}
      </div>
    </>
  );

  let contentUserFollowersModal = (
    <>
      {user?.followers?.length === 0 && <NoFollow follower />}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        {user?.followers?.map((follower, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <Link to={`/profile/${follower?.username}/${follower?._id}`}>
              <Tooltip title={follower?.username}>
                <div className="relative">
                  <Avatar src={follower?.profilePic?.url} />
                  <div className="absolute top-0 left-0">
                    {activeUsers.some((u) => u._id === follower?._id) ? (
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
              </Tooltip>
            </Link>
            <span>{follower?.username}</span>
          </div>
        ))}
      </div>
    </>
  );

  return (
    <div className="grid grid-cols-3 gap-4 justify-between mx-auto max-w-screen-lg">
      <div className="container flex justify-center items-center">
        {user?.username ? (
          <div className="relative">
            <img
              onClick={() =>
                auth?.user?._id === user?._id && setOpenUpdateUserModal(true)
              }
              className="rounded-full h-40 w-40 flex mt-5 cursor-pointer object-fill"
              alt={`${user?.username} profile picture`}
              src={user?.profilePic?.url}
            />

            <div className="absolute top-12 left-2">
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
        ) : (
          <Skeleton circle height={150} width={150} count={1} />
        )}
      </div>

      <div className="flex items-center justify-center flex-col col-span-2">
        <div className="container flex items-center">
          <p className="text-2xl mr-4">{user?.username}</p>

          {activeBtnFollow && isFollowingProfile === null ? (
            <Skeleton count={1} width={80} height={32} />
          ) : (
            activeBtnFollow && (
              <button
                className={
                  currentUserFollowings.some((u) => u?._id === user?._id)
                    ? "bg-red-primary font-bold text-sm rounded text-white w-20 h-8 mt-1 ml-2"
                    : "bg-blue-medium font-bold text-sm rounded text-white w-20 h-8 mt-1 ml-2"
                }
                type="button"
                onClick={
                  currentUserFollowings.some((u) => u?._id === user?._id)
                    ? handleUnfollow
                    : handleFollow
                }
              >
                {loadingFollowUnfollowUser ? (
                  <Spinner sm />
                ) : currentUserFollowings.some((u) => u?._id === user?._id) ? (
                  "Unfollow"
                ) : (
                  "Follow"
                )}
              </button>
            )
          )}
        </div>
        <div className="container flex mt-4">
          <>
            <p className="mr-10">
              <span className="font-bold">{posts?.length}</span> posts
            </p>
            <p
              className="mr-10 cursor-pointer"
              onClick={() => setOpenUserFollowersListModal(true)}
            >
              <span className="font-bold cursor-pointer">
                {user?.followers?.length}
              </span>
              {` `}
              {user?.followers?.length === 1 ? `follower` : `followers`}
            </p>
            <p
              className="mr-10 cursor-pointer"
              onClick={() => setOpenCurrentUserFollowingsModal(true)}
            >
              <span className="font-bold cursor-pointer">
                {user?.followings?.length}
              </span>{" "}
              following
            </p>
          </>
        </div>
      </div>
      {openCurrentUserFollowingsModal && (
        <BasicModal
          open={openCurrentUserFollowingsModal}
          setOpen={setOpenCurrentUserFollowingsModal}
          title="Followings"
          content={contentCurrentUserFollowingsModal}
        />
      )}
      {openUserFollowersListModal && (
        <BasicModal
          open={openUserFollowersListModal}
          setOpen={setOpenUserFollowersListModal}
          title="Followers"
          content={contentUserFollowersModal}
        />
      )}
      {openUpdateUserModal && (
        <UpdateUserModal
          fetchAgain={fetchAgain}
          setFetchAgain={setFetchAgain}
          open={openUpdateUserModal}
          setOpen={setOpenUpdateUserModal}
          userId={user?._id}
        />
      )}
    </div>
  );
};

export default ProfileHeader;
