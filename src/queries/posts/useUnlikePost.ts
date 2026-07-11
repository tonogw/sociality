import { postService } from "@/services/postService";
import { useQuery } from "@tanstack/react-query";

export function useUnlikePost(postId: number) {
  return useQuery({
    queryKey: ["postId"],
    queryFn: () => postService.unlikePost(postId),
  });
}
