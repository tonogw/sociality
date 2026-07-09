"use client";

import React, { useState } from "react";
import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";

interface SearchBarProps {
  placeholder?: string;
  className?: string;
  onClose?: () => void; // Callback opsional jika ingin memicu aksi tutup seperti di navbar
}

export default function SearchBar({
  placeholder = "Search users or posts...",
  className = "",
  onClose,
}: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  // Handler utama saat user menekan Enter atau submit form
  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Mencegah reload halaman penuh browser

    // if (!query.trim()) return;
    const cleanQuery = query.trim();
    if (!cleanQuery) return;

    // Alihkan user ke halaman explore/search bawaan URL query Next.js
    // Contoh hasil: /explore?search=tono
    // router.push(`/explore?search=${encodeURIComponent(query.trim())}`);
    router.push(
      `/users/search?q=${encodeURIComponent(cleanQuery)}&page=1&limit=20`,
    );
  };

  return (
    <form
      onSubmit={handleSearchSubmit}
      className={`w-full max-w-[321px] h-10 bg-[#0A0D12] border border-[#181D27] rounded-full px-4 flex items-center gap-2 transition-all ${className}`}
    >
      {/* Icon Kaca Pembesar */}
      <button
        type="submit"
        className="text-[#717680] hover:text-white transition-colors flex items-center justify-center"
      >
        <Search size={20} />
      </button>

      {/* Input Field Teks */}
      <input
        id="searchbar"
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="flex-1 bg-transparent text-[#FDFDFD] placeholder-[#535862] text-sm font-normal focus:outline-none"
      />

      {/* Tombol Clear Teks (Hanya muncul jika ada karakter) */}
      {query && (
        <button
          type="button"
          onClick={() => setQuery("")}
          className="text-[#535862] hover:text-white transition-colors"
        >
          <X size={16} />
        </button>
      )}

      {/* Tombol Close Tambahan (Jika dioperasikan di level Navbar kustom) */}
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="text-[#FDFDFD] ml-1 border-l border-[#181D27] pl-2 hover:text-zinc-400"
        >
          <X size={18} />
        </button>
      )}
    </form>
  );
}
