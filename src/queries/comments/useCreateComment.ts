"use client";

import { commentService } from "@/services/commentService";
import { useMutation } from "@tanstack/react-query";
import { CreateCommentInput } from "@/types/comment";

export function useCreateComment() {
  return useMutation({
    mutationFn: ({ postId, text }: CreateCommentInput) =>
      commentService.createComment(postId, text),
  });
}
