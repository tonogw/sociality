import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import SearchContent from "@/components/shared/SearchContent";

export default function SearchBar() {
  return (
    <Suspense
      fallback={
        <div className="w-full h-screen bg-black flex items-center justify-center">
          <Loader2 className="animate-spin text-[#6936F2]" size={32} />
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
