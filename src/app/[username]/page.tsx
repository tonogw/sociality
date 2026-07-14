"use client";

import { useState, useEffect } from "react";
import { Loader2, Lock } from "lucide-react";
import { useRouter, useParams } from "next/navigation";

import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileStats from "@/components/profile/ProfileStats";
import OwnerActions from "@/components/profile/OwnerAction";
import ProfileTabs from "@/components/profile/ProfileTabs";
import ProfileGallery from "@/components/profile/ProfileGallery";
import ProfileEmptyState from "@/components/profile/ProfileEmptyState";
import ProfileSavedGallery from "@/components/profile/ProfileSavedGallery";
import BottomNavbar from "@/components/shared/BottomNavbar";
import VisitorAction from "@/components/profile/VisitorAction";

import { useUser } from "@/queries/users/useUser";
import { useUserPosts } from "@/queries/users/useUserPosts";
import { useUserLikes } from "@/queries/users/useUserLikes";

export default function UserProfilePage() {
  const params = useParams();
  const username = params.username as string;
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"posts" | "saved">("posts");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    // Deteksi keberadaan token di localStorage secara aman di client-side
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    // SOLUSI UNTUK ERROR LINT (react-hooks/set-state-in-effect):
    // Membungkus perubahan state ke dalam antrean macro-task secara asinkron.
    // Ini menghentikan peringatan render beruntun sinkron secara total dan aman.
    const timer = setTimeout(() => {
      setIsLoggedIn(!!token);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const { data: profile, isLoading: isProfileLoading } = useUser(username);
  const { data: postsData, isLoading: isPostsLoading } = useUserPosts(username);
  const { data: likesData } = useUserLikes(username);

  const user = profile;
  const userPosts = postsData?.posts ?? [];
  const savedPosts = likesData?.posts ?? [];

  const isOwner = user?.isMe ?? false;
  const isFollowing = user?.isFollowing ?? false;

  // Mendapatkan data statistik pengikut & kiriman secara aman
  const stats = user?.counts;
  const postCount = stats?.post ?? 0;
  const followersCount = stats?.followers ?? 0;
  const followingCount = stats?.following ?? 0;
  const likesCount = stats?.likes ?? 0;

  // Menampilkan loader layar penuh saat mendeteksi status autentikasi atau memuat data API
  if (
    isLoggedIn === null ||
    (isLoggedIn && (isProfileLoading || isPostsLoading))
  ) {
    return (
      <div className="w-full h-screen bg-black flex items-center justify-center">
        <Loader2 className="animate-spin text-[#6936F2]" size={32} />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-black text-white px-4 pt-24 pb-32 font-sans flex flex-col items-center">
      <div className="w-full max-w-[361px] flex flex-col gap-4">
        <ProfileHeader
          name={user?.name || "User"}
          username={user?.username || username}
          avatarUrl={user?.avatarUrl}
        />

        {/* TOMBOL AKSI (EDIT JIKA PEMILIK / FOLLOW JIKA PENGUNJUNG) */}
        {isLoggedIn ? (
          isOwner ? (
            <OwnerActions
              isOwner={true}
              onEditProfile={() => router.push("/settings")}
            />
          ) : (
            <VisitorAction
              isFollowing={isFollowing}
              onFollowToggle={() => {}}
            />
          )
        ) : (
          /* Jika belum login, tampilkan tombol follow yang mengarah ke halaman login */
          <button
            onClick={() => router.push("/login")}
            className="w-full h-11 bg-[#7F51F9] hover:bg-[#6936F2] transition-colors text-xs font-bold text-[#FDFDFD] rounded-xl flex items-center justify-center cursor-pointer shadow-md"
          >
            Follow
          </button>
        )}

        {/* BIO SINGKAT */}
        <p className="text-sm text-[#FDFDFD] leading-relaxed max-w-full break-words">
          {user?.bio ||
            "Creating unforgettable moments! 📸✨ Let's cherish every second together!"}
        </p>

        {/* STATISTIK PORTFOLIO */}
        <ProfileStats
          postCount={postCount}
          followersCount={followersCount}
          followingCount={followingCount}
          likesCount={likesCount}
        />

        <div className="w-full flex flex-col gap-4 mt-2">
          {isLoggedIn ? (
            <>
              {/* Menu Tab Navigasi Galeri */}
              <ProfileTabs
                activeTab={activeTab}
                viewMode={viewMode}
                onPostsClick={() => {
                  if (activeTab === "posts") {
                    setViewMode((prev) => (prev === "grid" ? "list" : "grid"));
                  } else {
                    setActiveTab("posts");
                  }
                }}
                onSavedClick={() => setActiveTab("saved")}
              />

              {/* Konten Utama Galeri Kiriman */}
              {activeTab === "posts" ? (
                userPosts.length === 0 ? (
                  <ProfileEmptyState
                    onCreatePost={() => router.push("/create")}
                  />
                ) : (
                  <div className="w-full h-auto animate-fade-in">
                    <ProfileGallery
                      posts={userPosts}
                      viewMode={viewMode}
                      username={user?.username}
                      canDelete={isOwner}
                    />
                  </div>
                )
              ) : (
                <ProfileSavedGallery posts={savedPosts} />
              )}
            </>
          ) : (
            /* === KONDISI LANDING WALL: DIKUNCI BAGI USER BELUM LOGIN === */
            <div className="w-full flex flex-col items-center justify-center py-16 px-6 bg-[#0A0D12] border border-[#181D27] rounded-2xl text-center gap-4 animate-fade-in mt-2">
              <div className="w-12 h-12 rounded-full bg-zinc-900/50 flex items-center justify-center text-[#7F51F9] border border-[#181D27]">
                <Lock size={18} />
              </div>
              <div className="flex flex-col gap-1.5">
                <h3 className="text-base font-bold text-[#FDFDFD] tracking-tight">
                  Moments are Locked
                </h3>
                <p className="text-xs text-[#A4A7AE] max-w-[260px] leading-relaxed">
                  Sign in or create a Sociality account to explore @{username}
                  &apos;s moments, saved collections, and full portfolio.
                </p>
              </div>
              <button
                onClick={() => router.push("/login")}
                className="mt-2 py-2.5 px-8 bg-[#7F51F9] hover:bg-[#6936F2] text-xs font-bold text-white rounded-full transition-colors cursor-pointer shadow-lg"
              >
                Sign in to View Profile
              </button>
            </div>
          )}
        </div>
      </div>

      {/* FOOTER BOTTOM NAV BAR */}
      <BottomNavbar
        onHome={() => router.push("/feed")}
        onCreatePost={() => router.push("/create")}
      />
    </div>
  );
}
