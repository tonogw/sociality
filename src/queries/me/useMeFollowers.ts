"use client";

import { meService } from "@/services/meService";
import { useQuery } from "@tanstack/react-query";

export function useMeFollowers(page: number, limit: number) {
  return useQuery({
    queryKey: ["me-followers", page, limit],
    queryFn: () => meService.getMeFollowers(page, limit),
  });
}
