"use client";

import { useEffect, useState, Suspense } from "react";
import {
  Loader2,
  Image as ImageIcon,
  Heart,
  MessageCircle,
  Grid,
  List,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { PostItem } from "@/types/post";

// Import reusable components & hooks
import TimelineCard from "@/components/shared/TimelineCard";
import { useMe } from "@/queries/me/useGetMe";

function FeedContent() {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const router = useRouter();

  // Ambil profil user login aktif untuk mengidentifikasi kepemilikan postingan (canDelete)
  const { data: me } = useMe();

  // State untuk menampung seluruh daftar postingan
  const [postsList, setPostsList] = useState<PostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // SWITCHER LAYOUT STATE: "list" atau "grid"
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  // === STRATEGI INFINITE SCROLL STATE ===
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  // 1. FETCH DATA DENGAN SISTEM PAGINASI DINAMIS
  useEffect(() => {
    if (!baseUrl) return;

    const fetchTimelineFeed = async () => {
      try {
        if (page === 1) {
          setLoading(true);
        } else {
          setIsFetchingMore(true);
        }
        setError(null);
        const token = localStorage.getItem("token") || "";

        const res = await fetch(`${baseUrl}/posts?page=${page}&limit=20`, {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Gagal memuat feed global");
        const json = await res.json();

        if (json?.success && json?.data?.posts) {
          const newPosts = json.data.posts;
          setPostsList((prev) =>
            page === 1 ? newPosts : [...prev, ...newPosts],
          );

          const pagination = json?.data?.pagination;
          if (pagination) {
            setHasMore(page < (pagination.totalPages || 10));
          } else {
            setHasMore(newPosts.length === 20);
          }
        } else {
          setHasMore(false);
        }
      } catch (err) {
        console.error(err);
        setError(
          err instanceof Error ? err.message : "Terjadi kesalahan sistem",
        );
      } finally {
        setLoading(false);
        setIsFetchingMore(false);
      }
    };

    fetchTimelineFeed();
  }, [baseUrl, page]);

  // 2. DETEKSI SCROLL UNTUK MEMICU LOAD MORE
  useEffect(() => {
    const handleScroll = () => {
      if (loading || isFetchingMore || !hasMore) return;

      const threshold = 150;
      const windowHeight = window.innerHeight;
      const scrollY = window.scrollY;
      const documentHeight = document.documentElement.scrollHeight;

      if (windowHeight + scrollY >= documentHeight - threshold) {
        setPage((prevPage) => prevPage + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, isFetchingMore, hasMore]);

  if (loading && page === 1) {
    return (
      <div className="w-full h-[70vh] flex flex-col items-center justify-center gap-2">
        <Loader2 className="animate-spin text-[#6936F2]" size={32} />
        <p className="text-xs text-zinc-500 font-mono">
          Memuat postingan global...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-black text-white px-4 pt-20 pb-28 flex flex-col items-center font-sans">
      <div className="w-full max-w-90.25 lg:max-w-150 flex flex-col gap-4">
        {/* HEADER BRAND & LAYOUT SWITCHER */}
        <div className="w-full border-b border-[#181D27] pb-3 mb-2 flex items-center justify-between">
          <h1 className="text-xl font-black tracking-tight bg-linear-to-r from-[#6936F2] to-[#AD3AE7] bg-clip-text text-transparent">
            Sociality Feed
          </h1>

          <div className="flex items-center gap-1 bg-[#0A0D12] border border-[#181D27] p-1 rounded-full">
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-full cursor-pointer transition-colors ${viewMode === "list" ? "bg-[#6936F2] text-white" : "text-zinc-500"}`}
              title="Mode List Timeline"
            >
              <List size={16} />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-full cursor-pointer transition-colors ${viewMode === "grid" ? "bg-[#6936F2] text-white" : "text-zinc-500"}`}
              title="Mode 9-Grid Box"
            >
              <Grid size={16} />
            </button>
          </div>
        </div>

        {error && (
          <p className="text-xs text-red-400 text-center py-4 bg-red-950/20 rounded-xl border border-red-900/30">
            Error: {error}
          </p>
        )}

        {/* KEADAAN DATA KOSONG */}
        {postsList.length === 0 && !error && (
          <div className="w-full py-12 flex flex-col items-center justify-center text-center px-4 border border-dashed border-zinc-800 rounded-3xl bg-[#0A0D12]/20 mt-4">
            <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-500 mb-3 border border-zinc-800">
              <ImageIcon size={20} />
            </div>
            <h3 className="text-sm font-bold text-[#FDFDFD]">
              Belum Ada Postingan
            </h3>
            <p className="text-xs text-[#A4A7AE] mt-1 max-w-60">
              Gunakan pintasan upload di halaman profil untuk mengunggah gambar
              pertama Anda!
            </p>
          </div>
        )}

        {/* RENDERING DENGAN LAYOUT DINAMIS */}
        {postsList.length > 0 && (
          <>
            {viewMode === "list" ? (
              // OPTION A: REUSE TIMELINE CARD FIGMA PRECISION
              <div className="flex flex-col gap-6 w-full animate-fade-in">
                {postsList.map((post, index) => (
                  <TimelineCard
                    key={`${post.id}-${index}`}
                    post={post}
                    currentUsername={me?.data?.profile.username}
                    canDelete={
                      post.author?.username === me?.data?.profile.username
                    }
                  />
                ))}
              </div>
            ) : (
              // OPTION B: MODE 9 KOTAK GRID IMAGE EXPLORE STYLE
              <div className="grid grid-cols-3 gap-[1.78px] w-full animate-fade-in mt-2">
                {postsList.map((post, index) => (
                  <div
                    key={`${post.id}-grid-${index}`}
                    onClick={() =>
                      router.push(
                        `/${post.author?.username || ""}?postId=${post.id} }`,
                      )
                    }
                    className="w-full aspect-square bg-zinc-900 rounded-[2.66px] overflow-hidden relative border border-[#181D27]/40 group cursor-pointer"
                  >
                    {post.imageUrl ? (
                      <Image
                        src={post.imageUrl}
                        alt="Grid asset"
                        fill
                        sizes="361px"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] text-zinc-600">
                        No Image
                      </div>
                    )}

                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 text-xs font-bold text-white">
                      <div className="flex items-center gap-1">
                        <Heart size={12} fill="currentColor" />
                        <span>{post.likeCount}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle size={12} fill="currentColor" />
                        <span>{post.commentCount}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* === INDIKATOR LOADER INFINITE SCROLL === */}
        {isFetchingMore && (
          <div className="w-full py-6 flex flex-col items-center justify-center gap-2 border-t border-zinc-900/50 mt-4">
            <Loader2 className="animate-spin text-[#6936F2]" size={20} />
            <p className="text-[10px] text-zinc-500 font-mono tracking-wider">
              Memuat postingan lainnya...
            </p>
          </div>
        )}

        {/* PESAN JIKA DATA DI BACKEND SUDAH HABIS TOTAL */}
        {!hasMore && postsList.length > 0 && (
          <div className="w-full py-8 text-center border-t border-zinc-900/50 mt-4">
            <p className="text-[10px] text-zinc-600 font-mono">
              ~ Kamu telah melihat semua postingan global ({postsList.length}{" "}
              posts) ~
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function FeedPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full h-screen bg-black flex items-center justify-center">
          <Loader2 className="animate-spin text-[#6936F2]" size={32} />
        </div>
      }
    >
      <FeedContent />
    </Suspense>
  );
}
