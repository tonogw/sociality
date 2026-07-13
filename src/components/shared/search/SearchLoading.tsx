"use client";

import { Loader2 } from "lucide-react";

export default function SearchLoading() {
  return (
    <div className="flex h-40 w-full items-center justify-center">
      <Loader2 size={28} className="animate-spin text-[#6936F2]" />
    </div>
  );
}
