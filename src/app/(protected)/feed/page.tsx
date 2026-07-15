"use client";

import { useQuery } from "@tanstack/react-query";
import { Loader2, Flame } from "lucide-react";
import { useRouter } from "next/navigation";

import TimelineCard from "@/components/shared/TimelineCard";
import BottomNavbar from "@/components/shared/BottomNavbar";
import { meService } from "@/services/meService";
import type { PostItem } from "@/types/post";

export default function PersonalFeedPage() {
  const router = useRouter();
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  // 1. Fetch Data Profil untuk Kebutuhan Ikon Navigasi Bawah
  const { data: profileData } = useQuery({
    queryKey: ["my-profile"],
    queryFn: meService.getMe,
  });

  // 2. Fetch Data Khusus API /api/feed (Self + Following)
  const { data: feedData, isLoading } = useQuery({
    queryKey: ["personal-timeline"],
    queryFn: async () => {
      const token = localStorage.getItem("token") || "";
      const res = await fetch(`${baseUrl}/feed?page=1&limit=20`, {
        headers: {
          Authorization: `Bearer ${token}`,
          accept: "application/json",
        },
      });
      if (!res.ok) throw new Error("Failed to pull feed timeline");
      return res.json();
    },
  });

  const currentUser = profileData?.data?.profile;
  const feedItems: PostItem[] = feedData?.data?.items || [];

  if (isLoading) {
    return (
      <div className="w-full h-screen bg-black flex flex-col items-center justify-center gap-2">
        <Loader2 className="animate-spin text-[#6936F2]" size={32} />
        <span className="text-xs text-zinc-500 font-mono">
          Assembling your feed...
        </span>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-black text-white px-4 pt-20 pb-32 font-sans flex flex-col items-center">
      <div className="w-full max-w-90.25 flex flex-col gap-6">
        {/* HEADER BRANDING MINI */}
        <div className="w-full flex items-center gap-2 border-b border-[#181D27] pb-3 px-1 mt-2">
          <div className="text-[#6936F2]">
            <Flame size={20} className="fill-current" />
          </div>
          <h1 className="text-base font-bold text-[#FDFDFD] tracking-tight">
            Your Home Feed
          </h1>
        </div>

        {/* DAFTAR TIMELINE CARD FEED */}
        <div className="w-full flex flex-col gap-6">
          {feedItems.length === 0 ? (
            <div className="w-full py-20 border border-dashed border-[#181D27] rounded-2xl text-center flex flex-col items-center justify-center p-6 gap-2 bg-[#0A0D12]/20">
              <p className="text-xs text-zinc-400">
                Your timeline looks quiet.
              </p>
              <button
                onClick={() => router.push("/feed")}
                className="text-xs font-bold text-[#6936F2] hover:underline"
              >
                Explore global moments to find creators!
              </button>
            </div>
          ) : (
            feedItems.map((post) => (
              <TimelineCard
                key={post.id}
                post={post}
                currentUsername={currentUser?.username}
                canDelete={post.author?.username === currentUser?.username}
              />
            ))
          )}
        </div>
      </div>

      {/* FIXED BOTTOM NAV MENU BAR */}
      <BottomNavbar
        onHome={() => router.push("/feed")}
        onCreatePost={() => router.push("/me")} // Membuka uploader di halaman profil
        onProfile={() => router.push("/me")}
        avatarUrl={currentUser?.avatarUrl}
      />
    </div>
  );
}
