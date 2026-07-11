"use client";

import { commentService } from "@/services/commentService";
import { useQuery } from "@tanstack/react-query";

export function useComment(postId: number, page: number, limit: number) {
  return useQuery({
    queryKey: ["comments", postId, page, limit],
    queryFn: () => commentService.getComments(postId, page, limit),
  });
}
