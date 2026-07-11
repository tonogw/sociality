"use client";

import { meService } from "@/services/meService";
import { useQuery } from "@tanstack/react-query";

export function useFollowers(page: number, limit: number) {
  return useQuery({
    queryKey: [page, limit],
    queryFn: () => meService.getMeFollowers(page, limit),
  });
}
