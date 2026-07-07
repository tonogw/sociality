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

import { updateProfileSchema, type UpdateUserInput } from "@/lib/validations";
import { userService } from "@/services/userService";

interface ApiErrorResponse {
  message?: string;
}

interface Post {
  id: number;
  imageUrl: string;
  caption?: string;
  createdAt: string;
}

export default function MyProfilePage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"posts" | "saved">("posts");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // 1. Ambil Data Profil Pengguna (Termasuk stats dari API)
  const { data: profileData, isLoading } = useQuery({
    queryKey: ["user-profile"],
    queryFn: userService.getMe,
  });

  const user = profileData?.data?.user || profileData?.user;

  // Ambil counter stats asli dari API. Jika belum ada dari backend, default ke 0
  const postCount = user?.postsCount || 0;
  const followersCount = user?.followersCount || 0;
  const followingCount = user?.followingCount || 0;
  const likesCount = user?.likesCount || 0;

  // Tempat menampung data array posts (Guna mengecek Gallery kosong atau tidak)
  const userPosts = user?.posts || [];
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
    <div className="relative min-h-screen bg-black text-white px-4 pt-6 pb-24 font-sans flex flex-col items-center">
      {/* CARD CONTAINER PROFIL */}
      <div className="w-full max-w-[361px] flex flex-col gap-4">
        {/* INFO USER */}
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 rounded-full bg-zinc-800 border border-[#181D27] overflow-hidden flex items-center justify-center relative">
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt="Avatar"
                className="w-full h-full object-cover"
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

        {/* BIO TEXT */}
        <p className="text-sm text-[#FDFDFD] leading-relaxed max-w-full break-words">
          {user?.bio ||
            "Creating unforgettable moments with my favorite person! 📸✨ Let's cherish every second together!"}
        </p>

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

        {/* DYNAMIC STATS COUNTER BAR (Sesuai Data Figma) */}
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
              onClick={() => setActiveTab("posts")}
              className={`flex-1 h-full flex items-center justify-center gap-2 font-bold text-sm border-b-2 transition-all ${
                activeTab === "posts"
                  ? "border-[#FDFDFD] text-[#FDFDFD]"
                  : "border-transparent text-[#A4A7AE]"
              }`}
            >
              <Grid size={20} /> Gallery
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

          {/* ============================================================
              KONDISI KONTEN: DYNAMIC EMPTY STATE VS GRID IMAGES 
              ============================================================ */}
          {activeTab === "posts" ? (
            userPosts.length === 0 ? (
              /* KONDISI FIGMA 3: EMPTY POST STATE (Up Close & Personal) */
              <div className="w-full flex flex-col items-center text-center px-4 py-12 gap-6 animate-fade-in">
                <div className="flex flex-col gap-2">
                  <h3 className="text-base font-bold text-white tracking-tight">
                    Your story starts here
                  </h3>
                  <p className="text-sm text-[#A4A7AE] leading-relaxed max-w-[280px]">
                    Share your first post and let the world see your moments,
                    passions, and memories. Make this space truly yours.
                  </p>
                </div>
                <button
                  onClick={() => toast.info("Redirecting to create post...")}
                  className="w-full max-w-[280px] h-11 bg-[#6936F2] hover:bg-[#522BC8] text-[#FDFDFD] font-bold rounded-full text-sm transition-all duration-200 shadow-lg cursor-pointer flex items-center justify-center"
                >
                  Upload My First Post
                </button>
              </div>
            ) : (
              /* KONDISI FIGMA 1: GRID GALLERY ADA ISI */
              <div className="grid grid-cols-3 gap-1 w-full">
                {userPosts.map((post: Post) => (
                  <div
                    key={post.id}
                    className="w-full aspect-square bg-zinc-900 border border-[#181D27] rounded-sm overflow-hidden"
                  >
                    <img
                      src={post.imageUrl || "/placeholder.png"}
                      alt="Post"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )
          ) : /* TAB SAVED */
          savedPosts.length === 0 ? (
            <div className="w-full text-center py-16 text-sm text-[#A4A7AE]">
              No saved posts yet.
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-1 w-full">
              {savedPosts.map((save: Post) => (
                <div
                  key={save.id}
                  className="w-full aspect-square bg-zinc-900 border border-[#181D27] rounded-sm overflow-hidden"
                >
                  <img
                    src={save.imageUrl}
                    alt="Saved"
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* FIXED BOTTOM NAV MENU BAR */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[345px] h-16 bg-[#0A0D12]/90 border border-[#181D27] backdrop-blur-[50px] rounded-full flex items-center justify-center gap-4 px-6 z-20 shadow-xl">
        <button className="flex-1 flex flex-col items-center gap-0.5 text-white">
          <Home size={20} />
          <span className="text-[10px] font-bold">Home</span>
        </button>
        <button className="w-11 h-11 bg-[#6936F2] hover:bg-[#522BC8] rounded-full flex items-center justify-center text-white shadow-lg cursor-pointer shrink-0">
          <Plus size={22} />
        </button>
        <button className="flex-1 flex flex-col items-center gap-0.5 text-[#7F51F9]">
          <User size={20} />
          <span className="text-[10px] font-bold">Profile</span>
        </button>
      </div>

      {/* ============================================================
          MODAL DRAWER POPUP: EDIT BASIC PROFILE (Bebas 'any')
          ============================================================ */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-[380px] bg-black border border-[#181D27] rounded-2xl p-6 flex flex-col items-center gap-5 relative max-h-[90vh] overflow-y-auto shadow-2xl">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
            <h3 className="text-lg font-bold text-white tracking-tight">
              Edit Profile
            </h3>

            <div className="flex flex-col items-center gap-2">
              <label className="relative group cursor-pointer w-20 h-20 rounded-full bg-zinc-900 border border-[#181D27] overflow-hidden flex items-center justify-center">
                {previewUrl || user?.avatarUrl ? (
                  <img
                    src={previewUrl || user?.avatarUrl}
                    alt="Avatar Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={32} className="text-zinc-600" />
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <Camera size={18} className="text-white" />
                </div>
                <input
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
