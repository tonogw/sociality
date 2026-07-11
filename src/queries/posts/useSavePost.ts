import { postService } from "@/services/postService";
import { useQuery } from "@tanstack/react-query";

export function useSavePost(postId: number) {
  return useQuery({
    queryKey: ["postId"],
    queryFn: () => postService.savePost(postId),
  });
}
