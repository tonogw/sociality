import { postService } from "@/services/postService";
import { useQuery } from "@tanstack/react-query";

export function useFeed(page = 1, limit = 5) {
  return useQuery({
    queryKey: ["feed", page, limit],
    queryFn: () => postService.getFeed(page, limit),
  });
}
