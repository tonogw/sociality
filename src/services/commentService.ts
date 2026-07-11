import { axiosInstance } from "@/lib/api/axios";
import {
  CommentResponse,
  // CommentItem,
  DeletedCommentResponse,
  CreateCommentResponse,
} from "@/types/comment";

export const commentService = {
  getComments: async (
    postId: number,
    page: number,
    limit: number = 10, // Default 10 comments per request
  ): Promise<CommentResponse> => {
    const response = await axiosInstance.get(
      `/posts/${postId}/comments?page=${page}&limit=${limit}`,
    );
    return response.data;
  },

  createComment: async (
    postId: number,
    text: string,
  ): Promise<CreateCommentResponse> => {
    const response = await axiosInstance.post(`/posts/${postId}/comments`, {
      text,
    });
    return response.data;
  },

  deleteComment: async (commentId: number): Promise<DeletedCommentResponse> => {
    const response = await axiosInstance.delete(`/comments/${commentId}`);
    return response.data;
  },
};
