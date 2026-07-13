"use client";

import { meService } from "@/services/meService";
import { useQuery } from "@tanstack/react-query";
import { number } from "zod";

export function useFollowing(page: number, limit: number) {
  return useQuery({
    queryKey: ["following", page, number],
    queryFn: () => meService.getMeFollowing(page, limit),
  });
}
