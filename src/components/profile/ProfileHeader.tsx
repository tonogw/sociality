"use client";

import Image from "next/image";

interface ProfileHeaderProps {
  name?: string;
  username?: string;
  avatarUrl?: string | null;
}

export default function ProfileHeader({
  name,
  username,
  avatarUrl,
}: ProfileHeaderProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-16 h-16 rounded-full bg-zinc-800 border border-[#181D27] overflow-hidden flex items-center justify-center relative">
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt="Avatar"
            fill
            className="object-cover"
            unoptimized
            sizes="64px"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-tr from-[#6936F2] to-[#AD3AE7] flex items-center justify-center text-xl font-bold text-white">
            {name?.charAt(0).toUpperCase() ?? "U"}
          </div>
        )}
      </div>

      <div className="flex flex-col">
        <h2 className="text-sm font-bold text-[#FDFDFD] tracking-tight">
          {name}
        </h2>

        <p className="text-sm text-[#A4A7AE]">@{username}</p>
      </div>
    </div>
  );
}
