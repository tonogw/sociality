"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Heart, MessageCircle } from "lucide-react";
import type { PostItem } from "@/types/post";
import TimelineCard from "@/components/shared/TimelineCard";

interface ProfileGalleryProps {
  posts: PostItem[];
  viewMode: "grid" | "list";
  username?: string;
  canDelete?: boolean;
}

export default function ProfileGallery({
  posts = [],
  viewMode,
  username,
  canDelete = false,
}: ProfileGalleryProps) {
  const router = useRouter();

  // Guard mutlak untuk memastikan aplikasi tidak crash jika data dari backend bermasalah/bukan array
  const safePosts = Array.isArray(posts) ? posts : [];

  if (viewMode === "list") {
    return (
      <div className="w-full flex flex-col gap-6 animate-fade-in">
        {safePosts.map((post) => (
          <TimelineCard
            key={post.id}
            post={post}
            currentUsername={username}
            canDelete={canDelete && post.author?.username === username}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="w-full grid grid-cols-3 gap-1 animate-fade-in">
      {safePosts.map((post) => (
        <button
          key={post.id}
          onClick={() => router.push(`/posts/${post.id}`)}
          type="button"
          className="relative w-full aspect-square bg-zinc-900 overflow-hidden group border border-[#181D27]/40 hover:border-zinc-700 transition-all text-left"
        >
          {post.imageUrl ? (
            <Image
              src={post.imageUrl}
              alt={post.caption || "Gallery Moment"}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              unoptimized
              sizes="(max-w: 361px) 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[10px] text-zinc-600 font-mono p-1 bg-zinc-950">
              No Image
            </div>
          )}

          {/* HOVER OVERLAY BALON INTERAKSI */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 text-white text-[10px] font-bold">
            <div className="flex items-center gap-1">
              <Heart size={12} className="fill-white" />
              <span>{post.likeCount ?? 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle size={12} className="fill-white" />
              {/* FIX TYPE ERROR: Hanya menggunakan commentCount sesuai spesifikasi PostItem */}
              <span>{post.commentCount ?? 0}</span>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
