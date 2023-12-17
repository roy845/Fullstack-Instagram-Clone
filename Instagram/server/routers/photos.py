import json
from fastapi import HTTPException, status, Depends
from fastapi import APIRouter, HTTPException, status
from database import User
import models
from schemas import list_serial_photos, individual_serial_user, individual_serial_photo, list_serial_users
from models import UpdateUser
from bson import ObjectId
from pymongo import ReturnDocument
from datetime import datetime
from utils import hash
from oauth2 import get_current_user
from pymongo import DESCENDING
from bson import ObjectId
from database import Photo
from pymongo.errors import PyMongoError
from constants import limitUserPosts, limitTimeLinePosts, limitExplorePosts


router = APIRouter(
    tags=["Photos"],
    prefix="/photos"
)


@router.get("/{userId}")
async def get_user_photos(
    userId: str, current_user: dict = Depends(get_current_user), page: int = 1
):
    try:
        # Fetch user information
        user = User.find_one({"_id": ObjectId(userId)})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        serialized_user = individual_serial_user(user)

        # Fetch photos
        posts = Photo.find({"userId": userId}).skip((page-1)*limitUserPosts).limit(limitUserPosts).sort(
            "createdAt", DESCENDING)

        # Add user information to each post
        serialized_posts = []
        for post in posts:
            serialized_post = individual_serial_photo(post)
            serialized_post["user"] = {
                "_id": serialized_user["_id"],
                "username": serialized_user["username"],
                "fullName": serialized_user["fullName"],
                "emailAddress": serialized_user["emailAddress"],
                "profilePic": serialized_user["profilePic"],
                "isAdmin": serialized_user["isAdmin"],
                "followings": serialized_user["followings"],
                "followers": serialized_user["followers"],
                "createdAt": serialized_user["createdAt"],
                "updatedAt": serialized_user["updatedAt"],

            }
            serialized_posts.append(serialized_post)

        return serialized_posts

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error in fetching posts: {str(e)}"
        )


@router.get("/{userId}/totalPostCount")
def get_total_post_count(userId: str, current_user: dict = Depends(get_current_user)):
    try:
        post_count = Photo.count_documents({"userId": userId})
        return {"totalPostCount": post_count}
    except PyMongoError as e:
        # Handle MongoDB-related errors
        raise HTTPException(
            status_code=500, detail=f"Internal server error: {str(e)}")
    except Exception as e:
        # Handle other unexpected errors
        raise HTTPException(
            status_code=500, detail=f"Internal server error: {str(e)}")


@router.get('/getPostById/{postId}')
def get_post(postId: str):
    if not ObjectId.is_valid(postId):
        raise HTTPException(status_code=400, detail="Invalid ObjectId")

    post_object_id = ObjectId(postId)

    post = Photo.find_one({"_id": post_object_id})

    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    user = User.find_one({"_id": post["user_id"]})
    serialized_user = individual_serial_user(user)

    serialized_post = individual_serial_photo(post)
    serialized_post["user"] = {**serialized_user}
    return serialized_post


@router.post("/")
async def create_photo(photo: models.CreatePhoto, current_user: dict = Depends(get_current_user)):
    try:

        post_data = dict(photo)
        post_data["user_id"] = ObjectId(current_user["_id"])
        post_data["userId"] = current_user["_id"]
        current_time = datetime.now()
        post_data.update({
            "createdAt": current_time,
            "updatedAt": current_time
        })

        result = Photo.insert_one(post_data)

        all_user_posts = Photo.find({"userId": current_user["_id"]}).sort(
            "createdAt", DESCENDING)

        return {"message": "Photo created successfully", "photo_id": str(result.inserted_id), "all_user_posts": list_serial_photos(all_user_posts)}

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error in creating photos: {
                str(e)}"
        )


@router.delete("/deletePost/{postId}")
async def delete_photo(postId: str, current_user: dict = Depends(get_current_user)):

    # Convert postId to ObjectId
    post_id_object = ObjectId(postId)

    # Check if the post exists
    existing_post = Photo.find_one({"_id": post_id_object})
    if existing_post is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Post with ID {postId} not found"
        )

    if existing_post["userId"] != str(current_user["_id"]):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail="You cannot delete a post you don't own")

    # Delete the post
    result = Photo.delete_one({"_id": post_id_object})

    if result.deleted_count == 1:
        return {"message": "Post deleted successfully"}
    else:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete post"
        )


@router.post("/addComment/{postId}")
def add_comment(postId: str, comment: models.CreateComment, current_user: dict = Depends(get_current_user)):

    try:
        post = Photo.find_one({"_id": ObjectId(postId)})
        if post is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Post with ID {postId} not found"
            )

        new_comment = {
            "_id": str(ObjectId()),
            "user": current_user,
            "content": comment.content,
            "likes": [],
            "createdAt": datetime.now(),
            "updatedAt": datetime.now()
        }

        updated_post = Photo.find_one_and_update(
            {"_id": ObjectId(postId)},
            {"$push": {"comments": dict(new_comment)}},
            return_document=ReturnDocument.AFTER
        )

        user = User.find_one({"_id": post["user_id"]})
        serialized_user = individual_serial_user(user)

        serialized_post = individual_serial_photo(updated_post)
        serialized_post["user"] = {**serialized_user}

        return serialized_post

    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail=f"Error in adding comment to post: {str(e)}")


@router.delete('/deleteComment/{postId}/{commentId}')
def delete_comment(postId: str, commentId: str, current_user: dict = Depends(get_current_user)):
    try:
        post = Photo.find_one({"_id": ObjectId(postId)})
        if post is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Post with ID {postId} not found"
            )

        updated_post = Photo.find_one_and_update(
            {"_id": ObjectId(postId)},
            {"$pull": {"comments": {"_id": commentId}}},
            return_document=ReturnDocument.AFTER
        )

        user = User.find_one({"_id": post["user_id"]})
        serialized_user = individual_serial_user(user)

        serialized_post = individual_serial_photo(updated_post)
        serialized_post["user"] = {**serialized_user}

        return serialized_post

    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail=f"Error in deleting comment from post: {str(e)}")


@router.get('/getComment/{postId}/{commentId}')
def get_comment(postId: str, commentId: str, current_user: dict = Depends(get_current_user)):
    try:
        post = Photo.find_one({"_id": ObjectId(postId)})
        if post is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Post with ID {postId} not found"
            )

        comment = next((c for c in post.get("comments", [])
                       if str(c["_id"]) == commentId), None)
        if comment is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Comment with ID {
                    commentId} not found in post {postId}"
            )

        return comment

    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail=f"Error in deleting comment from post: {str(e)}")


@router.put('/updateComment/{postId}/{commentId}')
def update_comment(postId: str, commentId: str, updated_content: models.UpdateComment, current_user: dict = Depends(get_current_user)):
    try:
        post = Photo.find_one({"_id": ObjectId(postId)})
        if post is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Post with ID {postId} not found"
            )

        # Find the index of the comment with the specified _id
        comment_index = next((index for index, comment in enumerate(
            post.get("comments", [])) if str(comment["_id"]) == commentId), None)

        if comment_index is not None:
            # Update the content and updatedAt fields of the comment
            post["comments"][comment_index]["content"] = updated_content.content
            post["comments"][comment_index]["updatedAt"] = datetime.now()

            # Update the post document in the database
            updated_post = Photo.find_one_and_update(
                {"_id": ObjectId(postId)},
                {"$set": {"comments": post["comments"]}},
                return_document=ReturnDocument.AFTER
            )

            user = User.find_one({"_id": post["user_id"]})
            serialized_user = individual_serial_user(user)

            serialized_post = individual_serial_photo(updated_post)
            serialized_post["user"] = {**serialized_user}

            return serialized_post

        else:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Comment with ID {
                    commentId} not found in post {postId}"
            )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error in updating comment in post: {str(e)}"
        )


@router.post("/likePost")
def like_post(like: models.LikePost, current_user: dict = Depends(get_current_user)):
    try:
        # Check if the post exists
        post = Photo.find_one({"_id": ObjectId(like.postId)})

        if post is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Post with ID {like.postId} not found"
            )

        # Check if the current user has already liked the post
        user_already_liked = any(
            user["_id"] == current_user["_id"] for user in post["likes"])

        if user_already_liked:
            # Remove the like (unlike)
            updated_post = Photo.find_one_and_update(
                {"_id": ObjectId(like.postId)},
                {"$pull": {"likes": {"_id": current_user["_id"]}}},
                return_document=ReturnDocument.AFTER
            )
            message = "Post unliked successfully"
        else:
            # Add the like
            updated_post = Photo.find_one_and_update(
                {"_id": ObjectId(like.postId)},
                {"$push": {"likes": current_user}},
                return_document=ReturnDocument.AFTER
            )
            message = "Post liked successfully"

        user = User.find_one({"_id": post["user_id"]})
        serialized_user = individual_serial_user(user)

        serialized_post = individual_serial_photo(updated_post)
        serialized_post["user"] = {**serialized_user}

        return {"message": message, "updated_post": serialized_post}

    except Exception as e:
        # Handle other exceptions as needed
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.post("/likeComment")
def like_comment(like: models.LikeComment, current_user: dict = Depends(get_current_user)):
    try:
        # Check if the post exists
        post = Photo.find_one({"_id": ObjectId(like.postId)})

        if post is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Post with ID {like.postId} not found"
            )

        # Find the comment in the post
        comment = next((comment for comment in post["comments"] if str(
            comment["_id"]) == like.commentId), None)

        if comment is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Comment with ID {
                    like.commentId} not found in the post"
            )

        # Check if the current user has already liked the comment
        user_already_liked = any(
            user["_id"] == current_user["_id"] for user in comment["likes"])

        if user_already_liked:
            # Remove the like (unlike)
            updated_post = Photo.find_one_and_update(
                {"_id": ObjectId(like.postId),
                 "comments._id": like.commentId},
                {"$pull": {"comments.$.likes": {"_id": current_user["_id"]}}},
                return_document=ReturnDocument.AFTER
            )
            message = "Comment unliked successfully"
        else:
            # Add the like
            updated_post = Photo.find_one_and_update(
                {"_id": ObjectId(like.postId),
                 "comments._id": like.commentId},
                {"$push": {"comments.$.likes": current_user}},
                return_document=ReturnDocument.AFTER
            )
            message = "Comment liked successfully"

        updated_comment = next(
            (c for c in updated_post["comments"] if str(c["_id"]) == like.commentId), None)

        return {"message": message, "updated_comment_likes": updated_comment["likes"]}

    except Exception as e:
        # Handle other exceptions as needed
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.get("/getCommentLikes/{postId}/{commentId}")
def like_comment(postId, commentId, current_user: dict = Depends(get_current_user)):
    try:
        # Check if the post exists
        post = Photo.find_one({"_id": ObjectId(postId)})

        if post is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Post with ID {postId} not found"
            )

        # Find the comment in the post
        comment = next((comment for comment in post["comments"] if str(
            comment["_id"]) == commentId), None)

        if comment is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Comment with ID {commentId} not found in the post"
            )

        return comment["likes"]

    except Exception as e:
        # Handle other exceptions as needed
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.put('/updatePost/{postId}')
def update_post(postId: str, updatedPost: models.UpdatePost, current_user: dict = Depends(get_current_user)):
    try:

        # Check if the post exists
        existing_post = Photo.find_one(
            {"_id": ObjectId(postId), "userId": current_user["_id"]})

        if existing_post is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Post with ID {postId} not found"
            )

        # Update the post with the new data
        updated_data = dict(updatedPost)
        updated_data["createdAt"] = existing_post["createdAt"]
        updated_data["updatedAt"] = datetime.now()
        updated_data["comments"] = existing_post["comments"]
        updated_data["likes"] = existing_post["likes"]
        updated_data["user_id"] = existing_post["user_id"]
        updated_data["userId"] = existing_post["userId"]

        updated_post = Photo.find_one_and_update(
            {"_id": ObjectId(postId)},
            {"$set": updated_data},
            return_document=ReturnDocument.AFTER
        )

        return {"message": "Post updated successfully"}

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error in updating post: {
                str(e)}"
        )


@router.get('/timeline-recent/recent')
def get_timeline_posts(page: int = 1, current_user: dict = Depends(get_current_user)):
    try:
        followings_ids = current_user['followings'] or []

        friendsPosts = []
        for id in followings_ids:

            posts = Photo.find({"userId": id})

            for post in posts:
                friendPost = individual_serial_photo(post)
                user = User.find_one({"_id": ObjectId(id)})
                friendPost["user"] = individual_serial_user(user)
                friendsPosts.append(friendPost)

        start_index = (page-1) * limitTimeLinePosts
        end_index = start_index + limitTimeLinePosts
        friendsPosts = friendsPosts[start_index:end_index]

        # Sort the aggregated friendsPosts
        friendsPosts.sort(key=lambda x: x['createdAt'], reverse=True)

        return friendsPosts

    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.get('/totalTimeLinePostsCount/recent')
def get_total_timeline_posts_length(current_user: dict = Depends(get_current_user)):
    try:
        followings_ids = current_user['followings'] or []

        friendsPosts = []
        for id in followings_ids:
            # Assuming find returns multiple posts
            posts = Photo.find({"userId": id})
            for post in posts:
                friendPost = individual_serial_photo(post)
                user = User.find_one({"_id": ObjectId(id)})
                friendPost["user"] = individual_serial_user(user)
                friendsPosts.append(friendPost)

        return len(friendsPosts)

    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.get('/getTotalExplorePostsCount/recent')
def get_total_length_explore_posts(current_user: dict = Depends(get_current_user)):
    try:

        user_object_id = ObjectId(current_user["_id"])
        keyword = {
            "blockedUsers": user_object_id,

        }

        users = list_serial_users(User.find(keyword))
        not_followings_ids_and_users_that_the_current_user_is_in_their_blocked_users_array = [user["_id"]
                                                                                              for user in users] + current_user["followings"]

        not_followings_posts = Photo.find(
            {"userId": {
                "$nin": not_followings_ids_and_users_that_the_current_user_is_in_their_blocked_users_array,
                "$ne": current_user["_id"],

            }}
        )

        return len(list_serial_photos(not_followings_posts))
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.get("/getPostsOfNotFollowings/all")
def get_posts_of_not_followings(page: int, current_user: dict = Depends(get_current_user)):
    try:

        skip_count = (page - 1) * limitExplorePosts

        user_object_id = ObjectId(current_user["_id"])
        keyword = {
            "blockedUsers": user_object_id,

        }

        users = list_serial_users(User.find(keyword))

        blocked_user_ids = [
            str(user_id) for user in users for user_id in user.get("blockedUsers", [])]

        not_followings_posts = Photo.find(
            {"userId": {
                "$nin": [str(user["_id"]) for user in users] + current_user["followings"] + blocked_user_ids + current_user["blockedUsers"],
                "$ne": current_user["_id"],

            }}
        ).sort("createdAt", DESCENDING).skip(skip_count).limit(limitExplorePosts)

        return list_serial_photos(not_followings_posts)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
