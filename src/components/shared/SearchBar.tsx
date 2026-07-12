"use client";

import { Search, X } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search username...",
}: SearchBarProps) {
  return (
    <div className="relative flex-1">
      <Search
        size={18}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-[#717680]"
      />

      <input
        autoFocus
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-11 w-full rounded-full border border-[#181D27] bg-[#0A0D12] pl-11 pr-10 text-sm text-white outline-none"
      />

      {value.length > 0 && (
        <button
          onClick={() => onChange("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#717680]"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
