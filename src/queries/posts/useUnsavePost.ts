"use client";

import { postService } from "@/services/postService";
import { useMutation } from "@tanstack/react-query";

export function useUnsavePost() {
  return useMutation({
    mutationFn: postService.unsavePost,
  });
}
