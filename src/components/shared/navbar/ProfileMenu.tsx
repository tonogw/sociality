"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { LogOut, Settings, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { logout } from "@/store";

import { useMe } from "@/queries/me/useGetMe";

export default function ProfileMenu() {
  const [open, setOpen] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();

  const { data } = useMe();
  const user = data?.data.profile;

  if (!user) return null;

  const handleLogout = () => {
    dispatch(logout());
    setOpen(false);
    router.replace("/login");
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-[#181D27] bg-zinc-800">
        {user.avatarUrl ? (
          <Image
            src={user.avatarUrl}
            alt={user.name}
            fill
            className="object-cover"
            unoptimized
            sizes="40px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-tr from-[#6936F2] to-[#AD3AE7] text-xs font-bold text-white">
            {user.name.charAt(0).toUpperCase()}
          </div>
        )}
      </SheetTrigger>

      <SheetContent
        side="right"
        className="flex w-[280px] flex-col justify-between border-l border-[#181D27] bg-[#0A0D12] p-6 text-white"
      >
        <div className="flex flex-col gap-6">
          <SheetHeader className="border-b border-[#181D27] pb-4 text-left">
            <SheetTitle className="text-sm font-bold text-white">
              Navigation Account
            </SheetTitle>

            <div className="mt-3 flex items-center gap-3">
              <div className="relative h-10 w-10 overflow-hidden rounded-full border border-[#181D27] bg-zinc-900">
                {user.avatarUrl ? (
                  <Image
                    src={user.avatarUrl}
                    alt={user.name}
                    fill
                    className="object-cover"
                    unoptimized
                    sizes="40px"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-tr from-[#6936F2] to-[#AD3AE7] text-xs font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              <div className="min-w-0">
                <p className="truncate text-xs font-bold text-white">
                  {user.name}
                </p>

                <p className="truncate text-[10px] text-[#A4A7AE]">
                  @{user.username}
                </p>
              </div>
            </div>
          </SheetHeader>

          <div className="flex flex-col gap-2">
            <Link
              href="/me"
              onClick={() => setOpen(false)}
              className="flex h-10 items-center gap-3 rounded-xl px-3 text-xs font-semibold text-zinc-300 transition hover:bg-zinc-900/50 hover:text-white"
            >
              <User size={16} className="text-[#7F51F9]" />
              <span>My Account Profile</span>
            </Link>

            <Link
              href="/settings"
              onClick={() => setOpen(false)}
              className="flex h-10 items-center gap-3 rounded-xl px-3 text-xs font-semibold text-zinc-300 transition hover:bg-zinc-900/50 hover:text-white"
            >
              <Settings size={16} className="text-zinc-500" />
              <span>Account Settings</span>
            </Link>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="mt-auto flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-red-900/40 text-xs font-bold text-red-400 transition hover:bg-red-950/20"
        >
          <LogOut size={14} />
          <span>Log Out Account</span>
        </button>
      </SheetContent>
    </Sheet>
  );
}
