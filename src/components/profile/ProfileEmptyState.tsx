"use client";

interface ProfileEmptyStateProps {
  onCreatePost: () => void;
}

export default function ProfileEmptyState({
  onCreatePost,
}: ProfileEmptyStateProps) {
  return (
    <div className="w-full flex flex-col items-center text-center px-4 py-12 gap-6 animate-fade-in">
      <div className="flex flex-col gap-2">
        <h3 className="text-base font-bold text-white tracking-tight">
          Your story starts here
        </h3>

        <p className="text-sm text-[#A4A7AE] leading-relaxed max-w-[280px]">
          Share your first post and let the world see your moments, passions,
          and memories.
        </p>
      </div>

      <button
        onClick={onCreatePost}
        className="w-full max-w-[280px] h-11 bg-[#6936F2] hover:bg-[#522BC8] text-[#FDFDFD] font-bold rounded-full text-sm transition-all duration-200 shadow-lg cursor-pointer flex items-center justify-center"
      >
        Upload My First Post
      </button>
    </div>
  );
}
