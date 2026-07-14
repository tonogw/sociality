"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";

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

import { meService } from "@/services/meService";
import type { PostItem } from "@/types/post";

interface ApiErrorResponse {
  message?: string;
}

interface ProfileStateData {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  bio: string | null;
  avatarUrl: string | null;
  posts?: PostItem[];
  saved?: PostItem[];
}

export default function MyProfilePage() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [activeTab, setActiveTab] = useState<"posts" | "saved">("posts");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isAvatarCropOpen, setIsAvatarCropOpen] = useState(false);

  const [selectedAvatarFile, setSelectedAvatarFile] = useState<File | null>(
    null,
  );
  const [previewAvatarUrl, setPreviewAvatarUrl] = useState<string | null>(null);

  const { data: profileData, isLoading } = useQuery({
    queryKey: ["my-profile"],
    queryFn: meService.getMe,
  });

  const { data: feedData } = useQuery({
    queryKey: ["my-feed"],
    queryFn: async () => {
      const token = localStorage.getItem("token") || "";
      const res = await fetch(`${baseUrl}/feed?page=1&limit=20`, {
        headers: {
          Authorization: `Bearer ${token}`,
          accept: "application/json",
        },
      });
      return res.json();
    },
  });

  const user = profileData?.data?.profile as ProfileStateData | undefined;
  const isOwner = true;
  const stats = profileData?.data?.stats;

  const postCount = stats?.posts ?? 0;
  const followersCount = stats?.followers ?? 0;
  const followingCount = stats?.following ?? 0;
  const likesCount = stats?.likes ?? 0;

  const backupPost = feedData?.data?.items || [];
  const userPosts =
    user?.posts && user.posts.length > 0 ? user.posts : backupPost;
  const savedPosts = user?.saved || [];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateUserInput>({
    resolver: zodResolver(updateProfileSchema),
  });

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

  const mutation = useMutation({
    mutationFn: meService.updateMe,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["my-profile"] });
      await queryClient.invalidateQueries({ queryKey: ["my-feed"] });
      toast.success("Profile updated successfully", {
        style: {
          background: "#079455",
          color: "#FFFFFF",
          borderRadius: "8px",
          border: "none",
        },
      });
      setIsModalOpen(false);
      setSelectedAvatarFile(null);
      setPreviewAvatarUrl(null);
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      const msg = error.response?.data?.message || "Failed to update profile.";
      toast.error(msg);
    },
  });

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsAvatarCropOpen(true);
    }
  };

  // FIX TYPE ERROR: Mengubah fungsi menjadi async Promise<void> agar lolos validasi tipe onUpload
  const handleAvatarCropped = async (
    croppedFile: File,
    // caption?: string,
  ): Promise<void> => {
    setSelectedAvatarFile(croppedFile);
    setPreviewAvatarUrl(URL.createObjectURL(croppedFile));
    setIsAvatarCropOpen(false);
    toast.info("Avatar image cropped successfully!");
  };

  const onSubmit = (data: UpdateUserInput) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("username", data.username);
    formData.append("phone", data.phone);
    if (data.bio) formData.append("bio", data.bio);
    if (data.avatarUrl) formData.append("avatarUrl", data.avatarUrl);

    if (selectedAvatarFile) {
      formData.append("avatar", selectedAvatarFile);
    }
    mutation.mutate(formData);
  };

  const handleCreatePost = async (croppedFile: File, caption?: string) => {
    try {
      const token = localStorage.getItem("token") || "";
      const formData = new FormData();

      formData.append("image", croppedFile);
      formData.append("caption", caption || "New Moment Shared");

      const res = await fetch(`${baseUrl}/posts`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) throw new Error("Failed Post new moment");
      const json = await res.json();

      if (json) {
        toast.success("Success Post", {
          description: "Your gorgeous moment has been uploaded successfully!",
          style: {
            background: "#079455",
            color: "#FFFFFF",
            borderRadius: "12px",
            border: "none",
          },
        });

        await queryClient.invalidateQueries({ queryKey: ["my-profile"] });
        await queryClient.invalidateQueries({ queryKey: ["my-feed"] });

        setIsCreatePostOpen(false);
        setActiveTab("posts");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed process post");
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#6936F2]" size={32} />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-black text-white px-4 pt-24 pb-32 font-sans flex flex-col items-center">
      <div className="w-full max-w-90.25 flex flex-col gap-4">
        <ProfileHeader
          name={user?.name}
          username={user?.username}
          avatarUrl={user?.avatarUrl}
          isOwner={isOwner}
        />

        {isOwner ? (
          <OwnerActions
            isOwner={true}
            onEditProfile={() => setIsModalOpen(true)}
          />
        ) : (
          <VisitorAction isFollowing={false} onFollowToggle={() => {}} />
        )}

        <p className="text-sm text-[#FDFDFD] leading-relaxed max-w-full wrap-break-words">
          {user?.bio || "Creating unforgettable moments! 📸✨"}
        </p>

        <ProfileStats
          postCount={postCount}
          followersCount={followersCount}
          followingCount={followingCount}
          likesCount={likesCount}
        />

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

      {/* FIX ROUTING HOME KEMBALI KE /feed KARENA RUMAHNYA AKAN KITA BANGUN */}
      <BottomNavbar
        onHome={() => router.push("/feed")}
        onCreatePost={() => setIsCreatePostOpen(true)}
        onProfile={() => router.push("/me")}
        avatarUrl={user?.avatarUrl}
      />

      <ImageCropUploader
        isOpen={isCreatePostOpen}
        onClose={() => setIsCreatePostOpen(false)}
        onUpload={handleCreatePost}
        isUploading={false}
      />

      <ImageCropUploader
        isOpen={isAvatarCropOpen}
        onClose={() => setIsAvatarCropOpen(false)}
        onUpload={handleAvatarCropped}
        isUploading={false}
      />

      <ProfileEditModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        previewUrl={previewAvatarUrl}
        avatarUrl={user?.avatarUrl}
        handleFileChange={handleAvatarFileChange}
        register={register}
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        errors={errors}
        isSaving={mutation.isPending}
      />
    </div>
  );
}
