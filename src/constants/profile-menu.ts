import { User, Settings, LogOut } from "lucide-react";

export interface ProfileMenuItem {
  label: string;
  href?: string;
  action?: "logout";
  icon: React.ComponentType<{ size?: number; className?: string }>;
  variant?: "default" | "danger";
}

export const profileMenuItems: ProfileMenuItem[] = [
  {
    label: "My Profile",
    href: "/me", // FIX MUTLAK REQ NO.2: Diarahkan ke rute /me terstandar
    icon: User,
    variant: "default",
  },
  {
    label: "Account Settings",
    href: "/settings",
    icon: Settings,
    variant: "default",
  },
  {
    label: "Log Out Account",
    action: "logout",
    icon: LogOut,
    variant: "danger",
  },
];
