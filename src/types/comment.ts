import { Pagination } from "./api";
import { AuthorItem } from "./post";

export interface CreateCommentResponse {
  success: boolean;
  message: string;
  data: CommentItem;
}

export interface CommentItem {
  id: number;
  text: string;
  createdAt: string;
  author: AuthorItem;
  isMine: boolean;
}

export interface CommentResponse {
  success: boolean;
  message: string;
  data: {
    items: CommentItem[];
    pagination: Pagination;
  };
}

export interface DeletedCommentResponse {
  success: boolean;
  message: string;
  data: string | null;
}

export interface CreateCommentInput {
  postId: number;
  text: string;
}
