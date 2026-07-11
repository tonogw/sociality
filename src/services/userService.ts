import { axiosInstance } from "@/lib/api/axios";
import { Follow } from "@/types/follow";
// import { UpdateUserInput } from "@/lib/validations";
import type {
  UserProfileData,
  SearchUsersResponse,
  FollowersResponse,
  FollowingResponse,
} from "@/types/user";

// import type { GetMeFollowers, GetMeFollowing } from "@/types/me";

export const userService = {
  getUser: async (username: string): Promise<UserProfileData> => {
    const response = await axiosInstance.get(`/users/${username}`);
    return response.data.data;
  },

  follow: async (username: string): Promise<Follow> => {
    const response = await axiosInstance.post(`/follow/${username}`);

    return response.data;
  },

  unfollow: async (username: string): Promise<Follow> => {
    const response = await axiosInstance.delete(`/follow/${username}`);

    return response.data;
  },

  getFollowers: async (
    username: string,
    page: number,
    limit: number,
  ): Promise<FollowersResponse> => {
    const response = await axiosInstance.get(
      `/users/${username}/followers?page=${page}&limit=${limit}`,
    );

    return response.data;
  },

  getFollowing: async (
    username: string,
    page: number,
    limit: number,
  ): Promise<FollowingResponse> => {
    const response = await axiosInstance.get(
      `/users/${username}/following?page=${page}&limit=${limit}`,
    );

    return response.data;
  },

  searchUsers: async (
    queryText: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<SearchUsersResponse> => {
    const response = await axiosInstance.get(
      `/users/search?q=${encodeURIComponent(queryText)}&page=${page}&limit=${limit}`,
    );
    return response.data;
  },
};
