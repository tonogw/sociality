"use client";

import { commentService } from "@/services/commentService";
import { useMutation } from "@tanstack/react-query";

export function useDeleteComment() {
  return useMutation({
    mutationFn: commentService.deleteComment,
  });
}
