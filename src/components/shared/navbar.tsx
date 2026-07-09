"use client";

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  Search,
  Menu,
  X,
  ArrowLeft,
  LogOut,
  User,
  Settings,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image"; // Migrasi aman komponen gambar Next.js
import SearchBar from "./searchBar";

// Integrasi Shadcn / UI Sheet Components bawaan folder src/components/ui/sheet.tsx Bapak
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { RootState, logout } from "@/store";
import { userService } from "@/services/userService";
import Logo from "@/components/shared/logo";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();

  // Get search params from current URL
  const searchParams = useSearchParams();

  const token = useSelector((state: RootState) => state.auth.token);
  const isLoggedIn = !!token;

  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isAuthMenuOpen, setIsAuthMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false); // State handle sheet modal profile

  // Fetch data user login
  const { data: profileData } = useQuery({
    queryKey: ["user-profile", token],
    queryFn: userService.getMe,
    enabled: isLoggedIn,
  });

  const user = profileData?.data?.profile;

  const handleLogout = () => {
    dispatch(logout());
    setIsAuthMenuOpen(false);
    setIsProfileMenuOpen(false);
    router.push("/login");
  };

  // ============================================================
  // KONDISI VARIANT 1: MODE TEXT SEARCH BARU AKTIF (FIXED & STICKY)
  // ============================================================
  if (isSearchActive) {
    return (
      <nav className="fixed top-0 left-0 w-full h-16 bg-black border-b border-[#181D27] flex items-center justify-between px-4 gap-4 transition-all duration-200 z-50">
        <div className="flex-1 max-w-[321px] h-10 bg-[#0A0D12] border border-[#181D27] rounded-full px-3 flex items-center gap-1.5">
          <SearchBar placeholder="Search " />
        </div>
        <button
          onClick={() => setIsSearchActive(false)}
          className="text-[#FDFDFD] p-1 hover:bg-zinc-950 rounded-full cursor-pointer"
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
    const handleBackNavigation = () => {
      const fromQuery = searchParams.get("fromQ");
      const lastPage = searchParams.get("lastPage") || "1";

      if (pathname.startsWith("/profile") && fromQuery) {
        router.push(`
          /users/search?q=${encodeURIComponent(fromQuery)}&page=${lastPage}&limit=20
          `);
      } else if (pathname.startsWith("/profile")) {
        router.push("/search");
      } else {
        router.push("/");
      }
    };
    return (
      <nav className="fixed top-0 left-0 w-full h-16 bg-black border-b border-[#181D27] flex items-center justify-between px-4 z-50">
        <div className="flex items-center gap-2">
          <button
            onClick={handleBackNavigation}
            className="text-[#FDFDFD] p-1 hover:bg-zinc-950 rounded-full cursor-pointer flex items-center justify-center"
          >
            <ArrowLeft size={24} />
          </button>
          <span className="text-base font-bold text-[#FDFDFD] tracking-tight font-sans">
            {user.name}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsSearchActive(true)}
            className="text-[#FDFDFD] cursor-pointer"
          >
            <Search size={20} />
          </button>

          {/* SHEET DIALOG MENU UTAMA UNTUK USER PROFILE SETELAH LOGIN */}
          <Sheet open={isProfileMenuOpen} onOpenChange={setIsProfileMenuOpen}>
            <SheetTrigger
              className="w-10 h-10 rounded-full bg-zinc-800 border border-[#181D27] overflow-hidden flex items-center justify-center relative cursor-pointer shadow-inner shrink-0"
              title="Open Navigation Menu"
            >
              {/* <button
                className="w-10 h-10 rounded-full bg-zinc-800 border border-[#181D27] overflow-hidden flex items-center justify-center relative cursor-pointer shadow-inner"
                title="Open Navigation Menu"
              > */}
              {user.avatarUrl ? (
                <Image
                  src={user.avatarUrl}
                  alt="Profile"
                  fill
                  className="object-cover"
                  unoptimized
                  sizes="40px"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-tr from-[#6936F2] to-[#AD3AE7] flex items-center justify-center text-xs font-bold text-white">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
              )}
              {/* </button> */}
            </SheetTrigger>

            <SheetContent
              side="right"
              className="bg-[#0A0D12] border-l border-[#181D27] text-white p-6 flex flex-col justify-between w-[280px]"
            >
              <div className="flex flex-col gap-6">
                <SheetHeader className="text-left border-b border-[#181D27] pb-4">
                  <SheetTitle className="text-white text-sm font-bold tracking-tight">
                    Navigation Account
                  </SheetTitle>
                  <div className="flex items-center gap-3 mt-3">
                    <div className="w-10 h-10 rounded-full bg-zinc-900 border border-[#181D27] overflow-hidden relative">
                      {user.avatarUrl ? (
                        <Image
                          src={user.avatarUrl}
                          alt="Avatar Mini"
                          fill
                          className="object-cover"
                          unoptimized
                          sizes="40px"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-tr from-[#6936F2] to-[#AD3AE7] flex items-center justify-center font-bold text-xs">
                          {user.name?.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-bold text-[#FDFDFD] truncate">
                        {user.name}
                      </span>
                      <span className="text-[10px] text-[#A4A7AE] truncate">
                        @{user.username}
                      </span>
                    </div>
                  </div>
                </SheetHeader>

                {/* PILIHAN MENU DAFTAR LINK NAVIGASI FIGMA */}
                <div className="flex flex-col gap-2 mt-2">
                  <Link
                    href="/me"
                    onClick={() => setIsProfileMenuOpen(false)}
                    className="w-full h-10 px-3 rounded-xl hover:bg-zinc-900/50 transition-colors flex items-center gap-3 text-xs font-semibold text-zinc-300 hover:text-white"
                  >
                    <User size={16} className="text-[#7F51F9]" />
                    <span>My Account Profile</span>
                  </Link>
                  <Link
                    href="/settings"
                    onClick={() => setIsProfileMenuOpen(false)}
                    className="w-full h-10 px-3 rounded-xl hover:bg-zinc-900/50 transition-colors flex items-center gap-3 text-xs font-semibold text-zinc-300 hover:text-white"
                  >
                    <Settings size={16} className="text-zinc-500" />
                    <span>Account Settings</span>
                  </Link>
                </div>
              </div>

              {/* ACTION BUTTON LOGOUT DI BAGIAN BAWAH MODAL SHEET */}
              <button
                onClick={handleLogout}
                className="w-full h-11 border border-red-900/40 hover:bg-red-950/20 rounded-xl text-xs font-bold text-red-400 flex items-center justify-center gap-2 transition-colors cursor-pointer mt-auto"
              >
                <LogOut size={14} />
                <span>Log Out Account</span>
              </button>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    );
  }

  // ============================================================
  // KONDISI VARIANT 3: OPEN AUTH CONTAINER MOBILE (Height: 120px, FIXED)
  // ============================================================
  if (isAuthMenuOpen && !isLoggedIn) {
    return (
      <nav className="fixed top-0 left-0 w-full h-[120px] bg-black border-b border-[#181D27] flex flex-col transition-all duration-300 z-50">
        <div className="w-full h-16 flex items-center justify-between px-4">
          <Logo />
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSearchActive(true)}
              className="text-[#FDFDFD] cursor-pointer"
            >
              <Search size={20} />
            </button>
            <button
              onClick={() => setIsAuthMenuOpen(false)}
              className="text-white cursor-pointer"
            >
              <X size={24} />
            </button>
          </div>
        </div>
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
  // KONDISI VARIANT 4 & 5: STANDARD NAVBAR (FIXED TOP GLOBAL)
  // ============================================================
  return (
    <nav className="fixed top-0 left-0 w-full h-16 bg-black border-b border-[#181D27] flex items-center justify-between px-4 transition-all duration-200 z-50">
      <Logo />

      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsSearchActive(true)}
          className="text-[#FDFDFD] p-1 hover:bg-zinc-950 rounded-full cursor-pointer flex items-center justify-center"
        >
          <Search size={20} />
        </button>

        {isLoggedIn && user ? (
          /* STATE: AFTER LOGIN -> INTEGRASI DIALOG SHEET NAVIGASI */
          <Sheet open={isProfileMenuOpen} onOpenChange={setIsProfileMenuOpen}>
            <SheetTrigger className="w-10 h-10 rounded-full bg-zinc-800 border border-[#181D27] overflow-hidden flex items-center justify-center relative cursor-pointer shadow-inner shrink-0">
              {/* <button className="w-10 h-10 rounded-full bg-zinc-800 border border-[#181D27] overflow-hidden flex items-center justify-center relative cursor-pointer shadow-inner"> */}
              {user.avatarUrl ? (
                <Image
                  src={user.avatarUrl}
                  alt="Avatar"
                  fill
                  className="object-cover"
                  unoptimized
                  sizes="40px"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-tr from-[#6936F2] to-[#7F51F9] flex items-center justify-center text-xs font-bold text-white">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
              )}
              {/* </button> */}
            </SheetTrigger>

            <SheetContent
              side="right"
              className="bg-[#0A0D12] border-l border-[#181D27] text-white p-6 flex flex-col justify-between w-[280px]"
            >
              <div className="flex flex-col gap-6">
                <SheetHeader className="text-left border-b border-[#181D27] pb-4">
                  <SheetTitle className="text-white text-sm font-bold tracking-tight">
                    Navigation Account
                  </SheetTitle>
                  <div className="flex items-center gap-3 mt-3">
                    <div className="w-10 h-10 rounded-full bg-zinc-900 border border-[#181D27] overflow-hidden relative">
                      {user.avatarUrl ? (
                        <Image
                          src={user.avatarUrl}
                          alt="Avatar Mini"
                          fill
                          className="object-cover"
                          unoptimized
                          sizes="40px"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-tr from-[#6936F2] to-[#AD3AE7] flex items-center justify-center font-bold text-xs">
                          {user.name?.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-bold text-[#FDFDFD] truncate">
                        {user.name}
                      </span>
                      <span className="text-[10px] text-[#A4A7AE] truncate">
                        @{user.username}
                      </span>
                    </div>
                  </div>
                </SheetHeader>

                <div className="flex flex-col gap-2 mt-2">
                  <Link
                    href="/me"
                    onClick={() => setIsProfileMenuOpen(false)}
                    className="w-full h-10 px-3 rounded-xl hover:bg-zinc-900/50 transition-colors flex items-center gap-3 text-xs font-semibold text-zinc-300 hover:text-white"
                  >
                    <User size={16} className="text-[#7F51F9]" />
                    <span>My Account Profile</span>
                  </Link>
                  <Link
                    href="/settings"
                    onClick={() => setIsProfileMenuOpen(false)}
                    className="w-full h-10 px-3 rounded-xl hover:bg-zinc-900/50 transition-colors flex items-center gap-3 text-xs font-semibold text-zinc-300 hover:text-white"
                  >
                    <Settings size={16} className="text-zinc-500" />
                    <span>Account Settings</span>
                  </Link>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="w-full h-11 border border-red-900/40 hover:bg-red-950/20 rounded-xl text-xs font-bold text-red-400 flex items-center justify-center gap-2 transition-colors cursor-pointer mt-auto"
              >
                <LogOut size={14} />
                <span>Log Out Account</span>
              </button>
            </SheetContent>
          </Sheet>
        ) : (
          /* STATE: BEFORE LOGIN (Tampilkan Hamburger Menu) */
          <button
            onClick={() => setIsAuthMenuOpen(true)}
            className="text-white p-1 hover:bg-zinc-950 rounded-full cursor-pointer flex items-center justify-center"
          >
            <Menu size={24} />
          </button>
        )}
      </div>
    </nav>
  );
}
