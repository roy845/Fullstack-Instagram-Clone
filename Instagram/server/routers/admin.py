from fastapi import APIRouter, Depends, status, HTTPException
from oauth2 import get_current_admin_user
from schemas import list_serial_users
from pymongo import DESCENDING
from database import User, Photo, Story
from datetime import datetime
from bson import ObjectId

router = APIRouter(
    prefix="/admin",
    tags=['Admin']
)


@router.get('/')
def get_admin(current_admin_user: dict = Depends(get_current_admin_user)):
    return {"ok": True}


@router.get('/searchUsers')
def search_users(search: str = "", current_admin_user: dict = Depends(get_current_admin_user)):
    try:
        search_filter = {
            "$or": [
                {"username": {"$regex": search, "$options": "i"}},
                {"fullName": {"$regex": search, "$options": "i"}},
                {"emailAddress": {"$regex": search, "$options": "i"}},
            ], "_id": {"$ne": ObjectId(current_admin_user["_id"])}
        }

        # Apply the search filter and sort by createdAt
        users = list_serial_users(
            User.find(search_filter).sort("createdAt", DESCENDING)
        )

        return users
    except Exception as error:
        print(error)
        raise HTTPException(status_code=500, detail="Internal Server Error")


@router.get('/findAllUsers/all')
def find_all_users(current_admin_user: dict = Depends(get_current_admin_user)):
    try:
        users = list_serial_users(
            User.find({}).sort("createdAt", DESCENDING)
        )

        return users
    except Exception as error:
        print(error)
        raise HTTPException(status_code=500, detail="Internal Server Error")


@router.get("/getNewUsers/all")
def get_new_users():
    try:
        users = list_serial_users(User.find({}).sort(
            [("createdAt", DESCENDING)]).limit(5))
        return users
    except Exception as e:

        return HTTPException(status_code=500, detail={"message": str(e)})


@router.get("/getUsersStats/all")
def get_users_stats():
    try:
        pipeline = [
            {"$project": {"month": {"$month": "$createdAt"}}},
            {"$group": {"_id": "$month", "total": {"$sum": 1}}},
        ]
        data = list(User.aggregate(pipeline))

        user_stats = []
        for entry in data:
            month_name = datetime(1900, entry["_id"], 1).strftime(
                '%b')
            user_stats.append(
                {"name":  month_name.capitalize(), "New User": entry["total"]})

        return user_stats

    except Exception as e:
        raise HTTPException(status_code=500, detail={"message": str(e)})


@router.delete("/deleteUser/{userId}")
def get_users_stats(userId: str, current_admin_user: dict = Depends(get_current_admin_user)):
    try:

        # Delete user's stories
        Story.delete_many({"userId": userId})

        # Update other users' followings and followers lists
        User.update_many(
            {}, {"$pull": {"followings": userId, "followers": userId}})

        # Delete user's posts
        Photo.delete_many({"userId": userId})

        # Delete the user
        User.delete_one({"_id": ObjectId(userId)})

        return {"message": "Account and associated posts and stories have been deleted"}
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail={
                            "message": str(e)})
