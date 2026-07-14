"use client";

interface OwnerActionsProps {
  onEditProfile: () => void;
  isOwner?: boolean;
}

export default function OwnerActions({
  onEditProfile,
  isOwner = true,
}: OwnerActionsProps) {
  if (!isOwner) return null;
  return (
    <div className="flex items-center gap-3 w-full h-10">
      <button
        onClick={onEditProfile}
        className="flex-1 h-full border border-[#181D27] hover:bg-zinc-950 font-bold rounded-full text-sm text-[#FDFDFD] transition-colors flex items-center justify-center cursor-pointer"
      >
        Edit Profile
      </button>

      <button className="w-10 h-10 border border-[#181D27] hover:bg-zinc-950 rounded-full flex items-center justify-center cursor-pointer text-[#FDFDFD]">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="rotate-45"
        >
          <line x1="22" y1="2" x2="11" y2="13" />
          <polygon points="22 2 15 22 11 13 2 9 22 2" />
        </svg>
      </button>
    </div>
  );
}
