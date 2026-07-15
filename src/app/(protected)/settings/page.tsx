"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Lock,
  Unlock,
  LogOut,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { meService } from "@/services/meService";
import { getIsPrivateFromBio, generateBioWithPrivacy } from "@/lib/utils";

export default function SettingsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isPrivate, setIsPrivate] = useState(false);

  const { data: profileData, isLoading } = useQuery({
    queryKey: ["my-profile"],
    queryFn: meService.getMe,
  });

  const user = profileData?.data?.profile;

  useEffect(() => {
    if (user) {
      const parsedPrivate = getIsPrivateFromBio(user.bio);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsPrivate((prev) => (prev !== parsedPrivate ? parsedPrivate : prev));
    }
  }, [user]);

  const mutation = useMutation({
    mutationFn: async (privateStatus: boolean) => {
      const targetBio = generateBioWithPrivacy(user?.bio, privateStatus);
      const formData = new FormData();
      formData.append("name", user?.name || "");
      formData.append("username", user?.username || "");
      formData.append("phone", user?.phone || "");
      formData.append("bio", targetBio);
      return meService.updateMe(formData);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["my-profile"] });
      toast.success("Privacy setting updated on database!");
    },
    onError: () => {
      toast.error("Failed to update privacy settings.");
      setIsPrivate((prev) => !prev);
    },
  });

  const handlePrivacyToggle = () => {
    const nextStatus = !isPrivate;
    setIsPrivate(nextStatus);
    mutation.mutate(nextStatus);
  };

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      queryClient.clear();
      toast.success("Logged out successfully");
      router.push("/login");
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-screen bg-black flex flex-col items-center justify-center gap-2">
        <Loader2 className="animate-spin text-[#6936F2]" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col items-center pt-8 px-4 pb-20">
      <div className="w-full max-w-[393px] flex flex-col gap-6">
        <div className="w-full flex items-center justify-between border-b border-[#181D27] pb-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft size={18} />
            <span className="text-xs font-semibold">Back</span>
          </button>
          <h1 className="text-sm font-bold text-white">Account Settings</h1>
          <div className="w-10" />
        </div>

        <div className="w-full flex flex-col gap-5">
          <div className="flex flex-col gap-3 bg-[#0A0D12] border border-[#181D27] rounded-2xl p-5">
            <div className="flex items-center gap-2 text-[#6936F2] mb-1">
              <ShieldCheck size={18} />
              <h2 className="text-xs font-bold uppercase tracking-wider">
                Privacy & Security
              </h2>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed">
              When your account is private, only people you approve can see your
              captured memories and details.
            </p>

            <div className="w-full h-[1px] bg-[#181D27] my-2" />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-xl ${isPrivate ? "bg-red-950/30 text-red-400" : "bg-emerald-950/30 text-emerald-400"}`}
                >
                  {isPrivate ? <Lock size={18} /> : <Unlock size={18} />}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-white">
                    Private Account
                  </span>
                  <span className="text-[10px] text-zinc-500">
                    Currently: {isPrivate ? "Locked" : "Public"}
                  </span>
                </div>
              </div>

              <button
                onClick={handlePrivacyToggle}
                disabled={mutation.isPending}
                className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 relative cursor-pointer flex items-center ${
                  isPrivate ? "bg-[#6936F2]" : "bg-zinc-800"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white shadow-md transition-transform duration-300 ${
                    isPrivate ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="flex flex-col bg-[#0A0D12] border border-[#181D27] rounded-2xl p-5">
            <button
              onClick={handleLogout}
              className="w-full h-11 bg-red-950/20 hover:bg-red-900/30 border border-red-900/30 text-red-400 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <LogOut size={16} />
              Logout from Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
