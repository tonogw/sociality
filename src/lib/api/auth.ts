import api from "axios";
import type { AuthResponse, UserData } from "@/types/auth";

export const authApi = {
  register: async (data: {
    name: string;
    username: string;
    email: string;
    phone: string;
    password: string;
  }): Promise<AuthResponse> => {
    const res = await api.post("/api/auth/register", data);
    return res.data;
  },

  login: async (data: {
    email: string;
    password: string;
  }): Promise<AuthResponse> => {
    const res = await api.post("/api/auth/login", data);
    return res.data;
  },
};
