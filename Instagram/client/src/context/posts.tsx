import { ReactNode, createContext, useContext, useState } from "react";

import { Post } from "../types";

interface PostsContextProps {
  posts: Post[];
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
}

export const PostsContext = createContext<PostsContextProps | undefined>(
  undefined
);

interface PostsContextProviderProps {
  children: ReactNode;
}

export const PostsContextProvider: React.FC<PostsContextProviderProps> = ({
  children,
}) => {
  const [posts, setPosts] = useState<Post[]>([] as Post[]);

  return (
    <PostsContext.Provider
      value={{
        posts,
        setPosts,
      }}
    >
      {children}
    </PostsContext.Provider>
  );
};

const usePosts = () => {
  const context = useContext(PostsContext);
  if (!context) {
    throw new Error("usePosts must be used within an PostsContextProvider");
  }
  return context;
};

export { usePosts };
