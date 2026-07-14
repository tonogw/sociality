"use client";

import { useState, useEffect, Suspense } from "react";
import { Loader2, Lock } from "lucide-react";
import { useRouter, useParams, useSearchParams } from "next/navigation";

import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileStats from "@/components/profile/ProfileStats";
import OwnerActions from "@/components/profile/OwnerAction";
import ProfileTabs from "@/components/profile/ProfileTabs";
import ProfileGallery from "@/components/profile/ProfileGallery";
import ProfileEmptyState from "@/components/profile/ProfileEmptyState";
import ProfileSavedGallery from "@/components/profile/ProfileSavedGallery";
import BottomNavbar from "@/components/shared/BottomNavbar";
import VisitorAction from "@/components/profile/VisitorAction";

// Import kueri khusus React Query dari folder queries Anda
import { useUser } from "@/queries/users/useUser";
import { useUserPosts } from "@/queries/users/useUserPosts";
import { useUserLikes } from "@/queries/users/useUserLikes";

function UserProfileContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const username = params.username as string;
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"posts" | "saved">("posts");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  /* STREAMING_CHUNK: Extracting search parameters and handling authentication logic */
  const postIdParam = searchParams.get("postId");

  useEffect(() => {
    // Deteksi keberadaan token di localStorage secara aman di client-side
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    const timer = setTimeout(() => {
      setIsLoggedIn(!!token);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  /* STREAMING_CHUNK: Fetching user details and processing subsequent auto-scrolling */
  useEffect(() => {
    // FIX: Jika ada parameter postId, otomatis ubah mode tampilan ke LIST dan scroll ke sasaran
    // if (postIdParam) {
    //   setActiveTab("posts");
    //   setViewMode("list");

    //   const scrollTimer = setTimeout(() => {
    //     const targetElement = document.getElementById(`post-${postIdParam}`);
    //     if (targetElement) {
    //       targetElement.scrollIntoView({ behavior: "smooth", block: "center" });
    //     }
    //   }, 350); // Delay sedikit agar render TimelineCard selesai sepenuhnya

    //   return () => clearTimeout(scrollTimer);
    // }

    if (postIdParam) {
      const scrollTimer = setTimeout(() => {
        setActiveTab("posts");
        setViewMode("list");

        // Jalankan pencarian elemen dan scroll setelah state ter-update
        const targetElement = document.getElementById(`post-${postIdParam}`);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 350); // Memberikan jeda waktu ideal bagi render DOM

      return () => clearTimeout(scrollTimer);
    }
  }, [postIdParam]);

  // Memanggil React Query secara kondisional
  const { data: profile, isLoading: isProfileLoading } = useUser(username);
  const { data: postsData, isLoading: isPostsLoading } = useUserPosts(username);
  const { data: likesData } = useUserLikes(username);

  // Normalisasi data dari API agar tidak menghasilkan status "undefined"
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
      <div className="w-full max-w-90.25 flex flex-col gap-4">
        <ProfileHeader
          name={user?.name || "User"}
          username={user?.username || username}
          avatarUrl={user?.avatarUrl}
        />

        {/* TOMBOL AKSI */}
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
          <button
            onClick={() => router.push("/login")}
            className="w-full h-11 bg-[#7F51F9] hover:bg-[#6936F2] transition-colors text-xs font-bold text-[#FDFDFD] rounded-xl flex items-center justify-center cursor-pointer shadow-md"
          >
            Follow
          </button>
        )}

        {/* BIO */}
        <p className="text-sm text-[#FDFDFD] leading-relaxed max-w-full wrap-break-words">
          {user?.bio ||
            "Creating unforgettable moments! 📸✨ Let's cherish every second together!"}
        </p>

        {/* STATISTIK */}
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
                <p className="text-xs text-[#A4A7AE] max-w-65 leading-relaxed">
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
        onProfile={() => router.push("/my")}
        avatarUrl={user?.avatarUrl}
      />
    </div>
  );
}

// 📦 EXPORT DENGAN BOUNDARY SUSPENSE UNTUK MENJAGA NEXT.JS STATIC OPTIMIZATION
export default function UserProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="w-full h-screen bg-black flex items-center justify-center">
          <Loader2 className="animate-spin text-[#6936F2]" size={32} />
        </div>
      }
    >
      <UserProfileContent />
    </Suspense>
  );
}
