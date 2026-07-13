import Navbar from "@/components/shared/Navbar";
import { Suspense } from "react";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const token =
  //   typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // if (!token) {
  //   return null;
  // }

  console.log("Protected Layout loaded");

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Suspense fallback={null}>
        <Navbar />
      </Suspense>
      <main className="flex-1 w-full max-w-98.25 mx-auto">{children}</main>
    </div>
  );
}
