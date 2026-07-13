"use client";

import { meService } from "@/services/meService";
import { useQuery } from "@tanstack/react-query";

export function useGetMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: () => meService.getMe(),
  });
}
