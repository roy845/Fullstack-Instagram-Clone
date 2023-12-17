import { useEffect } from "react";
import {
  useLocation,
  Navigate,
  Outlet,
  useNavigate,
  NavigateFunction,
} from "react-router-dom";
import { useAuth } from "../context/auth";
import { checkTokenExpiration } from "../Api/serverAPI";

const RequireAuth = () => {
  const { auth, setAuth } = useAuth();
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

  return auth ? (
    <Outlet />
  ) : (
    <Navigate to="/" state={{ from: pathname }} replace />
  );
};

export default RequireAuth;
