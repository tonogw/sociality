export interface Follow {
  success: boolean;
  message: string;
  data: {
    following: boolean | null;
  };
}

// coba di remap untuk profileHeader, username/page, dsb
export interface FollowUser {
  id: number;
  username: string;
  name: string;
  avatarUrl: string | null;
  isFollowedByMe: boolean;
}
