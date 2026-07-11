"use client";

import { authService } from "@/services/authService";
import { useQuery } from "@tanstack/react-query";

export function useRegister(payload: Omit) {
  return useQuery({
    queryKey: [payload],
    queryFn: () => authService.register(payload),
  });
}
