"use client";

import { meService } from "@/services/meService";
import { useQuery } from "@tanstack/react-query";

export function useMeFollowing(page: number, limit: number) {
  return useQuery({
    queryKey: ["me-following", page, limit],
    queryFn: () => meService.getMeFollowing(page, limit),
  });
}
