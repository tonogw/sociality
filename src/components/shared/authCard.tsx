import Image from "next/image";
import Link from "next/link";
import React from "react";
import type { AuthCardProps } from "@/types/auth";
import Logo from "../../../public/images/logo.svg";

export default function AuthCard({
  title,
  subtitle,
  activeTab,
  children,
}: AuthCardProps) {
  return (
    // Card responsive
    <div
      className="
    w-86.25 lg:w-93.5
    bg-white rounded-2xl
    flex flex-col gap-6
    md:gap-8
   
    "
    >
      {/* Header Logo brand */}
      <div className="flex  gap-3 select-none ">
        <div
          className="
        relative w-8 h-8 
        "
        >
          <Image src={Logo} alt="Foody logo" fill className="object-contain" />
        </div>
        <span className="text-[28px] font-extrabold text-gray-900 tracking-tight">
          Foody
        </span>
      </div>
      {/* Welcome  */}
      <div className="space-y-1 ">
        <h1 className="text-[28px] lg:text-3xl font-extrabold text-gray-900 tracking-tight">
          {title}
        </h1>
        <p className="text-gray-500 text-medium">{subtitle}</p>
      </div>
      {/* Toggle capsule */}
      <div className="p-1 bg-gray-100 rounded-xl flex w-full">
        <Link
          href="/login"
          className={`
          w-1/2 text-center py-2 text-sm transition-all rounded-lg
          ${
            activeTab === "login"
              ? "font-bold text-gray-900 bg-white shadow-xs"
              : "font-semibold text-gray-500 hover:text-gray-900"
          }
          `}
        >
          Sign in
        </Link>
        <Link
          href="/register"
          className={`
          w-1/2 text-center py-2 text-sm transition-all rounded-lg
          ${
            activeTab === "register"
              ? "font-bold text-gray-900 bg-white shadow-xs"
              : "font-semibold text-gray-500 hover:text-gray-900"
          }
          `}
        >
          Sign up
        </Link>
      </div>
      {/* Form input */}
      <div className="w-full">{children}</div>
    </div>
  );
}
