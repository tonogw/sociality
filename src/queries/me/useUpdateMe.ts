"use client";

import { useMutation } from "@tanstack/react-query";
import { meService } from "@/services/meService";

export function useUpdateMe() {
  return useMutation({
    mutationFn: meService.updateMe,
  });
}
