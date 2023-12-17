import { User } from "./User";
import { Suggestions } from "./Suggestions";
import { useAuth } from "../../context/auth";

export function Sidebar() {
  const { auth } = useAuth();

  return (
    <div className="p-4">
      <User
        userId={auth?.user?._id as string}
        username={auth?.user?.username as string}
        fullName={auth?.user?.fullName as string}
        profilePic={auth?.user?.profilePic?.url as string}
      />
      <Suggestions />
    </div>
  );
}
