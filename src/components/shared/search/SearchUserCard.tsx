"use client";

import Image from "next/image";
import Link from "next/link";

import type { SearchedUser } from "@/types/user";

interface SearchUserCardProps {
  user: SearchedUser;
  query: string;
  page: number;
}

export default function SearchUserCard({
  user,
  query,
  page,
}: SearchUserCardProps) {
  const initial = user.name.charAt(0).toUpperCase();

  return (
    <Link
      href={`/${user.username}?fromQ=${encodeURIComponent(query)}&lastPage=${page}`}
      className="
        flex
        items-center
        gap-3
        rounded-xl
        p-3
        transition-colors
        hover:bg-[#111827]
      "
    >
      {user.avatarUrl ? (
        <Image
          src={user.avatarUrl}
          alt={user.name}
          width={48}
          height={48}
          className="
            h-12
            w-12
            rounded-full
            object-cover
          "
        />
      ) : (
        <div
          className="
            flex
            h-12
            w-12
            items-center
            justify-center
            rounded-full
            bg-[#2A2F3A]
            text-lg
            font-semibold
            text-white
          "
        >
          {initial}
        </div>
      )}

      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-white">{user.name}</p>

        <p className="truncate text-sm text-[#A4A7AE]">@{user.username}</p>
      </div>
    </Link>
  );
}
