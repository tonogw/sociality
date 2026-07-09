"use client";

interface OwnerActionProps {
  onEditClick: () => void;
  onCreatePostClick: () => void;
}

export default function OwnerAction({
  onEditClick,
  onCreatePostClick,
}: OwnerActionProps) {
  return (
    <div className="flex items-center gap-3 w-full h-10 font-sans">
      <button
        onClick={onEditClick}
        className="flex-1 h-full border border-[#181D27] bg-[#0A0D12] hover:bg-zinc-950 font-bold rounded-full text-sm text-[#FDFDFD] cursor-pointer flex items-center justify-center"
      >
        Edit Profile
      </button>
      <button
        onClick={onCreatePostClick}
        className="flex-1 h-full bg-[#6936F2] hover:bg-[#522BC8] font-bold rounded-full text-sm text-white cursor-pointer flex items-center justify-center transition-all active:scale-95"
      >
        Create Post
      </button>
    </div>
  );
}
