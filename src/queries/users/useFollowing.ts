"use client";

import { meService } from "@/services/meService";
import { useQuery } from "@tanstack/react-query";

export function useFollowing(page: number, limit: number) {
  return useQuery({
    queryKey: ["following", page, limit],
    queryFn: () => meService.getMeFollowing(page, limit),
  });
}
