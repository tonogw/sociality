import { axiosInstance } from "@/lib/api/axios";
import { UpdateUserInput } from "@/lib/validations";
import type { SearchedUser, SearchUsersResponse } from "@/types";

export const userService = {
  getMe: async () => {
    const response = await axiosInstance.get("/me");
    return response.data;
  },

  // Fungsi Baru: Kirim data pembaruan basic info profil
  // updateMe: async (payload: UpdateUserInput) => {
  updateMe: async (formData: FormData) => {
    const response = await axiosInstance.patch("/me", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  searchUsers: async (
    queryText: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<SearchUsersResponse> => {
    const response = await axiosInstance.get(
      `/users/search?q=encodeURIComponent(queryText)}&page=${page}&limit=${limit}`,
    );
    return response.data;
  },
};
