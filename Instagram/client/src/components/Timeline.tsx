import Skeleton from "react-loading-skeleton";
import { useAuth } from "../context/auth";
import { useUsers } from "../context/users";
import { useState, useEffect } from "react";
import { Post } from "../types";
import toast from "react-hot-toast";
import {
  getCurrentUserFollowingsList,
  getTimelinePosts,
  getTotalTimelinePostsCount,
} from "../Api/serverAPI";
import PostComp from "./post/Post";
import Spinner from "./Spinner";
import { Box, Button } from "@mui/material";
import { useNavigate, NavigateFunction } from "react-router-dom";
import NoTimelinePosts from "./NoTimelinePosts";
import Stories from "./Stories";

interface Props {}

export const Timeline = (props: Props) => {
  const { auth, setAuth } = useAuth();
  const { currentUserFollowings, setCurrentUserFollowings } = useUsers();
  const [timeLinePosts, setTimeLinePosts] = useState<Post[]>([] as Post[]);
  const [loading, setLoading] = useState<boolean>();
  const [totalPostsCount, setTotalPostsCount] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);

  const navigate: NavigateFunction = useNavigate();

  useEffect(() => {
    const fetchCurrentUserFollowingsList = async (): Promise<void> => {
      try {
        setLoading(true);
        const { data } = await getCurrentUserFollowingsList();
        setCurrentUserFollowings(data.followings);
        setLoading(false);
      } catch (error: any) {
        setAuth(null);
        localStorage.removeItem("auth");
        navigate("/");
        console.log(error);
        setLoading(false);
      }
    };
    fetchCurrentUserFollowingsList();
  }, [auth?.user?._id]);

  const fetchTimeLinePosts = async (page: number): Promise<void> => {
    try {
      const { data } = await getTimelinePosts(page);

      setTimeLinePosts(data);
      setPage(1);
    } catch (error: any) {
      setAuth(null);
      localStorage.removeItem("auth");
      navigate("/");
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchTotalCountTimelinePosts = async (): Promise<void> => {
      try {
        const { data: totalCount } = await getTotalTimelinePostsCount();
        setTotalPostsCount(totalCount);
      } catch (error: any) {
        toast.error(error?.response?.data.detail, {
          position: "bottom-left",
        });
      }
    };
    fetchTotalCountTimelinePosts();
  }, []);

  const loadMore = async (): Promise<void> => {
    setLoadingMore(true);
    try {
      const { data } = await getTimelinePosts(page);

      if (data.length > 0) {
        setTimeLinePosts([...timeLinePosts, ...data]);
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
    fetchTimeLinePosts(page);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line
    if (page === 1) {
      fetchTimeLinePosts(page);
      return;
    }
    loadMore();
  }, [page]);

  return (
    <>
      {loading ? (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          height="100vh"
        >
          <Spinner />
        </Box>
      ) : (
        <div className="container col-span-2">
          <Stories />
          {timeLinePosts.length === 0 && (
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              height="100vh"
            >
              <NoTimelinePosts />
            </Box>
          )}
          {auth?.user?.followings === undefined ? (
            <Skeleton count={2} width={640} height={500} className="mb-5" />
          ) : currentUserFollowings?.length === 0 ? (
            <div className="flex justify-center items-center h-screen">
              <p className="font-bold">Follow other people to see Posts</p>
            </div>
          ) : timeLinePosts ? (
            timeLinePosts.map((content, index) => (
              <PostComp key={content._id} content={content} index={index} />
            ))
          ) : null}
          {timeLinePosts && timeLinePosts.length < totalPostsCount && (
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
        </div>
      )}
    </>
  );
};
