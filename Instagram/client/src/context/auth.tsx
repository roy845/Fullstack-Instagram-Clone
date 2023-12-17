import { ReactNode, createContext, useContext, useState } from "react";
import axios from "axios";
import { Auth } from "../types";

interface AuthContextProps {
  auth: Auth | null;
  setAuth: React.Dispatch<React.SetStateAction<Auth | null>>;
  loadingSplashScreen: boolean;
  setLoadingSplashScreen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AuthContext = createContext<AuthContextProps | undefined>(
  undefined
);

interface AuthContextProviderProps {
  children: ReactNode;
}

export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({
  children,
}) => {
  const [auth, setAuth] = useState(JSON.parse(localStorage.getItem("auth")!));
  const [loadingSplashScreen, setLoadingSplashScreen] =
    useState<boolean>(false);

  axios.defaults.headers.common["Authorization"] = `Bearer ${
    auth?.access_token || ""
  }`;

  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
        loadingSplashScreen,
        setLoadingSplashScreen,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthContextProvider");
  }
  return context;
};

export { useAuth };
