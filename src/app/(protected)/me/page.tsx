"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { AxiosError } from "axios";
import { toast } from "sonner";

import { updateProfileSchema, type UpdateUserInput } from "@/validations/auth";

import ImageCropUploader from "@/components/shared/ImageCropUploader";
import BottomNavbar from "@/components/shared/BottomNavbar";

import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileStats from "@/components/profile/ProfileStats";
import OwnerActions from "@/components/profile/OwnerAction";
import ProfileTabs from "@/components/profile/ProfileTabs";
import ProfileGallery from "@/components/profile/ProfileGallery";
import ProfileSavedGallery from "@/components/profile/ProfileSavedGallery";
import ProfileEmptyState from "@/components/profile/ProfileEmptyState";
import ProfileEditModal from "@/components/profile/ProfileEditModal";

import { meService } from "@/services/meService";

import { useMePosts } from "@/queries/me/useMePosts";
import { useMeSaved } from "@/queries/me/useMeSaved";
import { useMeLikes } from "@/queries/me/useMeLikes";
import { useCreatePost } from "@/queries/posts/useCreatePost";

import { getCleanBio } from "@/lib/utils";

interface ApiErrorResponse {
  message?: string;
}

export default function MyProfilePage() {
  const router = useRouter();

  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<"feed" | "saved" | "likes">(
    "feed",
  );

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

  const { data: mePostsData } = useMePosts(1, 20);

  const { data: meSavedData } = useMeSaved(1, 20);

  const { data: meLikesData } = useMeLikes(1, 20);

  const createPostMutation = useCreatePost();

  const user = profileData?.data.profile;

  const stats = profileData?.data.stats;

  const mePosts = mePostsData?.data.items ?? [];

  const savedPosts = meSavedData?.data.posts ?? [];

  const likedPosts = meLikesData?.data.posts ?? [];

  const postCount = stats?.posts ?? mePosts.length;

  const followersCount = stats?.followers ?? 0;

  const followingCount = stats?.following ?? 0;

  const likesCount = stats?.likes ?? likedPosts.length;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateUserInput>({
    resolver: zodResolver(updateProfileSchema),
  });

  useEffect(() => {
    if (!user) return;

    reset({
      name: user.name,
      username: user.username,
      email: user.email,
      phone: user.phone,
      bio: getCleanBio(user.bio),
      avatarUrl: user.avatarUrl,
    });
  }, [user, reset]);

  const updateProfileMutation = useMutation({
    mutationFn: meService.updateMe,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["my-profile"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["me-posts"],
      });

      toast.success("Profile updated successfully", {
        style: {
          background: "#079455",
          color: "#FFFFFF",
          border: "none",
        },
      });

      setIsModalOpen(false);
      setSelectedAvatarFile(null);
      setPreviewAvatarUrl(null);
    },

    onError: (error: AxiosError<ApiErrorResponse>) => {
      toast.error(error.response?.data?.message ?? "Failed to update profile.");
    },
  });

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setIsAvatarCropOpen(true);
  };

  const handleAvatarCropped = async (
    croppedFile: File,
    // caption?: string,
  ): Promise<void> => {
    // if (caption) {
    // }

    setSelectedAvatarFile(croppedFile);

    setPreviewAvatarUrl(URL.createObjectURL(croppedFile));

    setIsAvatarCropOpen(false);

    toast.success("Avatar updated.");
  };

  const onSubmit = (data: UpdateUserInput) => {
    const isPrivate = user?.bio?.includes("[private:true]") ?? false;

    const finalBio = isPrivate ? `${data.bio} [private:true]` : data.bio;

    const formData = new FormData();

    formData.append("name", data.name);

    formData.append("username", data.username);

    formData.append("phone", data.phone);

    if (finalBio) {
      formData.append("bio", finalBio);
    }

    if (selectedAvatarFile) {
      formData.append("avatar", selectedAvatarFile);
    }

    updateProfileMutation.mutate(formData);
  };

  const handleCreatePost = async (
    croppedFile: File,
    // caption?: string
  ) => {
    const formData = new FormData();

    formData.append("image", croppedFile);

    formData.append("caption", "New Moment Shared");

    createPostMutation.mutate(formData, {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: ["me-posts"],
        });

        toast.success("Moment uploaded successfully.");

        setIsCreatePostOpen(false);

        setActiveTab("feed");
      },

      onError: () => {
        toast.error("Failed create post.");
      },
    });
  };

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-black">
        <Loader2 size={32} className="animate-spin text-[#6936F2]" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-black text-white px-4 pt-24 pb-32 font-sans flex flex-col items-center">
      <div className="w-full max-w-90.25 lg:max-w-150 flex flex-col gap-4">
        <ProfileHeader
          name={user?.name}
          username={user?.username}
          avatarUrl={user?.avatarUrl}
          isOwner
        />

        <OwnerActions isOwner onEditProfile={() => setIsModalOpen(true)} />

        <p className="text-sm text-[#FDFDFD] leading-relaxed break-words">
          {getCleanBio(user?.bio) || "Creating unforgettable moments! 📸✨"}
        </p>

        <ProfileStats
          postCount={postCount}
          followersCount={followersCount}
          followingCount={followingCount}
          likesCount={likesCount}
          onPostsClick={() => setActiveTab("feed")}
          onFollowersClick={() => router.push(`/${user?.username}/followers`)}
          onFollowingClick={() => router.push(`/${user?.username}/following`)}
          onLikesClick={() => setActiveTab("likes")}
        />

        <div className="w-full flex flex-col gap-4 mt-2">
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
            onSavedClick={() => setActiveTab("saved")}
            onLikesClick={() => setActiveTab("likes")}
          />

          {activeTab === "feed" &&
            (mePosts.length === 0 ? (
              <ProfileEmptyState
                onCreatePost={() => setIsCreatePostOpen(true)}
              />
            ) : (
              <ProfileGallery
                posts={mePosts}
                viewMode={viewMode}
                username={user?.username}
                canDelete
              />
            ))}

          {activeTab === "saved" && <ProfileSavedGallery posts={savedPosts} />}

          {activeTab === "likes" &&
            (likedPosts.length === 0 ? (
              <div className="w-full py-16 text-center text-xs text-zinc-500">
                No liked posts yet.
              </div>
            ) : (
              <ProfileGallery
                posts={likedPosts}
                viewMode={viewMode}
                username={user?.username}
                canDelete={false}
              />
            ))}
        </div>
      </div>

      <BottomNavbar
        onHome={() => router.push("/feed")}
        onCreatePost={() => setIsCreatePostOpen(true)}
        onProfile={() => router.push("/me")}
        avatarUrl={user?.avatarUrl}
      />

      <ImageCropUploader
        mode="post"
        isOpen={isCreatePostOpen}
        onClose={() => setIsCreatePostOpen(false)}
        onUpload={handleCreatePost}
        isUploading={createPostMutation.isPending}
      />

      <ImageCropUploader
        mode="avatar"
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
        isSaving={updateProfileMutation.isPending}
      />
    </div>
    // </div>
  );
}
