import { axiosInstance } from "@/lib/api/axios";

export const authService = {
  // Fungsi Register
  register: async (
    payload: Omit<import("@/validations/auth").RegisterUser, "confirmPassword">,
  ) => {
    const response = await axiosInstance.post("/auth/register", payload);
    return response.data; // Me-return data bersih (termasuk token & user data)
  },

  // Fungsi Login (Nanti akan kita pakai di halaman Login)
  login: async (payload: import("@/validations/auth").LoginInputs) => {
    const response = await axiosInstance.post("/auth/login", payload);
    return response.data;
  },
};
