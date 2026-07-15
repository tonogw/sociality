import { PostItem } from "./post";
import { Pagination } from "./api";

export interface UserStats {
  posts: number;
  followers: number;
  following: number;
  likes: number;
}

export interface UserProfile {
  id: number;
  username: string;
  name: string;
  email: string;
  phone: string;
  bio: string | null;
  avatarUrl: string | null;
  isMe?: boolean;
  isPrivate?: boolean;
  isFollowing?: boolean;
  isFollowedByMe?: boolean; // Relasi follow kustom penyeimbang Swagger
  counts?: {
    post: number;
    followers: number;
    following: number;
    likes: number;
  };
}

// Menggunakan perluasan interface langsung untuk NoInfer compatibilities
export type UserProfileData = UserProfile;

export interface SearchedUser {
  id: number;
  username: string;
  name: string;
  avatarUrl: string | null;
  isFollowedByMe: boolean;
}

export interface UserProfileResponse {
  success: boolean;
  message: string;
  data: {
    profile: UserProfile;
    stats: UserStats;
  };
}

export interface OtherUserProfileResponse {
  success: boolean;
  message: string;
  data: UserProfile;
}

export interface FollowResponse {
  success: boolean;
  message: string;
  data: {
    following: boolean | null;
  };
}

export interface ConnectionListResponse {
  success: boolean;
  message: string;
  data: {
    users: PostItem[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
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
