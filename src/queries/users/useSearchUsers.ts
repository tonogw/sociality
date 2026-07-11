"use client";

import { userService } from "@/services/userService";
import { useQuery } from "@tanstack/react-query";

export function useSearchUsers(queryText: string, page: number, limit = 20) {
  return useQuery({
    queryKey: ["search-user", queryText, page, limit],
    queryFn: () => userService.searchUsers(queryText, page, limit),
  });
}
