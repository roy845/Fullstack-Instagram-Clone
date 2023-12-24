from pydantic import BaseModel
from typing import Dict, Optional
from pydantic import EmailStr
from datetime import datetime
from typing import List
from bson import ObjectId


class BlockedList(BaseModel):
    blockedListUsers: List[str]


class UnblockedList(BaseModel):
    unblockedListUsers: List[str]


class NotificationsStatus(BaseModel):
    checked: bool


class MentionNotification(BaseModel):
    content: str
    post: dict
    recipientId: str
    sender: str


class Mentions(BaseModel):
    mentions: List[str]


class PictureProfile(BaseModel):
    id: str
    url: str

    def to_dict(self) -> Dict:
        return {"id": self.id, "url": self.url}


class TimeSpentInApp(BaseModel):
    date: str = ""
    timeSpent: int = 0


class CreateUser(BaseModel):
    username: str
    fullName: str
    password: str
    emailAddress: EmailStr
    isAdmin: bool = False
    followings: list = []
    followers: list = []
    profilePic: PictureProfile = {
        "id": ObjectId(),
        "url": "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
        "publish": False
    }
    timeSpentInApp: TimeSpentInApp = []


class UpdateUser(BaseModel):
    username: str
    fullName: str
    password: str
    emailAddress: EmailStr
    isAdmin: bool = False
    followings: list = []
    followers: list = []
    profilePic: PictureProfile = {
        "id": ObjectId(),
        "url": "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
        "publish": False
    }


class CreatePhoto(BaseModel):
    description: str
    files: List = []
    likes: List = []
    comments: List = []
    edited: bool = False


class UpdatePost(BaseModel):
    description: str
    files: List
    edited: bool = True


class CreateComment(BaseModel):
    content: str


class UpdateComment(CreateComment):
    pass


class LikePost(BaseModel):
    postId: str


class LikeComment(LikePost):
    commentId: str


class CreateStory(BaseModel):
    files: List = []


class TokenData(BaseModel):
    id: str


class PasswordResetRequest(BaseModel):
    email: str


class PasswordResetToken(BaseModel):
    token: str
    user_id: str
    expiration_time: datetime


class PasswordReset(BaseModel):
    newPassword: str
    token: str
