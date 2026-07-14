"use client";

import { Send, UserPlus, UserCheck } from "lucide-react";

interface VisitorActionProps {
  isFollowing: boolean;
  onFollowToggle: () => void;
}

export default function VisitorAction({
  isFollowing,
  onFollowToggle,
}: VisitorActionProps) {
  return (
    <div className="flex items-center gap-3 w-full h-10 font-sans">
      {/* TOMBOL FOLLOW: 
        Menyala warna biru terang (#0070f3) jika isFollowing = false,
        Berwarna gelap jika isFollowing = true (sudah diikuti).
      */}
      <button
        onClick={onFollowToggle}
        className={`flex-1 h-full font-bold rounded-full text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
          isFollowing
            ? "border border-[#181D27] bg-[#0A0D12] text-[#A4A7AE] hover:bg-zinc-900"
            : "bg-[#0070f3] text-white hover:bg-[#0060df] shadow-md"
        }`}
      >
        {isFollowing ? (
          <>
            <UserCheck size={16} />
            <span>Following</span>
          </>
        ) : (
          <>
            <UserPlus size={16} />
            <span>Follow</span>
          </>
        )}
      </button>

      <button className="w-12 h-full border border-[#181D27] bg-[#0A0D12] rounded-full flex items-center justify-center cursor-pointer hover:bg-zinc-950 text-white">
        <Send size={16} className="rotate-[-15deg]" />
      </button>
    </div>
  );
}
