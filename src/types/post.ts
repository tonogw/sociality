import { Pagination } from "./api";

export interface PostItem {
  id: number;
  imageUrl: string;
  caption: string;
  createdAt: string;
  author: AuthorItem;

  likeCount: number;
  commentCount: number;
  likedByMe: boolean;
}

export interface AuthorItem {
  id: number;
  username: string;
  name: string;
  avatarUrl: string | null;
}

export interface PostData {
  posts: PostItem[];
}

// export interface TimelineCardProps {
//   post: {
//     id: number;
//     imageUrl: string;
//     caption?: string;
//     createdAt: string;
//     author?: AuthorItem;
//     likeCount?: number;
//     commentCount?: number;
//     likedByMe?: boolean;
//     savedByMe?: boolean; // Mengantisipasi skema bookmark masa depan
//   };
//   currentUsername?: string; // Untuk pengecekan hak akses tombol hapus data post sendiri
// }

export interface TimelineCardProps {
  post: PostItem;
  canDelete?: boolean;
}

export interface FetchPostsResponse {
  // success: boolean;
  // message: string;
  // data: {
  posts: PostItem[];
  pagination: Pagination;
  // };
}

export interface DeletePostResponse {
  success: boolean;
  message: string;
  data: {
    deleted: boolean;
  };
}

export interface CreatePostResponse {
  success: boolean;
  message: string;
  data: PostItem;
}

export interface PostResponse {
  success: boolean;
  message: string;
  data: {
    saved: boolean;
  };
}
