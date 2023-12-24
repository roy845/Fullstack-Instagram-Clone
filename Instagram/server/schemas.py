from bson import ObjectId


def individual_serial_user(user) -> dict:
    def serialize_object_id(obj):
        if isinstance(obj, ObjectId):
            return str(obj)
        return obj
    profile_pic = user.get("profilePic", {
                           "id": ObjectId(), "url": "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg", "publish": False})
    return {
        "_id": str(user["_id"]),
        "username": str(user.get("username", "")),
        "fullName": str(user.get("fullName", "")),
        "emailAddress": str(user.get("emailAddress", "")),
        "profilePic": {
            "id": str(profile_pic.get("id", "1")),
            "url": str(profile_pic.get("url", "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"))
        },
        "blockedUsers": [serialize_object_id(obj) for obj in user.get("blockedUsers", [])],
        "isAdmin": bool(user.get("isAdmin", False)),
        "timeSpentInApp": user.get("timeSpentInApp", {}),
        "notifications_enabled": bool(user.get("notifications_enabled", False)),
        "followings": user.get("followings", []),
        "followers": user.get("followers", []),
        "createdAt": user.get("createdAt", None).strftime("%Y-%m-%d %H:%M:%S") if user.get("createdAt") else None,
        "updatedAt": user.get("updatedAt", None).strftime("%Y-%m-%d %H:%M:%S") if user.get("updatedAt") else None
    }


def list_serial_users(users) -> list:
    return [individual_serial_user(user) for user in users]


def individual_serial_story(story) -> dict:

    return {
        "_id": str(story["_id"]),
        "userId": str(story.get("userId", "")),
        "files": story.get("files", []),
        "createdAt": story.get("createdAt", None).strftime("%Y-%m-%d %H:%M:%S") if story.get("createdAt") else None,
        "updatedAt": story.get("updatedAt", None).strftime("%Y-%m-%d %H:%M:%S") if story.get("updatedAt") else None
    }


def list_serial_stories(stories) -> list:
    return [individual_serial_story(story) for story in stories]


def individual_serial_photo(photo) -> dict:
    return {
        "_id": str(photo["_id"]),
        "userId": str(photo.get("userId", "")),
        "files": photo.get("files", []),
        "description": str(photo.get("description", "")),
        "likes": photo.get("likes", []),
        "comments": photo.get("comments", []),
        "edited": photo.get("edited", False),
        "createdAt": photo.get("createdAt", None).strftime("%Y-%m-%d %H:%M:%S") if photo.get("createdAt") else None,
        "updatedAt": photo.get("updatedAt", None).strftime("%Y-%m-%d %H:%M:%S") if photo.get("updatedAt") else None
    }


def list_serial_photos(photos) -> list:
    return [individual_serial_photo(photo) for photo in photos]


def individual_serial_mentionNotification(notification) -> dict:
    return {
        "_id": str(notification["_id"]),
        "content": str(notification.get("content", "")),
        "post": notification.get("post", {}),
        "recipientId": str(notification.get("recipientId", "")),
        "sender": str(notification.get("sender", "")),
        "createdAt": notification.get("createdAt", None).strftime("%Y-%m-%d %H:%M:%S") if notification.get("createdAt") else None,
        "updatedAt": notification.get("updatedAt", None).strftime("%Y-%m-%d %H:%M:%S") if notification.get("updatedAt") else None
    }


def list_serial_mentionNotifications(notifications) -> list:
    return [individual_serial_mentionNotification(notification) for notification in notifications]
