"use client";

import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  showText?: boolean;
}

export default function Logo({ showText = true }: LogoProps) {
  return (
    <Link
      href="/posts"
      className="flex items-center gap-2.75 group select-none"
    >
      {/* ICON path extracted from figma */}
      <div className="w-7.5 h-7.5 flex items-center justify-center relative">
        {/* <svg
          width="30"
          height="30"
          viewBox="0 0 30 30"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="animate-spin-slow"
        >
          <path
            d="M15 2V5M15 25V28M2 15H5M25 15H28M5.8 5.8L7.9 7.9M22.1 22.1L24.2 24.2M24.2 5.8L22.1 7.9M7.9 22.1L5.8 24.2"
            stroke="#FDFDFD"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg> */}
        <Image
          src="/icons/Logo.svg"
          alt="logo"
          sizes="54px"
          fill
          unoptimized
          className="w-14 h-14"
        />
      </div>

      {showText && (
        <span className="text-2xl font-bold text-[#FDFDFD] tracking-tight font-sans">
          Sociality
        </span>
      )}
    </Link>
  );
}
