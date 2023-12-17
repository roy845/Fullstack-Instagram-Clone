import { ReactElement, useEffect, useState } from "react";
import { Layout } from "../components/Layout";
import toast from "react-hot-toast";
import {
  getPostsOfNotFollowings,
  getTotalExplorePostsCount,
} from "../Api/serverAPI";
import { Post } from "../types";
import Photos from "../components/profile/Photos";
import Spinner from "../components/Spinner";
import { Box, Button } from "@mui/material";
import NoPostsExplore from "../components/NoPostsExplore";

interface ExploreProps {}

function Explore({}: ExploreProps): ReactElement {
  const [posts, setPosts] = useState<Post[]>([] as Post[]);
  const [loadingPosts, setLoadingPosts] = useState<boolean>(false);
  const [totalPostsCount, setTotalPostsCount] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);

  const fetchPostsOfNotFollowings = async (page: number) => {
    try {
      setLoadingPosts(true);
      const { data } = await getPostsOfNotFollowings(page);
      setPosts(data);
      setLoadingPosts(false);
      setPage(1);
    } catch (error: any) {
      toast.error(error);
      setLoadingPosts(false);
    }
  };

  useEffect(() => {
    fetchPostsOfNotFollowings(page);
  }, []);

  const loadMore = async (): Promise<void> => {
    setLoadingMore(true);
    try {
      const { data } = await getPostsOfNotFollowings(page);

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
    // eslint-disable-next-line
    if (page === 1) {
      fetchPostsOfNotFollowings(page);
      return;
    }
    loadMore();
  }, [page]);

  useEffect(() => {
    const fetchTotalCountExplorePosts = async () => {
      try {
        const { data: totalCount } = await getTotalExplorePostsCount();
        setTotalPostsCount(totalCount);
      } catch (error: any) {
        toast.error(error?.response?.data.detail, {
          position: "bottom-left",
        });
      }
    };
    fetchTotalCountExplorePosts();
  }, []);

  return (
    <Layout title="Explore">
      {loadingPosts ? (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          height="100vh"
        >
          <Spinner />
        </Box>
      ) : posts.length > 0 ? (
        <Photos photos={posts} explore />
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          height="100vh"
        >
          <NoPostsExplore />
        </Box>
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

export default Explore;
