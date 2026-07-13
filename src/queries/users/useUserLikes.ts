"use client";

import { userService } from "@/services/userService";
import { useQuery } from "@tanstack/react-query";

export function useUserLikes(
  username: string,
  page: number = 1,
  limit: number = 20,
) {
  return useQuery({
    queryKey: ["user-likes", username, page, limit],
    queryFn: () => userService.getUserLikes(username, page, limit),
    enabled: !!username,
  });
}
