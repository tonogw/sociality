"use client";

import { Home, Plus } from "lucide-react";
import Image from "next/image";

interface BottomNavbarProps {
  onHome: () => void;
  onCreatePost: () => void;
  onProfile: () => void; // TAMBAHAN PROPS INTERAKTIF
  avatarUrl?: string | null; // BONUS: Menampilkan avatar asli pengguna jika ada
}

export default function BottomNavbar({
  onHome,
  onCreatePost,
  onProfile,
  avatarUrl,
}: BottomNavbarProps) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-86.25 h-16 bg-[#0A0D12]/90 border border-[#181D27] backdrop-blur-[50px] rounded-full flex items-center justify-center gap-4 px-6 z-20 shadow-xl">
      {/* TOMBOL HOME */}
      <button
        onClick={onHome}
        className="flex-1 flex flex-col items-center gap-0.5 text-zinc-400 hover:text-white cursor-pointer"
      >
        <Home size={20} />
        <span className="text-[10px] font-bold">Home</span>
      </button>

      {/* TOMBOL PLUS (CREATE MOMENT) */}
      <button
        onClick={onCreatePost}
        className="w-11 h-11 bg-[#6936F2] hover:bg-[#522BC8] rounded-full flex items-center justify-center text-white shadow-lg cursor-pointer shrink-0 transition-transform active:scale-95"
      >
        <Plus size={22} />
      </button>

      {/* FIX: TOMBOL PROFILE INTERAKTIF MENUJU /me */}
      <button
        onClick={onProfile}
        className="flex-1 flex flex-col items-center gap-0.5 text-zinc-400 hover:text-white cursor-pointer"
      >
        <div className="w-6 h-6 rounded-full overflow-hidden relative border border-zinc-700">
          {avatarUrl ? (
            <Image
              // src={avatarUrl}
              src="/icons/icon-profile.svg"
              alt="profile"
              width={32}
              height={32}
              unoptimized
              className="absolute inset-0 w-6 h-6 object-cover"
            />
          ) : (
            <div className="w-full h-full bg-liniear-to-tr from-[#6936F2] to-[#AD3AE7]" />
          )}
        </div>
        <span className="text-[10px] font-bold">Profile</span>
      </button>
    </div>
  );
}
