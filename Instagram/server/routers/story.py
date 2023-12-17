from fastapi import HTTPException, status, Depends
from fastapi import APIRouter, HTTPException, status
from pymongo import DESCENDING
import models
from database import Story, User
from datetime import datetime
from bson import ObjectId
from oauth2 import get_current_user
from schemas import individual_serial_story, individual_serial_user, list_serial_stories

router = APIRouter(
    tags=["Stories"],
    prefix="/story"
)


@router.post('/')
def create_story(story: models.CreateStory, current_user=Depends(get_current_user)):
    try:

        for file in story.files:
            file["createdAt"] = datetime.now()

        story_data = dict(story)
        story_data["user_id"] = ObjectId(current_user["_id"])
        story_data["userId"] = current_user["_id"]
        current_time = datetime.now()
        story_data.update({
            "createdAt": current_time,
            "updatedAt": current_time
        })

        result = Story.insert_one(story_data)

        all_user_stories = Story.find({"userId": current_user["_id"]}).sort(
            "createdAt", DESCENDING)

        return {"message": "Story created successfully", "story_id": str(result.inserted_id), "all_user_stories": list_serial_stories(all_user_stories)}

    except:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error in creating story")


@router.get("/{user_id}")
def get_story_by_user_id(user_id: str, current_user=Depends(get_current_user)):

    story = Story.find_one({"user_id": ObjectId(user_id)})

    if not story:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=f"Story that belongs to user id: {user_id} is not found")

    story_data = individual_serial_story(story)

    user = User.find_one({"_id": ObjectId(user_id)})

    story_data["user"] = individual_serial_user(user)

    return story_data


@router.put("/{user_id}")
def update_story(files: models.CreateStory, user_id: str, current_user: dict = Depends(get_current_user)):

    story = Story.find_one({"user_id": ObjectId(user_id)})

    if not story:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=f"Story that belongs to user id: {user_id} is not found")
    update_data = {
        "$push": {"files": {"$each": [{"createdAt": datetime.now(), **file} for file in files.files]}}
    }
    Story.update_one({"_id": story["_id"]}, update_data)

    return {"message": "Story updated successfully"}


@router.delete("/{story_id}/{file_id}")
def delete_story(story_id: str, file_id: str, current_user: dict = Depends(get_current_user)):

    story = Story.find_one({"_id": ObjectId(story_id)})

    if not story:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,  detail="Story not found")

    story["files"] = [file for file in story["files"] if file["id"] != file_id]

    Story.update_one({"_id": ObjectId(story_id)}, {
                     "$set": {"files": story["files"]}})

    return {"message": "Story file deleted successfully"}


@router.delete("/{story_id}")
def delete_all_story(story_id: str, current_user: dict = Depends(get_current_user)):
    print("hi")
    story = Story.find_one_and_delete({"_id": ObjectId(story_id)})

    if not story:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,  detail="Story not found")

    return {"message": "Story deleted successfully"}
