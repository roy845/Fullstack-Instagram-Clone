import axios from "axios";
const BASE_URL = "http://localhost:8800/";

const API_URLS = {
  login: `${BASE_URL}api/auth/login`,
  register: `${BASE_URL}api/auth/register`,
  forgotPassword: `${BASE_URL}api/auth/forgotPassword`,
  resetPassword: `${BASE_URL}api/auth/resetPassword`,
  searchUsers: `${BASE_URL}api/users/searchUsers`,
  createChat: `${BASE_URL}api/chat/createChat`,
  getChats: `${BASE_URL}api/chat/fetchChat`,
  createGroupChat: `${BASE_URL}api/chat/createGroupChat`,
  renameGroupChat: `${BASE_URL}api/chat/renameGroupChat`,
  addToGroupChat: `${BASE_URL}api/chat/addToGroupChat`,
  removeFromGroupChat: `${BASE_URL}api/chat/removeFromGroupChat`,
  sendMessage: `${BASE_URL}api/messages/sendMessage`,
  getAllMessages: `${BASE_URL}api/messages/getAllMessages/`,
  addUsersToBlockedList: `${BASE_URL}api/users/addUsersToBlockedList`,
  removeUsersFromBlockedList: `${BASE_URL}api/users/removeUsersFromBlockedList`,
  searchBlockedListUsers: `${BASE_URL}api/users/searchBlockedListUsers`,
  createNotification: `${BASE_URL}api/notifications/createNotification`,
  getAllNotifications: `${BASE_URL}api/notifications/getAllNotifications`,
  removeNotification: `${BASE_URL}api/notifications/removeNotification/`,
  getUser: `${BASE_URL}api/users/getUser/`,
  updateUser: `${BASE_URL}api/users/updateUser/`,
  deleteGroup: `${BASE_URL}api/chat/deleteGroup/`,
};

export const login = (email, password) => {
  try {
    return axios.post(API_URLS.login, {
      email,
      password,
    });
  } catch (error) {
    throw error;
  }
};

export const register = (name, email, password, profilePic) => {
  try {
    return axios.post(API_URLS.register, { name, email, password, profilePic });
  } catch (error) {
    throw error;
  }
};

export const forgotPassword = (email) => {
  try {
    return axios.post(API_URLS.forgotPassword, { email });
  } catch (error) {
    throw error;
  }
};

export const resetPassword = (token, password) => {
  try {
    return axios.post(API_URLS.resetPassword, { token, password });
  } catch (error) {
    throw error;
  }
};

export const searchUsers = (search) => {
  try {
    return axios.get(`${API_URLS.searchUsers}?search=${search}`);
  } catch (error) {
    throw error;
  }
};

export const addUsersToBlockedList = (userIdsToBlock) => {
  try {
    return axios.post(`${API_URLS.addUsersToBlockedList}`, { userIdsToBlock });
  } catch (error) {
    throw error;
  }
};

export const removeUsersFromBlockedList = (userIdsToRemove) => {
  try {
    return axios.post(`${API_URLS.removeUsersFromBlockedList}`, {
      userIdsToRemove,
    });
  } catch (error) {
    throw error;
  }
};

export const searchBlockedListUsers = (search) => {
  try {
    return axios.get(`${API_URLS.searchBlockedListUsers}?search=${search}`);
  } catch (error) {
    throw error;
  }
};

export const createChat = (userId) => {
  try {
    return axios.post(`${API_URLS.createChat}`, { userId });
  } catch (error) {
    throw error;
  }
};

export const getChats = (checked) => {
  try {
    return axios.get(`${API_URLS.getChats}?checked=${checked}`);
  } catch (error) {
    throw error;
  }
};

export const createGroupChat = (name, users) => {
  try {
    return axios.post(`${API_URLS.createGroupChat}`, { name, users });
  } catch (error) {
    throw error;
  }
};

export const renameGroupChat = (chatId, chatName) => {
  try {
    return axios.put(`${API_URLS.renameGroupChat}`, { chatId, chatName });
  } catch (error) {
    throw error;
  }
};

export const addToGroupChat = (chatId, userId) => {
  try {
    return axios.put(`${API_URLS.addToGroupChat}`, { chatId, userId });
  } catch (error) {
    throw error;
  }
};

export const removeFromGroupChat = (chatId, userId) => {
  try {
    return axios.put(`${API_URLS.removeFromGroupChat}`, { chatId, userId });
  } catch (error) {
    throw error;
  }
};

export const sendNewMessage = (formData) => {
  try {
    return axios.post(`${API_URLS.sendMessage}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  } catch (error) {
    throw error;
  }
};

export const getAllMessages = (chatId) => {
  try {
    return axios.get(`${API_URLS.getAllMessages}${chatId}`);
  } catch (error) {
    throw error;
  }
};

export const createNotification = (data) => {
  try {
    return axios.post(`${API_URLS.createNotification}`, { data });
  } catch (error) {
    throw error;
  }
};

export const getAllNotifications = () => {
  try {
    return axios.get(`${API_URLS.getAllNotifications}`);
  } catch (error) {
    throw error;
  }
};

export const removeNotificationApiCall = (notificationId) => {
  try {
    return axios.delete(`${API_URLS.removeNotification}${notificationId}`);
  } catch (error) {
    throw error;
  }
};

export const getUser = (userId) => {
  try {
    return axios.get(`${API_URLS.getUser}${userId}`);
  } catch (error) {
    throw error;
  }
};

export const updateUser = (userId, updatedUser) => {
  try {
    return axios.put(`${API_URLS.updateUser}${userId}`, { updatedUser });
  } catch (error) {
    throw error;
  }
};

export const deleteGroup = (chatId) => {
  try {
    return axios.delete(`${API_URLS.deleteGroup}${chatId}`);
  } catch (error) {
    throw error;
  }
};

export default API_URLS;
