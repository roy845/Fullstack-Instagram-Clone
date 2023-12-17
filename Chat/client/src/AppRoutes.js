import React from "react";
import { Route, Routes } from "react-router-dom";
import Homepage from "./pages/Homepage";
import ChatPage from "./pages/ChatPage";
import { useAuth } from "./context/auth";
import RequireAuth from "./components/RequireAuth";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

const AppRoutes = () => {
  const { auth } = useAuth();
  return (
    <Routes>
      <Route path="/" element={!auth ? <Homepage /> : <ChatPage />} />
      <Route path="/forgotpassword" element={<ForgotPassword />} />
      <Route path="/resetpassword/:token" element={<ResetPassword />} />
      <Route element={<RequireAuth />}>
        <Route path="/chats" element={<ChatPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
