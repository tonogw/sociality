"use client";

import { useParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { Loader2, Send, Grid, Heart } from "lucide-react";
import Image from "next/image";
import type { UserProfileData } from "@/types";

function ProfileContent() {
  const params = useParams();
  //   const router = useRouter();
  //   const searchParams = useSearchParams();

  const username = params?.username as string;
  //   const fromQuery = searchParams.get("fromQ") || "";
  //   const lastPage = searchParams.get("lastPage") || "1";

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [followLoading, setFollowLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"gallery" | "liked">("gallery");

  // Fetch profile public data from backend server
  useEffect(() => {
    if (!username || !baseUrl) return;

    const fetchUserProfile = async () => {
      try {
        // Menggunakan rute dinamis backend yang sesuai
        const token = localStorage.getItem("token") || "";
        const res = await fetch(`${baseUrl}/users/${username}`, {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Profile not found");
        const json = await res.json();

        // Sesuaikan dengan mapping struktur response API Anda
        if (json?.success && json?.data) {
          setProfile(json.data);
        }
        //  else {
        //   // Fallback mockup jika API detail profil Anda menggunakan skema berbeda
        //   setProfile({
        //     id: Math.random(),
        //     username: username,
        //     name: username.toUpperCase(),
        //     avatarUrl: null,
        //     bio: "Creating unforgettable moments with my favorite person! 📸✨ Let's cherish every second together!",
        //     postCount: 50,
        //     followersCount: 100,
        //     followingCount: 43,
        //     likesCount: 567,
        //     isFollowedByMe: false,
        //   });
        // }
      } catch (err) {
        console.error("Gagal menarik data profil:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [username, baseUrl]);

  //   const handleBackNavigation = () => {
  //     if (fromQuery) {
  //       router.push(
  //         `/users/search?q=${encodeURIComponent(fromQuery)}&page=${lastPage}`,
  //       );
  //     } else {
  //       router.push("/");
  //     }
  //   };

  const handleFollowAction = async () => {
    if (!profile || !baseUrl || followLoading) return;

    setFollowLoading(true);
    try {
      const token = localStorage.getItem("token") || "";
      // Fetch api follow
      const res = await fetch(`${baseUrl}/follow/${username}`, {
        method: "POST",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: "", // as params -d '' at CURL
      });

      if (!res.ok) throw new Error("Failed change to follow status");
      const json = await res.json();

      if (json?.success) {
        // get following new status from backend server
        const isNowFollowing = json?.data?.following;

        setProfile((prev) => {
          if (!prev) return null;

          const currentFollowers = Number(
            prev.counts.followers ??
              //   prev.followers ??
              //   prev._count?.followers ??
              0,
          );

          return {
            ...prev,
            isFollowedByMe: isNowFollowing,
            // Update total follow
            followersCount: isNowFollowing
              ? currentFollowers + 1
              : Math.max(0, currentFollowers - 1),
            //   ? prev.followersCount + 1
            //   : prev.followersCount - 1,
          };
        });
      }
    } catch (err) {
      console.error("Follow error:", err);
    } finally {
      setFollowLoading(false);
    }
  };

  //   ArrowLeft button
  //   const handleBackNavigation = () => {
  //     if (fromQuery) {
  //       router.push(
  //         `/users/search?q=${encodeURIComponent(fromQuery)}&page=${lastPage}&limit=20`,
  //       );
  //     } else {
  //       router.push("/");
  //     }
  //   };

  //   const handleImageUploadAction = () => {
  //     alert(`Open gallery to post new timeline to your profile @${username}`);
  //   };

  if (loading) {
    return (
      <div className="w-full h-[60vh] flex flex-col items-center justify-center gap-2 text-white">
        <Loader2 className="animate-spin text-[#6936F2]" size={28} />
        <p className="text-xs text-zinc-500">Loading profile data...</p>
      </div>
    );
  }

  //   const renderName = profile?.name || username;
  //   const renderBio = profile?.bio || "No description template provided";
  //   const renderPost = profile?.counts.post ?? 0;
  //   const render

  return (
    <div className="w-full min-h-screen bg-black text-white px-4 pt-6 pb-24 flex flex-col items-center font-sans">
      <div className="w-full max-w-90.25 flex flex-col gap-4">
        {/* HEADER NAVIGATION (BARIS ATAS FIGMA) */}
        <div className="flex items-center justify-between w-full border-b border-[#181D27] pb-3">
          {/* <div className="flex items-center gap-3">
            <button
              onClick={handleBackNavigation}
              className="p-1 hover:bg-zinc-900 rounded-full cursor-pointer text-white"
            >
              <ArrowLeft size={22} />
            </button>
            <span className="text-base font-bold tracking-tight text-[#FDFDFD]">
              {profile?.name || username}
            </span>
          </div> */}
        </div>

        {/* PROFILE HEADER (WIDTH: 361px, HEIGHT: 116px FIGMA AUTO LAYOUT) */}
        <div className="flex flex-col gap-3 w-full">
          <div className="flex items-center gap-3 w-full">
            {/* AVATAR CONTAINER DECORATION (64px x 64px) */}
            <div className="w-16 h-16 rounded-full bg-zinc-900 border border-[#181D27] overflow-hidden flex items-center justify-center shrink-0 relative">
              {profile?.avatarUrl ? (
                <Image
                  src={profile.avatarUrl}
                  alt={profile.name}
                  width={64}
                  height={64}
                  unoptimized
                  className="w-14 h-14 object-cover"
                />
              ) : (
                <div className="w-full h-full bg-linear-to-tr from-[#6936F2] to-[#AD3AE7] flex items-center justify-center text-lg font-bold text-white">
                  {profile?.name?.charAt(0).toUpperCase() || "U"}
                </div>
              )}
            </div>

            {/* IDENTITY (HEIGHT 56px FIGMA) */}
            <div className="flex flex-col">
              <span className="text-sm font-bold text-[#FDFDFD] tracking-tight">
                {profile?.name}
              </span>
              <span className="text-sm text-[#A4A7AE]">
                @{profile?.username}
              </span>
            </div>
          </div>
        </div>

        {/* ACTIONS CONTAINER (BUTTON ACTION & SHARE) */}
        <div className="flex items-center gap-3 w-full h-10 mt-1">
          <button
            onClick={handleFollowAction}
            disabled={followLoading}
            className={`flex-1 h-full rounded-full text-sm font-bold text-white transition-all flex items-center justify-center gap-2 cursor-pointer ${
              profile?.isFollowedByMe
                ? "bg-[#181D27] border border-zinc-800"
                : "bg-[#6936F2] hover:bg-[#582cd1]"
            }`}
          >
            {followLoading ? (
              <Loader2 className="animate-spin" size={16} />
            ) : profile?.counts.following ? (
              "Following"
            ) : (
              "Follow"
            )}
          </button>

          {/* SHARE BUTTON ROUNDED ACCORDING TO FIGMA STYLE */}
          <button className="w-10 h-10 border border-[#181D27] rounded-full flex items-center justify-center text-white hover:bg-zinc-900 transition-colors cursor-pointer">
            <Send
              size={18}
              className="transform rotate-[-20deg] -translate-x-px"
            />
          </button>
        </div>

        {/* BIO TEXT DESCRIPTION */}
        <div className="text-sm text-[#FDFDFD] leading-6 font-normal tracking-wide mt-1">
          {profile?.bio || "No description template provided."}
        </div>

        {/* STATS COUNT GRID GRIDBAR (HEIGHT: 50px ACCORDING TO FIGMA) */}
        <div className="flex items-center justify-between w-full bg-[#0A0D12]/30 border border-[#181D27]/50 rounded-2xl py-3 px-2 text-center mt-2">
          <div className="flex-1">
            <p className="text-base font-bold text-[#FDFDFD]">
              {profile?.counts.post}
            </p>
            <p className="text-[10px] text-[#A4A7AE] uppercase tracking-wider mt-0.5">
              Post
            </p>
          </div>
          <div className="w-px h-6 bg-[#181D27]" />
          <div className="flex-1">
            <p className="text-base font-bold text-[#FDFDFD]">
              {profile?.counts.followers}
            </p>
            <p className="text-[10px] text-[#A4A7AE] uppercase tracking-wider mt-0.5">
              Followers
            </p>
          </div>
          <div className="w-px h-6 bg-[#181D27]" />
          <div className="flex-1">
            <p className="text-base font-bold text-[#FDFDFD]">
              {profile?.counts.following}
            </p>
            <p className="text-[10px] text-[#A4A7AE] uppercase tracking-wider mt-0.5">
              Following
            </p>
          </div>
          <div className="w-px h-6 bg-[#181D27]" />
          <div className="flex-1">
            <p className="text-base font-bold text-[#FDFDFD]">
              {profile?.counts.likes}
            </p>
            <p className="text-[10px] text-[#A4A7AE] uppercase tracking-wider mt-0.5">
              Likes
            </p>
          </div>
        </div>

        {/* GALLERY TAB CONTAINER HEADER */}
        <div className="flex items-center w-full h-12 border-b border-[#181D27] mt-4">
          <button
            onClick={() => setActiveTab("gallery")}
            className={`flex-1 h-full flex items-center justify-center gap-2 border-b-2 font-bold text-sm cursor-pointer transition-all ${
              activeTab === "gallery"
                ? "border-white text-white"
                : "border-transparent text-[#A4A7AE]"
            }`}
          >
            <Grid size={16} />
            <span>Gallery</span>
          </button>

          <button
            onClick={() => setActiveTab("liked")}
            className={`flex-1 h-full flex items-center justify-center gap-2 border-b-2 font-medium text-sm cursor-pointer transition-all ${
              activeTab === "liked"
                ? "border-white text-white"
                : "border-transparent text-[#A4A7AE]"
            }`}
          >
            <Heart size={16} />
            <span>Liked</span>
          </button>
        </div>

        {/* IMAGES MOCKUP LAYOUT (DIMENSI: 119.15px x 119.15px GAP: 1.78px FIGMA) */}
        <div className="grid grid-cols-3 gap-[1.78px] w-full mt-2">
          {Array.from({ length: 9 }).map((_, index) => (
            <div
              key={index}
              className="w-full aspect-square bg-zinc-900 rounded-[2.66px] overflow-hidden relative group cursor-pointer border border-[#181D27]/40"
            >
              {/* Dummy Image asset placeholder */}
              <div className="w-full h-full bg-linear-to-b from-zinc-800 to-zinc-900 flex items-center justify-center text-[10px] text-zinc-600">
                Post {index + 1}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function UserProfileDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full h-screen bg-black flex items-center justify-center">
          <Loader2 className="animate-spin text-[#6936F2]" size={32} />
        </div>
      }
    >
      <ProfileContent />
    </Suspense>
  );
}
