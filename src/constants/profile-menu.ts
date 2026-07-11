import { User, LogOut } from "lucide-react";

export const profileMenu = [
  {
    label: "My Profile",
    href: "/me",
    icon: User,
  },
  {
    label: "Logout",
    action: "logout",
    icon: LogOut,
  },
] as const;
