const express = require("express");
const dotenv = require("dotenv");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/dbConn");
const routes = require("./routes");

dotenv.config();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(routes);

const PORT = process.env.PORT || 8800;

connectDB();
const server = app.listen(PORT, () => console.log(`Server Started on ${PORT}`));

let users = [];

const addUser = (userData, socketId) => {
  !users.some((user) => user._id === userData._id) &&
    users.push({ ...userData, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const io = require("socket.io")(server, {
  pingTimeOut: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("connected to socket.io");
  socket.on("setup", (userData) => {
    console.log(userData._id);
    socket.join(userData._id);
    addUser(userData, socket.id);
    io.emit("getUsers", users);

    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User joined Room: " + room);
  });

  socket.on("typing", (room) => {
    socket.in(room).emit("typing");
  });

  socket.on("stop typing", (room) => {
    socket.in(room).emit("stop typing");
  });

  socket.on("new message", (newMessageReceived) => {
    let chat = newMessageReceived.chat;
    if (!chat.users) {
      return;
    }

    chat.users.forEach((user) => {
      if (user._id === newMessageReceived.sender._id) {
        return;
      }
      socket.in(user._id).emit("message received", newMessageReceived);
    });
  });

  socket.on("disconnect", () => {
    console.log("USER DISCONNECTED");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});
