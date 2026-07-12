"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import ProfileMenu from "./ProfileMenu";

interface NavbarProfileProps {
  title?: string;
}

export default function NavbarProfile({
  title = "Profile",
}: NavbarProfileProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleBack = () => {
    const fromQ = searchParams.get("fromQ");
    const lastPage = searchParams.get("lastPage") || "1";

    if (fromQ) {
      router.push(
        `/users/search?q=${encodeURIComponent(fromQ)}&page=${lastPage}&limit=20`,
      );
      return;
    }

    router.push("/posts");
  };

  return (
    <nav className="fixed top-0 left-0 z-50 flex h-16 w-full items-center border-b border-[#181D27] bg-black px-4">
      <button
        onClick={handleBack}
        className="rounded-full p-1 text-white hover:bg-zinc-900"
      >
        <ArrowLeft size={24} />
      </button>

      <span className="ml-3 text-base font-bold text-white">{title}</span>

      <div className="ml-auto flex items-center gap-4">
        <button>
          <Search size={20} />
        </button>

        <ProfileMenu />
      </div>
    </nav>
  );
}
