"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileStats from "@/components/profile/ProfileStats";
import ProfileTabs from "@/components/profile/ProfileTabs";
import ProfileGallery from "@/components/profile/ProfileGallery";
import OwnerAction from "@/components/profile/OwnerAction";
import VisitorAction from "@/components/profile/VisitorAction";
import PrivateProfile from "@/components/profile/PrivateProfile";

export default function NewProfileContent() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [activeTab, setActiveTab] = useState<"posts" | "saved">("posts");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const urlUsername = params?.username as string | undefined;

  // 1. Ambil Identitas User yang Login
  const { data: myData, isLoading: myDataLoading } = useQuery({
    queryKey: ["my-core-identity"],
    queryFn: async () => {
      const token = localStorage.getItem("token") || "";
      const res = await fetch(`${baseUrl}/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
          accept: "application/json",
        },
      });
      if (!res.ok) return null;
      return res.json();
    },
  });

  const myUsername = myData?.data?.profile?.username;
  const isOwnProfile = !urlUsername || urlUsername === myUsername;

  // 2. Ambil Data Profil Target
  const { data: displayData, isLoading: isDisplayLoading } = useQuery({
    queryKey: ["dynamic-profile-stream", urlUsername || "me"],
    queryFn: async () => {
      const token = localStorage.getItem("token") || "";
      const endpoint = isOwnProfile
        ? `${baseUrl}/me`
        : `${baseUrl}/users/${urlUsername}`;
      const res = await fetch(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
          accept: "application/json",
        },
      });
      if (!res.ok) throw new Error("Gagal memuat data");
      return res.json();
    },
    enabled: !!myUsername || !urlUsername,
  });

  const user = displayData?.data?.profile;
  const stats = displayData?.data?.stats;

  // 🟢 PERBAIKAN STATE ERROR: Turunkan state secara deklaratif langsung dari query backend
  const isFollowing = user?.isFollowedByMe ?? false;

  const followMutation = useMutation({
    mutationFn: async () => {
      const token = localStorage.getItem("token") || "";
      const res = await fetch(`${baseUrl}/follow/${user?.username}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          accept: "application/json",
        },
        body: "",
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dynamic-profile-stream"] });
    },
  });

  const isAccountPrivate = user?.isPrivate ?? false;
  // Boolean Penentu Akses Konten Galeri sesuai logika di kepala Bapak!
  const canViewPosts = isOwnProfile || !isAccountPrivate || isFollowing;

  if (myDataLoading || isDisplayLoading) {
    return (
      <div className="w-full h-[50vh] flex flex-col items-center justify-center gap-2 text-white">
        <Loader2 className="animate-spin text-[#6936F2]" size={28} />
        <p className="text-xs text-zinc-500 font-mono">
          Assembling secure interface components...
        </p>
      </div>
    );
  }

  const targetPosts =
    activeTab === "posts" ? user?.posts || [] : user?.saved || [];

  return (
    <div className="w-full max-w-[361px] flex flex-col gap-4">
      <ProfileHeader user={user} isOwnProfile={isOwnProfile} />

      {/* RENDER TOMBOL AKSI DENGAN KONDISI LOGIS BAPAK */}
      {isOwnProfile ? (
        <OwnerAction
          onEditClick={() => router.push("/settings")}
          onCreatePostClick={() => {}}
        />
      ) : (
        <VisitorAction
          isFollowing={isFollowing}
          onFollowToggle={() => followMutation.mutate()}
        />
      )}

      <ProfileStats stats={stats} />

      {/* RENDER KONTEN BERDASARKAN CAN VIEW POSTS JELAS FIGMA BLUEPRINT BAPAK */}
      {canViewPosts ? (
        <>
          <ProfileTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            viewMode={viewMode}
            setViewMode={setViewMode}
            isOwnProfile={isOwnProfile}
          />
          <ProfileGallery
            posts={targetPosts}
            viewMode={viewMode}
            activeTab={activeTab}
            username={user?.username}
          />
        </>
      ) : (
        <PrivateProfile />
      )}
    </div>
  );
}
