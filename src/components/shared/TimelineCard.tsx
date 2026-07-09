"use client";

import { useState } from "react";
import Image from "next/image";
import { Heart, MessageSquare, Send, Bookmark, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { TimelineCardProps } from "@/types/post";

// interface TimelineCardProps {
//   post: {
//     id: number;
//     imageUrl: string;
//     caption?: string;
//     createdAt: string;
//     author?: {
//       id: number;
//       username: string;
//       name: string;
//       avatarUrl: string | null;
//     };
//     likeCount?: number;
//     commentCount?: number;
//     likedByMe?: boolean;
//     savedByMe?: boolean; // Mengantisipasi skema bookmark masa depan
//   };
//   currentUsername?: string; // Untuk pengecekan hak akses tombol hapus data post sendiri
// }

export default function TimelineCard({
  post,
  currentUsername,
}: TimelineCardProps) {
  const queryClient = useQueryClient();
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  // State untuk interaksi instan (Optimistic UI state)
  const [isLiked, setIsLiked] = useState(post.likedByMe ?? false);
  const [likesCount, setLikesCount] = useState(post.likeCount ?? 0);
  const [isSaved, setIsSaved] = useState(post.savedByMe ?? false);

  // State ekspansi caption sesuai spesifikasi css figma ("Show More")
  const [isExpanded, setIsExpanded] = useState(false);

  // Batasan karakter untuk mengaktifkan tombol 'See More'
  const isLongCaption = post.caption && post.caption.length > 90;

  // 1. MUTASI INTERAKSI API
  const handleInteraction = async (
    endpoint: string,
    method: "POST" | "DELETE",
  ) => {
    const token = localStorage.getItem("token") || "";
    const res = await fetch(`${baseUrl}${endpoint}`, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        accept: "application/json",
      },
    });
    if (!res.ok) throw new Error("Gagal memproses aksi");
    return res.json();
  };

  // Mutasi Like Post
  const likeMutation = useMutation({
    mutationFn: () =>
      handleInteraction(`/posts/${post.id}/like`, isLiked ? "DELETE" : "POST"),
    onMutate: () => {
      // Optimistic UI update agar animasi pergantian warna instan tanpa nunggu server
      setIsLiked(!isLiked);
      setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));
    },
    onError: () => {
      // Rollback jika server error
      setIsLiked(isLiked);
      setLikesCount(post.likeCount ?? 0);
      toast.error("Gagal menyukai postingan");
    },
  });

  // Mutasi Save / Bookmark Post
  const saveMutation = useMutation({
    mutationFn: () =>
      handleInteraction(`/posts/${post.id}/save`, isSaved ? "DELETE" : "POST"),
    onMutate: () => {
      setIsSaved(!isSaved);
    },
    onSuccess: () => {
      toast.success(isSaved ? "Saved to bookmarks" : "Removed from bookmarks");
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
    },
    onError: () => {
      setIsSaved(isSaved);
      toast.error("Gagal menyimpan postingan");
    },
  });

  // Mutasi Hapus Post Timeline
  const deleteMutation = useMutation({
    mutationFn: () => handleInteraction(`/posts/${post.id}`, "DELETE"),
    onSuccess: () => {
      toast.success("Post deleted successfully", {
        style: {
          background: "#D92D20",
          color: "#FFFFFF",
          borderRadius: "8px",
          border: "none",
        },
      });
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      queryClient.invalidateQueries({ queryKey: ["user-my-feed"] });
    },
    onError: () => toast.error("Failed to delete post"),
  });

  const handleDeleteTrigger = () => {
    if (window.confirm("Are you sure want to delete permanently?")) {
      deleteMutation.mutate();
    }
  };

  return (
    <div className="w-full max-w-[361px] bg-[#0A0D12] border border-[#181D27] rounded-2xl overflow-hidden flex flex-col gap-3 font-sans animate-fade-in mx-auto">
      {/* 1. TOP BAR POST: AVATAR & USERNAME */}
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-zinc-800 border border-[#181D27] overflow-hidden flex items-center justify-center relative shrink-0">
            {post.author?.avatarUrl ? (
              <Image
                src={post.author.avatarUrl}
                alt="Author avatar"
                fill
                className="object-cover"
                unoptimized
                sizes="32px"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-tr from-[#6936F2] to-[#AD3AE7] flex items-center justify-center text-[10px] font-bold text-white">
                {post.author?.name?.charAt(0).toUpperCase() || "U"}
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-[#FDFDFD] tracking-tight">
              {post.author?.name || "User"}
            </span>
            <span className="text-[10px] text-zinc-500 font-mono">
              {post.createdAt
                ? new Date(post.createdAt).toLocaleDateString("id-ID")
                : "Just Now"}
            </span>
          </div>
        </div>

        {/* Akses hapus khusus jika ini postingan milik Bapak sendiri */}
        {post.author?.username === currentUsername && (
          <button
            onClick={handleDeleteTrigger}
            className="text-zinc-600 hover:text-red-400 p-1 transition-colors cursor-pointer"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>

      {/* 2. IMAGE POST AREA (Square 1:1 Instagram Look) */}
      <div className="w-full aspect-square relative bg-black rounded-xl overflow-hidden border border-[#181D27]/50">
        <Image
          src={post.imageUrl || "/placeholder.png"}
          alt="Post media display"
          fill
          className="object-cover"
          unoptimized
          sizes="361px"
          priority
        />
      </div>

      {/* 3. INTERACTIVE INTERFACE FRAME (Ekstraksi Frame 2 CSS Figma Bapak) */}
      <div className="flex flex-row justify-between items-center w-full h-7 mt-0.5">
        {/* Kontainer Tombol Actions Kiri */}
        <div className="flex flex-row items-center gap-4 h-7">
          {/* Tombol Likes */}
          <button
            onClick={() => likeMutation.mutate()}
            className="flex flex-row items-center gap-1.5 h-7 cursor-pointer text-white transition-transform active:scale-90"
          >
            <Heart
              size={20}
              className={`transition-colors ${isLiked ? "fill-red-500 stroke-red-500" : "text-[#FDFDFD]"}`}
              strokeWidth={1.5}
            />
            <span className="text-sm font-medium tracking-tight font-sans text-[#FDFDFD]">
              {likesCount}
            </span>
          </button>

          {/* Tombol Comments */}
          <button
            onClick={() => toast.info("Opening comment section...")}
            className="flex flex-row items-center gap-1.5 h-7 cursor-pointer text-white hover:text-zinc-300"
          >
            <MessageSquare
              size={20}
              className="text-[#FDFDFD]"
              strokeWidth={1.5}
            />
            <span className="text-sm font-medium tracking-tight font-sans text-[#FDFDFD]">
              {post.commentCount ?? 0}
            </span>
          </button>

          {/* Tombol Share */}
          <button
            onClick={() => {
              navigator.clipboard.writeText(
                `${window.location.origin}/post/${post.id}`,
              );
              toast.success("Link copied to clipboard");
            }}
            className="flex flex-row items-center gap-1.5 h-7 cursor-pointer text-white hover:text-zinc-300"
          >
            <Send
              size={18}
              className="text-[#FDFDFD] rotate-[-15px]"
              strokeWidth={1.5}
            />
            <span className="text-sm font-medium tracking-tight font-sans text-[#FDFDFD]">
              0
            </span>
          </button>
        </div>

        {/* Tombol Save / Bookmark Kanan */}
        <button
          onClick={() => saveMutation.mutate()}
          className="w-6 h-6 flex items-center justify-center cursor-pointer text-white transition-transform active:scale-95"
        >
          <Bookmark
            size={20}
            className={`transition-colors ${isSaved ? "fill-[#7F51F9] text-[#7F51F9]" : "text-[#FDFDFD]"}`}
            strokeWidth={1.5}
          />
        </button>
      </div>

      {/* 4. CAPTION TEXT AREA (Ekstraksi CSS Post Content Auto Layout Figma Bapak) */}
      <div className="w-full h-auto flex flex-col items-start p-0 mt-1">
        {/* Post Username */}
        <span className="w-full h-7 text-sm font-bold text-[#FDFDFD] tracking-tight leading-7 font-sans">
          @{post.author?.username || "username"}
        </span>

        {/* Post Text & Show More Controller */}
        <div className="w-full flex flex-col items-start gap-0.5">
          <p
            className={`w-full text-sm font-normal text-[#FDFDFD] tracking-tight leading-7 font-sans wrap-break-word whitespace-pre-wrap transition-all ${
              !isExpanded && isLongCaption
                ? "line-clamp-2 overflow-hidden max-h-14"
                : "h-auto"
            }`}
          >
            {post.caption || "No description provided."}
          </p>

          {/* Tombol See More / Show Less */}
          {isLongCaption && (
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full h-7 text-sm font-bold text-[#7F51F9] tracking-tight leading-7 text-left cursor-pointer hover:text-[#6936F2] transition-colors font-sans mt-0.5"
            >
              {isExpanded ? "Show Less" : "See More"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
