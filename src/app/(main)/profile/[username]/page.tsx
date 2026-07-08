"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function UserProfileDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const username = params?.username as string;
  // Tangkap query pencarian asal dari URL jika ada
  const fromQuery = searchParams.get("fromQ") || "";
  const lastPage = searchParams.get("lastPage");

  const handleBackNavigation = () => {
    if (fromQuery) {
      // Kembali ke halaman search dengan mempertahankan keyword aslinya
      router.push(
        `/users/search?q=${encodeURIComponent(fromQuery)}&page=${lastPage}&limit=20`,
      );
    } else {
      // Jika masuk bukan dari halaman pencarian, arahkan kembali ke beranda
      router.push("/");
    }
  };

  return (
    <div className="w-full min-h-screen bg-black text-white px-4 pt-6 pb-24 flex flex-col items-center">
      <div className="w-full max-w-[361px] flex flex-col gap-6">
        {/* Header Navigasi Balik Eksplisit */}
        <div className="flex items-center gap-3 w-full border-b border-zinc-900 pb-4">
          <button
            onClick={handleBackNavigation}
            className="p-1 hover:bg-zinc-900 rounded-full transition-colors cursor-pointer flex items-center justify-center text-white"
          >
            <ArrowLeft size={22} />
          </button>
          <span className="text-base font-bold tracking-tight">
            Profil @{username}
          </span>
        </div>

        {/* Info Konten Sementara */}
        <div className="w-full flex flex-col items-center justify-center py-20 text-center gap-2">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#6936F2] to-[#AD3AE7] flex items-center justify-center text-2xl font-bold uppercase">
            {username?.charAt(0)}
          </div>
          <h2 className="text-lg font-bold mt-2">@{username}</h2>
          <p className="text-xs text-zinc-500 max-w-[240px]">
            Halaman profil publik milik user ini sedang dalam persiapan
            integrasi data.
          </p>
        </div>
      </div>
    </div>
  );
}
