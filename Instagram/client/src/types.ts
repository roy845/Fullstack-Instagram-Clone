import { StringNullableChain } from "lodash";

type ProfilePicture = {
  id: string;
  url: string;
  publish: boolean;
};
export interface User {
  _id: string;
  fullName: string;
  username: string;
  emailAddress: string;
  profilePic: ProfilePicture;
  isAdmin: boolean;
  followings: User[];
  followers: User[];
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUser extends User {
  password: string;
}

export interface Post {
  _id: string;
  userId?: string;
  description: string;
  files?: FileData[];
  likes?: User[];
  comments?: [];
  user: User;
  edited?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PostCreate {
  files: FileData[];
  description: string;
}

export interface FileData {
  id: string;
  url: string | null;
  type: string;
  publish: boolean;
}

export interface CommentType {
  _id: string;
  content: string;
  user: User;
  likes: [];
  createdAt: string;
  updatedAt: string;
}

export interface Auth {
  token_type: string;
  access_token: string;
  user: User;
}

export interface RegisterFormData {
  username: string;
  fullName: string;
  emailAddress: string;
  password: string;
}

export type StoryFileData = {
  id: string;
  url: string;
  type: string;
  publish?: boolean;
  duration?: number;
  createdAt?: string;
  updatedAt?: string;
};

export interface Story {
  _id: string;
  userId: string;
  files: StoryFileData[];
  user: User;
  createdAt: string;
  updatedAt: string;
}

export interface MentionNotification {
  _id: string;
  content: string;
  post: Post;
  recipientId: string;
  sender: string;
}
