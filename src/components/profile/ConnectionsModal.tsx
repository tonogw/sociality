"use client";

import { X, User, Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

interface ConnectionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "followers" | "following";
  targetUsername?: string; // Jika tidak ada, diasumsikan memuat data profil saya ("me")
}

interface ConnectionUser {
  id: number;
  username: string;
  name: string;
  avatarUrl: string | null;
}

export default function ConnectionsModal({
  isOpen,
  onClose,
  type,
  targetUsername,
}: ConnectionsModalProps) {
  const router = useRouter();
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  // 1. Fetch data followers/following secara dinamis berdasarkan parameter target
  const { data: listResponse, isLoading } = useQuery({
    queryKey: ["connections", type, targetUsername || "me"],
    queryFn: async () => {
      const token = localStorage.getItem("token") || "";
      const path = targetUsername
        ? `/users/${targetUsername}/${type}`
        : `/me/${type}`;

      const res = await fetch(`${baseUrl}${path}`, {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to load connection data list");
      return res.json();
    },
    enabled: isOpen, // Kueri hanya menembak API saat modal dalam kondisi terbuka
  });

  // Backend menyimpan datanya dalam array listResponse atau listResponse?.data
  const users: ConnectionUser[] = listResponse?.data ?? listResponse ?? [];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-95  bg-[#0A0D12] border border-[#181D27] rounded-2xl p-6 flex flex-col gap-4 relative max-h-[80vh] shadow-2xl">
        {/* HEADER MODAL */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        <h3 className="text-sm font-bold text-white capitalize text-center">
          {type === "followers" ? "Followers" : "Following List"}
        </h3>

        <div className="w-full h-px bg-[#181D27]" />

        {/* LOADING LOADER */}
        {isLoading ? (
          <div className="w-full py-20 flex justify-center items-center">
            <Loader2 className="animate-spin text-[#6936F2]" size={24} />
          </div>
        ) : (
          /* DAFTAR USER DARI SERVER */
          <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-1 scrollbar-thin max-h-[45vh]">
            {users.length === 0 ? (
              <div className="text-center py-12 text-xs text-zinc-500 font-medium">
                No users found in this list.
              </div>
            ) : (
              users.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    onClose();
                    // Klik nama user -> langsung route ke [username]/page.tsx dinamis
                    router.push(`/${item.username}`);
                  }}
                  className="w-full flex items-center gap-3 p-1.5 hover:bg-zinc-900/40 rounded-xl cursor-pointer transition-all active:scale-99"
                >
                  <div className="w-10 h-10 rounded-full bg-zinc-800 border border-[#181D27] overflow-hidden flex items-center justify-center relative shrink-0">
                    {item.avatarUrl ? (
                      <Image
                        src={item.avatarUrl}
                        alt={item.name}
                        fill
                        className="object-cover"
                        unoptimized
                        sizes="40px"
                      />
                    ) : (
                      <User size={18} className="text-zinc-600" />
                    )}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-bold text-white leading-tight">
                      {item.name}
                    </span>
                    <span className="text-[10px] text-[#A4A7AE]">
                      @{item.username}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
