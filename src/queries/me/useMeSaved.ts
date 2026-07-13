"use client";

import { meService } from "@/services/meService";
import { useQuery } from "@tanstack/react-query";

export function useMeSaved(page: number, limit: number) {
  return useQuery({
    queryKey: ["me-saved", page, limit],
    queryFn: () => meService.getMeSaved(page, limit),
  });
}
