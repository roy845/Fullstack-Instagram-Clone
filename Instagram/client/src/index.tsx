import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthContextProvider } from "./context/auth";
import { Toaster } from "react-hot-toast";
import { UsersContextProvider } from "./context/users";
import { PostsContextProvider } from "./context/posts";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <Router>
    <AuthContextProvider>
      <UsersContextProvider>
        <PostsContextProvider>
          <App />
          <Toaster />
        </PostsContextProvider>
      </UsersContextProvider>
    </AuthContextProvider>
  </Router>
);
