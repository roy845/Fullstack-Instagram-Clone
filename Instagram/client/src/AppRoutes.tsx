import { useAuth } from "./context/auth";
import { ForgotPassword } from "./pages/Auth/ForgotPassword";
import { Login } from "./pages/Auth/Login";
import { Register } from "./pages/Auth/Register";
import { ResetPassword } from "./pages/Auth/ResetPassword";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import RequireAuth from "./components/RequireAuth";
import NotFound from "./pages/NotFound";
import Profile from "./components/profile/Profile";
import PostPage from "./pages/PostPage";
import EditPost from "./pages/EditPost";
import { SocketProvider } from "./context/socket";
import ChatPage from "./pages/Chat/ChatPage";
import Explore from "./pages/Explore";

export const AppRoutes = () => {
  const { auth } = useAuth();
  return (
    <SocketProvider auth={auth!}>
      <Routes>
        <Route path="/" element={!auth ? <Login /> : <Home />} />
        <Route
          path="/signup"
          element={auth ? <Navigate to="/" /> : <Register />}
        />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/resetpassword/:token" element={<ResetPassword />} />

        <Route element={<RequireAuth />}>
          <Route path="/home" element={<Home />} />
          <Route path="/profile/:username/:userId" element={<Profile />} />
          <Route path="/post/:postId" element={<PostPage />} />
          <Route path="/editPost/:postId" element={<EditPost />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/chats" element={<ChatPage />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </SocketProvider>
  );
};
