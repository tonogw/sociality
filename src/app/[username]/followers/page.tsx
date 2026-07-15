"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Loader2 } from "lucide-react";

import { userService } from "@/services/userService";
import UserListCard from "@/components/profile/UserListCard";

export default function FollowersPage() {
  const router = useRouter();
  const params = useParams();

  const username = params.username as string;

  const { data, isLoading } = useQuery({
    queryKey: ["followers", username],
    queryFn: () => userService.getFollowers(username, 1, 20),
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
      <div className="w-full max-w-[361px] flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="text-zinc-400 hover:text-white"
          >
            <ArrowLeft size={18} />
          </button>

          <h1 className="text-lg font-bold">Followers</h1>
        </div>

        {users.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#181D27] py-16 text-center text-sm text-zinc-500">
            No followers yet.
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
