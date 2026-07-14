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

function FeedContent() {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const router = useRouter();

  // State utama untuk menampung seluruh daftar postingan
  const [postsList, setPostsList] = useState<PostItem[]>([]);
  const [loading, setLoading] = useState(true); // Loader layar penuh (hanya untuk page 1)
  const [error, setError] = useState<string | null>(null);

  // SWITCHER LAYOUT STATE: "list" atau "grid"
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  // === STRATEGI INFINITE SCROLL STATE ===
  const [page, setPage] = useState(1); // Melacak halaman aktif saat ini
  const [hasMore, setHasMore] = useState(true); // Menandai jika masih ada halaman tersisa di backend
  const [isFetchingMore, setIsFetchingMore] = useState(false); // Mencegah duplikasi tembakan API saat scroll

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

        // Mengambil data secara dinamis berdasarkan parameter page aktif
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

          // JIKA page = 1: Isi ulang state (reset)
          // JIKA page > 1: Gabungkan post lama dengan post baru yang baru saja di-fetch (append)
          setPostsList((prev) =>
            page === 1 ? newPosts : [...prev, ...newPosts],
          );

          // Ambil metadata pagination dari API response untuk menentukan status hasMore
          const pagination = json?.data?.pagination;
          if (pagination) {
            // Jika halaman saat ini kurang dari totalPages, berarti masih ada data
            setHasMore(page < (pagination.totalPages || 10));
          } else {
            // Fallback: Jika limit=20 dan data yang kembali kurang dari 20, berarti data sudah habis
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

  // 2. DETEKSI SCROLL UNTUK MEMICU LOAD MORE (INFINITE SCROLL EVENT)
  useEffect(() => {
    const handleScroll = () => {
      // Jangan trigger fetch jika sedang loading, sedang memuat halaman baru, atau data sudah habis
      if (loading || isFetchingMore || !hasMore) return;

      const threshold = 150; // Jarak aman (px) dari bawah layar untuk memicu fetch data baru
      const windowHeight = window.innerHeight;
      const scrollY = window.scrollY;
      const documentHeight = document.documentElement.scrollHeight;

      // Jika posisi scroll saat ini mendekati bagian paling bawah halaman
      if (windowHeight + scrollY >= documentHeight - threshold) {
        setPage((prevPage) => prevPage + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, isFetchingMore, hasMore]);

  // Loader Layar Penuh hanya muncul pada loading pertama kali (Halaman 1)
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
      <div className="w-full max-w-[361px] flex flex-col gap-4">
        {/* HEADER BRAND & LAYOUT SWITCHER */}
        <div className="w-full border-b border-[#181D27] pb-3 mb-2 flex items-center justify-between">
          <h1 className="text-xl font-black tracking-tight bg-gradient-to-r from-[#6936F2] to-[#AD3AE7] bg-clip-text text-transparent">
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
            <p className="text-xs text-[#A4A7AE] mt-1 max-w-[240px]">
              Gunakan pintasan upload di halaman profil untuk mengunggah gambar
              pertama Anda!
            </p>
          </div>
        )}

        {/* RENDERING DENGAN LAYOUT DINAMIS */}
        {postsList.length > 0 && (
          <>
            {viewMode === "list" ? (
              // OPTION A: TIMELINE INSTAGRAM STYLE
              <div className="flex flex-col gap-6 w-full animate-fade-in">
                {postsList.map((post, index) => (
                  <div
                    key={`${post.id}-${index}`} // Kombinasi ID dan Index menjamin key selalu unik di Virtual DOM Next.js
                    className="w-full flex flex-col gap-3 border-b border-zinc-950 pb-5"
                  >
                    {/* INFO PENULIS POST */}
                    <div
                      onClick={() => router.push(`/${post.author.username}`)}
                      className="flex items-center gap-2.5 cursor-pointer group"
                    >
                      <div className="w-9 h-9 rounded-full bg-zinc-900 overflow-hidden relative border border-[#181D27]">
                        {post.author.avatarUrl ? (
                          <Image
                            src={post.author.avatarUrl}
                            alt={post.author.name}
                            fill
                            unoptimized
                            sizes="361px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-xs font-bold">
                            {post.author.name
                              ? post.author.name.charAt(0).toUpperCase()
                              : "U"}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-[#FDFDFD] group-hover:text-[#7F51F9] transition-colors">
                          {post.author.name}
                        </span>
                        <span className="text-[10px] text-[#A4A7AE]">
                          @{post.author.username}
                        </span>
                      </div>
                    </div>

                    {/* GAMBAR UTAMA POST */}
                    {post.imageUrl && (
                      <div className="w-full aspect-square bg-zinc-900 rounded-2xl overflow-hidden relative border border-[#181D27]">
                        <Image
                          src={post.imageUrl}
                          alt="Post asset"
                          fill
                          sizes="361px"
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    )}

                    {/* CAPTION TEKS POST */}
                    {post.caption && (
                      <p className="text-xs text-[#FDFDFD] leading-relaxed px-1">
                        <span className="font-bold mr-1.5">
                          {post.author.username}
                        </span>
                        {post.caption}
                      </p>
                    )}

                    {/* TOMBOL STATISTIK INTERAKSI */}
                    <div className="flex items-center gap-4 px-1 mt-1 text-zinc-400">
                      <button
                        className={`flex items-center gap-1 transition-colors text-[11px] font-medium ${post.likedByMe ? "text-red-500" : "hover:text-red-500"}`}
                      >
                        <Heart
                          size={16}
                          fill={post.likedByMe ? "currentColor" : "none"}
                        />
                        <span>{post.likeCount || 0}</span>
                      </button>
                      <button className="flex items-center gap-1 hover:text-[#6936F2] transition-colors text-[11px] font-medium">
                        <MessageCircle size={16} />
                        <span>{post.commentCount || 0}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // OPTION B: MODE 9 KOTAK GRID IMAGE EXPLORE STYLE
              <div className="grid grid-cols-3 gap-[1.78px] w-full animate-fade-in mt-2">
                {postsList.map((post, index) => (
                  <div
                    key={`${post.id}-grid-${index}`}
                    onClick={() => router.push(`/${post.author.username}`)}
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

                    {/* Tampilan Overlay Ringkas saat Kursor Mouse Diarahkan Ke Kotak */}
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

        {/* === INDIKATOR LOADER INFINITE SCROLL DI BAGIAN BAWAH === */}
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
