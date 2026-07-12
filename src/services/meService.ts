import { axiosInstance } from "@/lib/api/axios";
import {
  GetMeFollowers,
  GetMeFollowing,
  GetMyProfileResponse,
  GetMyPostData,
  MySavedResponse,
  MyLikesResponse,
  UpdateMyProfileData,
} from "@/types/me";

export const meService = {
  getMe: async (): Promise<GetMyProfileResponse> => {
    const response = await axiosInstance.get("/my");
    return response.data;
  },

  updateMe: async (formData: FormData): Promise<UpdateMyProfileData> => {
    const response = await axiosInstance.patch("/my", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  getMeFollowers: async (
    page: number,
    limit: number,
  ): Promise<GetMeFollowers> => {
    const response = await axiosInstance.get(
      `/me/followers?page=${page}&limit=${limit}`,
    );
    return response.data;
  },

  getMeFollowing: async (
    page: number,
    limit: number,
  ): Promise<GetMeFollowing> => {
    const response = await axiosInstance.get(
      `/me/following?page=${page}&limit=${limit}`,
    );
    return response.data;
  },

  getMeLikes: async (page: number, limit: number): Promise<MyLikesResponse> => {
    const response = await axiosInstance.get(
      `/me/likes?page=${page}&limit=${limit}`,
    );
    return response.data;
  },

  getMeSaved: async (page: number, limit: number): Promise<MySavedResponse> => {
    const response = await axiosInstance.get(
      `/me/saved?page=${page}&limit=${limit}`,
    );
    return response.data;
  },

  getMePosts: async (page: number, limit: number): Promise<GetMyPostData> => {
    const response = await axiosInstance.get(
      `/me/posts?page=${page}&limit=${limit}`,
    );
    return response.data;
  },
};
