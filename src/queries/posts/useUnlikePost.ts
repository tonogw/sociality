"use client";

import { postService } from "@/services/postService";
import { useMutation } from "@tanstack/react-query";

export function useUnlikePost() {
  return useMutation({
    mutationFn: postService.unlikePost,
  });
}
