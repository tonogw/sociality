"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Smile, Trash2, MessageCircle } from "lucide-react";
import Image from "next/image";

import {
  useComment,
  useCreateComment,
  useDeleteComment,
} from "@/queries/comments/useComments";
import { useMe } from "@/queries/me/useGetMe";
import { CommentItem } from "@/types/comment";

export default function PostCommentsPage() {
  const params = useParams();
  const router = useRouter();
  const postId = Number(params.id);

  const { data: me } = useMe();
  const [commentText, setCommentText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Fetch komentar (Limit 50 untuk menampung diskusi panjang sesuai spesifikasi)
  const { data: commentsResponse, isLoading } = useComment(postId, 1, 50);
  const createCommentMutation = useCreateComment();
  const deleteCommentMutation = useDeleteComment();

  // FIX: Mengakses data.items sesuai skema CommentResponse di types/comment.ts
  const comments = commentsResponse?.data?.items ?? [];

  // Daftar Emoji sesuai spesifikasi figma Anda
  const emojis = [
    "😀",
    "😅",
    "🥰",
    "😇",
    "🙂",
    "😋",
    "🤪",
    "🤐",
    "😏",
    "🤗",
    "😪",
    "🙄",
    "🤫",
    "😴",
    "🥵",
    "😫",
    "😭",
    "😱",
  ];

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    createCommentMutation.mutate(
      { postId, text: commentText },
      {
        onSuccess: () => {
          setCommentText("");
          setShowEmojiPicker(false);
        },
      },
    );
  };

  const handleSelectEmoji = (emoji: string) => {
    setCommentText((prev) => prev + emoji);
  };

  const handleDeleteComment = (commentId: number) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      deleteCommentMutation.mutate(commentId);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-screen bg-black flex flex-col items-center justify-center gap-2">
        <Loader2 className="animate-spin text-[#7F51F9]" size={32} />
        <span className="text-xs text-zinc-500 font-mono">
          Loading conversation...
        </span>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-black text-[#FDFDFD] font-sans flex flex-col items-center pt-6 pb-32">
      {/* CONTAINER UTAMA (Ukuran Maksimal Sesuai Figma 393px) */}
      <div className="w-full max-w-98.25 flex flex-col gap-4 px-4">
        {/* TOMBOL KEMBALI */}
        <div className="w-full flex justify-end">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 py-1 px-3 bg-[#0A0D12] border border-[#181D27] rounded-full text-xs font-semibold text-[#FDFDFD] cursor-pointer hover:bg-zinc-900 transition-colors"
          >
            <ArrowLeft size={14} />
            Back
          </button>
        </div>

        {/* SECTION UTAMA KOMENTAR */}
        <div className="w-full bg-[#0A0D12] border border-[#181D27] rounded-2xl flex flex-col p-4 gap-4 min-h-134.5 relative overflow-hidden">
          {/* Header Post Discussion */}
          <div className="w-full border-b border-[#181D27] pb-3">
            <h1 className="text-base font-bold text-[#FDFDFD] tracking-tight">
              Post Discussion
            </h1>
          </div>

          {/* LIST KOMENTAR */}
          <div className="flex-1 flex flex-col gap-4 overflow-y-auto max-h-90 pr-1 scrollbar-thin">
            {comments.length === 0 ? (
              /* KONDISI EMPTY STATE SESUAI FIGMA */
              <div className="w-full py-16 flex flex-col items-center justify-center text-center gap-1.5 animate-fade-in">
                <div className="w-12 h-12 rounded-full bg-zinc-900/50 flex items-center justify-center text-zinc-500 mb-2 border border-zinc-800">
                  <MessageCircle size={20} />
                </div>
                <h3 className="text-base font-bold text-[#FDFDFD]">
                  No Comments yet
                </h3>
                <p className="text-sm text-[#A4A7AE] font-normal">
                  Start the conversation
                </p>
              </div>
            ) : (
              /* LIST ARRAY KOMENTAR */
              comments.map((comment: CommentItem) => {
                // Verifikasi menggunakan isMine bawaan backend atau mencocokkan username
                const isCommentOwner =
                  comment.isMine ||
                  (me?.data.profile.username &&
                    comment.author?.username === me.data.profile.username);

                return (
                  <div
                    key={comment.id}
                    className="w-full flex flex-col gap-2.5 animate-fade-in"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        {/* Avatar */}
                        <div className="w-10 h-10 rounded-full bg-zinc-800 overflow-hidden relative shrink-0">
                          {comment.author?.avatarUrl ? (
                            <Image
                              src={comment.author.avatarUrl}
                              alt="Avatar"
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          ) : (
                            <div className="w-full h-full bg-linear-to-tr from-[#6936F2] to-[#AD3AE7] flex items-center justify-center text-xs font-bold text-white">
                              {comment.author?.name?.charAt(0).toUpperCase() ||
                                "U"}
                            </div>
                          )}
                        </div>
                        {/* Nama & Info Waktu */}
                        <div className="flex flex-col justify-center">
                          <span className="text-xs font-semibold text-[#FDFDFD]">
                            {comment.author?.username || "Username"}
                          </span>
                          <span className="text-[10px] text-[#A4A7AE] tracking-tight">
                            {comment.createdAt
                              ? new Date(comment.createdAt).toLocaleDateString(
                                  "id-ID",
                                )
                              : "1 Minutes Ago"}
                          </span>
                        </div>
                      </div>

                      {/* Tombol Hapus khusus pemilik komentar */}
                      {isCommentOwner && (
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="text-zinc-600 hover:text-red-400 p-1 transition-colors cursor-pointer"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>

                    {/* Konten Teks Komentar */}
                    <p className="text-xs text-[#FDFDFD] leading-relaxed wrap-break-words pl-1">
                      {comment.text}
                    </p>

                    <div className="w-full border-b border-[#181D27] pt-2" />
                  </div>
                );
              })
            )}
          </div>

          {/* AREA INPUT CHAT DAN EMOJI SESUAI FIGMA */}
          <div className="w-full flex flex-col gap-2 pt-2 relative">
            {/* POP-UP EMOJI SELECTOR */}
            {showEmojiPicker && (
              <div className="absolute bottom-14 left-0 z-50 bg-[#0A0D12] border border-[#181D27] rounded-xl p-3 w-52.5 h-38 shadow-2xl animate-fade-in">
                <div className="grid grid-cols-5 gap-2 max-h-30 overflow-y-auto">
                  {emojis.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => handleSelectEmoji(emoji)}
                      type="button"
                      className="text-xl hover:scale-125 transition-transform cursor-pointer"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <form
              onSubmit={handleSendComment}
              className="w-full flex items-center gap-2"
            >
              {/* Tombol Trigger Emoji */}
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className={`w-12 h-12 flex items-center justify-center border rounded-xl cursor-pointer transition-colors ${
                  showEmojiPicker
                    ? "bg-[#181D27] border-[#7F51F9]"
                    : "bg-[#0A0D12] border-[#181D27]"
                }`}
              >
                <Smile
                  size={20}
                  className={
                    showEmojiPicker ? "text-[#7F51F9]" : "text-[#FDFDFD]"
                  }
                />
              </button>

              {/* Input Teks & Tombol Kirim */}
              <div className="flex-1 h-12 bg-[#0A0D12] border border-[#181D27] rounded-xl flex items-center px-4 gap-2">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="flex-1 bg-transparent border-none text-sm text-[#FDFDFD] focus:outline-none placeholder-[#535862]"
                />

                <button
                  type="submit"
                  disabled={
                    !commentText.trim() || createCommentMutation.isPending
                  }
                  className={`text-sm font-bold tracking-tight cursor-pointer transition-colors ${
                    commentText.trim()
                      ? "text-[#7F51F9] hover:text-[#6936F2]"
                      : "text-[#535862]"
                  }`}
                >
                  {createCommentMutation.isPending ? "Posting..." : "Post"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
