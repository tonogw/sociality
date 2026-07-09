"use client";

import Image from "next/image";
import TimelineCard from "@/components/shared/TimelineCard";

interface ProfileGalleryProps {
  posts: any[];
  viewMode: "grid" | "list";
  activeTab: "posts" | "saved";
  username?: string;
}

export default function ProfileGallery({
  posts,
  viewMode,
  activeTab,
  username,
}: ProfileGalleryProps) {
  if (!posts || posts.length === 0) {
    return (
      <div className="w-full text-center py-12 text-zinc-500 text-sm">
        No items available.
      </div>
    );
  }

  return (
    <div className="w-full h-auto mt-2">
      {viewMode === "grid" || activeTab === "saved" ? (
        <div className="grid grid-cols-3 gap-1 w-full animate-fade-in">
          {posts.map((post) => (
            <div
              key={post.id}
              className="w-full aspect-square bg-zinc-900 border border-[#181D27] relative overflow-hidden"
            >
              <Image
                src={post.imageUrl}
                alt="Grid post"
                fill
                className="object-cover"
                unoptimized
                sizes="120px"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-6 w-full items-center">
          {posts.map((post) => (
            <TimelineCard
              key={post.id}
              post={post}
              currentUsername={username}
            />
          ))}
        </div>
      )}
    </div>
  );
}
