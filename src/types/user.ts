import { Pagination } from "./api";

export interface UserProfileData {
  id: number;
  username: string;
  name: string;
  avatarUrl: string | null;
  bio?: string;
  email: string;
  phone: string;
  counts: {
    post: number;
    followers: number;
    following: number;
    likes: number;
  };
  isFollowing: boolean;
  isMe: boolean;
}

export interface SearchedUser {
  id: number;
  username: string;
  name: string;
  avatarUrl: string | null;
  isFollowedByMe: boolean;
}

export interface SearchUsersResponse {
  success: boolean;
  message: string;
  data: {
    users: SearchedUser[];
    pagination: Pagination;
  };
}

export interface FollowerUsers {
  id: number;
  username: string;
  name: string;
  avatarUrl: string | null;
  isFollowedByMe: boolean;
}

export interface FollowersResponse {
  success: boolean;
  message: string;
  data: {
    users: FollowerUsers[];
    pagination: Pagination;
  };
}

export interface FollowingResponse {
  success: boolean;
  message: string;
  data: {
    users: FollowerUsers[];
    pagination: Pagination;
  };
}

export interface ProfileViewModel {
  profile: string;
  posts: string;
  stats: string;
  isOwner: boolean;
  isFollowing: boolean;
}
