"use client";

import { Grid, Bookmark, Heart } from "lucide-react";

interface ProfileTabsProps {
  activeTab: "posts" | "saved" | "likes";
  viewMode: "grid" | "list";
  onPostsClick: () => void;
  onSavedClick?: () => void;
  onLikesClick: () => void;
}

export default function ProfileTabs({
  activeTab,
  viewMode,
  onPostsClick,
  onSavedClick,
  onLikesClick,
}: ProfileTabsProps) {
  return (
    <div className="w-full h-12 flex border-b border-[#181D27] select-none">
      {/* 1. GALLERY TAB */}
      <button
        onClick={onPostsClick}
        className={`flex-1 h-full flex items-center justify-center gap-2 font-bold text-xs border-b-2 transition-all cursor-pointer ${
          activeTab === "posts"
            ? "border-[#FDFDFD] text-[#FDFDFD]"
            : "border-transparent text-[#A4A7AE]"
        }`}
      >
        <Grid
          size={16}
          className={
            viewMode === "list" && activeTab === "posts" ? "text-[#6936F2]" : ""
          }
        />
        <span>
          Gallery{" "}
          {viewMode === "list" && activeTab === "posts" ? "(Feed)" : "(Grid)"}
        </span>
      </button>

      {/* 2. SAVED TAB */}
      {onSavedClick && (
        <button
          onClick={onSavedClick}
          className={`flex-1 h-full flex items-center justify-center gap-2 font-bold text-xs border-b-2 transition-all cursor-pointer ${
            activeTab === "saved"
              ? "border-[#FDFDFD] text-[#FDFDFD]"
              : "border-transparent text-[#A4A7AE]"
          }`}
        >
          <Bookmark size={16} />
          <span>Saved</span>
        </button>
      )}

      {/* 3. LIKES TAB */}
      <button
        onClick={onLikesClick}
        className={`flex-1 h-full flex items-center justify-center gap-2 font-bold text-xs border-b-2 transition-all cursor-pointer ${
          activeTab === "likes"
            ? "border-[#FDFDFD] text-[#FDFDFD]"
            : "border-transparent text-[#A4A7AE]"
        }`}
      >
        <Heart
          size={16}
          className={activeTab === "likes" ? "fill-red-500 text-red-500" : ""}
        />
        <span>Likes</span>
      </button>
    </div>
  );
}
