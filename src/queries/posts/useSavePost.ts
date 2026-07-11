"use client";

import { postService } from "@/services/postService";
import { useMutation } from "@tanstack/react-query";

export function useSavePost() {
  return useMutation({
    mutationFn: postService.savePost,
  });
}
