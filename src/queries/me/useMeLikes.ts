"use client";

import { meService } from "@/services/meService";
import { useQuery } from "@tanstack/react-query";

export function useMeLikes(page: number, limit: number) {
  return useQuery({
    queryKey: ["me-likes", page, limit],
    queryFn: () => meService.getMeLikes(page, limit),
  });
}
