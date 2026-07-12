"use client";

import { postService } from "@/services/postService";
import { useMutation } from "@tanstack/react-query";

export function useLikePost() {
  return useMutation({
    mutationFn: (postId: number) => postService.likePost(postId),
  });
}
