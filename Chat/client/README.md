# Messenger App (Whatsapp-like)

A real-time messaging application built with Socket.io for instant data push from server to client.
This project is build with ReactJs,NodeJS,MongoDB,Express,JWT and Firebase.

## Tech Stack

- <b>Backend:</b> Node.js with Express

<img src="https://upload.wikimedia.org/wikipedia/commons/d/d9/Node.js_logo.svg" width="124px" height="124px">

<img src = "https://upload.wikimedia.org/wikipedia/commons/6/64/Expressjs.png" width = "60px" height = "60px">

**JWT (JSON Web Tokens)**

<img src = "https://cdn.worldvectorlogo.com/logos/jwt-3.svg" width = "60px" height = "60px">

- <b>Real-Time Data Transfer:</b> Socket.io

 <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Socket-io.svg/600px-Socket-io.svg.png?20200308235956" width="124px" height="124px">

- <b>Frontend:</b> React and Material UI

<img src="https://upload.wikimedia.org/wikipedia/he/a/a7/React-icon.svg" width="124px" height="124px">

**Chakra UI**
<img src="data:image/jpeg;base64,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" alt="d973e444eea4230bcba93cb79b1168e0.png" width = "60px" height = "60px">

- **IDE**

**VSCODE**
<img src="https://upload.wikimedia.org/wikipedia/commons/9/9a/Visual_Studio_Code_1.35_icon.svg" width="60px" height="60px">

<b>Database:</b> MongoDB

<img src="https://upload.wikimedia.org/wikipedia/commons/9/93/MongoDB_Logo.svg" width="124px" height="124px">

**Firebase**
<img src = "https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/google-firebase-icon.png" width = "60px" height = "60px">

## Core Principle

The essence of a real-time messaging app like this one lies in its ability to immediately "push" new data (in this case, messages) from the server to the client. This ensures instantaneous delivery and updating without waiting for the client to request new data. We achieve this using Socket.io library.

## Features

1. New user registration through a register page
   <a href="https://ibb.co/pbf5s2x"><img src="https://i.ibb.co/djPx3Br/register-page.png" alt="register-page"></a>

2. User authentication through a login page.
   <a href="https://ibb.co/0hnJHRY"><img src="https://i.ibb.co/qkD1T3m/login-page-screen-2.png" alt="login-page-screen-2"></a>

3. Menu navigation to different pages in the app.
   <a href="https://ibb.co/zxBNLh3"><img src="https://i.ibb.co/4tXJDZb/navigation-menu.png" alt="navigation-menu"></a>

4. User profile editing (editing Profile Picture, Username,FullName,Password and Status).
   <a href="https://ibb.co/0MSHM2m"><img src="https://i.ibb.co/wWX5WgB/Profile-page.png" alt="Profile-page"></a>

5. Search individual chats/groups
   <a href="https://ibb.co/fC0Jvdc"><img src="https://i.ibb.co/wK6tshv/search-chats-screen.png" alt="search-chats-screen"></a>

6. Search users to add to chat

<a href="https://ibb.co/QXGsWCX"><img src="https://i.ibb.co/FntGQ0n/search-users-to-add-to-chat-screen.png" alt="search-users-to-add-to-chat-screen"></a>

6. User-to-user direct messaging (with emoji's) and user to group messaging (send/receive).

- user-to-user direct messaging

<a href="https://ibb.co/r0QyL8X"><img src="https://i.ibb.co/1Q02py4/direct-one-to-one-messaging-screen.png" alt="direct-one-to-one-messaging-screen"></a>

- user-to-group messaging

<a href="https://ibb.co/zFPmYPg"><img src="https://i.ibb.co/7QrS5rD/group-messaging-screen.png" alt="group-messaging-screen"></a>

<a href="https://ibb.co/r4zPqwb"><img src="https://i.ibb.co/4PXyCVs/group-messaging-screen-2.png" alt="group-messaging-screen-2"></a>

- emoji picker

<a href="https://ibb.co/M127ySX"><img src="https://i.ibb.co/pK0d6wm/emoji-picker-screen.png" alt="emoji-picker-screen"></a>

7. Group creation and adding/removing users to/from groups.

<a href="https://ibb.co/RD8VzWb"><img src="https://i.ibb.co/S3S9Rpy/add-to-group-screen.png" alt="add-to-group-screen"></a>

8. group updation (editing group name,adding/deleting users) by user creator (who creates the group) also if group creator left the chat the system randomly picks one of the group members to be the creator of the group.

<a href="https://ibb.co/zrYCj3t"><img src="https://i.ibb.co/80pGTyQ/group-updation-screen.png" alt="group-updation-screen"></a>

9. Ability for users to leave a group.

<a href="https://ibb.co/zrYCj3t"><img src="https://i.ibb.co/80pGTyQ/group-updation-screen.png" alt="group-updation-screen"></a>

10. Viewing list of groups a user is a part of.

<a href="https://ibb.co/v1jw4rF"><img src="https://i.ibb.co/K6r0xQP/chats-page.png" alt="chats-page"></a>

11. Blocking and unblocking other users.

<a href="https://ibb.co/kXKRrQD"><img src="https://i.ibb.co/fHMhK4N/block-unblock-users-screen.png" alt="block-unblock-users-screen"></a>

- blocked users

<a href="https://ibb.co/mC5gNry"><img src="https://i.ibb.co/7JtLkxp/blocked-user-screen.png" alt="blocked-user-screen"></a>

<a href="https://ibb.co/tqT7X4s"><img src="https://i.ibb.co/wSF9sRW/blocked-user-screen-2.png" alt="blocked-user-screen-2"></a>

12. Viewing the last 20 conversations(this done by checkbox selecting - if checked the system will filter the last 20 conversations that the user interacts with - users are sorted by last message date).

<a href="https://ibb.co/8MpwT2z"><img src="https://i.ibb.co/xh0bPGm/view-last-20-conversations-page.png" alt="view-last-20-conversations-page"></a>

13. View for notifications

<a href="https://ibb.co/kQZm28B"><img src="https://i.ibb.co/Rz8jT0b/notifications-screen.png" alt="notifications-screen"></a>

<a href="https://ibb.co/W30mvsY"><img src="https://i.ibb.co/VNxfY3P/notifications-screen-2.png" alt="notifications-screen-2"></a>

### Installation and Setup

<b>Clone the repository git clone</b> https://github.com/roy845/WhatsApp-Fullstack-MERN.git

### Client

<b>Install the dependencies and start the client</b>

1. Open a new terminal in VSCODE.

2. Navigate to the client directory: cd client.

3. Install dependencies: npm/yarn install.

4. Run the client: npm/yarn start.

### Server

<b>Install the dependencies and start the server</b>

1. Open a new terminal in VSCODE.

2. Navigate to the server directory: cd server.

3. Install dependencies: npm/yarn install.

4. Create a .env file in the root server directory.

In the .env file, set the following variables:

PORT: The port number on which the server will run (e.g., PORT=8800).

MONGO_DB_URI: The MongoDB connection URI for connecting to the database (e.g., MONGODB_URI=mongodb://localhost:27017/mydatabase).

JWT_SECRET_KEY:This key used for authentication and authorization. Here is how you can generate this key:

Open a terminal.

Type the following command and press Enter to generate a random JWT secret key

require('crypto').randomBytes(32).toString('hex')

Copy the generated secret key.

Open the .env file in the server directory.

Set the JWT_SECRET_KEY variable by pasting the generated secret key.

For example:

JWT_SECRET_KEY=generated_secret_key

5. Save the .env file.

6. Run the server: node server.js.
