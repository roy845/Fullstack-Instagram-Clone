import { Link } from "react-router-dom";
import { Post } from "../../types";
import { useUsers } from "../../context/users";
import { format } from "timeago.js";

interface HeaderProps {
  content: Post;
}

const Header: React.FC<HeaderProps> = ({ content }) => {
  const { activeUsers } = useUsers();
  const isUserActive = activeUsers.some(
    (user) => user._id === content?.user?._id
  );

  return (
    <div className="flex border-b border-gray-primary h-4 p-4 py-8">
      <Link
        to={`/profile/${content?.user?.username}/${content?.user?._id}`}
        className="flex items-center w-full"
      >
        <div className="relative">
          <img
            className="rounded-full h-12 w-12 flex mr-3"
            src={content?.user?.profilePic?.url}
            alt={`${content?.user?.username} profile picture`}
          />
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
        <div className="flex-grow flex justify-between items-center">
          <p className="font-bold">{content?.user?.username}</p>
          <p className="text-gray-base">{format(content.createdAt)}</p>
        </div>
      </Link>
    </div>
  );
};

export default Header;
