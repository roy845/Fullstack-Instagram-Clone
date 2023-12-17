import { ReactNode, createContext, useContext, useState } from "react";
import { User } from "../types";

interface UsersContextProps {
  currentUserFollowings: User[];
  setCurrentUserFollowings: React.Dispatch<React.SetStateAction<User[]>>;
  activeUsers: User[];
  setActiveUsers: React.Dispatch<React.SetStateAction<User[]>>;
  // friends: User[];
  // setFriends: React.Dispatch<React.SetStateAction<User[]>>;
}

export const UsersContext = createContext<UsersContextProps | undefined>(
  undefined
);

interface UsersContextProviderProps {
  children: ReactNode;
}

export const UsersContextProvider: React.FC<UsersContextProviderProps> = ({
  children,
}) => {
  const [currentUserFollowings, setCurrentUserFollowings] = useState<User[]>(
    [] as User[]
  );

  const [activeUsers, setActiveUsers] = useState<User[]>([]);
  // const [friends, setFriends] = useState<User[]>([] as User[]);
  return (
    <UsersContext.Provider
      value={{
        currentUserFollowings,
        setCurrentUserFollowings,
        activeUsers,
        setActiveUsers,
        // friends,
        // setFriends,
      }}
    >
      {children}
    </UsersContext.Provider>
  );
};

const useUsers = () => {
  const context = useContext(UsersContext);
  if (!context) {
    throw new Error("useUsers must be used within an UsersContextProvider");
  }
  return context;
};

export { useUsers };
