"use client";

import { Search, X } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
  className?: string;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search username...",
  className = "",
}: SearchBarProps) {
  return (
    <form
      className={`w-full max-w-[321px] h-10 bg-[#0A0D12] border border-[#181D27] rounded-full px-4 flex items-center gap-2 ${className}`}
    >
      <Search size={20} className="text-[#717680]" />

      <input
        autoFocus
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 bg-transparent text-[#FDFDFD] placeholder-[#535862] text-sm focus:outline-none"
      />

      {value.length > 0 && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="text-[#535862] hover:text-white"
        >
          <X size={16} />
        </button>
      )}
    </form>
  );
}
