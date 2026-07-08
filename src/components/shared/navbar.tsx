"use client";

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter, usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Search, Menu, X, ArrowLeft, LogOut } from "lucide-react";
import Link from "next/link";
// import Image from "next/image";
import SearchBar from "./searchBar";

import { RootState, logout } from "@/store";
import { userService } from "@/services/userService";
import Logo from "@/components/shared/logo";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();

  // 1. Baca session token langsung dari Redux Store
  const token = useSelector((state: RootState) => state.auth.token);
  const isLoggedIn = !!token;

  // 2. Local UI state untuk handle transisi variant figma
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isAuthMenuOpen, setIsAuthMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // 3. Fetch data user login jika session aktif (untuk Avatar & Nama Profile)
  const { data: profileData } = useQuery({
    queryKey: ["user-profile", token],
    queryFn: userService.getMe,
    enabled: isLoggedIn,
  });

  const user = profileData?.data?.profile; // || profileData?.user;

  // Handler Aksi Logout
  const handleLogout = () => {
    dispatch(logout());
    setIsAuthMenuOpen(false);
    router.push("/login");
  };

  // ============================================================
  // KONDISI VARIANT 1: MODE TEXT SEARCH BARU AKTIF
  // ============================================================
  if (isSearchActive) {
    return (
      <nav className="w-full h-16 bg-black border-b border-[#181D27] flex items-center px-4 gap-4 transition-all duration-200">
        <div className="flex-1 max-w-[321px] h-10 bg-[#0A0D12] border border-[#181D27] rounded-full px-3 flex items-center gap-1.5">
          <SearchBar placeholder="Search " />
          {/* <Search size={20} className="text-[#717680]" /> */}
          {/* <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users or posts..."
            className="flex-1 bg-transparent text-[#FDFDFD] placeholder-[#535862] text-sm focus:outline-none"
            autoFocus
          /> */}
          {/* {searchQuery && (
            <button onClick={() => setSearchQuery("")}>
              <X size={16} className="text-[#535862] hover:text-white" />
            </button>
          )} */}
        </div>
        <button
          onClick={() => setIsSearchActive(false)}
          className="text-[#FDFDFD] p-1 hover:bg-zinc-950 rounded-full"
        >
          <X size={24} />
        </button>
      </nav>
    );
  }

  // ============================================================
  // KONDISI VARIANT 2: HALAMAN PROFILE MOBILE (Path mengandung /[username] atau /me)
  // ============================================================
  const isProfilePage = pathname.startsWith("/profile") || pathname === "/me";
  if (isProfilePage && isLoggedIn && user) {
    return (
      <nav className="w-full h-16 bg-black border-b border-[#181D27] flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.back()}
            className="text-[#FDFDFD] p-1 hover:bg-zinc-950 rounded-full"
          >
            <ArrowLeft size={24} />
          </button>
          <span className="text-base font-bold text-[#FDFDFD] tracking-tight font-sans">
            {user.name || "John Doe"}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsSearchActive(true)}
            className="text-[#FDFDFD]"
          >
            <Search size={20} />
          </button>
          {/* Avatar Klik Akses Menu Logout */}
          <button
            onClick={handleLogout}
            className="w-10 h-10 rounded-full bg-zinc-800 border border-[#181D27] overflow-hidden flex items-center justify-center relative group"
            title="Click to logout"
          >
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-tr from-[#6936F2] to-[#AD3AE7] flex items-center justify-center text-xs font-bold text-white">
                {user.name?.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <LogOut size={14} className="text-red-400" />
            </div>
          </button>
        </div>
      </nav>
    );
  }

  // ============================================================
  // KONDISI VARIANT 3: OPEN AUTH CONTAINER MOBILE (Height: 120px)
  // ============================================================
  if (isAuthMenuOpen && !isLoggedIn) {
    return (
      <nav className="w-full h-[120px] bg-black border-b border-[#181D27] flex flex-col transition-all duration-300">
        {/* Atas: Baris Header Logo & Close */}
        <div className="w-full h-16 flex items-center justify-between px-4">
          <Logo />
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSearchActive(true)}
              className="text-[#FDFDFD]"
            >
              <Search size={20} />
            </button>
            <button
              onClick={() => setIsAuthMenuOpen(false)}
              className="text-white"
            >
              <X size={24} />
            </button>
          </div>
        </div>
        {/* Bawah: Baris Tombol Login & Register */}
        <div className="h-14 flex items-center gap-3 px-4 pb-4">
          <Link
            href="/login"
            onClick={() => setIsAuthMenuOpen(false)}
            className="flex-1 h-10 border border-[#181D27] rounded-full flex items-center justify-center text-sm font-bold text-[#FDFDFD] hover:bg-zinc-950 transition-colors"
          >
            Login
          </Link>
          <Link
            href="/register"
            onClick={() => setIsAuthMenuOpen(false)}
            className="flex-1 h-10 bg-[#6936F2] rounded-full flex items-center justify-center text-sm font-bold text-[#FDFDFD] hover:bg-[#522BC8] transition-colors"
          >
            Register
          </Link>
        </div>
      </nav>
    );
  }

  // ============================================================
  // KONDISI VARIANT 4 & 5: STANDARD NAVBAR (Before & After Login)
  // ============================================================
  return (
    <nav className="w-full h-16 bg-black border-b border-[#181D27] flex items-center justify-between px-4 transition-all duration-200">
      <Logo />

      <div className="flex items-center gap-4">
        {/* Tombol Search Global */}
        <button
          onClick={() => setIsSearchActive(true)}
          className="text-[#FDFDFD] p-1 hover:bg-zinc-950 rounded-full"
        >
          <Search size={20} />
        </button>

        {isLoggedIn && user ? (
          /* STATE: AFTER LOGIN (Tampilkan Lingkaran Avatar) */
          <Link
            href="/me"
            className="w-10 h-10 rounded-full bg-zinc-800 border border-[#181D27] overflow-hidden flex items-center justify-center"
          >
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-tr from-[#6936F2] to-[#7F51F9] flex items-center justify-center text-xs font-bold text-white">
                {user.name?.charAt(0).toUpperCase()}
              </div>
            )}
          </Link>
        ) : (
          /* STATE: BEFORE LOGIN (Tampilkan Hamburger Menu) */
          <button
            onClick={() => setIsAuthMenuOpen(true)}
            className="text-white p-1 hover:bg-zinc-950 rounded-full"
          >
            <Menu size={24} />
          </button>
        )}
      </div>
    </nav>
  );
}
