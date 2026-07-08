"use client";

import { useEffect, useState, Suspense } from "react";
import {
  Loader2,
  Image as ImageIcon,
  Heart,
  MessageCircle,
} from "lucide-react";
import Image from "next/image";

interface FeedItem {
  id: number;
  content: string;
  imageUrl: string | null;
  createdAt: string;
  user: {
    id: number;
    username: string;
    name: string;
    avatarUrl: string | null;
  };
  _count?: {
    likes: number;
    comments: number;
  };
}

function FeedContent() {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!baseUrl) return;

    const fetchTimelineFeed = async () => {
      try {
        setLoading(true);
        // Ambil token dari localStorage atau store Auth Anda
        const token = localStorage.getItem("token") || "";

        const res = await fetch(`${baseUrl}/post?page=1&limit=20`, {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Gagal memuat feed");
        const json = await res.json();

        if (json?.success && json?.data?.items) {
          setFeedItems(json.data.items);
        }
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : "Terjadi kesalahan");
      } finally {
        setLoading(false);
      }
    };

    fetchTimelineFeed();
  }, [baseUrl]);

  if (loading) {
    return (
      <div className="w-full h-[70vh] flex flex-col items-center justify-center gap-2">
        <Loader2 className="animate-spin text-[#6936F2]" size={32} />
        <p className="text-xs text-zinc-500">Memuat timeline...</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-black text-white px-4 pt-20 pb-28 flex flex-col items-center font-sans">
      <div className="w-full max-w-[361px] flex flex-col gap-4">
        {/* HEADER BRAND */}
        <div className="w-full border-b border-[#181D27] pb-3 mb-2">
          <h1 className="text-xl font-black tracking-tight bg-gradient-to-r from-[#6936F2] to-[#AD3AE7] bg-clip-text text-transparent">
            Sociality Feed
          </h1>
        </div>

        {error && (
          <p className="text-xs text-red-400 text-center py-4 bg-red-950/20 rounded-xl border border-red-900/30">
            {error}
          </p>
        )}

        {/* JIKA FEED KOSONG (KARENA BELUM FOLLOW SIAPAPUN) */}
        {feedItems.length === 0 && !error && (
          <div className="w-full py-12 flex flex-col items-center justify-center text-center px-4 border border-dashed border-zinc-800 rounded-3xl bg-[#0A0D12]/20 mt-4">
            <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-500 mb-3 border border-zinc-800">
              <ImageIcon size={20} />
            </div>
            <h3 className="text-sm font-bold text-[#FDFDFD]">
              Timeline Kamu Kosong
            </h3>
            <p className="text-xs text-[#A4A7AE] mt-1 max-w-[240px]">
              Kamu belum memfollow siapapun atau teman yang kamu follow belum
              memposting gambar.
            </p>
            {/* BUTTON SHORTCUT UNTUK MEMBANTU USER KE SEARCH PAGE */}
            <a
              href="/users/search"
              className="mt-4 px-4 py-2 bg-[#6936F2] hover:bg-[#522BC8] text-white text-xs font-bold rounded-full transition-colors"
            >
              Cari & Follow Teman
            </a>
          </div>
        )}

        {/* KETIKA DATA FEED BERHASIL KELUAR */}
        {feedItems.length > 0 && (
          <div className="flex flex-col gap-6 w-full">
            {feedItems.map((item) => (
              <div
                key={item.id}
                className="w-full flex flex-col gap-3 border-b border-zinc-900 pb-5"
              >
                {/* USER INFO HEADER POST */}
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-zinc-900 overflow-hidden relative border border-[#181D27]">
                    {item.user.avatarUrl ? (
                      <Image
                        src={item.user.avatarUrl}
                        alt={item.user.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-xs font-bold">
                        {item.user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-[#FDFDFD]">
                      {item.user.name}
                    </span>
                    <span className="text-[10px] text-[#A4A7AE]">
                      @{item.user.username}
                    </span>
                  </div>
                </div>

                {/* POST TEXT */}
                <p className="text-xs text-[#FDFDFD] leading-relaxed px-1">
                  {item.content}
                </p>

                {/* POST IMAGE (JIKA ADA) */}
                {item.imageUrl && (
                  <div className="w-full aspect-square bg-zinc-900 rounded-2xl overflow-hidden relative border border-[#181D27]">
                    <Image
                      src={item.imageUrl}
                      alt="Post media"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                {/* INTERACTION STATS (LIKE & COMMENT) */}
                <div className="flex items-center gap-4 px-1 mt-1 text-zinc-400">
                  <button className="flex items-center gap-1 hover:text-red-500 transition-colors text-[11px] font-medium">
                    <Heart size={16} />
                    <span>{item._count?.likes || 0}</span>
                  </button>
                  <button className="flex items-center gap-1 hover:text-[#6936F2] transition-colors text-[11px] font-medium">
                    <MessageCircle size={16} />
                    <span>{item._count?.comments || 0}</span>
                  </button>
                </div>
              </div>
            ))}
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
