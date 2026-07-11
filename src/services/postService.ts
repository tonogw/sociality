import { axiosInstance } from "@/lib/api/axios";
import {
  FetchPostsResponse,
  CreatePostResponse,
  DeletePostResponse,
  PostResponse,
} from "@/types/post";
import { CommentItem, CommentResponse } from "@/types/comment";

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

  getPosts: async (
    page: number,
    limit: number = 20,
  ): Promise<FetchPostsResponse> => {
    const response = await axiosInstance.get(
      `/posts?page=${page}&limit=${limit}`,
    );
    return response.data;
  },

  createPost: async (formData: FormData): Promise<CreatePostResponse> => {
    const response = await axiosInstance.post(`/posts`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  deletePost: async (postId: number): Promise<DeletePostResponse> => {
    const response = await axiosInstance.delete(`/posts/${postId}`);
    return response.data;
  },

  savePost: async (postId: number): Promise<PostResponse> => {
    const response = await axiosInstance.post(`/posts/${postId}/save`);
    return response.data;
  },

  unsavePost: async (postId: number): Promise<PostResponse> => {
    const response = await axiosInstance.delete(`/posts/${postId}/save`);
    return response.data;
  },

  // Aksi Idempotent Like Post
  likePost: async (postId: number): Promise<PostResponse> => {
    const response = await axiosInstance.post(`/posts/${postId}/like`);
    return response.data;
  },

  // Aksi Idempotent Unlike Post
  unlikePost: async (postId: number): Promise<PostResponse> => {
    const response = await axiosInstance.delete(`/posts/${postId}/like`);
    return response.data;
  },

  getComment: async (
    postId: number,
    page: number = 1,
    limit: number = 10, //10 per fetch
  ): Promise<CommentResponse> => {
    const response = await axiosInstance.get(
      `/posts/${postId}/comments?page=${page}&limit=${limit}`,
    );
    return response.data;
  },

  postComment: async (postId: number, text: string): Promise<CommentItem> => {
    const response = await axiosInstance.post(`/posts/${postId}/comments`, {
      text,
    });

    return response.data;
  },
};
