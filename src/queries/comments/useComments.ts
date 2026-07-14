"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { commentService } from "@/services/commentService";
import { CreateCommentInput } from "@/types/comment";
import { toast } from "sonner";

// 1. Hook tunggal untuk fetch komentar post spesifik
export function useComment(postId: number, page: number, limit: number) {
  return useQuery({
    queryKey: ["comments", postId, page, limit],
    queryFn: () => commentService.getComments(postId, page, limit),
    enabled: !!postId, // Hanya berjalan jika postId valid
  });
}

// 2. Hook mutasi untuk membuat komentar baru
export function useCreateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, text }: CreateCommentInput) =>
      commentService.createComment(postId, text),
    onSuccess: (_, variables) => {
      // Refresh cache komentar post setelah berhasil submit
      queryClient.invalidateQueries({
        queryKey: ["comments", variables.postId],
      });
      toast.success("Comment added successfully!");
    },
    onError: () => {
      toast.error("Failed to post comment.");
    },
  });
}

// 3. Hook mutasi untuk menghapus komentar
export function useDeleteComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: number) => commentService.deleteComment(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
      toast.success("Comment deleted successfully.");
    },
    onError: () => {
      toast.error("Failed to delete comment.");
    },
  });
}
