import { Pagination } from "./api";

export interface PostLikeResponse {
  success: boolean;
  message: string;
  data: {
    liked: boolean;
    likeCount: number;
  };
}

export interface DeleteLikeResponse {
  success: boolean;
  message: string;
  data: {
    liked: boolean;
    likeCount: number;
  };
}

// List users who liked a post
export interface LikeUsers {
  id: number;
  username: string;
  name: string;
  avatarUrl: string | null;
  isFollowedByMe: boolean;
  isMe: boolean;
  followsMe: boolean;
}

export interface UsersLikedPost {
  success: boolean;
  message: string;
  data: {
    users: LikeUsers[];
    pagination: Pagination;
  };
}
