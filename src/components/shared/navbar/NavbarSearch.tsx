"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import SearchBar from "@/components/shared/SearchBar";

export default function NavbarSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [keyword, setKeyword] = useState(() => searchParams.get("q") ?? "");

  const handleSubmit = () => {
    const q = keyword.trim();

    if (!q) return;

    router.push(`/search?q=${encodeURIComponent(q)}&page=1`);
  };

  const handleClose = () => {
    router.replace("/posts");
  };

  return (
    <nav className="fixed top-0 left-1/2 -translate-x-1/2 z-50 flex h-16 max-w-98.25 items-center gap-3 border-b border-[#181D27] bg-black">
      <SearchBar
        value={keyword}
        onChange={setKeyword}
        onSubmit={handleSubmit}
        className="flex-1"
      />

      <button type="button" onClick={handleClose} className="text-white">
        <X size={28} />
      </button>
    </nav>
  );
}
