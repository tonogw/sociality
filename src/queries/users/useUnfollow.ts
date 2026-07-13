"use client";

import { useMutation } from "@tanstack/react-query";
import { userService } from "@/services/userService";

export function useUnfollow() {
  return useMutation({
    mutationFn: userService.unfollow,
  });
}
