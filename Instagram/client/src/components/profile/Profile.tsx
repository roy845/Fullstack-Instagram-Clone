import { useEffect, useState } from "react";
import { Layout } from "../Layout";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { HTTP_404_NOT_FOUND } from "../../constants/httpStatusCodes";
import {
  getTotalUserPostsCount,
  getUser,
  getUserPhotos,
} from "../../Api/serverAPI";
import { Post, User } from "../../types";
import ProfileHeader from "./ProfileHeader";
import Photos from "./Photos";
import { usePosts } from "../../context/posts";
import { useUsers } from "../../context/users";
import { useAuth } from "../../context/auth";
import Unauthorized from "../Unauthorized";
import { Button } from "@mui/material";
import Spinner from "../Spinner";

type Props = {};

function Profile({}: Props) {
  const { username, userId } = useParams();

  const [user, setUser] = useState<User>({} as User);
  const [fetchAgain, setFetchAgain] = useState<boolean>(false);
  const [posts, setPosts] = useState<Post[]>([] as Post[]);
  const [totalPostsCount, setTotalPostsCount] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const { currentUserFollowings } = useUsers();
  const { auth } = useAuth();

  useEffect(() => {
    const fetchUserById = async (): Promise<void> => {
      try {
        const { data: user } = await getUser(userId as string);
        setUser(user);
      } catch (error: any) {
        if (error?.response?.status === HTTP_404_NOT_FOUND) {
          toast.error(error?.response?.data.detail, {
            position: "bottom-left",
          });
        }
      }
    };
    fetchUserById();
  }, [username, fetchAgain]);

  const fetchUserPosts = async (page: number): Promise<void> => {
    try {
      setLoading(true);
      const { data: photos } = await getUserPhotos(userId as string, page);
      setPosts(photos);
      setPage(1);

      setLoading(false);
    } catch (error: any) {
      toast.error(error?.response?.data.detail, {
        position: "bottom-left",
      });

      setLoading(false);
    }
  };

  const loadMore = async (): Promise<void> => {
    setLoadingMore(true);
    try {
      const { data } = await getUserPhotos(userId as string, page);

      if (data.length > 0) {
        setPosts([...posts, ...data]);
      }

      setLoadingMore(false);
    } catch (error) {
      console.log(error);
      setLoadingMore(false);
    }
  };

  const onLoadMore = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): Promise<void> => {
    e.preventDefault();

    setPage(page + 1);
  };

  useEffect(() => {
    fetchUserPosts(page);
  }, [userId]);

  useEffect(() => {
    // eslint-disable-next-line
    if (page === 1) {
      fetchUserPosts(page);
      return;
    }
    loadMore();
  }, [page]);

  useEffect(() => {
    const fetchTotalCountUserPosts = async () => {
      try {
        const { data: totalCount } = await getTotalUserPostsCount(
          userId as string
        );
        setTotalPostsCount(totalCount.totalPostCount);
      } catch (error: any) {
        toast.error(error?.response?.data.detail, {
          position: "bottom-left",
        });
      }
    };
    fetchTotalCountUserPosts();
  }, [userId]);

  return (
    <Layout title={`Profile - ${username}`}>
      <ProfileHeader
        fetchAgain={fetchAgain}
        setFetchAgain={setFetchAgain}
        user={user}
        posts={posts}
      />

      {loading ? (
        <Spinner />
      ) : (
        <>
          {currentUserFollowings.some((u) => u?._id === user?._id) ||
          user?._id === auth?.user?._id ? (
            <Photos photos={posts} />
          ) : auth?.user?._id !== user?._id ? (
            <Unauthorized follow />
          ) : null}
        </>
      )}

      {posts && posts.length < totalPostsCount && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          {loadingMore && <Spinner />}
          <Button variant="outlined" color="primary" onClick={onLoadMore}>
            Load More
          </Button>
        </div>
      )}
    </Layout>
  );
}

export default Profile;
