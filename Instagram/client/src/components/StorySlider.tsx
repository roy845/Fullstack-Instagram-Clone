import { Story } from "../types";
import ImagesStoryCarousel from "./ImagesStoryCarousel";
import SongsStoryCarousel from "./SongsStoryCarousel";
import StoryTabs from "./StoryTabs";
import VideosStoryCarousel from "./VideosStoryCarousel";

interface StorySliderProps {
  story: Story;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const StorySlider: React.FC<StorySliderProps> = ({ story, setOpen }) => {
  const images = story.files.filter((file) => file.type === "image");
  const songs = story.files.filter((file) => file.type === "song");
  const videos = story.files.filter((file) => file.type === "movie");

  return (
    <StoryTabs
      imagesLength={images.length}
      songsLength={songs.length}
      videosLength={videos.length}
      imagesCarousel={
        <ImagesStoryCarousel
          images={images}
          storyId={story._id}
          storyAuthor={story?.user}
        />
      }
      songsCarousel={
        <SongsStoryCarousel
          songs={songs}
          storyId={story._id}
          storyAuthor={story?.user}
        />
      }
      videosCarousel={
        <VideosStoryCarousel
          videos={videos}
          storyId={story._id}
          storyAuthor={story?.user}
        />
      }
    />
  );
};

export default StorySlider;
