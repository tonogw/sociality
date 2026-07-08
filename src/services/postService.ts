import { axiosInstance } from "@/lib/api/axios";

export interface PostItem {
  id: number;
  caption: string;
  imageUrl: string;
  createdAt: string;
  user: {
    id: number;
    name: string;
    username: string;
    avatarUrl: string | null;
  };
  _count?: {
    likes: number;
    comments: number;
  };
}

export interface FetchPostsResponse {
  success: boolean;
  message: string;
  data: {
    posts: PostItem[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export const postService = {
  // KOREKSI UTAMA: Mengarah ke /feed sesuai spesifikasi swagger timeline Anda
  getFeed: async (
    page: number = 1,
    limit: number = 5,
  ): Promise<FetchPostsResponse> => {
    const response = await axiosInstance.get(
      `/feed?page=${page}&limit=${limit}`,
    );
    return response.data;
  },

  // Aksi Idempotent Like Post
  likePost: async (postId: number) => {
    const response = await axiosInstance.post(`/posts/${postId}/like`);
    return response.data;
  },

  // Aksi Idempotent Unlike Post
  unlikePost: async (postId: number) => {
    const response = await axiosInstance.delete(`/posts/${postId}/like`);
    return response.data;
  },
};
