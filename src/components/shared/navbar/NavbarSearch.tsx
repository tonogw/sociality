"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";

import SearchBar from "@/components/shared/SearchBar-temp";

export default function NavbarSearch() {
  const router = useRouter();

  const [keyword, setKeyword] = useState("");

  const handleClose = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.replace("/posts");
    }
  };

  return (
    <nav className="fixed top-0 left-0 z-50 flex h-16 w-full items-center gap-3 border-b border-[#181D27] bg-black px-4">
      <SearchBar value={keyword} onChange={setKeyword} />

      <button onClick={handleClose} className="text-white">
        <X size={28} />
      </button>
    </nav>
  );
}
