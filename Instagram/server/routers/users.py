from fastapi import HTTPException, status, Depends
from fastapi import APIRouter, HTTPException, status
from database import User
import models
from schemas import individual_serial_user, list_serial_users
from models import UpdateUser
from bson import ObjectId
from pymongo import ReturnDocument
from datetime import datetime
from utils import hash
from oauth2 import get_current_user
from pymongo import DESCENDING
from bson import ObjectId


router = APIRouter(
    tags=["Users"],
    prefix="/users"
)


@router.get("/all")
async def get_all_users(
    search: str = "",
    current_user: dict = Depends(get_current_user)
):
    try:
        # Build the search filter based on username, fullName, and email
        search_filter = {
            "$or": [
                {"username": {"$regex": search, "$options": "i"}},
                {"fullName": {"$regex": search, "$options": "i"}},
                {"emailAddress": {"$regex": search, "$options": "i"}},
            ]
        }

        # Apply the search filter and sort by createdAt
        users = list_serial_users(
            User.find(search_filter).sort("createdAt", DESCENDING)
        )

        return users
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error in fetching users: {str(e)}"
        )


@router.get("/")
async def get_users(
    search: str = "",
    current_user: dict = Depends(get_current_user)
):
    try:
        # Retrieve the current user from the database
        current_user_document = User.find_one(
            {"_id": ObjectId(current_user["_id"])})

        # Ensure the current user is found
        if not current_user_document:
            raise HTTPException(
                status_code=404, detail="Current user not found")

        # Get the blocked users list of the current user
        blocked_users_ids = current_user_document.get("blockedUsers", [])

        # Define the search filter
        search_filter = {
            "_id": {"$ne": ObjectId(current_user["_id"]), "$nin": blocked_users_ids},
            "blockedUsers": {"$ne": ObjectId(current_user["_id"])}
        }

        # Add the $or condition if search is provided
        if search:
            search_filter["$or"] = [
                {"username": {"$regex": search, "$options": "i"}},
                {"email": {"$regex": search, "$options": "i"}},
            ]

        # Retrieve users based on the search filter
        users = list_serial_users(User.find(search_filter))

        return users

    except Exception as error:
        print(error)
        raise HTTPException(status_code=500, detail="Internal Server Error")


@router.get("/{user_id}", status_code=status.HTTP_200_OK)
def get_user(user_id: str):

    try:
        user_id_object = ObjectId(user_id)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid user_id format: {e}"
        )

    user = User.find_one({"_id": user_id_object})

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with id: {user_id} not found"
        )

    serialized_user = individual_serial_user(user)

    if 'followers' in serialized_user:
        serialized_user['followers'] = [individual_serial_user(User.find_one(
            {"_id": ObjectId(follower_id)})) for follower_id in serialized_user['followers']]

    if 'followings' in serialized_user:
        serialized_user['followings'] = [individual_serial_user(User.find_one(
            {"_id": ObjectId(following_id)})) for following_id in serialized_user['followings']]

    return serialized_user


@router.get("/getUserByUsername/{username}", status_code=status.HTTP_200_OK)
def get_user(username: str):

    user = User.find_one({"username": username})

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with id: {username} not found"
        )

    serialized_user = individual_serial_user(user)

    if 'followers' in serialized_user:
        serialized_user['followers'] = [individual_serial_user(User.find_one(
            {"_id": ObjectId(follower_id)})) for follower_id in serialized_user['followers']]

    if 'followings' in serialized_user:
        serialized_user['followings'] = [individual_serial_user(User.find_one(
            {"_id": ObjectId(following_id)})) for following_id in serialized_user['followings']]

    return serialized_user


@router.delete('/{user_id}', status_code=status.HTTP_204_NO_CONTENT)
def delete_user(user_id: str):
    try:
        user_id_object = ObjectId(user_id)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid user_id object format: {e}"
        )

    deleted_user = User.find_one_and_delete(
        {"_id": user_id_object})

    if not deleted_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with id: {user_id} not found"
        )

    return "User deleted successfully"


@router.put("/{user_id}")
def update_user(user_id: str, updated_user: UpdateUser):

    try:
        user_id_object = ObjectId(user_id)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid user_id format: {e}"
        )

    user = User.find_one({"_id": user_id_object})

    update_data = {"$set": {}}

    update_data["$set"]["password"] = hash(
        updated_user.password) if updated_user.password else user["password"]
    update_data["$set"]["profilePic"] = updated_user.profilePic.to_dict(
    ) if updated_user.profilePic else user["profilePic"]
    update_data["$set"]["username"] = updated_user.username if updated_user.username else user["username"]
    update_data["$set"]["fullName"] = updated_user.fullName if updated_user.fullName else user["fullName"]
    update_data["$set"]["emailAddress"] = updated_user.emailAddress if updated_user.emailAddress else user["emailAddress"]
    update_data["$set"]["isAdmin"] = user["isAdmin"]
    update_data["$set"]["followers"] = user["followers"]
    update_data["$set"]["followings"] = user["followings"]
    update_data["$set"]["timeSpentInApp"] = user["timeSpentInApp"]
    update_data["$set"]["notifications_enabled"] = user["notifications_enabled"]
    update_data["$set"]["createdAt"] = user["createdAt"]
    update_data["$set"]["updatedAt"] = datetime.now()

    # Update the database
    updated_user_from_db = User.find_one_and_update(
        {"_id": user_id_object},
        update_data,
        return_document=ReturnDocument.AFTER
    )

    if not updated_user_from_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with id: {user_id} not found"
        )

    return {"message": "User updated successfully", "user": individual_serial_user(updated_user_from_db)}


@router.put('/followUser/{userIdToFollow}')
def follow_user(userIdToFollow: str, current_user: dict = Depends(get_current_user)):
    if current_user["_id"] != userIdToFollow:
        userToFollow = User.find_one({"_id": ObjectId(userIdToFollow)})

        if current_user["_id"] not in userToFollow.get("followers", []):
            updated_user_to_follow = User.find_one_and_update(
                {"_id": ObjectId(userIdToFollow)},
                {"$push": {"followers": current_user["_id"]}},
                return_document=ReturnDocument.AFTER
            )

            updated_current_user = User.find_one_and_update(
                {"_id": ObjectId(current_user["_id"])},
                {"$push": {"followings": userIdToFollow}},
                return_document=ReturnDocument.AFTER
            )

            current_user_followings = [
                individual_serial_user(User.find_one({"_id": ObjectId(id)})) for id in updated_current_user.get("followings", [])
            ]

            user_followers = [
                individual_serial_user(User.find_one({"_id": ObjectId(id)})) for id in updated_user_to_follow.get("followers", [])
            ]

            return {
                "currentUserFollowingsList": current_user_followings,
                "userFollowersList": user_followers
            }
        else:
            raise HTTPException(
                status_code=403, detail="You already follow this user")
    else:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="You can't follow yourself")


@router.put('/unfollowUser/{userIdToUnfollow}')
def unfollow_user(userIdToUnfollow: str, current_user: dict = Depends(get_current_user)):
    if current_user["_id"] != userIdToUnfollow:
        userToFollow = User.find_one({"_id": ObjectId(userIdToUnfollow)})

        if current_user["_id"] in userToFollow.get("followers", []):
            updated_user_to_follow = User.find_one_and_update(
                {"_id": ObjectId(userIdToUnfollow)},
                {"$pull": {"followers": current_user["_id"]}},
                return_document=ReturnDocument.AFTER
            )

            updated_current_user = User.find_one_and_update(
                {"_id": ObjectId(current_user["_id"])},
                {"$pull": {"followings": userIdToUnfollow}},
                return_document=ReturnDocument.AFTER
            )

            current_user_followings = [
                individual_serial_user(User.find_one({"_id": ObjectId(id)})) for id in updated_current_user.get("followings", [])
            ]

            user_followers = [
                individual_serial_user(User.find_one({"_id": ObjectId(id)})) for id in updated_user_to_follow.get("followers", [])
            ]

            return {
                "currentUserFollowingsList": current_user_followings,
                "userFollowersList": user_followers
            }
        else:
            raise HTTPException(
                status_code=403, detail="You dont follow this user")
    else:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="You can't unfollow yourself")


@router.get("/user-followers-list/{user_id}")
def get_user_followers_list(user_id: str, current_user: dict = Depends(get_current_user)):

    user = User.find_one({"_id": ObjectId(user_id)})

    user_data = individual_serial_user(user)

    users = []
    if "followers" in user_data:
        for id in user_data["followings"]:
            users.append(individual_serial_user(
                User.find_one({"_id": ObjectId(id)})))
        return {"userFollowers": users}
    else:
        return {"userFollowers": []}


@router.get("/current-user/followings-list")
def get_current_user_followings_list(current_user: dict = Depends(get_current_user)):
    users = []
    if "followings" in current_user:
        for id in current_user["followings"]:
            users.append(individual_serial_user(
                User.find_one({"_id": ObjectId(id)})))

        return {"followings": users}
    else:
        return {"followings": []}


@router.get("/current-user/followings-listWithCurrentUser")
def get_current_user_followings_list(current_user: dict = Depends(get_current_user)):
    users = []
    if "followings" in current_user:
        for id in current_user["followings"]:
            users.append(individual_serial_user(
                User.find_one({"_id": ObjectId(id)})))

        users.insert(0, current_user)
        return {"followingsWithCurrentUser": users}
    else:
        return {"followingsWithCurrentUser": []}


@router.get("/user-Suggestions/limit")
def user_suggestions(current_user: dict = Depends(get_current_user)):
    try:
        current_user_document = User.find_one(
            {"_id": ObjectId(current_user["_id"])})

        # Ensure the current user is found
        if not current_user_document:
            raise HTTPException(
                status_code=404, detail="Current user not found")

        # Get the blocked users list of the current user
        blocked_users_ids = current_user_document.get("blockedUsers", [])

        users = User.find(
            {"_id": {"$ne": ObjectId(current_user["_id"]), "$nin": blocked_users_ids},
             "blockedUsers": {"$ne": ObjectId(current_user["_id"])}, }).sort({"createdAt": DESCENDING}).limit(10)

        return list_serial_users(users)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail="error in fetching users")


@router.get("/getFriends/{userId}")
def get_user_friends(current_user: dict = Depends(get_current_user)):
    users = []
    if "followings" in current_user:
        for id in current_user["followings"]:
            users.append(individual_serial_user(
                User.find_one({"_id": ObjectId(id)})))

        return {"friends": users}
    else:
        return {"friends": []}


@router.post("/getUsersByUsername/all")
def get_users_by_username(mentions: models.Mentions, current_user: dict = Depends(get_current_user)):
    try:
        usernames = mentions.mentions
        users = list_serial_users(User.find({"username": {"$in": usernames}}))

        return {"users": users}

    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail="error in fetching users")


@router.put("/enableDisableNotifications/all")
def enable_disable_user_notifications(checked: models.NotificationsStatus, current_user: dict = Depends(get_current_user)):
    try:
        print(checked.checked)
        query = {"_id": ObjectId(current_user["_id"])}
        update = {"$set": {"notifications_enabled": checked.checked}}

        # # Use find_one_and_update to update and return the updated user
        updated_user = User.find_one_and_update(
            query, update, return_document=ReturnDocument.AFTER)
        print(updated_user)
        if updated_user:
            updated_user_serialized = individual_serial_user(updated_user)
            checked = updated_user_serialized["notifications_enabled"]
            return {"message": "Notifications status updated: enabled" if checked else "Notifications status updated: disabled", "checked": checked}
        else:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    except Exception as e:
        print(str(e))
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail="error in changing notifications status")


@router.get("/getNotificationsStatus/all")
def enable_disable_user_notifications(current_user: dict = Depends(get_current_user)):
    try:

        query = {"_id": ObjectId(current_user["_id"])}

        # # Use find_one_and_update to update and return the updated user
        user = User.find_one(query)

        if user:
            user_serialized = individual_serial_user(user)
            checked = user_serialized["notifications_enabled"]
            return checked
        else:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    except Exception as e:
        print(str(e))
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail="error in changing notifications status")


@router.put("/addUsersToBlockedList/all")
def add_users_to_blocked_list(blockedListUsers: models.BlockedList, current_user: dict = Depends(get_current_user)):
    user_id = ObjectId(current_user["_id"])
    blocked_users_ids = [ObjectId(id)
                         for id in blockedListUsers.blockedListUsers]

    update_followings_result = User.update_many(
        {"_id": {"$in": blocked_users_ids}},
        {
            "$pull": {
                "followings": current_user["_id"],
                "followers": current_user["_id"],
            },
        },
    )

    block_back_result = User.update_many(
        {"_id": {"$in": blocked_users_ids}},
        {"$addToSet": {"blockedUsers": ObjectId(current_user["_id"])}},
    )

    current_user_update_result = User.update_one(
        {"_id":  user_id},
        {
            "$pull": {
                "followings": {"$in": blockedListUsers.blockedListUsers},
                "followers": {"$in": blockedListUsers.blockedListUsers},
            },
        },
    )

    return {"message": "Users Blocked Successfully"}


@router.put("/removeUsersFromBlockedList/all")
def remove_users_from_blocked_list(unblockedListUsers: models.UnblockedList, current_user: dict = Depends(get_current_user)):

    user_id = ObjectId(current_user["_id"])
    unblocked_users_ids = [ObjectId(user_id)
                           for user_id in unblockedListUsers.unblockedListUsers]

    update_followings_result = User.update_many(
        {"_id": {"$in": unblocked_users_ids}},
        {
            "$push": {
                "followings": current_user["_id"],
                "followers": current_user["_id"],
            },
        },
    )

    block_back_result = User.update_many(
        {"_id": {"$in": unblocked_users_ids}},
        {"$pull": {"blockedUsers": ObjectId(current_user["_id"])}},
    )

    current_user_update_result = User.update_one(
        {"_id":  user_id},
        {
            "$push": {
                "followings": {"$each": unblockedListUsers.unblockedListUsers},
                "followers": {"$each": unblockedListUsers.unblockedListUsers},
            },
        },
    )

    return {"message": "Users Unblocked Successfully"}


@router.get("/searchBlockedListUsers/all")
def search_blocked_list_users(search: str, current_user: dict = Depends(get_current_user)):

    try:
        user_object_id = ObjectId(current_user["_id"])
        keyword = {
            "blockedUsers": user_object_id,
            "$or": [
                {"username": {"$regex": search, "$options": "i"}},
                {"email": {"$regex": search, "$options": "i"}},
            ] if search else {}
        }

        users = list_serial_users(User.find(keyword))

        return users

    except Exception as error:
        print(error)
        raise HTTPException(status_code=400, detail=str(error))


@router.put("/updateTimeSpentInApp/all/{uid}")
def update_time_spent(uid: str, timeSpentInApp: models.TimeSpentInApp):
    try:
        user = User.find_one({"_id": ObjectId(uid)})
        if user:
            time_entry_index = next(
                (
                    i
                    for i, entry in enumerate(user["timeSpentInApp"])
                    if entry["date"] == timeSpentInApp.date
                ),
                None,
            )

            if time_entry_index is not None:
                # Update the time spent for the existing date
                User.update_one(
                    {"_id": ObjectId(
                        uid), "timeSpentInApp.date": timeSpentInApp.date},
                    {"$inc": {"timeSpentInApp.$.timeSpent": timeSpentInApp.timeSpent}},
                )
            else:
                # Add a new time entry for the date
                User.update_one(
                    {"_id": ObjectId(uid)},
                    {"$push": {"timeSpentInApp": {
                        "date": timeSpentInApp.date, "timeSpent": timeSpentInApp.timeSpent}}},
                )

            return {"message": "Time spent updated successfully."}
        else:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    except Exception as e:

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal server error")


@router.get("/getTimeSpentInApp/{uid}")
def get_time_spent(uid: str):
    try:
        user = User.find_one({"_id":  ObjectId(uid)})

        if user:
            timeSpentInApp = user.get("timeSpentInApp", [])

            return {"timeSpentInApp": timeSpentInApp}

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    except Exception as e:

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal server error")
