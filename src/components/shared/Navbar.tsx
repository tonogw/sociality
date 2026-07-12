"use client";

import { usePathname } from "next/navigation";

import NavbarDefault from "./navbar/NavbarDefault";
import NavbarProfile from "./navbar/NavbarProfile";
import NavbarSearch from "./navbar/NavbarSearch";

export default function Navbar() {
  const pathname = usePathname();

  if (pathname.startsWith("/search")) {
    return <NavbarSearch />;
  }

  if (pathname === "/my") {
    return <NavbarProfile title="My Profile" />;
  }

  if (/^\/[^/]+$/.test(pathname)) {
    const username = pathname.replace("/", "");

    return <NavbarProfile title={username} />;
  }

  return <NavbarDefault />;
}
