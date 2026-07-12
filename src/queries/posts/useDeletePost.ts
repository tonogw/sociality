"use client";

import { postService } from "@/services/postService";
import { useMutation } from "@tanstack/react-query";

export function useDeletePost() {
  return useMutation({
    mutationFn: (postId: number) => postService.deletePost(postId),
  });
}
