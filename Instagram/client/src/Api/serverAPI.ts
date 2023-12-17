import axios, { AxiosResponse } from "axios";
import {
  MentionNotification,
  PostCreate,
  RegisterFormData,
  StoryFileData,
  UpdateUser,
  User,
} from "../types";

const BASE_URL = "http://localhost:8000/";

export const API_URLS = {
  login: `${BASE_URL}auth/login`,
  register: `${BASE_URL}auth/register`,
  checkTokenExpiration: `${BASE_URL}auth/checktokenexpiration`,
  getUser: `${BASE_URL}users/`,
  getUserByUsername: `${BASE_URL}users/getUserByUsername/`,
  searchUsers: `${BASE_URL}users/`,
  updateProfile: `${BASE_URL}users/`,
  forgotPassword: `${BASE_URL}auth/forgotpassword`,
  resetPassword: `${BASE_URL}auth/resetpassword`,
  getUserPhotos: `${BASE_URL}photos/`,
  createPost: `${BASE_URL}photos/`,
  getPostById: `${BASE_URL}photos/getPostById/`,
  addComment: `${BASE_URL}photos/addComment/`,
  deleteComment: `${BASE_URL}photos/deleteComment/`,
  getComment: `${BASE_URL}photos/getComment/`,
  updateComment: `${BASE_URL}photos/updateComment/`,
  deletePostById: `${BASE_URL}photos/deletePost/`,
  likePost: `${BASE_URL}photos/likePost`,
  likeComment: `${BASE_URL}photos/likeComment`,
  getCommentLikes: `${BASE_URL}photos/getCommentLikes/`,
  updatePost: `${BASE_URL}photos/updatePost/`,
  followUser: `${BASE_URL}users/followUser/`,
  unfollowUser: `${BASE_URL}users/unfollowUser/`,
  getCurrentUserFollowingsList: `${BASE_URL}users/current-user/followings-list`,
  getUserFollowersList: `${BASE_URL}users/user-followers-list/`,
  getTimelinePosts: `${BASE_URL}photos/timeline-recent/recent`,
  getUserSuggestions: `${BASE_URL}users/user-Suggestions/limit`,
  getTotalUserPostsCount: `${BASE_URL}photos/`,
  getTotalTimelinePostsCount: `${BASE_URL}photos/totalTimeLinePostsCount/recent`,
  getTotalExplorePostsCount: `${BASE_URL}photos/getTotalExplorePostsCount/recent`,
  updateUser: `${BASE_URL}users/`,
  getUserFriendsWithCurrentUser: `${BASE_URL}users/current-user/followings-listWithCurrentUser`,
  createStory: `${BASE_URL}story/`,
  getStoryByUserId: `${BASE_URL}story/`,
  updateStory: `${BASE_URL}story/`,
  deleteStory: `${BASE_URL}story/`,
  deleteAllStories: `${BASE_URL}story/`,
  getFriends: `${BASE_URL}users/getFriends/`,
  getUsersByUsername: `${BASE_URL}users/getUsersByUsername/all`,
  createMentionNotification: `${BASE_URL}notifications/createMentionNotification`,
  getMentionsNotifications: `${BASE_URL}notifications/getAllMentionsNotifications`,
  deleteMentionsNotification: `${BASE_URL}notifications/deleteMentionsNotification/`,
  getPostsOfNotFollowings: `${BASE_URL}photos/getPostsOfNotFollowings/all`,
  enableDisableNotifications: `${BASE_URL}users/enableDisableNotifications/all`,
  getNotificationsStatus: `${BASE_URL}users/getNotificationsStatus/all`,
  addUsersToBlockedList: `${BASE_URL}users/addUsersToBlockedList/all`,
  removeUsersFromBlockedList: `${BASE_URL}users/removeUsersFromBlockedList/all`,
  searchBlockedListUsers: `${BASE_URL}users/searchBlockedListUsers/all`,
};

export const register = (
  formData: RegisterFormData
): Promise<AxiosResponse<any, any>> => {
  try {
    return axios.post(API_URLS.register, formData);
  } catch (error) {
    throw error;
  }
};

export const login = (formData: FormData): Promise<AxiosResponse<any, any>> => {
  try {
    return axios.post(API_URLS.login, formData);
  } catch (error) {
    throw error;
  }
};

export const checkTokenExpiration = (): Promise<AxiosResponse<any, any>> => {
  try {
    return axios.get(API_URLS.checkTokenExpiration);
  } catch (error) {
    throw error;
  }
};

export const getUser = (user_id: string): Promise<AxiosResponse<any, any>> => {
  try {
    return axios.get(`${API_URLS.getUser}${user_id}`);
  } catch (error) {
    throw error;
  }
};

export const getUserByUsername = (
  username: string
): Promise<AxiosResponse<any, any>> => {
  try {
    return axios.get(`${API_URLS.getUserByUsername}${username}`);
  } catch (error) {
    throw error;
  }
};

export const searchUsers = (
  searchTerm: string
): Promise<AxiosResponse<any, any>> => {
  try {
    return axios.get(`${API_URLS.searchUsers}?search=${searchTerm}`);
  } catch (error) {
    throw error;
  }
};

export const updateProfile = (
  user_id: string,
  user: User
): Promise<AxiosResponse<any, any>> => {
  try {
    return axios.put(`${API_URLS.updateProfile}${user_id}`, user);
  } catch (error) {
    throw error;
  }
};

export const forgotPassword = (
  email: string
): Promise<AxiosResponse<any, any>> => {
  try {
    return axios.post(API_URLS.forgotPassword, { email });
  } catch (error) {
    throw error;
  }
};

export const resetPassword = (
  newPassword: string,
  token: string
): Promise<AxiosResponse<any, any>> => {
  try {
    return axios.post(API_URLS.resetPassword, { newPassword, token });
  } catch (error) {
    throw error;
  }
};

export const getUserPhotos = (
  userId: string,
  page: number
): Promise<AxiosResponse<any, any>> => {
  try {
    return axios.get(`${API_URLS.getUserPhotos}${userId}?page=${page}`);
  } catch (error) {
    throw error;
  }
};

export const getPostById = (
  postId: string
): Promise<AxiosResponse<any, any>> => {
  try {
    return axios.get(`${API_URLS.getPostById}${postId}`);
  } catch (error) {
    throw error;
  }
};

export const addComment = (
  postId: string,
  content: string
): Promise<AxiosResponse<any, any>> => {
  try {
    return axios.post(`${API_URLS.addComment}${postId}`, { content });
  } catch (error) {
    throw error;
  }
};

export const deleteComment = (
  postId: string,
  commentId: string
): Promise<AxiosResponse<any, any>> => {
  try {
    return axios.delete(`${API_URLS.deleteComment}${postId}/${commentId}`);
  } catch (error) {
    throw error;
  }
};

export const getComment = (
  postId: string,
  commentId: string
): Promise<AxiosResponse<any, any>> => {
  try {
    return axios.get(`${API_URLS.getComment}${postId}/${commentId}`);
  } catch (error) {
    throw error;
  }
};

export const updateComment = (
  postId: string,
  commentId: string,
  content: string
): Promise<AxiosResponse<any, any>> => {
  try {
    return axios.put(`${API_URLS.updateComment}${postId}/${commentId}`, {
      content,
    });
  } catch (error) {
    throw error;
  }
};

export const deletePostById = (
  postId: string
): Promise<AxiosResponse<any, any>> => {
  try {
    return axios.delete(`${API_URLS.deletePostById}${postId}`);
  } catch (error) {
    throw error;
  }
};

export const createPost = (
  postData: PostCreate
): Promise<AxiosResponse<any, any>> => {
  try {
    return axios.post(`${API_URLS.createPost}`, postData);
  } catch (error) {
    throw error;
  }
};

export const updatePost = (
  postId: string,
  postData: PostCreate
): Promise<AxiosResponse<any, any>> => {
  try {
    return axios.put(`${API_URLS.updatePost}${postId}`, postData);
  } catch (error) {
    throw error;
  }
};

export const likePost = (postId: string): Promise<AxiosResponse<any, any>> => {
  try {
    return axios.post(`${API_URLS.likePost}`, { postId });
  } catch (error) {
    throw error;
  }
};

export const likeComment = (
  postId: string,
  commentId: string
): Promise<AxiosResponse<any, any>> => {
  try {
    return axios.post(`${API_URLS.likeComment}`, { postId, commentId });
  } catch (error) {
    throw error;
  }
};

export const getCommentLikes = (
  postId: string,
  commentId: string
): Promise<AxiosResponse<any, any>> => {
  try {
    return axios.get(`${API_URLS.getCommentLikes}${postId}/${commentId}`);
  } catch (error) {
    throw error;
  }
};

export const followUser = (
  userIdToFollow: string
): Promise<AxiosResponse<any, any>> => {
  try {
    return axios.put(`${API_URLS.followUser}${userIdToFollow}`);
  } catch (error) {
    throw error;
  }
};

export const unfollowUser = (
  userIdToUnfollow: string
): Promise<AxiosResponse<any, any>> => {
  try {
    return axios.put(`${API_URLS.unfollowUser}${userIdToUnfollow}`);
  } catch (error) {
    throw error;
  }
};

export const getCurrentUserFollowingsList = (): Promise<
  AxiosResponse<any, any>
> => {
  try {
    return axios.get(API_URLS.getCurrentUserFollowingsList);
  } catch (error) {
    throw error;
  }
};

export const getUserFollowersList = (
  user_id: string
): Promise<AxiosResponse<any, any>> => {
  try {
    return axios.get(`${API_URLS.getUserFollowersList}${user_id}`);
  } catch (error) {
    throw error;
  }
};

export const getTimelinePosts = (
  page: number
): Promise<AxiosResponse<any, any>> => {
  try {
    return axios.get(`${API_URLS.getTimelinePosts}?page=${page}`);
  } catch (error) {
    throw error;
  }
};

export const getUserSuggestions = (): Promise<AxiosResponse<any, any>> => {
  try {
    return axios.get(`${API_URLS.getUserSuggestions}`);
  } catch (error) {
    throw error;
  }
};

export const getTotalUserPostsCount = (
  userId: string
): Promise<AxiosResponse<any, any>> => {
  try {
    return axios.get(
      `${API_URLS.getTotalUserPostsCount}${userId}/totalPostCount`
    );
  } catch (error) {
    throw error;
  }
};

export const getTotalTimelinePostsCount = (): Promise<
  AxiosResponse<any, any>
> => {
  try {
    return axios.get(`${API_URLS.getTotalTimelinePostsCount}`);
  } catch (error) {
    throw error;
  }
};

export const getTotalExplorePostsCount = (): Promise<
  AxiosResponse<any, any>
> => {
  try {
    return axios.get(`${API_URLS.getTotalExplorePostsCount}`);
  } catch (error) {
    throw error;
  }
};

export const updateUser = (
  userId: string,
  updatedUser: UpdateUser
): Promise<AxiosResponse<any, any>> => {
  try {
    return axios.put(`${API_URLS.updateUser}${userId}`, updatedUser);
  } catch (error) {
    throw error;
  }
};

export const getUserFriendsWithCurrentUser = (): Promise<
  AxiosResponse<any, any>
> => {
  try {
    return axios.get(`${API_URLS.getUserFriendsWithCurrentUser}`);
  } catch (error) {
    throw error;
  }
};

export const createStory = (
  files: StoryFileData[]
): Promise<AxiosResponse<any, any>> => {
  try {
    return axios.post(`${API_URLS.createStory}`, { files });
  } catch (error) {
    throw error;
  }
};

export const getStoryByUserId = (
  selectedUserId: string
): Promise<AxiosResponse<any, any>> => {
  try {
    return axios.get(`${API_URLS.getStoryByUserId}${selectedUserId}`);
  } catch (error) {
    throw error;
  }
};

export const updateStory = (
  selectedUserId: string,
  files: StoryFileData[]
): Promise<AxiosResponse<any, any>> => {
  try {
    return axios.put(`${API_URLS.updateStory}${selectedUserId}`, {
      files,
    });
  } catch (error) {
    throw error;
  }
};

export const deleteStory = (
  storyId: string,
  fileId: string
): Promise<AxiosResponse<any, any>> => {
  try {
    return axios.delete(`${API_URLS.deleteStory}${storyId}/${fileId}`);
  } catch (error) {
    throw error;
  }
};

export const deleteAllStories = (
  story_id: string
): Promise<AxiosResponse<any, any>> => {
  try {
    return axios.delete(`${API_URLS.deleteAllStories}${story_id}`);
  } catch (error) {
    throw error;
  }
};

export const getFriends = (
  userId: string
): Promise<AxiosResponse<any, any>> => {
  try {
    return axios.get(`${API_URLS.getFriends}${userId}`);
  } catch (error) {
    throw error;
  }
};

export const getUsersByUsername = (
  mentions: string[] | false
): Promise<AxiosResponse<any, any>> => {
  try {
    return axios.post(`${API_URLS.getUsersByUsername}`, { mentions });
  } catch (error) {
    throw error;
  }
};

export const createMentionNotification = (
  mentionNotification: MentionNotification
): Promise<AxiosResponse<any, any>> => {
  try {
    return axios.post(`${API_URLS.createMentionNotification}`, {
      mentionNotification,
    });
  } catch (error) {
    throw error;
  }
};

export const getMentionsNotifications = (): Promise<
  AxiosResponse<any, any>
> => {
  try {
    return axios.get(`${API_URLS.getMentionsNotifications}`);
  } catch (error) {
    throw error;
  }
};

export const deleteMentionsNotification = (
  notificationId: string
): Promise<AxiosResponse<any, any>> => {
  try {
    return axios.delete(
      `${API_URLS.deleteMentionsNotification}${notificationId}`
    );
  } catch (error) {
    throw error;
  }
};

export const getPostsOfNotFollowings = (
  page: number
): Promise<AxiosResponse<any, any>> => {
  try {
    return axios.get(`${API_URLS.getPostsOfNotFollowings}?page=${page}`);
  } catch (error) {
    throw error;
  }
};

export const enableDisableNotifications = (
  checked: boolean
): Promise<AxiosResponse<any, any>> => {
  try {
    return axios.put(`${API_URLS.enableDisableNotifications}`, { checked });
  } catch (error) {
    throw error;
  }
};

export const getNotificationsStatus = (): Promise<AxiosResponse<any, any>> => {
  try {
    return axios.get(`${API_URLS.getNotificationsStatus}`);
  } catch (error) {
    throw error;
  }
};

export const addUsersToBlockedList = (
  blockedListUsers: string[]
): Promise<AxiosResponse<any, any>> => {
  try {
    return axios.put(`${API_URLS.addUsersToBlockedList}`, {
      blockedListUsers,
    });
  } catch (error) {
    throw error;
  }
};

export const removeUsersFromBlockedList = (
  unblockedListUsers: string[]
): Promise<AxiosResponse<any, any>> => {
  try {
    return axios.put(`${API_URLS.removeUsersFromBlockedList}`, {
      unblockedListUsers,
    });
  } catch (error) {
    throw error;
  }
};

export const searchBlockedListUsers = (
  query: string
): Promise<AxiosResponse<any, any>> => {
  try {
    return axios.get(`${API_URLS.searchBlockedListUsers}?search=${query}`);
  } catch (error) {
    throw error;
  }
};
