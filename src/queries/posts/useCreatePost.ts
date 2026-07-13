"use client";

import { postService } from "@/services/postService";
import { useMutation } from "@tanstack/react-query";

export function useCreatePost() {
  return useMutation({
    mutationFn: postService.createPost,
  });
}
