"use client";

import Logo from "@/components/shared/Logo";
import { Search, Menu } from "lucide-react";
import ProfileMenu from "./ProfileMenu";

export default function NavbarDefault() {
  return (
    <nav className="fixed top-0 left-0 z-50 flex h-16 w-full items-center justify-between border-b border-[#181D27] bg-black px-4">
      <Logo />

      <div className="flex items-center gap-4">
        <button className="cursor-pointer text-white">
          <Search size={20} />
        </button>

        <ProfileMenu />
        {/* <button className="cursor-pointer text-white">
          <Menu size={24} />
        </button> */}
      </div>
    </nav>
  );
}
