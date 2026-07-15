"use client";

import { useState, useEffect, Suspense } from "react";
import { Loader2, Lock } from "lucide-react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

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
import { useUserPosts } from "@/queries/users/useUserPosts";
import { useFollow } from "@/queries/users/useFollow";
import { useUnfollow } from "@/queries/users/useUnfollow";
import { getIsPrivateFromBio } from "@/lib/utils";

// Impor tipe data terstandarisasi buatan kita
import { UserProfileData } from "@/types/user";

function UserProfileContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const username = params.username as string;
  const router = useRouter();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<"posts" | "saved" | "likes">(
    "posts",
  );
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  const postIdParam = searchParams.get("postId");

  useEffect(() => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    const timer = setTimeout(() => {
      setIsLoggedIn(!!token);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (postIdParam) {
      const scrollTimer = setTimeout(() => {
        setActiveTab("posts");
        setViewMode("list");

        const targetElement = document.getElementById(`post-${postIdParam}`);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 350);

      return () => clearTimeout(scrollTimer);
    }
  }, [postIdParam]);

  const { data: profile, isLoading: isProfileLoading } = useUser(username);
  const { data: postsData, isLoading: isPostsLoading } = useUserPosts(username);
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const hasQueryAccess = isLoggedIn === true && !!username;

  const { data: userLikesData } = useQuery({
    queryKey: ["user-likes", username],
    queryFn: async () => {
      const token = localStorage.getItem("token") || "";
      const res = await fetch(`${baseUrl}/users/${username}/likes`, {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Gagal mengambil data kiriman disukai.");
      return res.json();
    },
    enabled: hasQueryAccess,
  });

  const followMutation = useFollow();
  const unfollowMutation = useUnfollow();

  // EXPLICIT CASTING: Mengubah profil menjadi tipe UserProfileData agar linter membaca isFollowedByMe
  const user = profile as UserProfileData | undefined;
  const userPosts = postsData?.posts ?? [];
  const likedPosts = userLikesData?.data?.posts ?? userLikesData?.data ?? [];

  const isOwner = user?.isMe ?? false;
  const isFollowing = user?.isFollowedByMe ?? user?.isFollowing ?? false;
  const isPrivate = getIsPrivateFromBio(user?.bio);

  const stats = user?.counts;
  const postCount = stats?.post ?? 0;
  const followersCount = stats?.followers ?? 0;
  const followingCount = stats?.following ?? 0;
  const likesCount = stats?.likes ?? 0;

  const handleFollowToggle = () => {
    if (isFollowing) {
      unfollowMutation.mutate(username, {
        onSuccess: async () => {
          await queryClient.invalidateQueries({ queryKey: ["user", username] });
          toast.success(`Unfollowed @${username}`);
        },
        onError: () => {
          toast.error("Failed to unfollow user.");
        },
      });
    } else {
      followMutation.mutate(username, {
        onSuccess: async () => {
          await queryClient.invalidateQueries({ queryKey: ["user", username] });
          toast.success(`Following @${username}!`);
        },
        onError: () => {
          toast.error("Failed to follow user.");
        },
      });
    }
  };

  const shouldLockContent = isLoggedIn && !isOwner && isPrivate && !isFollowing;

  const handleOpenFollowers = () => {
    if (shouldLockContent) {
      toast.error("This account is private. Follow to view followers.");
      return;
    }
    router.push(`/${username}/followers`);
  };

  const handleOpenFollowing = () => {
    if (shouldLockContent) {
      toast.error("This account is private. Follow to view following list.");
      return;
    }
    router.push(`/${username}/following`);
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
    <div className="relative min-h-screen bg-black text-white px-4 pt-24 pb-32 font-sans flex flex-col items-center">
      <div className="w-full max-w-[361px] flex flex-col gap-4">
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
              onFollowToggle={handleFollowToggle}
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

        <p className="text-sm text-[#FDFDFD] leading-relaxed max-w-full break-words">
          {user?.bio || "Creating unforgettable moments! 📸✨"}
        </p>

        <ProfileStats
          postCount={postCount}
          followersCount={followersCount}
          followingCount={followingCount}
          likesCount={likesCount}
          onPostsClick={() => {
            if (!shouldLockContent) setActiveTab("posts");
          }}
          onFollowersClick={handleOpenFollowers}
          onFollowingClick={handleOpenFollowing}
          onLikesClick={() => {
            if (!shouldLockContent) setActiveTab("likes");
          }}
        />

        <div className="w-full flex flex-col gap-4 mt-2">
          {isLoggedIn ? (
            shouldLockContent ? (
              <PrivateProfile />
            ) : (
              <>
                <ProfileTabs
                  activeTab={activeTab}
                  viewMode={viewMode}
                  onPostsClick={() => {
                    if (activeTab === "posts") {
                      setViewMode((prev) =>
                        prev === "grid" ? "list" : "grid",
                      );
                    } else {
                      setActiveTab("posts");
                    }
                  }}
                  onLikesClick={() => setActiveTab("likes")}
                />

                {activeTab === "posts" &&
                  (userPosts.length === 0 ? (
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
                  ))}

                {activeTab === "likes" &&
                  (likedPosts.length === 0 ? (
                    <div className="w-full text-center py-16 text-xs text-zinc-500 font-medium">
                      This user hasn&apos;t liked any posts yet.
                    </div>
                  ) : (
                    <div className="w-full h-auto animate-fade-in">
                      <ProfileGallery
                        posts={likedPosts}
                        viewMode={viewMode}
                        username={user?.username}
                        canDelete={false}
                      />
                    </div>
                  ))}
              </>
            )
          ) : (
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
