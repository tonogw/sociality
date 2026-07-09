"use client";

import { Grid, Bookmark } from "lucide-react";

interface ProfileTabsProps {
  activeTab: "posts" | "saved";
  setActiveTab: (tab: "posts" | "saved") => void;
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
  isOwnProfile: boolean;
}

export default function ProfileTabs({
  activeTab,
  setActiveTab,
  viewMode,
  setViewMode,
  isOwnProfile,
}: ProfileTabsProps) {
  return (
    <div className="w-full flex border-b border-[#181D27] h-12 mt-2 font-sans">
      <button
        onClick={() =>
          activeTab === "posts"
            ? setViewMode(viewMode === "grid" ? "list" : "grid")
            : setActiveTab("posts")
        }
        className={`flex-1 h-full flex items-center justify-center gap-2 font-bold text-sm border-b-2 transition-all cursor-pointer ${activeTab === "posts" ? "border-white text-white" : "border-transparent text-zinc-500"}`}
      >
        <Grid
          size={18}
          className={
            viewMode === "list" && activeTab === "posts" ? "text-[#6936F2]" : ""
          }
        />
        <span>Gallery</span>
      </button>
      {isOwnProfile && (
        <button
          onClick={() => setActiveTab("saved")}
          className={`flex-1 h-full flex items-center justify-center gap-2 font-bold text-sm border-b-2 transition-all cursor-pointer ${activeTab === "saved" ? "border-white text-white" : "border-transparent text-zinc-500"}`}
        >
          <Bookmark size={18} />
          <span>Saved</span>
        </button>
      )}
    </div>
  );
}
