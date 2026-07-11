import { postService } from "@/services/postService";
import { useQuery } from "@tanstack/react-query";

export function useUnsavePost(postId: number) {
  return useQuery({
    queryKey: ["postId"],
    queryFn: () => postService.unsavePost(postId),
  });
}
