from fastapi import HTTPException, status, Depends
from fastapi import APIRouter, HTTPException, status
from database import Notification
import models
from schemas import individual_serial_mentionNotification, list_serial_mentionNotifications
from bson import ObjectId
from pymongo import ReturnDocument
from datetime import datetime
from utils import hash
from oauth2 import get_current_user
from pymongo import DESCENDING
from bson import ObjectId

router = APIRouter(
    tags=["Notifications"],
    prefix="/notifications"
)


@router.post("/createMentionNotification")
def create_mentions_notification(mentionNotification: dict, current_user: dict = Depends(get_current_user)):
    try:

        current_time = datetime.now()
        mentionNotification["mentionNotification"].update({
            "createdAt": current_time,
            "updatedAt": current_time
        })

        result = Notification.insert_one(
            mentionNotification["mentionNotification"])

        # Fetch the inserted document using the inserted_id
        inserted_notification = Notification.find_one(
            {"_id": result.inserted_id})

        return {"message": "Notification created successfully", "mentionNotification": individual_serial_mentionNotification(inserted_notification)}

    except Exception as e:

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error in creating notification: {
                str(e)}"
        )


@router.get("/getAllMentionsNotifications")
def get_all_notifications(current_user: dict = Depends(get_current_user)):
    try:
        notifications = Notification.find({})

        return list_serial_mentionNotifications(notifications)
    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error in fetching notification: {
                str(e)}"
        )


@router.delete("/deleteMentionsNotification/{notificationId}")
def delete_mentions_notification(notificationId: str, current_user: dict = Depends(get_current_user)):
    try:
        # Convert the notificationId to ObjectId
        notification_id = ObjectId(notificationId)

        # Delete the notification based on the _id field
        result = Notification.delete_one({"_id": notification_id})

        # Check if the notification was found and deleted
        if result.deleted_count == 1:
            # If the notification was successfully deleted, return the updated list
            return {"message", "Notification deleted successfully"}
        else:
            # If the notification was not found, raise an HTTPException
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Notification with ID {notificationId} not found",
            )

    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error in deleting notification: {str(e)}"
        )
