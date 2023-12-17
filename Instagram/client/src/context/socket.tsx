import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import io, { Socket } from "socket.io-client";
import { Auth, MentionNotification, User } from "../types";
import { useUsers } from "./users";
import {
  createMentionNotification,
  getNotificationsStatus,
} from "../Api/serverAPI";

const ENDPOINT = "http://localhost:8000";
const PATH = "/sockets";

let socketInstance: Socket | null = null;

export const getSocketInstance = (): Socket => {
  if (!socketInstance) {
    socketInstance = io(ENDPOINT, {
      path: PATH,
    });
  }

  return socketInstance;
};

interface SocketContextProps {
  socket: Socket;
  socketConnected: boolean;
  notifications: MentionNotification[];
  setNotifications: React.Dispatch<React.SetStateAction<MentionNotification[]>>;
  isNotificationsOn: boolean;
  setIsNotificationsOn: React.Dispatch<React.SetStateAction<boolean>>;
}

const SocketContext = createContext<SocketContextProps | undefined>(undefined);

interface SocketProviderProps {
  auth: Auth;
  children: React.ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({
  children,
  auth,
}) => {
  const [socketConnected, setSocketConnected] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<MentionNotification[]>(
    [] as MentionNotification[]
  );
  const [isNotificationsOn, setIsNotificationsOn] = useState(false);

  const { setActiveUsers } = useUsers();
  const socket = getSocketInstance();

  useEffect(() => {
    socket.connect();
    // socket.on("connect", () => {
    //   setSocketConnected(socket.connected);
    // });
    socket.emit("setup", auth?.user);
    socket.on("getUsers", (users: User[]) => {
      localStorage.setItem("activeUsers", JSON.stringify(users));
      setActiveUsers(JSON.parse(localStorage.getItem("activeUsers")!));
    });

    // socket.on("typing", () => setIsTyping(true));
    // socket.on("stop typing", () => setIsTyping(false));
    // socket.emit("join chat", "693b704-903c-4006-bada-4716c6bdab9c");

    return () => {
      socket.disconnect();

      socket.on("getUsers", (users: User[]) => {
        localStorage.setItem("activeUsers", JSON.stringify(users));
        setActiveUsers(JSON.parse(localStorage.getItem("activeUsers")!));
      });
    };
  }, [auth, setActiveUsers]);

  // const handleNewMention = useCallback(
  //   (message: MentionNotification) => {
  //     createMentionNotification(message)
  //       .then((res) => {
  //         setNotifications((prevNotifications) => [
  //           ...prevNotifications,
  //           res.data,
  //         ]);
  //       })
  //       .catch((err: any) => console.log(err));
  //   },
  //   [notifications]
  // );

  // useEffect(
  //   () => {
  //     socket.on("newMention", handleNewMention);
  //     // Cleanup function to remove the event listener
  //     return () => {
  //       socket.off("newMention", handleNewMention);
  //     };
  //   },
  //   [
  //     /*isNotificationsOn*/
  //   ]
  // );

  return (
    <SocketContext.Provider
      value={{
        socket,
        socketConnected,
        notifications,
        setNotifications,
        isNotificationsOn,
        setIsNotificationsOn,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within an SocketContextProvider");
  }
  return context;
};
