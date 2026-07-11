import { postService } from "@/services/postService";
import { useQuery } from "@tanstack/react-query";

export function usePost(page = 1, limit = 5) {
  return useQuery({
    queryKey: ["post", page, limit],
    queryFn: () => postService.getPosts(page, limit),
  });
}
