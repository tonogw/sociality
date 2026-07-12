"use client";

import { usePathname } from "next/navigation";

import NavbarDefault from "./navbar/NavbarDefault";
import NavbarProfile from "./navbar/NavbarProfile";
import NavbarSearch from "./navbar/NavbarSearch";

import { ROUTES } from "@/constants/routes";

const SYSTEM_ROUTES = new Set<string>([
  ROUTES.HOME,
  ROUTES.LOGIN,
  ROUTES.REGISTER,
  ROUTES.FEED,
  ROUTES.SEARCH,
  ROUTES.CREATE,
  ROUTES.SAVED,
  ROUTES.ME,
]);

export default function Navbar() {
  const pathname = usePathname();

  console.log(pathname);

  if (pathname.startsWith("/search")) {
    return <NavbarSearch />;
  }

  if (pathname === "/my") {
    return <NavbarProfile title="My Profile" />;
  }

  if (/^\/[^/]+$/.test(pathname) && !SYSTEM_ROUTES.has(pathname)) {
    return <NavbarProfile title={pathname.slice(1)} />;
    // const username = pathname.replace("/", "");
  }
  // return <NavbarProfile title={username} />;

  return <NavbarDefault />;
}
