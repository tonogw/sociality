"use client";

import { Lock } from "lucide-react";

export default function PrivateProfile() {
  return (
    <div className="w-full py-16 flex flex-col items-center justify-center text-center gap-4 border border-[#181D27] bg-[#0A0D12]/40 rounded-3xl p-6 mt-4">
      <div className="w-12 h-12 rounded-full bg-zinc-900 border border-[#181D27] flex items-center justify-center text-zinc-400">
        <Lock size={20} />
      </div>
      <div className="flex flex-col gap-1">
        <h4 className="text-sm font-bold text-white">
          This Account is Private
        </h4>
        <p className="text-xs text-zinc-500 max-w-[220px]">
          Follow this account to explore their captured memories.
        </p>
      </div>
    </div>
  );
}
