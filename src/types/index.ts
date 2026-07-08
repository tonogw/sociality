// GET /api/me
export interface GetMyProfileResponse {
  success: boolean;
  message: string;
  data: {
    profile: {
      id: number;
      name: string;
      username: string;
      email: string;
      phone: string;
      bio: string;
      avatarUrl: string;
      createdAt: string;
    };
    stats: {
      posts: number;
      followers: number;
      following: number;
      likes: number;
    };
  };
}

// curl -X 'PATCH' \
//   'https://be-social-media-api-production.up.railway.app/api/me' \
//   -H 'accept: */*' \
//   -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTY3LCJ1c2VybmFtZSI6InRvbm9ndyIsImlhdCI6MTc4MzM0NzgwMSwiZXhwIjoxNzgzOTUyNjAxfQ.tkMEyrb34IhluRx3yX0H_-NxCijJmRtov1yH1zi70qo' \
//   -H 'Content-Type: multipart/form-data' \
//   -F 'name=tono' \
//   -F 'username=tonog' \
//   -F 'phone=08121345' \
//   -F 'bio=bio' \
//   -F 'avatar=@image-testi-kevin.png;type=image/png' \
//   -F 'avatarUrl=https://picsum.com/200/300'

export interface UpdataMyProfile {
  success: string;
  username: string;
  phone: string;
  bio: string;
  avatar: string;
  avatarUrl: string;
}

export interface UpdateMyProfileData {
  success: boolean;
  message: string;
  data: {
    id: number;
    name: string;
    username: string;
    email: string;
    phone: string;
    bio: string;
    avatarUrl: string;
    updatedAt: string;
  };
}

// https://be-social-media-api-production.up.railway.app/api/me/posts?page=1&limit=20
export interface GetMyPostData {
  success: boolean;
  message: string;
  data: {
    items: [];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
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
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}
