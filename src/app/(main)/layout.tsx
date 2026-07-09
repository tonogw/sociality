import Navbar from "@/components/shared/Navbar";
import { Suspense } from "react";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Suspense fallback={null}>
        <Navbar />
      </Suspense>
      <main className="flex-1 w-full max-w-[393px] mx-auto">{children}</main>
    </div>
  );
}
