import { axiosInstance } from "@/lib/api/axios";

// Like, comment, follow
export const postService = {
  likePost: async (postId: number) => {
    return await axiosInstance.post(`/posts/${postId}/like`);
    // Token sudah otomatis ikut terbang di dalam Header!
  },
};
