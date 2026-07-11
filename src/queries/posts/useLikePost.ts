import { postService } from "@/services/postService";
import { useQuery } from "@tanstack/react-query";

export function useLikePost(postId: number) {
  return useQuery({
    queryKey: ["postId", postId],
    queryFn: () => postService.likePost(postId),
  });
}
