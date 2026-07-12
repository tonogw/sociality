"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NavbarSearch() {
  const router = useRouter();

  const [keyword, setKeyword] = useState("");

  return (
    <nav className="fixed top-0 left-0 z-50 flex h-16 w-full items-center gap-3 border-b border-[#181D27] bg-black px-4">
      <div className="relative flex-1">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-[#717680]"
        />

        <input
          autoFocus
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Search username..."
          className="h-11 w-full rounded-full border border-[#181D27] bg-[#0A0D12] pl-11 pr-10 text-sm text-white outline-none"
        />

        {keyword.length > 0 && (
          <button
            onClick={() => setKeyword("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#717680]"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <button onClick={() => router.push("/posts")} className="text-white">
        <X size={28} />
      </button>
    </nav>
  );
}
