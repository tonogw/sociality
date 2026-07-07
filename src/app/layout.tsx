import type { Metadata } from "next";
// import localFont from "next/font/local";
// import { Geist, Geist_Mono } from "next/font/google";
import { StoreProvider } from "@/components/providers/store-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { Toaster } from "@/components/ui/sonner";

import "./globals.css";

export const metadata: Metadata = {
  title: "Sociality",
  description: "Created with Next.ts app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <StoreProvider>
          <QueryProvider>
            {children}
            <Toaster position="top-right" richColors />
          </QueryProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
