import { filterFilesByType } from "../../helpers/helpers";
import { FileData, Post } from "../../types";
import { useNavigate, NavigateFunction } from "react-router-dom";
import ImageSlider from "../ImageSlider";

interface ImageProps {
  content: Post;
}

const Image: React.FC<ImageProps> = ({ content }) => {
  const images = filterFilesByType(content?.files as FileData[], "image");

  const navigate: NavigateFunction = useNavigate();

  return <ImageSlider slides={images} postId={content?._id} />;
};

export default Image;
