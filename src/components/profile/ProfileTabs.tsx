"use client";

import { Grid, Bookmark } from "lucide-react";

interface ProfileTabsProps {
  activeTab: "posts" | "saved";
  viewMode: "grid" | "list";

  onPostsClick: () => void;
  onSavedClick: () => void;
}

export default function ProfileTabs({
  activeTab,
  viewMode,
  onPostsClick,
  onSavedClick,
}: ProfileTabsProps) {
  return (
    <div className="w-full h-12 flex border-b border-[#181D27]">
      <button
        onClick={onPostsClick}
        className={`flex-1 h-full flex items-center justify-center gap-2 font-bold text-sm border-b-2 transition-all ${
          activeTab === "posts"
            ? "border-[#FDFDFD] text-[#FDFDFD]"
            : "border-transparent text-[#A4A7AE]"
        }`}
      >
        <Grid
          size={20}
          className={viewMode === "list" ? "text-[#6936F2]" : ""}
        />

        <span>Gallery {viewMode === "list" ? "(Feed)" : "(Grid)"}</span>
      </button>

      <button
        onClick={onSavedClick}
        className={`flex-1 h-full flex items-center justify-center gap-2 font-bold text-sm border-b-2 transition-all ${
          activeTab === "saved"
            ? "border-[#FDFDFD] text-[#FDFDFD]"
            : "border-transparent text-[#A4A7AE]"
        }`}
      >
        <Bookmark size={20} />

        <span>Saved</span>
      </button>
    </div>
  );
}
