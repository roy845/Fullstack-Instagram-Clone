import { Post as PostType } from "../../types";
import Footer from "./Footer";
import Header from "./Header";
import Image from "./Image";

interface PostProps {
  content: PostType;
  index: number;
}

const Post: React.FC<PostProps> = ({ content, index }) => {
  const marginTopClass = index === 0 ? "" : "";
  return (
    <div
      className={`rounded col-span-4 border bg-white border-gray-primary mb-4 ${marginTopClass}`}
    >
      <Header content={content} />
      <Image content={content} />
      <Footer content={content} />
    </div>
  );
};

export default Post;
