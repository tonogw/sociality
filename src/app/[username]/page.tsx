"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AxiosError } from "axios";

import { useRouter, useParams } from "next/navigation";
import { updateProfileSchema, type UpdateUserInput } from "@/validations/auth";
import ImageCropUploader from "@/components/shared/ImageCropUploader";

import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileStats from "@/components/profile/ProfileStats";
import OwnerActions from "@/components/profile/OwnerAction";
import ProfileTabs from "@/components/profile/ProfileTabs";
import ProfileGallery from "@/components/profile/ProfileGallery";
import ProfileEmptyState from "@/components/profile/ProfileEmptyState";
import ProfileSavedGallery from "@/components/profile/ProfileSavedGallery";
import ProfileEditModal from "@/components/profile/ProfileEditModal";
import BottomNavbar from "@/components/shared/BottomNavbar";
import VisitorAction from "@/components/profile/VisitorAction";

// 1. IMPORT CUSTOM HOOKS BAWAAN APLIKASI UNTUK MENGURANGI REDUNDANSI KODE
import { useUser } from "@/queries/users/useUser";
import { useUserPosts } from "@/queries/users/useUserPosts";
import { useUserLikes } from "@/queries/users/useUserLikes";

interface ApiErrorResponse {
  message?: string;
}

interface Post {
  id: number;
  imageUrl: string;
  caption?: string;
  createdAt: string;
  author?: {
    id: number;
    username: string;
    name: string;
    avatarUrl: string | null;
  };
}

export default function UserProfilePage() {
  const params = useParams();
  const username = params.username as string;
  const queryClient = useQueryClient();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"posts" | "saved">("posts");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);

  // 2. MENGGUNAKAN CUSTOM HOOKS YANG SUDAH TERDEFINISI DI FOLDER QUERIES
  const { data: profile, isLoading: isProfileLoading } = useUser(username);
  const { data: postsData, isLoading: isPostsLoading } = useUserPosts(username);
  const { data: likesData } = useUserLikes(username);

  // Normalisasi data untuk menghindari error "undefined"
  const user = profile;
  const userPosts = postsData?.posts ?? [];
  const savedPosts = likesData?.posts ?? [];

  const isOwner = user?.isMe ?? false;
  const isFollowing = user?.isFollowing ?? false;

  // Ambil data statistik pengikut & kiriman secara dinamis
  const stats = user?.counts;
  const postCount = stats?.post ?? 0;
  const followersCount = stats?.followers ?? 0;
  const followingCount = stats?.following ?? 0;
  const likesCount = stats?.likes ?? 0;

  // Form Handling untuk Edit Profile
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateUserInput>({
    resolver: zodResolver(updateProfileSchema),
  });

  // Sinkronisasi data form saat profil berhasil dimuat
  useEffect(() => {
    if (user) {
      reset({
        name: user.name || "",
        username: user.username || "",
        email: user.email || "",
        phone: user.phone || "",
        bio: user.bio || "",
        avatarUrl: user.avatarUrl || "",
      });
    }
  }, [user, reset]);

  // Loading state yang bersih dan estetik
  if (isProfileLoading || isPostsLoading) {
    return (
      <div className="w-full h-screen bg-black flex items-center justify-center">
        <Loader2 className="animate-spin text-[#6936F2]" size={32} />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-black text-white px-4 pt-24 pb-32 font-sans flex flex-col items-center">
      <div className="w-full max-w-90.25 flex flex-col gap-4">
        {/* INFO USER HEADER */}
        <ProfileHeader
          name={user?.name || "User"}
          username={user?.username || username}
          avatarUrl={user?.avatarUrl}
        />

        {/* ACTIONS BUTTONS (OWNER VS VISITOR) */}
        {isOwner ? (
          <OwnerActions
            isOwner={true}
            onEditProfile={() => setIsModalOpen(true)}
          />
        ) : (
          <VisitorAction isFollowing={isFollowing} onFollowToggle={() => {}} />
        )}

        {/* BIO TEXT */}
        <p className="text-sm text-[#FDFDFD] leading-relaxed max-w-full break-words">
          {user?.bio ||
            "Creating unforgettable moments! 📸✨ Let's cherish every second together!"}
        </p>

        {/* STATISTIK COUNTER */}
        <ProfileStats
          postCount={postCount}
          followersCount={followersCount}
          followingCount={followingCount}
          likesCount={likesCount}
        />

        {/* GALLERY NAVIGATION TABS */}
        <div className="w-full flex flex-col gap-4 mt-2">
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

          {/* RENDERING FEED ATAU PROFILE SAVED GALLERY */}
          {activeTab === "posts" ? (
            userPosts.length === 0 ? (
              <ProfileEmptyState
                onCreatePost={() => setIsCreatePostOpen(true)}
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
        </div>
      </div>

      {/* FIXED BOTTOM NAV MENU BAR */}
      <BottomNavbar
        onHome={() => router.push("/feed")}
        onCreatePost={() => setIsCreatePostOpen(true)}
      />
    </div>
  );
}
