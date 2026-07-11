"use client";

import { useQuery } from "@tanstack/react-query";
import { userService } from "@/services/userService";

export function useUser(username: string) {
  return useQuery({
    queryKey: ["user", username],
    queryFn: () => userService.getUser(username),
    enabled: !!username,
  });
}
