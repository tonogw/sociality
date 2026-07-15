"use client";

import { useState } from "react";
import { Heart, MessageSquare, Send, Bookmark, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import type { PostItem } from "@/types/post";
import { useRouter } from "next/navigation";
import Image from "next/image";

// Import kueri mutasi interaktif dari pustaka kueri Anda
import { useLikePost } from "@/queries/posts/useLikePost";
import { useUnlikePost } from "@/queries/posts/useUnlikePost";
import { useSavePost } from "@/queries/posts/useSavePost";
import { useUnsavePost } from "@/queries/posts/useUnsavePost";
import { useDeletePost } from "@/queries/posts/useDeletePost";

interface TimelineCardProps {
  post: PostItem;
  canDelete?: boolean;
  currentUsername?: string;
}

export default function TimelineCard({
  post,
  canDelete,
  currentUsername,
}: TimelineCardProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [isLiked, setIsLiked] = useState(post.likedByMe ?? false);
  const [likesCount, setLikesCount] = useState(post.likeCount ?? 0);
  const [isSaved, setIsSaved] = useState(post.savedByMe ?? false);
  const [isExpanded, setIsExpanded] = useState(false);

  const isLongCaption = post.caption && post.caption.length > 90;

  // React Query Mutations
  const likeMutation = useLikePost();
  const unlikeMutation = useUnlikePost();
  const saveMutation = useSavePost();
  const unsaveMutation = useUnsavePost();
  const deleteMutation = useDeletePost();

  const handleDeleteTrigger = () => {
    if (
      window.confirm("Are you sure you want to delete this post permanently?")
    ) {
      deleteMutation.mutate(post.id);
    }
  };

  const handleBookmarkToggle = () => {
    if (isSaved) {
      unsaveMutation.mutate(post.id, {
        onSuccess: async () => {
          setIsSaved(false);
          toast.success("Removed from saved posts");
          await queryClient.invalidateQueries({ queryKey: ["my-profile"] });
          await queryClient.invalidateQueries({ queryKey: ["my-feed"] });
        },
      });
    } else {
      saveMutation.mutate(post.id, {
        onSuccess: async () => {
          setIsSaved(true);
          toast.success("Post saved successfully!");
          await queryClient.invalidateQueries({ queryKey: ["my-profile"] });
          await queryClient.invalidateQueries({ queryKey: ["my-feed"] });
        },
      });
    }
  };

  return (
    <div
      id={`post-${post.id}`}
      className="w-full max-w-90. lg:max-w-150 bg-[#0A0D12]/20 border-b border-[#181D27] pb-6 flex flex-col gap-3 font-sans animate-fade-in mx-auto"
    >
      {/* 1. TOP BAR: AUTHOR PROFILE INFORMATION */}
      <div className="w-full flex items-center justify-between px-1">
        <button
          onClick={() =>
            router.push(`/${post.author?.username || ""}?postId=${post.id}`)
          }
          className="flex items-center gap-2.5 group cursor-pointer text-left"
        >
          <div className="w-9 h-9 rounded-full bg-zinc-800 overflow-hidden flex items-center justify-center relative shrink-0">
            {post.author?.avatarUrl ? (
              <Image
                src={post.author.avatarUrl}
                alt="Author avatar"
                width={36}
                height={36}
                unoptimized
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-linear-to-tr from-[#6936F2] to-[#AD3AE7] flex items-center justify-center text-xs font-bold text-white">
                {post.author?.name?.charAt(0).toUpperCase() || "U"}
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-[#FDFDFD] group-hover:text-[#7F51F9] transition-colors tracking-tight">
              {post.author?.username || "Username"}
            </span>
            <span className="text-[10px] text-zinc-500 font-mono">
              {post.createdAt
                ? new Date(post.createdAt).toLocaleDateString("id-ID")
                : "1 Minutes Ago"}
            </span>
          </div>
        </button>

        {/* Tombol Hapus Kiriman Pribadi */}
        {(canDelete || post.author?.username === currentUsername) && (
          <button
            onClick={handleDeleteTrigger}
            className="text-zinc-600 hover:text-red-400 p-1 transition-colors cursor-pointer"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>

      {/* 2. IMAGE CONTENT AREA */}
      <div
        onClick={() =>
          router.push(`/${post.author?.username || ""}?postId=${post.id}`)
        }
        className="w-full aspect-square relative bg-zinc-950 rounded-2xl overflow-hidden border border-[#181D27] cursor-pointer hover:opacity-95 transition-opacity"
      >
        <Image
          src={post.imageUrl || "/placeholder.png"}
          alt="Post media display"
          width={361}
          height={361}
          unoptimized
          className="w-full h-full object-cover"
        />
      </div>

      {/* 3. INTERACTIVE ACTIONS FRAME PANEL */}
      <div className="flex flex-row justify-between items-center w-full h-7 px-1">
        <div className="flex flex-row items-center gap-4">
          {/* Likes */}
          <button
            onClick={() => {
              if (isLiked) {
                unlikeMutation.mutate(post.id, {
                  onSuccess: () => {
                    setIsLiked(false);
                    setLikesCount((prev) => prev - 1);
                  },
                });
              } else {
                likeMutation.mutate(post.id, {
                  onSuccess: () => {
                    setIsLiked(true);
                    setLikesCount((prev) => prev + 1);
                  },
                });
              }
            }}
            className="flex flex-row items-center gap-1.5 cursor-pointer text-white transition-transform active:scale-90"
          >
            <Heart
              size={20}
              className={`transition-colors ${isLiked ? "fill-red-500 stroke-red-500 text-red-500" : "text-[#FDFDFD]"}`}
              strokeWidth={1.5}
            />
            <span className="text-xs font-semibold text-[#FDFDFD]">
              {likesCount}
            </span>
          </button>

          {/* Comments */}
          <button
            onClick={() => router.push(`/posts/${post.id}/comments`)}
            className="flex flex-row items-center gap-1.5 cursor-pointer text-white hover:text-zinc-300"
          >
            <MessageSquare
              size={20}
              className="text-[#FDFDFD]"
              strokeWidth={1.5}
            />
            <span className="text-xs font-semibold text-[#FDFDFD]">
              {post.commentCount ?? 0}
            </span>
          </button>

          {/* Share */}
          <button
            onClick={() => {
              if (typeof window !== "undefined") {
                navigator.clipboard.writeText(
                  `${window.location.origin}/${post.author?.username || ""}?postId=${post.id}`,
                );
                toast.success("Link copied to clipboard");
              }
            }}
            className="flex flex-row items-center gap-1.5 cursor-pointer text-white hover:text-zinc-300"
          >
            <Send
              size={18}
              className="text-[#FDFDFD] -rotate-12"
              strokeWidth={1.5}
            />
          </button>
        </div>

        {/* Tombol Bookmark Kanan */}
        <button
          onClick={handleBookmarkToggle}
          className="w-6 h-6 flex items-center justify-center cursor-pointer text-white transition-transform active:scale-95"
        >
          <Bookmark
            size={20}
            className={`transition-colors ${isSaved ? "fill-[#7F51F9] stroke-[#7F51F9] text-[#7F51F9]" : "text-[#FDFDFD]"}`}
            strokeWidth={1.5}
          />
        </button>
      </div>

      {/* 4. CAPTION TEXT AREA */}
      <div className="w-full flex flex-col items-start px-1">
        <span className="text-sm font-bold text-[#FDFDFD] tracking-tight">
          {post.author?.username || "username"}
        </span>

        <div className="w-full flex flex-col items-start mt-1">
          <p
            className={`text-sm text-zinc-300 tracking-tight leading-relaxed wrap-break-words whitespace-pre-wrap transition-all ${
              !isExpanded && isLongCaption
                ? "line-clamp-2 overflow-hidden"
                : "h-auto"
            }`}
          >
            {post.caption}
          </p>

          {isLongCaption && (
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs font-bold text-[#7F51F9] hover:text-[#6936F2] transition-colors cursor-pointer mt-1"
            >
              {isExpanded ? "Show Less" : "Show More"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
