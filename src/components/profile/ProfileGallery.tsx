"use client";

import Image from "next/image";
import TimelineCard from "@/components/shared/TimelineCard";

interface Post {
  id: number;
  imageUrl: string;
  caption?: string;
  createdAt: string;
  author?: {
    id: number;
    username: string;
    name: string;
    avatarUrl: string | null;
  };
}

interface Props {
  posts: Post[];
  viewMode: "grid" | "list";
  username?: string;
}

export default function ProfileGallery({ posts, viewMode, username }: Props) {
  if (viewMode === "grid") {
    return (
      <div className="grid grid-cols-3 gap-1 w-full">
        {posts.map((post) => (
          <div
            key={post.id}
            className="w-full aspect-square bg-zinc-900 border border-[#181D27] rounded-sm overflow-hidden relative"
          >
            <Image
              src={post.imageUrl || "/placeholder.png"}
              alt="Post"
              fill
              className="object-cover"
              unoptimized
              sizes="120px"
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full items-center">
      {posts.map((post) => (
        <TimelineCard key={post.id} post={post} currentUsername={username} />
      ))}
    </div>
  );
}
