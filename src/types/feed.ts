import { PostItem } from "./post";
import { Pagination } from "./api";

export interface FeedData {
  success: boolean;
  message: string;
  data: {
    items: PostItem[];
    pagination: Pagination;
  };
}
