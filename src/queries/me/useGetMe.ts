"use client";

import { meService } from "@/services/meService";
import { useQuery } from "@tanstack/react-query";

export function useMe() {
  return useQuery({
    queryKey: [],
    queryFn: () => meService.getMe(),
  });
}
