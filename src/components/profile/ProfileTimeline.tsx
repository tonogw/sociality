"use client";

import TimelineCard from "@/components/shared/TimelineCard";
import type { PostItem } from "@/types/post";

interface ProfileTimelineProps {
  posts: PostItem[];
  currentUsername?: string;
  canDelete?: boolean;
  isLoading?: boolean;
}

export default function ProfileTimeline({
  posts,
  currentUsername,
  canDelete,
  isLoading = false,
}: ProfileTimelineProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="w-full h-96 rounded-2xl bg-[#0A0D12] animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="flex justify-center items-center py-16 text-[#A4A7AE]">
        No posts available.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {posts.map((post) => (
        <TimelineCard
          key={post.id}
          post={post}
          canDelete={canDelete}
          currentUsername={currentUsername}
        />
      ))}
    </div>
  );
}
