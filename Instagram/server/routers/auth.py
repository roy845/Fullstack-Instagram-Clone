from fastapi import APIRouter, Depends, status, HTTPException
from fastapi.security.oauth2 import OAuth2PasswordRequestForm
from database import User, ResetPasswordToken
import models
import secrets
from jose import JWTError, jwt
from utils import verify
from oauth2 import create_access_token
from datetime import datetime, timedelta, timezone
from utils import send_reset_email, hash
from fastapi.security import OAuth2PasswordBearer
from config import settings
from schemas import individual_serial_user
from datetime import datetime
from bson import ObjectId
from pymongo import ReturnDocument

SECRET_KEY = settings.SECRET_KEY
ALGORITHM = settings.ALGORITHM

router = APIRouter(
    prefix="/auth",
    tags=['Authentication']
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")


@router.post("/register", status_code=status.HTTP_201_CREATED)
def create_user(user: models.CreateUser):

    existing_email = User.find_one({"emailAddress": user.emailAddress})

    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail=f"User with this email already exists")

    existing_username = User.find_one({"username": user.username})

    if existing_username:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail=f"User with this username already exists")

    existing_fullname = User.find_one({"fullName": user.fullName})

    if existing_fullname:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail=f"User with this fullname already exists")

    # hash the password - user.password
    hashed_password = hash(user.password)
    user.password = hashed_password

    current_time = datetime.now()
    user_dict = dict(user)
    user_dict.update({
        "createdAt": current_time,
        "updatedAt": current_time
    })

    result = User.insert_one(user_dict)

    # Return the inserted user with the generated ObjectId
    inserted_user = User.find_one({"_id": result.inserted_id})
    return {"message": f"User {user.username} created!", "user": individual_serial_user(inserted_user)}


@router.post('/login')
# credentials are send via form data and not body!!!
def login(user_credentials: OAuth2PasswordRequestForm = Depends()):

    user = User.find_one({"emailAddress": user_credentials.username})

    if not user:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail=f"Invalid Credentials")

    if not verify(user_credentials.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail=f"Invalid Credentials")

    serialized_user = individual_serial_user(user)
    # create token
    access_token = create_access_token(
        data={"user_id": serialized_user["_id"], "isAdmin": serialized_user["isAdmin"]})

    username = serialized_user["username"]

    # return token
    return {"access_token": access_token, "token_type": "bearer", "user": serialized_user,
            "message": f"User {username} logged in successfully"
            }


@router.get('/checktokenexpiration')
def check_token_expiration(token: str = Depends(oauth2_scheme)):
    try:
        jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return {"message": "Token is still valid"}

    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired token")


@router.post("/forgotpassword")
def forgot_password(request: models.PasswordResetRequest):

    user = User.find_one({"emailAddress": request.email})

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Invalid Credentials")

    # Generate a random token
    token = secrets.token_urlsafe(32)
    expiration_time = datetime.now() + timedelta(minutes=15)

    # Store the token in the database
    password_reset_token = models.PasswordResetToken(
        user_id=str(user["_id"]), token=token, expiration_time=expiration_time)
    ResetPasswordToken.insert_one(password_reset_token.model_dump())
    # Send the reset email
    send_reset_email(request.email, token)
    return {"message": "Reset email sent"}


@router.post("/resetpassword")
def reset_password(request: models.PasswordReset):

    reset_password_data = ResetPasswordToken.find_one({"token": request.token})

    if not reset_password_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired token")

    # Check if the token is still valid
    if reset_password_data["expiration_time"] < datetime.now():
        ResetPasswordToken.delete_one({"token": request.token})
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired token")

    user_id_object = ObjectId(reset_password_data["user_id"])

    update_data = {"$set": {}}

    update_data["$set"]["password"] = hash(request.newPassword)

    User.find_one_and_update(
        {"_id": user_id_object},
        update_data,
        return_document=ReturnDocument.AFTER
    )

    # Remove the used token
    ResetPasswordToken.delete_one({"token": request.token})

    return {"message": "Password reset successfully"}
