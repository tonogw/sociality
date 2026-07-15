"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

import { userService } from "@/services/userService";
import UserListCard from "@/components/profile/UserListCard";
import Navbar from "@/components/shared/Navbar";

export default function FollowingPage() {
  // const router = useRouter();
  const params = useParams();

  const username = params.username as string;

  const { data, isLoading } = useQuery({
    queryKey: ["following", username],
    queryFn: () => userService.getFollowing(username, 1, 20),
    enabled: !!username,
  });

  const users = data?.data.users ?? [];

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-black">
        <Loader2 size={32} className="animate-spin text-[#6936F2]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black px-4 pt-20 pb-10 text-white flex justify-center">
      <Navbar />
      <div className="w-full max-w-[361px] flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-bold">Following</h1>
        </div>

        {users.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#181D27] py-16 text-center text-sm text-zinc-500">
            No following yet.
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {users.map((user) => (
              <UserListCard key={user.id} user={user} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
