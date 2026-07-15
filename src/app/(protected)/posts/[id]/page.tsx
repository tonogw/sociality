"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Loader2, Flame } from "lucide-react";

import TimelineCard from "@/components/shared/TimelineCard";
import BottomNavbar from "@/components/shared/BottomNavbar";
import ProfileMenu from "@/components/shared/navbar/ProfileMenu";
import type { PostItem } from "@/types/post";

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const postId = params.id as string;
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  // 1. Fetch data profil saya untuk keperluan BottomNav/Navbar
  const { data: myProfileData } = useQuery({
    queryKey: ["my-profile"],
    queryFn: async () => {
      const token = localStorage.getItem("token") || "";
      const res = await fetch(`${baseUrl}/me`, {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return res.json();
    },
  });

  // 2. Fetch kiriman tunggal spesifik
  const { data: postResponse, isLoading } = useQuery({
    queryKey: ["post-detail", postId],
    queryFn: async () => {
      const token = localStorage.getItem("token") || "";
      const res = await fetch(`${baseUrl}/posts/${postId}`, {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Gagal memuat kiriman");
      return res.json();
    },
  });

  const currentUser = myProfileData?.data?.profile;
  const post: PostItem | undefined = postResponse?.data;

  if (isLoading) {
    return (
      <div className="w-full h-screen bg-black flex flex-col items-center justify-center gap-2">
        <Loader2 className="animate-spin text-[#6936F2]" size={32} />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-black text-white px-4 pt-20 pb-32 font-sans flex flex-col items-center">
      {/* GLOBAL FIGMA NAVBAR VARIANT (BACK NAVIGATION WITH PROFILE DRAWER) */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-[#0A0D12]/90 backdrop-blur-md border-b border-[#181D27] flex items-center justify-center z-40 px-4">
        <div className="w-full max-w-[361px] lg:max-w-150 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft size={18} />
            <span className="text-xs font-semibold">Back</span>
          </button>

          <div className="flex items-center gap-1.5 text-[#6936F2]">
            <Flame size={18} className="fill-current" />
            <span className="text-xs font-bold tracking-tight text-white">
              Moment
            </span>
          </div>

          <ProfileMenu />
        </div>
      </div>

      <div className="w-full max-w-[361px] lg:max-w-150 flex flex-col gap-6 mt-4">
        {post ? (
          <TimelineCard
            post={post}
            currentUsername={currentUser?.username}
            canDelete={post.author?.username === currentUser?.username}
          />
        ) : (
          <div className="text-center py-20 text-xs text-zinc-500 border border-dashed border-[#181D27] rounded-2xl bg-[#0A0D12]/20">
            Kiriman tidak ditemukan atau telah dihapus.
          </div>
        )}
      </div>

      <BottomNavbar
        onHome={() => router.push("/feed")}
        onCreatePost={() => router.push("/me")}
        onProfile={() => router.push("/me")}
        avatarUrl={currentUser?.avatarUrl}
      />
    </div>
  );
}
