import { axiosInstance } from "@/lib/api/axios";
import { DeletedCommentResponse } from "@/types/comment";

export const CommentService = {
  deleteComment: async (commentId: number): Promise<DeletedCommentResponse> => {
    const response = await axiosInstance.delete(`/comments/${commentId}`);
    return response.data;
  },
};
