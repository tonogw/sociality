import { axiosInstance } from "@/lib/api/axios";
import { UpdateUserInput } from "@/lib/validations";

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
};
