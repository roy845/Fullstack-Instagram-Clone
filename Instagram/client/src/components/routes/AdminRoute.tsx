import { useState, useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router";
import Spinner from "../Spinner";
import { useAuth } from "../../context/auth";
import { getAdminRoutes } from "../../Api/serverAPI";
import { Box } from "@mui/material";

export default function UserAdminRoutes() {
  const [ok, setOk] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const { auth } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const authCheck = async () => {
      try {
        const { data } = await getAdminRoutes();
        setOk(data.ok);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    if (auth?.access_token) {
      authCheck();
    } else {
      setLoading(false);
    }
  }, [auth?.access_token]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <Spinner />
      </Box>
    );
  }

  return ok ? (
    <Outlet />
  ) : auth?.access_token ? (
    <Navigate to="/unauthorized" state={{ from: location }} replace />
  ) : (
    <Navigate to="/" state={{ from: location }} replace />
  );
}
