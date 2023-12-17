import { useEffect, useState } from "react";
import UserSlide from "./UserSlide";
import { User } from "../types";
import { getUserFriendsWithCurrentUser } from "../Api/serverAPI";
import CreateStoryModal from "./CreateStoryModal";
import StorySliderModal from "./StorySliderModal";

type StoriesProps = {};

const Stories: React.FC<StoriesProps> = ({}) => {
  const [userFriendsWithCurrentUser, setUserFriendsWithCurrentUser] = useState<
    User[]
  >([] as User[]);
  const [openCreateStories, setOpenCreateStories] = useState<boolean>(false);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  // const [stories, setStories] = useState([]);
  const [openStorySliderModal, setOpenStorySliderModal] =
    useState<boolean>(false);

  useEffect(() => {
    const fetchUserFriendsWithCurrentUser = async (): Promise<void> => {
      try {
        const { data } = await getUserFriendsWithCurrentUser();
        setUserFriendsWithCurrentUser(data.followingsWithCurrentUser);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUserFriendsWithCurrentUser();
  }, []);
  return (
    <div style={{ marginTop: "10px" }}>
      <UserSlide
        profiles={userFriendsWithCurrentUser}
        setOpenStorySliderModal={setOpenStorySliderModal}
        setOpenCreateStories={setOpenCreateStories}
        selectedUserId={selectedUserId}
        setSelectedUserId={setSelectedUserId}
      />

      {openCreateStories && (
        <CreateStoryModal
          open={openCreateStories}
          setOpen={setOpenCreateStories}
          selectedUserId={selectedUserId}
        />
      )}

      {openStorySliderModal && (
        <StorySliderModal
          open={openStorySliderModal}
          setOpen={setOpenStorySliderModal}
          // stories={stories}
          selectedUserId={selectedUserId}
        />
      )}
    </div>
  );
};

export default Stories;
