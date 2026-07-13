"use client";

import { meService } from "@/services/meService";
import { useQuery } from "@tanstack/react-query";

export function useMePosts(page: number, limit: number) {
  return useQuery({
    queryKey: ["me-posts", page, limit],
    queryFn: () => meService.getMePosts(page, limit),
  });
}
