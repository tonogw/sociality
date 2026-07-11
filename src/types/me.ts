import { PostItem } from "./post";
import { Pagination } from "./api";
import { FollowerUsers } from "./user";

export interface GetMyProfileResponse {
  success: boolean;
  message: string;
  data: {
    profile: ProfileUsers;
    // {
    //   id: number;
    //   name: string;
    //   username: string;
    //   email: string;
    //   phone: string;
    //   bio: string;
    //   avatarUrl: string;
    //   createdAt: string;
    // };
    stats: {
      posts: number;
      followers: number;
      following: number;
      likes: number;
    };
  };
}

export interface ProfileUsers {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  bio: string;
  avatarUrl: string;
  updatedAt: string;
}

export interface UpdateMyProfileData {
  success: boolean;
  message: string;
  data: ProfileUsers;
  // {
  //   id: number;
  //   name: string;
  //   username: string;
  //   email: string;
  //   phone: string;
  //   bio: string;
  //   avatarUrl: string;
  //   updatedAt: string;
  // };
}

// https://be-social-media-api-production.up.railway.app/api/me/posts?page=1&limit=20
export interface GetMyPostData {
  success: boolean;
  message: string;
  data: {
    items: PostItem[];
    // {
    //   id: number;
    //   imageUrl: string;
    //   caption: string;
    //   createdAt: string;
    //   author: {
    //     id: number;
    //     username: string;
    //     name: string;
    //     avatarUrl: string;
    //   };
    //   likeCount: number;
    //   commentCount: number;
    //   likedByMe: boolean;
    // },
    pagination: Pagination;
    // {
    //   page: number;
    //   limit: number;
    //   total: number;
    //   totalPages: number;
    // };
  };
}

export interface GetMeFollowers {
  success: boolean;
  message: string;
  data: {
    users: FollowerUsers[];
    // {
    //   id: number;
    //   username: string;
    //   avatarUrl: null;
    //   isFollowedByMe: boolean;
    // },
    pagination: Pagination;
    // {
    //   page: number;
    //   limit: number;
    //   total: number;
    //   totalPages: number;
    // };
  };
}

export interface GetMeFollowing {
  success: boolean;
  message: string;
  data: {
    users: FollowerUsers[];
    // {
    //   id: number;
    //   username: string;
    //   name: string;
    //   avatarUrl: null;
    //   isFollowedByMe: boolean;
    // },
    pagination: Pagination;
    // {
    //   page: number;
    //   limit: number;
    //   total: number;
    //   totalPages: number;
    // };
  };
}

export interface MySavedResponse {
  success: boolean;
  message: string;
  data: {
    posts: PostItem[];
    pagination: Pagination;
    // {
    //   page: number;
    //   limit: number;
    //   total: number;
    //   totalPages: number;
    // };
  };
}

export interface MyLikesResponse {
  success: boolean;
  message: string;
  data: {
    items: PostItem[];
    pagination: Pagination;
  };
}
