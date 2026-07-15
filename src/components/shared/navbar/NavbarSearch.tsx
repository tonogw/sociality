"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import SearchBar from "@/components/shared/SearchBar";

export default function NavbarSearch() {
  console.count("SearchPage");
  const router = useRouter();
  const searchParams = useSearchParams();

  const [keyword, setKeyword] = useState(() => searchParams.get("q") ?? "");
  const [searchMode, setSearchMode] = useState(
    () => (searchParams.get("q") ?? "").length > 0,
  );

  const handleSubmit = () => {
    const q = keyword.trim();

    if (!q) return;

    router.push(`/search?q=${encodeURIComponent(q)}&page=1`);
  };

  const handleClose = () => {
    setKeyword("");
    setSearchMode(false);
  };

  const handleBack = () => {
    router.push("/posts");
  };
  // const handleClose = () => {
  //   if (window.history.length > 1) {
  //     router.back();

  //     return;
  //   }

  //   router.replace("/posts");
  // };

  return (
    <nav className="fixed w-full px-4 top-0 left-1/2 -translate-x-1/2 z-50 flex h-16 max-w-98.25 lg:max-w-150 items-center gap-3 border-b border-[#181D27] bg-black">
      {searchMode ? (
        <>
          <SearchBar
            value={keyword}
            onChange={setKeyword}
            onSubmit={handleSubmit}
            className="flex-1"
          />

          <button type="button" onClick={handleClose} className="text-white">
            <X size={28} />
          </button>
        </>
      ) : (
        <>
          <button type="button" onClick={handleBack} className="text-white">
            <ArrowLeft size={24} />
          </button>

          <button
            type="button"
            onClick={() => setSearchMode(true)}
            className="flex-1 h-11 rounded-full border border-[#181D27] bg-[#0A0D12] px-4 text-left text-sm text-[#717680]"
          >
            Search
          </button>
        </>
      )}
    </nav>
  );
}
