import { useState, useContext, createContext } from "react";
import axios from "axios";

export const AuthContext = createContext({});

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(
    JSON.parse(localStorage.getItem("userInfo"))
  );
  const [activeUsers, setActiveUsers] = useState([]);

  axios.defaults.headers.common["Authorization"] = auth?.token;

  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
        activeUsers,
        setActiveUsers,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

//custom hook
const useAuth = () => useContext(AuthContext);

export { useAuth, AuthProvider };
