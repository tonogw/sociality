"use client";

import Logo from "@/components/shared/Logo";
import { Search, Menu } from "lucide-react";
import ProfileMenu from "./ProfileMenu";
import { ROUTES } from "@/constants/routes";
import { useRouter } from "next/navigation";

export default function NavbarDefault() {
  const router = useRouter();
  return (
    <nav className="fixed top-0 w-full px-4 left-1/2 -translate-x-1/2 z-50 flex h-16 max-w-98.25 items-center justify-between border-b border-[#181D27] bg-black">
      <Logo />

      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push(ROUTES.SEARCH)}
          className="cursor-pointer text-white"
        >
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
