"use client";

import { useMutation } from "@tanstack/react-query";
import { userService } from "@/services/userService";

export function useFollow() {
  return useMutation({
    mutationFn: userService.follow,
  });
}
