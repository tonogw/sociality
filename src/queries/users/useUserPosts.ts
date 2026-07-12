"use client";

import { userService } from "@/services/userService";
import { useQuery } from "@tanstack/react-query";

export function useUserPosts(
  username: string,
  page: number = 1,
  limit: number = 20,
) {
  return useQuery({
    queryKey: ["user-posts", username, page, limit],
    queryFn: () => userService.getUserPosts(username, page, limit),
    enabled: !!username,
  });
}
