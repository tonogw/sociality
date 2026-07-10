"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Grid,
  Bookmark,
  X,
  Loader2,
  Camera,
  Home,
  Plus,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { AxiosError } from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { updateProfileSchema, type UpdateUserInput } from "@/validations/auth";
import { userService } from "@/services/userService";
import ImageCropUploader from "@/components/shared/ImageCropUploader";
import TimelineCard from "@/components/shared/TimelineCard";

interface ApiErrorResponse {
  message?: string;
}

// 🟢 PERBAIKAN TS 1: Tambahkan skema objek 'author' ke dalam interface Post agar linter lulus bersih
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

interface ProfileStateData {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  bio: string | null;
  avatarUrl: string | null;
  posts?: Post[];
  saved?: Post[];
}

export default function MyProfilePage() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [activeTab, setActiveTab] = useState<"posts" | "saved">("posts");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { data: profileData, isLoading } = useQuery({
    queryKey: ["user-profile"],
    queryFn: userService.getMe,
  });

  const { data: feedData } = useQuery({
    queryKey: ["user-my-feed"],
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
    mutationFn: userService.updateMe,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      toast.success("Profile updated successfully", {
        style: {
          background: "#079455",
          color: "#FFFFFF",
          borderRadius: "8px",
          border: "none",
        },
      });
      setIsModalOpen(false);
      setSelectedFile(null);
      setPreviewUrl(null);
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      const msg = error.response?.data?.message || "Failed to update profile.";
      toast.error(msg);
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const onSubmit = (data: UpdateUserInput) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("username", data.username);
    formData.append("phone", data.phone);
    if (data.bio) formData.append("bio", data.bio);
    if (data.avatarUrl) formData.append("avatarUrl", data.avatarUrl);

    if (selectedFile) {
      formData.append("avatar", selectedFile);
    }
    mutation.mutate(formData);
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
      <div className="w-full max-w-[361px] flex flex-col gap-4">
        {/* INFO USER */}
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 rounded-full bg-zinc-800 border border-[#181D27] overflow-hidden flex items-center justify-center relative">
            {user?.avatarUrl ? (
              <Image
                src={user.avatarUrl}
                alt="Avatar"
                fill
                className="object-cover"
                unoptimized
                sizes="64px"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-tr from-[#6936F2] to-[#AD3AE7] flex items-center justify-center text-xl font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <h2 className="text-sm font-bold text-[#FDFDFD] tracking-tight">
              {user?.name}
            </h2>
            <p className="text-sm text-[#A4A7AE]">@{user?.username}</p>
          </div>
        </div>

        {/* ACTIONS BUTTONS */}
        <div className="flex items-center gap-3 w-full h-10">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex-1 h-full border border-[#181D27] hover:bg-zinc-950 font-bold rounded-full text-sm text-[#FDFDFD] transition-colors flex items-center justify-center cursor-pointer"
          >
            Edit Profile
          </button>
          <button className="w-10 h-10 border border-[#181D27] hover:bg-zinc-950 rounded-full flex items-center justify-center cursor-pointer text-[#FDFDFD]">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="rotate-45"
            >
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>

        {/* BIO TEXT */}
        <p className="text-sm text-[#FDFDFD] leading-relaxed max-w-full break-words">
          {user?.bio ||
            "Creating unforgettable moments with my favorite person! 📸✨ Let's cherish every second together!"}
        </p>

        {/* STATS COUNTER BAR */}
        <div className="flex items-center gap-4 w-full h-[50px] border-y border-[#181D27] py-2 mt-2">
          <div className="flex-1 flex flex-col items-center">
            <span className="text-lg font-bold text-[#FDFDFD]">
              {postCount}
            </span>
            <span className="text-xs text-[#A4A7AE]">Post</span>
          </div>
          <div className="w-[1px] h-6 bg-[#181D27]" />
          <div className="flex-1 flex flex-col items-center">
            <span className="text-lg font-bold text-[#FDFDFD]">
              {followersCount}
            </span>
            <span className="text-xs text-[#A4A7AE]">Followers</span>
          </div>
          <div className="w-[1px] h-6 bg-[#181D27]" />
          <div className="flex-1 flex flex-col items-center">
            <span className="text-lg font-bold text-[#FDFDFD]">
              {followingCount}
            </span>
            <span className="text-xs text-[#A4A7AE]">Following</span>
          </div>
          <div className="w-[1px] h-6 bg-[#181D27]" />
          <div className="flex-1 flex flex-col items-center">
            <span className="text-lg font-bold text-[#FDFDFD]">
              {likesCount}
            </span>
            <span className="text-xs text-[#A4A7AE]">Likes</span>
          </div>
        </div>

        {/* GALLERY NAVIGATION TABS */}
        <div className="w-full flex flex-col gap-4 mt-2">
          <div className="w-full h-12 flex border-b border-[#181D27]">
            <button
              onClick={() => {
                if (activeTab === "posts") {
                  setViewMode((prev) => (prev === "grid" ? "list" : "grid"));
                } else {
                  setActiveTab("posts");
                }
              }}
              className={`flex-1 h-full flex items-center justify-center gap-2 font-bold text-sm border-b-2 transition-all ${
                activeTab === "posts"
                  ? "border-[#FDFDFD] text-[#FDFDFD]"
                  : "border-transparent text-[#A4A7AE]"
              }`}
            >
              <Grid
                size={20}
                className={viewMode === "list" ? "text-[#6936F2]" : ""}
              />

              <span>Gallery {viewMode === "list" ? "(Feed)" : "(Grid)"}</span>
            </button>
            <button
              onClick={() => setActiveTab("saved")}
              className={`flex-1 h-full flex items-center justify-center gap-2 font-bold text-sm border-b-2 transition-all ${
                activeTab === "saved"
                  ? "border-[#FDFDFD] text-[#FDFDFD]"
                  : "border-transparent text-[#A4A7AE]"
              }`}
            >
              <Bookmark size={20} /> Saved
            </button>
          </div>

          {activeTab === "posts" ? (
            userPosts.length === 0 ? (
              <div className="w-full flex flex-col items-center text-center px-4 py-12 gap-6 animate-fade-in">
                <div className="flex flex-col gap-2">
                  <h3 className="text-base font-bold text-white tracking-tight">
                    Your story starts here
                  </h3>
                  <p className="text-sm text-[#A4A7AE] leading-relaxed max-w-[280px]">
                    Share your first post and let the world see your moments,
                    passions, and memories.
                  </p>
                </div>
                <button
                  onClick={() => setIsCreatePostOpen(true)}
                  className="w-full max-w-[280px] h-11 bg-[#6936F2] hover:bg-[#522BC8] text-[#FDFDFD] font-bold rounded-full text-sm transition-all duration-200 shadow-lg cursor-pointer flex items-center justify-center"
                >
                  Upload My First Post
                </button>
              </div>
            ) : (
              /* 🟢 SOLUSI MUTLAK: Pisahkan container secara total berdasarkan viewMode */
              <div className="w-full h-auto animate-fade-in">
                {viewMode === "grid" ? (
                  /* 1️⃣ TAMPILAN MODE GRID (Murni Kotak 3-Kolom, Gambar Kecil 120px) */
                  <div className="grid grid-cols-3 gap-1 w-full">
                    {userPosts.map((singlePost: Post) => (
                      <div
                        key={singlePost.id}
                        className="w-full aspect-square bg-zinc-900 border border-[#181D27] rounded-sm overflow-hidden relative"
                      >
                        <Image
                          src={singlePost.imageUrl || "/placeholder.png"}
                          alt="Post Grid View"
                          fill
                          className="object-cover"
                          unoptimized
                          sizes="120px" // Ukuran kecil untuk optimalisasi grid 3 kolom
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  /* 2️⃣ TAMPILAN MODE LIST/FEED (Murni 1 Kolom Vertikal, Melebar Penuh Sesuai Figma) */
                  <div className="flex flex-col gap-6 w-full items-center">
                    {userPosts.map((singlePost: Post) => (
                      <TimelineCard
                        key={singlePost.id}
                        post={singlePost} // Mengirim object post tunggal ke komponen shared
                        currentUsername={user?.username}
                      />
                    ))}
                  </div>
                )}
              </div>
            )
          ) : savedPosts.length === 0 ? (
            <div className="w-full text-center py-16 text-sm text-[#A4A7AE]">
              No saved posts yet.
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-1 w-full">
              {savedPosts.map((save: Post) => (
                <div
                  key={save.id}
                  className="w-full aspect-square bg-zinc-900 border border-[#181D27] rounded-sm overflow-hidden relative"
                >
                  <Image
                    src={save.imageUrl}
                    alt="Saved"
                    fill
                    className="object-cover"
                    unoptimized
                    sizes="120px"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* FIXED BOTTOM NAV MENU BAR */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[345px] h-16 bg-[#0A0D12]/90 border border-[#181D27] backdrop-blur-[50px] rounded-full flex items-center justify-center gap-4 px-6 z-20 shadow-xl">
        <button
          onClick={() => router.push("/feed")}
          className="flex-1 flex flex-col items-center gap-0.5 text-zinc-400 hover:text-white cursor-pointer"
        >
          <Home size={20} />
          <span className="text-[10px] font-bold">Home</span>
        </button>
        <button
          onClick={() => setIsCreatePostOpen(true)}
          className="w-11 h-11 bg-[#6936F2] hover:bg-[#522BC8] rounded-full flex items-center justify-center text-white shadow-lg cursor-pointer shrink-0 transition-transform active:scale-95"
        >
          <Plus size={22} />
        </button>
        <button className="flex-1 flex flex-col items-center gap-0.5 text-[#7F51F9] cursor-default">
          <Image
            src="/icons/icon-profile.svg"
            alt="profile"
            width={24}
            height={24}
            unoptimized
            className="w-6 h-6 cursor-pointer"
          />
          <span className="text-[10px] font-bold">Profile</span>
        </button>
      </div>

      {/* INTEGRASI MURNI IMAGE CROPPER MODULAR */}
      <ImageCropUploader
        isOpen={isCreatePostOpen}
        onClose={() => setIsCreatePostOpen(false)}
        onUpload={async (croppedFile, caption) => {
          try {
            const token = localStorage.getItem("token") || "";
            const formData = new FormData();
            formData.append("image", croppedFile);
            formData.append("caption", caption || "New Moment Shared");

            const res = await fetch(`${baseUrl}/posts`, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
              },
              body: formData,
            });
            if (!res.ok) throw new Error("Failed Post new moment");
            const json = await res.json();

            if (json) {
              toast.success("Success Post", {
                description:
                  "Your gorgeous moment has been uploaded successfully!",
                style: {
                  background: "#079455",
                  color: "#FFFFFF",
                  borderRadius: "12px",
                  border: "none",
                },
              });
              queryClient.invalidateQueries({ queryKey: ["user-profile"] });
              queryClient.invalidateQueries({ queryKey: ["user-my-feed"] });
              setIsCreatePostOpen(false);
            }
          } catch (err) {
            toast.error(
              err instanceof Error ? err.message : "Failed process post",
            );
          }
        }}
        isUploading={false}
      />

      {/* MODAL EDIT BASIC PROFILE */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-[380px] bg-black border border-[#181D27] rounded-2xl p-6 flex flex-col items-center gap-5 relative max-h-[90vh] overflow-y-auto shadow-2xl">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-white"
            >
              <X size={20} />
            </button>
            <h3 className="text-lg font-bold text-white tracking-tight">
              Edit Profile
            </h3>

            <div className="flex flex-col items-center gap-2">
              <label className="relative group cursor-pointer w-20 h-20 rounded-full bg-zinc-900 border border-[#181D27] overflow-hidden flex items-center justify-center">
                {previewUrl || user?.avatarUrl ? (
                  <Image
                    src={previewUrl || user?.avatarUrl || "/placeholder.png"}
                    alt="Avatar Preview"
                    fill
                    className="object-cover"
                    unoptimized
                    sizes="80px"
                  />
                ) : (
                  <User size={32} className="text-zinc-600" />
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <Camera size={18} className="text-white" />
                </div>
                <input
                  id="image-file"
                  type="file"
                  accept="image/png, image/jpeg, image/jpg"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              <span className="text-xs text-zinc-400">
                Tap avatar to change
              </span>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="w-full flex flex-col gap-4"
            >
              <div className="flex flex-col gap-1 w-full">
                <label className="text-xs font-bold text-white">Name</label>
                <div className="w-full h-11 bg-[#0A0D12] border border-[#181D27] rounded-xl px-4 flex items-center">
                  <input
                    id="name"
                    type="text"
                    {...register("name")}
                    className="w-full bg-transparent text-white text-sm focus:outline-none"
                  />
                </div>
                {errors.name && (
                  <p className="text-red-400 text-xs">{errors.name.message}</p>
                )}
              </div>

              <div className="flex flex-col gap-1 w-full">
                <label className="text-xs font-bold text-white">Username</label>
                <div className="w-full h-11 bg-[#0A0D12] border border-[#181D27] rounded-xl px-4 flex items-center">
                  <input
                    id="username"
                    type="text"
                    {...register("username")}
                    className="w-full bg-transparent text-white text-sm focus:outline-none"
                  />
                </div>
                {errors.username && (
                  <p className="text-red-400 text-xs">
                    {errors.username.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1 w-full">
                <label className="text-xs font-bold text-white">
                  Number Phone
                </label>
                <div className="w-full h-11 bg-[#0A0D12] border border-[#181D27] rounded-xl px-4 flex items-center">
                  <input
                    id="phone"
                    type="text"
                    {...register("phone")}
                    className="w-full bg-transparent text-white text-sm focus:outline-none"
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-400 text-xs">{errors.phone.message}</p>
                )}
              </div>

              <div className="flex flex-col gap-1 w-full">
                <label className="text-xs font-bold text-white">Bio</label>
                <div className="w-full bg-[#0A0D12] border border-[#181D27] rounded-xl p-3 flex">
                  <textarea
                    rows={3}
                    placeholder="Tell us about yourself..."
                    {...register("bio")}
                    className="w-full bg-transparent text-white text-sm focus:outline-none resize-none"
                  />
                </div>
                {errors.bio && (
                  <p className="text-red-400 text-xs">{errors.bio.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={mutation.isPending}
                className="w-full h-10 bg-[#6936F2] hover:bg-[#522BC8] disabled:bg-zinc-800 disabled:text-zinc-500 text-white font-bold rounded-full text-sm mt-2 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {mutation.isPending && (
                  <Loader2 size={16} className="animate-spin" />
                )}
                {mutation.isPending ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
