"use client";

import { authService } from "@/services/authService";
import { useMutation } from "@tanstack/react-query";

export function useRegister() {
  return useMutation({
    mutationFn: authService.register,
  });
}
