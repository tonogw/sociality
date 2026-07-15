"use client";

import Image from "next/image";
import { CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import { useFollow } from "@/queries/users/useFollow";
import { useUnfollow } from "@/queries/users/useUnfollow";

import type { FollowUser } from "@/types/follow";

interface UserListCardProps {
  user: FollowUser;
}

export default function UserListCard({ user }: UserListCardProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const followMutation = useFollow();
  const unfollowMutation = useUnfollow();

  const handleToggleFollow = () => {
    if (user.isFollowedByMe) {
      unfollowMutation.mutate(user.username, {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["followers"],
          });

          queryClient.invalidateQueries({
            queryKey: ["following"],
          });

          queryClient.invalidateQueries({
            queryKey: ["user", user.username],
          });
        },
      });

      return;
    }

    followMutation.mutate(user.username, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["followers"],
        });

        queryClient.invalidateQueries({
          queryKey: ["following"],
        });

        queryClient.invalidateQueries({
          queryKey: ["user", user.username],
        });
      },
    });
  };

  return (
    <div className="flex items-center justify-between">
      {/* LEFT */}
      <button
        type="button"
        onClick={() => router.push(`/${user.username}`)}
        className="flex flex-1 items-center gap-3 text-left"
      >
        <Image
          src={user.avatarUrl || "/default-avatar.png"}
          alt={user.username}
          width={48}
          height={48}
          className="h-12 w-12 rounded-full object-cover"
          unoptimized
        />

        <div className="flex flex-col">
          <span className="text-sm font-bold text-white">{user.name}</span>

          <span className="text-sm text-zinc-400">@{user.username}</span>
        </div>
      </button>

      {/* RIGHT */}
      <button
        type="button"
        onClick={handleToggleFollow}
        disabled={followMutation.isPending || unfollowMutation.isPending}
        className={
          user.isFollowedByMe
            ? "flex h-10 items-center gap-2 rounded-full border border-[#181D27] px-5 text-sm font-bold text-white hover:bg-[#181D27]"
            : "h-10 rounded-full bg-[#6936F2] px-6 text-sm font-bold text-white hover:bg-[#5d2de3]"
        }
      >
        {user.isFollowedByMe ? (
          <>
            <CheckCircle size={18} />
            Following
          </>
        ) : (
          "Follow"
        )}
      </button>
    </div>
  );
}
