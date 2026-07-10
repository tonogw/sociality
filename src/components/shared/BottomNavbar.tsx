"use client";

import Image from "next/image";
import { Home, Plus } from "lucide-react";

interface BottomNavbarProps {
  onHome: () => void;
  onCreatePost: () => void;
}

export default function BottomNavbar({
  onHome,
  onCreatePost,
}: BottomNavbarProps) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-86.25 h-16 bg-[#0A0D12]/90 border border-[#181D27] backdrop-blur-[50px] rounded-full flex items-center justify-center gap-4 px-6 z-20 shadow-xl">
      <button
        onClick={onHome}
        className="flex-1 flex flex-col items-center gap-0.5 text-zinc-400 hover:text-white cursor-pointer"
      >
        <Home size={20} />
        <span className="text-[10px] font-bold">Home</span>
      </button>

      <button
        onClick={onCreatePost}
        className="w-11 h-11 bg-[#6936F2] hover:bg-[#522BC8] rounded-full flex items-center justify-center text-white shadow-lg cursor-pointer shrink-0 transition-transform active:scale-95"
      >
        <Plus size={22} />
      </button>

      <button className="flex-1 flex flex-col items-center gap-0.5 text-[#7F51F9] cursor-default">
        <Image
          src="/icons/icon-profile.svg"
          alt="profile"
          width={24}
          height={24}
          unoptimized
          className="w-6 h-6"
        />

        <span className="text-[10px] font-bold">Profile</span>
      </button>
    </div>
  );
}
