"use client";

import Image from "next/image";

interface ProfileHeaderProps {
  user: any;
  isOwnProfile: boolean;
}

export default function ProfileHeader({
  user,
  isOwnProfile,
}: ProfileHeaderProps) {
  return (
    <div className="flex flex-col gap-3 w-full font-sans">
      <div className="flex items-center gap-3">
        <div className="w-16 h-16 rounded-full bg-zinc-800 border border-[#181D27] overflow-hidden flex items-center justify-center relative shrink-0">
          {user?.avatarUrl ? (
            <Image
              src={user.avatarUrl}
              alt="Avatar"
              fill
              className="object-cover"
              unoptimized
              sizes="64px"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-tr from-[#6936F2] to-[#AD3AE7] flex items-center justify-center text-xl font-bold text-white">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
          )}
        </div>
        <div className="flex flex-col">
          <h2 className="text-sm font-bold text-[#FDFDFD] tracking-tight">
            {user?.name}
          </h2>
          <p className="text-sm text-[#A4A7AE]">@{user?.username}</p>
        </div>
      </div>

      {isOwnProfile && user && (user.email || user.phone) && (
        <div className="w-full p-3 bg-[#0A0D12] border border-[#181D27] rounded-xl flex flex-col gap-1 text-[11px] text-zinc-400 font-mono">
          <span className="text-zinc-600 uppercase font-bold text-[9px] tracking-wider">
            🔒 Private Contact
          </span>
          {user.email && <div>Email: {user.email}</div>}
          {user.phone && <div>Phone: {user.phone}</div>}
        </div>
      )}
      <p className="text-sm text-[#FDFDFD] leading-relaxed break-words">
        {user?.bio || "Creating unforgettable moments! 📸✨"}
      </p>
    </div>
  );
}
