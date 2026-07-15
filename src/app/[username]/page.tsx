"use client";

import { useState, useEffect, Suspense } from "react";
import { Loader2, Share2 } from "lucide-react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { userService } from "@/services/userService";
import Navbar from "@/components/shared/Navbar";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileStats from "@/components/profile/ProfileStats";
import OwnerActions from "@/components/profile/OwnerAction";
import ProfileTabs from "@/components/profile/ProfileTabs";
import ProfileGallery from "@/components/profile/ProfileGallery";
import ProfileEmptyState from "@/components/profile/ProfileEmptyState";
import BottomNavbar from "@/components/shared/BottomNavbar";
import VisitorAction from "@/components/profile/VisitorAction";
import PrivateProfile from "@/components/profile/PrivateProfile";

import { useUser } from "@/queries/users/useUser";

import { useFollow } from "@/queries/users/useFollow";
import { useUnfollow } from "@/queries/users/useUnfollow";
import { getIsPrivateFromBio, cleanBioText } from "@/lib/utils";
// import type { PostItem } from "@/types/post";

export interface UserProfileData {
  id: number;
  username: string;
  name: string;
  email: string;
  phone: string;
  bio: string | null;
  avatarUrl: string | null;
  isMe?: boolean;
  isPrivate?: boolean;
  isFollowing?: boolean;
  isFollowedByMe?: boolean;
  counts?: {
    post: number;
    followers: number;
    following: number;
    likes: number;
  };
}

function UserProfileContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const username = params.username as string;
  const router = useRouter();
  const queryClient = useQueryClient();

  const fromQuery = searchParams.get("fromQuery") || "";
  const lastPage = searchParams.get("lastPage") || "";

  const [activeTab, setActiveTab] = useState<"feed" | "saved" | "likes">(
    "feed",
  );

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, []);

  const { data: profile, isLoading: isProfileLoading } = useUser(username);
  // const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  // 1. GET /api/users/{username}/posts
  const { data: userPostsData, isLoading: isPostsLoading } = useQuery({
    queryKey: ["user-posts", username],
    queryFn: () => userService.getUserPosts(username, 1, 20),
    enabled: !!username,
  });

  // 2. GET /api/users/{username}/likes
  const { data: userLikesData } = useQuery({
    queryKey: ["user-likes", username],
    queryFn: () => userService.getUserLikes(username, 1, 20),
    enabled: !!username,
  });

  const followMutation = useFollow();
  const unfollowMutation = useUnfollow();

  const user = profile as UserProfileData | undefined;

  const userPosts = userPostsData?.posts ?? [];
  const likedPosts = userLikesData?.posts ?? [];

  const isOwner = user?.isMe ?? false;
  const isFollowing = user?.isFollowedByMe ?? user?.isFollowing ?? false;
  const isPrivate = getIsPrivateFromBio(user?.bio);

  const stats = user?.counts;
  const postCount = stats?.post ?? userPosts.length;
  const followersCount = stats?.followers ?? 0;
  const followingCount = stats?.following ?? 0;
  const likesCount = stats?.likes ?? likedPosts.length;

  const shouldLockContent =
    isLoggedIn === true && !isOwner && isPrivate && !isFollowing;

  const handleFollowToggle = () => {
    if (isFollowing) {
      unfollowMutation.mutate(username, {
        onSuccess: async () => {
          // await queryClient.invalidateQueries({ queryKey: ["user", username] });
          await queryClient.refetchQueries({
            queryKey: ["user", username],
          });
          toast.success(`Unfollowed @${username}`);
        },
      });
    } else {
      followMutation.mutate(username, {
        onSuccess: async () => {
          // await queryClient.invalidateQueries({ queryKey: ["user", username] });
          await queryClient.refetchQueries({
            queryKey: ["user", username],
          });
          toast.success(`Following @${username}!`);
        },
      });
    }
  };

  const handleShareAccount = async () => {
    const shareUrl = typeof window !== "undefined" ? window.location.href : "";
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Profile ${user?.name}`,
          url: shareUrl,
        });
      } catch {}
    } else {
      navigator.clipboard.writeText(shareUrl);
      toast.success("Account link successfully copied to clipboard!");
    }
  };

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
    <div className="w-full min-h-screen bg-black text-white px-4 pt-20 pb-24 flex flex-col items-center font-sans">
      <Navbar fromQuery={fromQuery} lastPage={lastPage} />

      <div className="w-full max-w-90.25 lg:max-w-150 flex flex-col gap-4">
        {/* BARIS-1: AVATAR + DISPLAY NAME */}
        <ProfileHeader
          name={user?.name || "User"}
          username={user?.username || username}
          avatarUrl={user?.avatarUrl}
        />

        {/* BARIS-2: ACTION BUTTONS */}
        <div className="w-full flex items-center gap-2">
          <div className="flex-1">
            {isOwner ? (
              <OwnerActions
                isOwner={true}
                onEditProfile={() => router.push("/settings")}
              />
            ) : (
              <VisitorAction
                isFollowing={isFollowing}
                onFollowToggle={handleFollowToggle}
              />
            )}
          </div>
          <button
            onClick={handleShareAccount}
            type="button"
            className="w-11 h-11 border border-[#181D27] bg-[#0A0D12] text-zinc-400 hover:text-white rounded-xl flex items-center justify-center transition-colors cursor-pointer"
          >
            <Share2 size={16} />
          </button>
        </div>

        {/* BARIS-3: BIO CAPTION TEXT */}
        <p className="text-sm text-[#FDFDFD] leading-relaxed max-w-full wrap-break-words">
          {cleanBioText(user?.bio) || "Moment collector. 📸✨"}
        </p>

        {/* BARIS-4: LINK KLIK STATISTIK KONEKSI */}
        <ProfileStats
          postCount={postCount}
          followersCount={followersCount}
          followingCount={followingCount}
          likesCount={likesCount}
          onPostsClick={() => {
            if (!shouldLockContent) setActiveTab("feed");
          }}
          onFollowersClick={() => {
            if (!shouldLockContent) router.push(`/${username}/followers`);
          }}
          onFollowingClick={() => {
            if (!shouldLockContent) router.push(`/${username}/following`);
          }}
          onLikesClick={() => {
            if (!shouldLockContent) setActiveTab("likes");
          }}
        />

        {/* BARIS-5 & 6: GALLERY RENDERING CONTAINER */}
        <div className="w-full flex flex-col gap-4 mt-2">
          {shouldLockContent ? (
            <PrivateProfile />
          ) : (
            <>
              <ProfileTabs
                activeTab={activeTab}
                viewMode={viewMode}
                onPostsClick={() => {
                  if (activeTab === "feed") {
                    setViewMode((prev) => (prev === "grid" ? "list" : "grid"));
                  } else {
                    setActiveTab("feed");
                  }
                }}
                onLikesClick={() => setActiveTab("likes")}
              />

              {activeTab === "saved" &&
                (userPosts.length === 0 ? (
                  <ProfileEmptyState onCreatePost={() => {}} />
                ) : (
                  <ProfileGallery
                    posts={userPosts}
                    viewMode={viewMode}
                    username={user?.username}
                    canDelete={isOwner}
                  />
                ))}

              {activeTab === "likes" &&
                (likedPosts.length === 0 ? (
                  <div className="text-center py-16 text-xs text-zinc-500 font-medium bg-[#0A0D12]/10 border border-dashed border-[#181D27] rounded-2xl">
                    No liked moments found.
                  </div>
                ) : (
                  <ProfileGallery
                    posts={likedPosts}
                    viewMode={viewMode}
                    username={user?.username}
                    canDelete={false}
                  />
                ))}
            </>
          )}
        </div>
      </div>

      <BottomNavbar
        onHome={() => router.push("/feed")}
        onCreatePost={() => router.push("/me")}
        onProfile={() => router.push("/me")}
        avatarUrl={user?.avatarUrl}
      />
    </div>
  );
}

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
