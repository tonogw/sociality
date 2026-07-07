import Navbar from "@/components/shared/navbar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navbar />
      <main className="flex-1 w-full max-w-[393px] mx-auto">{children}</main>
    </div>
  );
}
