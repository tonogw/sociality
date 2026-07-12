"use client";

import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";

interface SearchInputProps {
  initialValue?: string;
  onSearch: (keyword: string) => void;
}

export default function SearchInput({
  initialValue = "",
  onSearch,
}: SearchInputProps) {
  const [keyword, setKeyword] = useState(initialValue);

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(keyword.trim());
    }, 400);

    return () => clearTimeout(timer);
  }, [keyword, onSearch]);

  return (
    <div className="relative w-full">
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
  );
}
