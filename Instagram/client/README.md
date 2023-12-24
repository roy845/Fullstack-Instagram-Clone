# <img src = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXCYC7rrLBmjp_Hz5SfLkxU_aHZKAmm8sjb-3vBM3naiLNsCaoiI6qg8gvoM1osU7lcnA&usqp=CAU" height="48" width = "48"/> Fullstack Instagram and Chat App

This is a Fullstack Instagram and Chat App built with React (Typescript) for the frontend, NodeJS and Express for the backend of the chat app, FastAPI (Python web framework) for the backend of the instagram app, MongoDB for the database, Firebase Storage for file storage, SocketIO for realtime messaging and Docker for containerization.

## Technology stack

- **Docker**
  <img src="https://icon-icons.com/icons2/2699/PNG/512/docker_official_logo_icon_169250.png" width="124px" height="124px">

- **React**
  <img src="https://upload.wikimedia.org/wikipedia/he/a/a7/React-icon.svg" width="124px" height="124px">
- **MongoDB**
  <img src="https://upload.wikimedia.org/wikipedia/commons/9/93/MongoDB_Logo.svg" width="124px" height="124px">
- **NodeJs**
  <img src="https://upload.wikimedia.org/wikipedia/commons/d/d9/Node.js_logo.svg" width="124px" height="124px">

- **Express**
  <img src = "https://upload.wikimedia.org/wikipedia/commons/6/64/Expressjs.png" width = "60px" height = "60px">

- **JWT (JSON Web Tokens)**
  <img src = "https://cdn.worldvectorlogo.com/logos/jwt-3.svg" width = "60px" height = "60px">

- **Nodemailer**
  <img src = "https://i0.wp.com/community.nodemailer.com/wp-content/uploads/2015/10/n2-2.png?w=422&ssl=1" width = "60px" height = "60px">

- **Material UI**
  <a href="https://ibb.co/VtWN1my"><img src="https://i.ibb.co/wRNLksH/mui-logo.png" alt="mui-logo" width = "60px" height = "60px"></a>

- **Chakra UI**
  <img src="https://i.ibb.co/4Sg46gN/chakra-ui-logo.png" width="124px" height="124px">

- <b>Real-Time Data Transfer:</b> SocketIO

 <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Socket-io.svg/600px-Socket-io.svg.png?20200308235956" width="124px" height="124px">

- **Firebase**
  <img src = "https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/google-firebase-icon.png" width = "60px" height = "60px">

- **VSCODE**
  <img src="https://upload.wikimedia.org/wikipedia/commons/9/9a/Visual_Studio_Code_1.35_icon.svg" width="60px" height="60px">

- **Tailwindcss**
  <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_BuIzY141a5nIZoGEQkFYPN_f3bQddC4uu5ctRPO1Ftp6BNy_iV5foebwEIYesnZLA6c&usqp=CAU" width="60px" height="60px">

- **Typescript**
  <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTuiTDrB4jE3RaO72W0feOQP1XcZhjTrOBuYcqcXNSIQKeOx4iaA75cEZVN5BDrkQcLYK0&usqp=CAU" width="60px" height="60px">

- **Javascript**
  <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRlNiCvQEcbh6JOGeC-g_P3e8DE8VFIvmWuYlbHKSJsYl9m97bnRXpD5Umez0tOBoGU89o&usqp=CAU" width="60px" height="60px">

- **FastAPI**
  <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShdRY5RgXBX9M-FFX3JbQVmjPAKnLhGyqW-o0Z1cyyNcUqepl8gO9u8U3UrLRoReKvDRU&usqp=CAU" width="220px" height="120px">

- **Zegocloud**
  <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0KZWkCsXEvxaDflx2CQhe-GL1zx1jmTVeuTSEvIJLQ-a2EBP-kdwtI1NnCWJuOhKMFI8&usqp=CAU" width="220px" height="220px">

- **Rechart**
  <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTe7cmZpYBaWC4ppgZBHlR7OTqaXlu_PQ2GJSho28vMBW8BqFnomTnrSN3QCZumtGLK2jY&usqp=CAU" width="220px" height="220px">

- **React hook form**
  <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcStBSZr9XstT3_uX0Mi4nBL88vUxZ2LTLu_6ikhMhZywt41ETXdZepvU12op0L33xJTrEM&usqp=CAU" width="220px" height="220px">

- **Zod**
  <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXt1ITFzxsJzjyjX9RnBco2jKyBcNv1UUnf8HojJSqcDchgcAL1x7DuSqdUje0oH7nLsA&usqp=CAU" width="220px" height="220px">

## Project structure

<a href="https://ibb.co/2WdbZXn"><img src="https://i.ibb.co/n6jWPhg/Instagram-Chatapp-system-architecture-drawio.png" alt="Instagram-Chatapp-system-architecture-drawio" border="1"></a>

## Installation and Setup

<b>Clone the repository git clone https://github.com/roy845/Fullstack-Instagram-Clone.git</b>

### Instagram Client

Prepare .env file in the root frontend directory with the following details:
//Firebase connection - create firebase project through firebase console site - https://console.firebase.google.com/u/0/

REACT_APP_APIKEY=
REACT_APP_AUTHDOMAIN=
REACT_APP_PROJECTID=
REACT_APP_STORAGEBUCKET=
REACT_APP_MESSAGINGSENDERID=
REACT_APP_APPID=
REACT_APP_MEASUREMENTID=

<b>Install the dependencies and start the client</b>

1. Open a new terminal in VSCODE.
2. Navigate to the frontend directory: cd Instagram followed by cd client.
3. Install dependencies: npm/yarn install.
4. Run the client: npm/yarn start.

### Instagram Server

Prepare .env file in the root server directory with the following details:
DATABASE_URI=
SECRET_KEY=
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
EMAIL_ADDRESS=
EMAIL_PASSWORD=

Here is how you can generate a JWT secret key:

Open a terminal.

Type the following command and press Enter to generate a random JWT secret key

require('crypto').randomBytes(32).toString('hex')

Copy the generated secret key.

Open the .env file in the server directory.

Set the SECRET_KEY variable by pasting the generated secret key.

For example:

SECRET_KEY=generated_secret_key

<b>Install python virtual environment and dependencies and start the server</b>

1. Open a new terminal in VSCODE.
2. Navigate to the server directory: cd Instagram and followed by cd server.
3. Create the virtual environment: python -m venv venv.
4. Activate the virtual environment: .\venv\Scripts\activate.
5. Install dependencies: pip install -r requirements.txt.
6. Run the server: uvicorn main:app --reload.

<b>Run in docker environment</b>
Open Dockerfile file in the root of the server directory
and put this content in there:

FROM python:3.9.7

WORKDIR /usr/src/app

COPY requirements.txt ./

RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 8000

COPY . .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]

Open .dockerignore file in the root of the server directory and put this content in there:
**pycache**
venv

#### Build the docker image

1. Open a new terminal in VSCODE.
2. Type docker build -t imagename:latest .

#### Run the docker image

1. docker run --name containername -p portnumber:portnumber -d imagename
2. open the browser and type http://localhost:8000

#### Stop the docker container

1. Open a new terminal in VSCODE.
1. list all the running containers with the command: docker ps -a
1. Stop the container with the command: docker container stop container_name_or_id

---

### ChatApp Client

Prepare .env file in the root frontend directory with the following details:
//Firebase connection - create firebase project through firebase console site - https://console.firebase.google.com/u/0/
//Zegocloud connection - create zegocloud project through zegocloud site - https://www.zegocloud.com/

REACT_APP_APIKEY=
REACT_APP_AUTHDOMAIN=
REACT_APP_PROJECTID=
REACT_APP_STORAGEBUCKET=
REACT_APP_MESSAGINGSENDERID=
REACT_APP_APPID=
REACT_APP_MEASUREMENTID=
REACT_APP_ZEGO_APP_ID=
REACT_APP_ZEGO_SERVER_ID=

<b>Install the dependencies and start the client</b>

1. Open a new terminal in VSCODE.
2. Navigate to the client directory: cd Chat followed by cd client.
3. Install dependencies: npm/yarn install.
4. Run the client: npm/yarn start.

### ChatApp Server

Prepare .env file in the root server directory with the following details:
PORT=
MONGO_DB_URI=
JWT_SECRET_KEY=
EMAIL_USERNAME=
EMAIL_PASSWORD=
ZEGO_APP_ID=
ZEGO_SERVER_ID=

Here is how you can generate a JWT key:

Open a terminal.

Type the following command and press Enter to generate a random JWT secret key

require('crypto').randomBytes(32).toString('hex')

Copy the generated secret key.

Open the .env file in the server directory.

Set the JWT_SECRET_KEY variable by pasting the generated secret key.

For example:

JWT_SECRET_KEY=generated_secret_key

<b>Install the dependencies and start the server</b>

1. Open a new terminal in VSCODE.
2. Navigate to the backend directory: cd Chat followed by cd server.
3. Install dependencies: npm/yarn install.
4. Run the server: npm/yarn start.

<b>Run in docker environment</b>
Open Dockerfile file in the root of the backend directory
and put this content in there:

FROM node:18-alpine

WORKDIR /app

COPY package.json .

RUN yarn install

COPY . .

EXPOSE 8800

CMD ["npm", "start"]

Open .dockerignore file in the root of the backend directory and put this content in there:
node_modules

#### Build the docker image

1. Open a new terminal in VSCODE.
2. Type docker build -t imagename:latest .

#### Run the docker image

1. docker run --name containername -p portnumber:portnumber -d imagename
2. open the browser and type http://localhost:8800

#### Stop the docker container

1. Open a new terminal in VSCODE.
1. list all the running containers with the command: docker ps -a
1. Stop the container with the command: docker container stop container_name_or_id

## Features

### Instagram App

- <b>User Authentication</b>
  Users can sign up, log in, and log out securely using jwt authentication system and also reset their password

<br/>

- <b>Login</b>
  <a href="https://ibb.co/d7785qc"><img src="https://i.ibb.co/R77RDmS/Login.png" alt="Login" border="1"></a>

- <b>Register</b>
  <a href="https://ibb.co/fCjVrh8"><img src="https://i.ibb.co/MRFyPY8/Register.png" alt="Register" border="1"></a>

- <b>Forgot password</b>
  <a href="https://ibb.co/hWWky8s"><img src="https://i.ibb.co/pzzgxX2/Forgot-Password.png" alt="Forgot-Password" border="1"></a>

- <b>Reset Password</b>
  <a href="https://ibb.co/3kNKC7s"><img src="https://i.ibb.co/kM8ZSxy/Reset-password.png" alt="Reset-password" border="1"></a>

- <b>Loading screen</b>
  Once the user press on the login button a loading screen will pop up
  <a href="https://ibb.co/9Yys2rK"><img src="https://i.ibb.co/dKkG65C/Loading-screen.png" alt="Loading-screen" border="1"></a>

- <b>Main feed</b>
  After the loading screen the user will see the main screen that contains the navigation menu at the right the time line post feed at the center and user suggestions and his profile at the left. at the top we can view all the stories the different friends uploaded.
  <a href="https://ibb.co/TMmxTRR"><img src="https://i.ibb.co/4RPnfMM/Main.png" alt="Main" border="1"></a>

- <b>Menu navigation</b>
  Here we can navigate to different sections in the app
  <a href="https://ibb.co/sRCFXSL"><img src="https://i.ibb.co/54k5JDq/Menu-navigation.png" alt="Menu-navigation" border="1"></a>

- <b>Search section</b>
  In this section we can search different users found on the app and that don't blocked us.
  <a href="https://ibb.co/vsM8ghw"><img src="https://i.ibb.co/SQZpWcs/Search-users.png" alt="Search-users" border="1"></a>

- <b>Explore section</b>
  In this section we can view all the different posts of the users which we don't follow them and users that don't blocked us.
  <a href="https://ibb.co/XYrB6mH"><img src="https://i.ibb.co/Z2psvy9/Explore.png" alt="Explore" border="1"></a>

- <b>Create section</b>
  In this section we can create new posts that contains images,songs and videos. each post must contain at least one image
  <a href="https://ibb.co/jVrdcrM"><img src="https://i.ibb.co/6vW23WP/Create-post.png" alt="Create-post" border="1"></a>

- <b>Notifications section</b>
  In this section we can view all the notifications that we get when another friend tags us in a post. when we click on the notification it will navigate us to the post page of the tagged comment
  <a href="https://ibb.co/M7qXSWN"><img src="https://i.ibb.co/x6V4LP5/Notifications.png" alt="Notifications" border="0"></a>

- <b>Settings section</b>
  In this section we can change different settings related to if notifications and block/unblock different users
  <a href="https://ibb.co/b36ZXZ4"><img src="https://i.ibb.co/xs2060n/Settings.png" alt="Settings" border="1"></a>

- <b>Analytics section</b>
  In this section we can view how much time total time (in minutes) per day the user spent in the app
  <a href="https://ibb.co/Brz7x7h"><img src="https://i.ibb.co/CM1XZXj/Analytics-dashboard.png" alt="Analytics-dashboard" border="1"></a>
  <a href="https://ibb.co/234zWXm"><img src="https://i.ibb.co/HT8cBm1/Time-spent-in-app-graphs.png" alt="Time-spent-in-app-graphs" border="1"></a>
  <a href="https://ibb.co/NrVMvz8"><img src="https://i.ibb.co/XD2qQTh/Time-spent-in-app-table.png" alt="Time-spent-in-app-table" border="1"></a>

- <b>Post page</b>
  In this page we can view the user's post media (image,songs,videos) and also comment,add friends tags and like it.
  <a href="https://ibb.co/9wMNwcJ"><img src="https://i.ibb.co/Rh59hY1/Post-page.png" alt="Post-page" border="1"></a>
- <b>Post lkes</b>
  The user can view all the likes given to a single post and also like his own post.
  <a href="https://ibb.co/ByMn28T"><img src="https://i.ibb.co/jyXJk73/Post-likes.png" alt="Post-likes" border="1"></a>
- <b>Comment lkes</b>
  The user can view all the likes given to a single comment and also like his own comment.
  <a href="https://ibb.co/SfKghsQ"><img src="https://i.ibb.co/cYN9Ggb/Comment-likes.png" alt="Comment-likes" border="1"></a>
- <b>Editing Comment</b>
  Only the user who created the comment can edit it.
  <a href="https://ibb.co/QjQdy2j"><img src="https://i.ibb.co/qFj5TtF/edit-comment.png" alt="edit-comment" border="1"></a>
- <b>Deleting Comment</b>
  Only the user who created the comment can delete it.
  <a href="https://ibb.co/WPPrRzh"><img src="https://i.ibb.co/2sszpM9/Deleting-comment.png" alt="Deleting-comment" border="1"></a>
- <b>Editing Post</b>
  Only the user who created the post can edit it. it can add more media (images,songs,videos) and also edit the description of the post.
  <a href="https://ibb.co/db37fn3"><img src="https://i.ibb.co/JxbCcXb/Edit-post.png" alt="Edit-post" border="1"></a>
- <b>Deleting Post</b>
  Only the user who created the post can delete it.
  <a href="https://ibb.co/GR4NvYf"><img src="https://i.ibb.co/njNtsdq/Delete-post.png" alt="Delete-post" border="1"></a>
- <b>Tag frients in Post</b>
  The user can tag his friends (users which he/she are follow after) in a post. the friend will get a notification which will show in the notifications section shown previously.
  The user can clear the notification or can press on it and it will take him to the post and the comment he/she tagged in.
  <a href="https://ibb.co/1M44y8X"><img src="https://i.ibb.co/f9TT64N/Friends-tag-in-a-post.png" alt="Friends-tag-in-a-post" border="1"></a>
  <a href="https://ibb.co/Dt8bXvp"><img src="https://i.ibb.co/9NVvX1t/Notification-added.png" alt="Notification-added" border="1"></a>
  <a href="https://ibb.co/TPMhZbL"><img src="https://i.ibb.co/zPVf17J/Get-notification.png" alt="Get-notification" border="1"></a>

- <b>User stories</b>
  In this section the user can view it's own story and stories uploaded by their followings. each story contains media (images,songs,videos).
  <a href="https://ibb.co/ykjynbY"><img src="https://i.ibb.co/vdnPxKQ/User-story.png" alt="User-story" border="1"></a>

- <b>User profile section</b>
  In this section the user can view its own posts and view it's followers and followings.
  <a href="https://ibb.co/nc5Ckmg"><img src="https://i.ibb.co/BZSNs3z/User-profile.png" alt="User-profile" border="1"></a>

- <b>User followers</b>
  <a href="https://ibb.co/tY25q53"><img src="https://i.ibb.co/r5pJxJv/User-followers.png" alt="User-followers" border="1"></a>

- <b>User followings</b>
  <a href="https://ibb.co/gF220r3"><img src="https://i.ibb.co/2Y99zFy/User-followings.png" alt="User-followings" border="1"></a>

- <b>Update user profile</b>
  In this section the user can edit it's details like username,name,password,email and change it's profilePicture.
  <a href="https://ibb.co/9gH6t4f"><img src="https://i.ibb.co/vq4pYdr/Update-profile.png" alt="Update-profile" border="1"></a>

- <b>Other user profile</b>
  In this section the user can see the other user profile. it includes its posts,followers and followings. in order to see the other user posts the user must follow the other user and not blocked by him.
  <a href="https://ibb.co/XWq92Y3"><img src="https://i.ibb.co/NFMXVTm/Other-profile-unfollow.png" alt="Other-profile-unfollow" border="1"></a>

- Once he/she follows him he/she can see its posts
  <a href="https://ibb.co/TtXCPd2"><img src="https://i.ibb.co/x6v4zdL/Other-user-profile.png" alt="Other-user-profile" border="1"></a>

- Other user followers
  <a href="https://ibb.co/wYBZ5Hw"><img src="https://i.ibb.co/mSbrfsX/Other-user-followers.png" alt="Other-user-followers" border="1"></a>
- Other user followings
  <a href="https://ibb.co/qjd6LFP"><img src="https://i.ibb.co/NCsRgnH/Other-user-followings.png" alt="Other-user-followings" border="1"></a>

---

- <b>Admin section</b>
  Only users defined as admin (which there isAdmin field in the db is true) can access this page. In this section the admin user can manage the different users found on the app in realtime, view their statistics and even edit their profile and delete them.
  <a href="https://ibb.co/g9ZZGBQ"><img src="https://i.ibb.co/1QGG3wB/Admin-dashboard.png" alt="Admin-dashboard" border="1"></a>

- <b>Users section</b>
  In this section the admin can view all the users details in table format and can edit their details and even delete them completly from the app.
  <a href="https://ibb.co/2gXJK57"><img src="https://i.ibb.co/bzptd7g/Admin-dashboard-users-table.png" alt="Admin-dashboard-users-table" border="1"></a>

- <b>Edit user</b>
  <a href="https://ibb.co/ZxkjBj4"><img src="https://i.ibb.co/RcVF3Fr/Admin-dashboard-edit-user.png" alt="Admin-dashboard-edit-user" border="1"></a>

- <b>Delete user</b>
  <a href="https://ibb.co/3Y0D1dn"><img src="https://i.ibb.co/XkzhXLq/Admin-dashboard-delete-user.png" alt="Admin-dashboard-delete-user" border="1"></a>

- <b>Users statistics section</b>
  In this section the admin can see how much users joined to the app per month and also can see user analytics (how much time each user spent in the app in minutes per day) and also a table of new users joined to the app (the 5 recent).
  <a href="https://ibb.co/fDTM5T9"><img src="https://i.ibb.co/7k0v50Q/Admin-dashboard-user-statistics-1.png" alt="Admin-dashboard-user-statistics-1" border="1"></a>

<a href="https://ibb.co/4PxZ6LW"><img src="https://i.ibb.co/SRpXhgN/Admin-dashboard-user-statistics-2.png" alt="Admin-dashboard-user-statistics-2" border="1"></a>

- <b>Active users section</b>
  In this section the admin can see all the users that are active on the app right now. the updation occur in realtime. when a user login or logout from the app the change reflect immidiately.
  <a href="https://ibb.co/G0Z0kRL"><img src="https://i.ibb.co/KXtX7Wk/Admin-dashboard-active-users.png" alt="Admin-dashboard-active-users" border="1"></a>

---

### Chat App

In the instagram app there is a link to the chat app
<a href="https://ibb.co/LPShGty"><img src="https://i.ibb.co/8BM4h5w/Link-to-chat-app.png" alt="Link-to-chat-app" border="1"></a>

- <b>User Authentication</b>
  Users can sign up, log in, and log out securely using jwt authentication system and also reset their password

<br/>

- <b>Login</b>
  <a href="https://ibb.co/2qyYbZC"><img src="https://i.ibb.co/6YmJdXT/Login.png" alt="Login" border="1"></a>
- <b>Register</b>
  <a href="https://ibb.co/crN73LF"><img src="https://i.ibb.co/x7MRLHj/Register.png" alt="Register" border="1"></a>
- <b>Forgot password</b>
  <a href="https://ibb.co/Rjqkydr"><img src="https://i.ibb.co/vXS6YRy/Forgot-password.png" alt="Forgot-password" border="1"></a>
- <b>Reset Password</b>
  <a href="https://ibb.co/9VpCyzc"><img src="https://i.ibb.co/z7m0PjQ/Reset-password.png" alt="Reset-password" border="1"></a>

- <b>Main screen</b>
  After login the user navigates to this page. this is the main screen in the app that contains the chats list,chatbox,header that contains user search and a menu
  <a href="https://ibb.co/R3RtXYW"><img src="https://i.ibb.co/K2TBtbH/Main.png" alt="Main" border="1"></a>

- <b>Menu navigation</b>
  Here we can navigate to different sections in the app (User profile,settings,logout)
  <a href="https://ibb.co/ssnr0kP"><img src="https://i.ibb.co/1R1xDhn/Menu-navigation.png" alt="Menu-navigation" border="1"></a>
- <b>User profile</b>
  <a href="https://ibb.co/QJ76K6X"><img src="https://i.ibb.co/FhkBDBn/User-profile.png" alt="User-profile" border="1"></a>

- <b>Search users</b>
  In this drawer the user can search different users found in the app. once he/she clicks on the found user he/she can start a chat with this user.
  <a href="https://ibb.co/tDw4tWh"><img src="https://i.ibb.co/2d0yQf6/Search-users.png" alt="Search-users" border="1"></a>

- <b>One to one chat</b>
  Here we can chat one to one chat with the selected user.
  we can send text and media files between the users
  <a href="https://ibb.co/Nt7bCBF"><img src="https://i.ibb.co/17bjQW0/One-to-one-chat.png" alt="One-to-one-chat" border="1"></a>
- <b>One to one voice call</b>
  There is an option to perform a voice call in one to one chat
  <a href="https://ibb.co/YfCfP81"><img src="https://i.ibb.co/HGSGBYb/One-to-one-voice-call.png" alt="One-to-one-voice-call" border="1"></a>
- <b>One to one video call</b>
  There is an option to perform a video call in one to one chat
  <a href="https://ibb.co/GJ7wBwN"><img src="https://i.ibb.co/n0r2Z2t/One-to-one-video-call.png" alt="One-to-one-video-call" border="1"></a>
- <b>One to one details</b>
  In this modal we can view the other user details: its name,email and when he joined the app.
  <a href="https://ibb.co/qMKwJbk"><img src="https://i.ibb.co/3y2HRtB/One-to-one-details.png" alt="One-to-one-details" border="0"></a>
- <b>Attach media</b>
  There is an option to attach media in each chat.
  it includes the option to attach files,taking photos,videos and even voice recordings.
  <a href="https://ibb.co/tMyVHVV"><img src="https://i.ibb.co/fYmjXjj/Attach-media.png" alt="Attach-media" border="1"></a>
- <b>Search messages</b>
  The user can search messages in the chat. once he start typing the relevant characters/words will glow in yellow.
  <a href="https://ibb.co/qd4nQz9"><img src="https://i.ibb.co/6mpZC2b/Search-messages.png" alt="Search-messages" border="1"></a>
- <b>Create Group chat</b>
  In this modal we can create new group chat. we can search the users in the app and add them to the group and press create group.
  <a href="https://ibb.co/Dr3Q6Hc"><img src="https://i.ibb.co/1zHTpty/Create-group.png" alt="Create-group" border="1"></a>
- <b>Group chat</b>
  Once the group is created we can chat with different peoples in that group.
  <a href="https://ibb.co/8sgv3GV"><img src="https://i.ibb.co/2h3V2RB/Group-chat.png" alt="Group-chat" border="1"></a>
- <b>Group chat details</b>
  In this modal we can view the members in this group,add new users,change the group name and also leave the group.
  <a href="https://ibb.co/wyGHJkf"><img src="https://i.ibb.co/BLWD4p9/Group-chat-detail.png" alt="Group-chat-detail" border="1"></a>
- <b>Settings</b>
  In this modal the user can block/unblock other users, select if he want to see just the 20 last converations and enable/disable notifications sounds.
  <a href="https://ibb.co/P9dXqbW"><img src="https://i.ibb.co/fns6jKN/Settings-modal.png" alt="Settings-modal" border="1"></a>
- <b>Chat notifications</b>
  Once the user if out of the chat (it means the other chat is not selected a notification will pop up if he receives a message)
  <a href="https://ibb.co/47jhC4c"><img src="https://i.ibb.co/wRK58pT/Chat-notifications.png" alt="Chat-notifications" border="1"></a>
