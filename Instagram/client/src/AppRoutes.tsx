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
import AdminRoute from "./components/routes/AdminRoute";
import AdminDashboard from "./pages/Admin/dashboard/AdminDashboard";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import Users from "./pages/Admin/users/Users";
import TimeSpent from "./components/TimeSpent";
import AnalyticsDashboard from "./pages/Statistics/dashboard/AnalyticsDashboard";
import Statistics from "./pages/Statistics/Statistics";
import ActiveUsers from "./pages/Admin/users/ActiveUsers";
import UserStatistics from "./pages/Admin/users/UserStatistics";
import UpdateUserPage from "./pages/Admin/users/UpdateUserPage";
import DeleteUserPage from "./pages/Admin/users/DeleteUserPage";

export const AppRoutes = () => {
  const { auth } = useAuth();
  return (
    <SocketProvider auth={auth!}>
      {auth && <TimeSpent />}
      <Routes>
        <Route path="/" element={!auth ? <Login /> : <Home />} />
        <Route
          path="/signup"
          element={auth ? <Navigate to="/" /> : <Register />}
        />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/resetpassword/:token" element={<ResetPassword />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        <Route element={<RequireAuth />}>
          <Route path="/home" element={<Home />} />
          <Route path="/profile/:username/:userId" element={<Profile />} />
          <Route path="/post/:postId" element={<PostPage />} />
          <Route path="/editPost/:postId" element={<EditPost />} />
          <Route path="/explore" element={<Explore />} />
          <Route
            path="/timeSpentAnalytics/:userId"
            element={<AnalyticsDashboard />}
          />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/chats" element={<ChatPage />} />
        </Route>

        <Route element={<AdminRoute />} path="/admin">
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="users/:userId" element={<UpdateUserPage />} />
          <Route path="users/delete/:userId" element={<DeleteUserPage />} />
          <Route path="users/statistics" element={<UserStatistics />} />
          <Route path="activeUsers" element={<ActiveUsers />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </SocketProvider>
  );
};
