export interface Follow {
  success: boolean;
  message: string;
  data: {
    following: boolean | null;
  };
}

export interface FollowUser {
  id: number;
  username: string;
  name: string;
  avatarUrl: string | null;
  isFollowedByMe: boolean;
}
