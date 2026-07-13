"use client";

import { postService } from "@/services/postService";
import { useMutation } from "@tanstack/react-query";

export function useSavePost() {
  return useMutation({
    mutationFn: (postId: number) => postService.savePost(postId),
  });
}
