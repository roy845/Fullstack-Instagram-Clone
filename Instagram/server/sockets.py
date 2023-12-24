import socketio

sio_server = socketio.AsyncServer(
    async_mode='asgi',   cors_allowed_origins=[])

sio_app = socketio.ASGIApp(
    socketio_server=sio_server,
    socketio_path="/"
)

users = []


def add_user(user_data, socket_id):

    if not any(user["_id"] == user_data.get("_id") for user in users):
        users.append({**user_data, "socketId": socket_id})


def remove_user(socket_id):

    users[:] = [user for user in users if user.get("socketId") != socket_id]


@sio_server.event
async def connect(sid, environ, auth):
    print(f'{sid} connected')


@sio_server.event
async def setup(sid, user):

    if user:
        await sio_server.enter_room(sid, user.get("_id", ""))
        add_user(user, sid)
        await sio_server.emit("getUsers", users)
        await sio_server.emit("connected", room=sid)


@sio_server.event
async def postMention(sid,  mentionedUsers):

    message = f"You were mentioned in a post by {
        mentionedUsers.get('auth', {}).get('user', {}).get('username', '')}."

    for user in mentionedUsers.get('users', []):
        recipient_sid = user['_id']
        await sio_server.emit(
            "newMention",
            {
                "sender": mentionedUsers.get('auth', {}).get('user', {}).get('username', ''),
                "recipientId": user['_id'],
                "content": message,
                "post": mentionedUsers.get('post', {}),
            },
            room=recipient_sid
        )


@sio_server.event
async def disconnect(sid):

    print("USER DISCONNECTED")
    remove_user(sid)
    await sio_server.emit("getUsers", users)
