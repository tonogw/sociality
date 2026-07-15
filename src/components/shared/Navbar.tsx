"use client";

import { usePathname } from "next/navigation";

import NavbarDefault from "./navbar/NavbarDefault";
import NavbarProfile from "./navbar/NavbarProfile";
import NavbarSearch from "./navbar/NavbarSearch";

import { ROUTES } from "@/constants/routes";

interface NavbarProps {
  fromQuery?: string;
  lastPage?: string;
}

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

export default function Navbar({ fromQuery, lastPage }: NavbarProps) {
  const pathname = usePathname();

  if (pathname.startsWith("/search")) {
    return <NavbarSearch />;
  }

  if (pathname === "/me") {
    return <NavbarProfile title="My Profile" />;
  }

  const isCommentsRoute = /^\/posts\/\d+\/comments$/.test(pathname);
  if (isCommentsRoute) {
    return (
      <NavbarProfile
        title="Post Discussion"
        fromQuery={fromQuery}
        lastPage={lastPage}
      />
    );
  }

  const isFollowersRoute = /^\/[^/]+\/followers$/.test(pathname);
  if (isFollowersRoute) {
    const username = pathname.split("/")[1];

    return (
      <NavbarProfile
        title={`${username} Followers`}
        fromQuery={fromQuery}
        lastPage={lastPage}
      />
    );
  }

  const isFollowingRoute = /^\/[^/]+\/following$/.test(pathname);
  if (isFollowingRoute) {
    const username = pathname.split("/")[1];

    return (
      <NavbarProfile
        title={`${username} Following`}
        fromQuery={fromQuery}
        lastPage={lastPage}
      />
    );
  }

  if (/^\/[^/]+$/.test(pathname) && !SYSTEM_ROUTES.has(pathname)) {
    return (
      <NavbarProfile
        title={pathname.slice(1)}
        fromQuery={fromQuery}
        lastPage={lastPage}
      />
    );
    // const username = pathname.replace("/", "");
  }
  // return <NavbarProfile title={username} />;

  return <NavbarDefault />;
}
