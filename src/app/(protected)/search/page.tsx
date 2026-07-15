"use client";

// import Navbar from "@/components/shared/Navbar";
import SearchList from "@/components/shared/search/SearchList";

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-black pt-10">
      {/* <Navbar /> */}

      <main className="mx-auto w-full max-w-90.25 lg:max-w-150 px-4 py-4">
        <SearchList />
      </main>
    </div>
  );
}
