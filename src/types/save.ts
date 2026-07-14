import { Pagination } from "./api";
import { PostItem } from "./post";

// 1. Skema Respons POST /api/posts/{id}/save (Save / Bookmark)
export interface SavePostResponse {
  success: boolean;
  message: "Saved";
  data: {
    saved: true;
  };
}

// 2. Skema Respons DELETE /api/posts/{id}/save (Unsave / Unbookmark)
export interface UnsavePostResponse {
  success: boolean;
  message: "Unsaved";
  data: {
    saved: false;
  };
}

// 3. Skema Respons GET /api/me/saved (Get My Saved Posts)
export interface SavedPostsResponse {
  success: boolean;
  message: string;
  data: {
    posts: PostItem[];
    pagination: Pagination;
  };
}
