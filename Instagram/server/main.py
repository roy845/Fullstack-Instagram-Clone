from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, users, photos, story, notifications

from sockets import sio_app

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(photos.router)
app.include_router(story.router)
app.include_router(notifications.router)

app.mount("/", app=sio_app)


@app.get("/", tags=["Root"])
def root():
    return {"message": "hello world"}
