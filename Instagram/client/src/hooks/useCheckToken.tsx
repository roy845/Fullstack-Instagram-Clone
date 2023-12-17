import { useEffect } from "react";
import { useAuth } from "../context/auth";
import { checkTokenExpiration } from "../Api/serverAPI";
import { NavigateFunction, useLocation, useNavigate } from "react-router-dom";

export const useCheckToken = () => {
  const { setAuth } = useAuth();
  const navigate: NavigateFunction = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    const checkToken = async () => {
      try {
        await checkTokenExpiration();
      } catch (error) {
        setAuth(null);
        localStorage.removeItem("auth");
        navigate("/");
      }
    };

    checkToken();
  }, [pathname]);

  return null;
};
