import { createContext, useContext, useState } from "react";
import { MentionNotification } from "../types";

interface NotificationsContextProps {
  notifications: MentionNotification[];
  setNotifications: React.Dispatch<React.SetStateAction<MentionNotification[]>>;
}

const NotificationsContext = createContext<
  NotificationsContextProps | undefined
>(undefined);

interface NotificationsProviderProps {
  children: React.ReactNode;
}

export const NotificationsProvider: React.FC<NotificationsProviderProps> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState(
    [] as MentionNotification[]
  );
  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        setNotifications,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within an NotificationsContextProvider"
    );
  }
  return context;
};
