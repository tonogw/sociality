"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import type { SearchedUser } from "@/types";

// interface SearchedUser {
//   id: number;
//   username: string;
//   name: string;
//   avatarUrl: string | null;
//   isFollowedByMe: boolean;
// }

export default function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const query = searchParams.get("q") || "";
  const initialPageFromUrl = Number(searchParams.get("page")) || 1;
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [usersList, setUsersList] = useState<SearchedUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadingPrev, setLoadingPrev] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [topPage, setTopPage] = useState(initialPageFromUrl);
  const [bottomPage, setBottomPage] = useState(initialPageFromUrl);
  const [totalPages, setTotalPages] = useState(1);

  const containerRef = useRef<HTMLDivElement>(null);
  const previousScrollHeightRef = useRef<number>(0);

  useEffect(() => {
    let isMounted = true;

    const fetchInitialPage = async () => {
      if (!query || !baseUrl) {
        if (isMounted) {
          setUsersList([]);
          setTopPage(1);
          setBottomPage(1);
          setTotalPages(1);
        }
        return;
      }

      if (isMounted) setLoading(true);
      setError(null);

      try {
        const url = `${baseUrl}/users/search?q=${encodeURIComponent(query)}&page=${initialPageFromUrl}&limit=20`;
        const res = await fetch(url, {
          method: "GET",
          headers: { accept: "application/json" },
        });

        if (!res.ok) throw new Error("Server error");
        const json = await res.json();

        if (isMounted) {
          const pageUsers: SearchedUser[] = json?.data?.users || [];
          const pagination = json?.data?.pagination;

          setUsersList(pageUsers);
          setTopPage(initialPageFromUrl);
          setBottomPage(initialPageFromUrl);
          if (pagination) setTotalPages(pagination.totalPages);
        }
      } catch (err: unknown) {
        if (isMounted)
          setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchInitialPage();

    return () => {
      isMounted = false;
    };
  }, [query, initialPageFromUrl, baseUrl]);

  useEffect(() => {
    const handleScroll = async () => {
      if (
        !containerRef.current ||
        loadingPrev ||
        topPage <= 1 ||
        !query ||
        !baseUrl
      )
        return;

      if (window.scrollY < 50) {
        setLoadingPrev(true);
        previousScrollHeightRef.current = document.documentElement.scrollHeight;

        const prevPageTarget = topPage - 1;
        try {
          const url = `${baseUrl}/users/search?q=${encodeURIComponent(query)}&page=${prevPageTarget}&limit=20`;
          const res = await fetch(url, {
            method: "GET",
            headers: { accept: "application/json" },
          });
          const json = await res.json();
          const prevUsers: SearchedUser[] = json?.data?.users || [];

          setUsersList((prevList) => {
            const combined = [...prevUsers, ...prevList];
            return combined.filter(
              (user, idx, self) =>
                self.findIndex((u) => u.id === user.id) === idx,
            );
          });

          setTopPage(prevPageTarget);
        } catch (err) {
          console.error(err);
        } finally {
          setLoadingPrev(false);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [topPage, loadingPrev, query, baseUrl]);

  useEffect(() => {
    if (previousScrollHeightRef.current && containerRef.current) {
      const currentScrollHeight = document.documentElement.scrollHeight;
      const heightDifference =
        currentScrollHeight - previousScrollHeightRef.current;
      window.scrollTo(0, window.scrollY + heightDifference);
      previousScrollHeightRef.current = 0;
    }
  }, [usersList]);

  const handleLoadMore = async () => {
    if (loadingMore || bottomPage >= totalPages || !query || !baseUrl) return;

    setLoadingMore(true);
    const nextPageTarget = bottomPage + 1;
    try {
      const url = `${baseUrl}/users/search?q=${encodeURIComponent(query)}&page=${nextPageTarget}&limit=20`;
      const res = await fetch(url, {
        method: "GET",
        headers: { accept: "application/json" },
      });
      const json = await res.json();
      const nextUsers: SearchedUser[] = json?.data?.users || [];

      setUsersList((prevList) => {
        const combined = [...prevList, ...nextUsers];
        return combined.filter(
          (user, idx, self) => self.findIndex((u) => u.id === user.id) === idx,
        );
      });

      setBottomPage(nextPageTarget);
      router.replace(
        `/users/search?q=${encodeURIComponent(query)}&page=${nextPageTarget}`,
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className="w-full min-h-screen bg-black text-white px-4 pt-20 pb-24 font-sans flex flex-col items-center"
    >
      <div className="w-full max-w-90.25 flex flex-col gap-4">
        {loadingPrev && (
          <div className="w-full py-2 flex items-center justify-center gap-2">
            <Loader2 className="animate-spin text-[#6936F2]" size={16} />
            <span className="text-[10px] text-zinc-500 font-mono">
              Loading previous users...
            </span>
          </div>
        )}

        {loading && usersList.length === 0 && (
          <div className="w-full h-[30vh] flex flex-col items-center justify-center gap-2">
            <Loader2 className="animate-spin text-[#6936F2]" size={24} />
            <p className="text-xs text-zinc-500">
              Opening Page {initialPageFromUrl}...
            </p>
          </div>
        )}

        {error && usersList.length === 0 && (
          <p className="text-sm text-red-400 font-semibold text-center py-6">
            Error: {error}
          </p>
        )}

        {usersList.length > 0 && (
          <div className="flex flex-col gap-4 w-full">
            {usersList.map((user: SearchedUser) => (
              <div
                key={user.id}
                onClick={() =>
                  router.push(
                    `/${user.username}?fromQ=${encodeURIComponent(query)}&lastPage=${bottomPage}`,
                  )
                }
                className="w-full h-14 flex items-center gap-3 border-b border-zinc-950/50 pb-2 cursor-pointer p-1 rounded-xl transition-all hover:bg-zinc-900/40"
              >
                <div className="w-12 h-12 rounded-full bg-zinc-900 border border-[#181D27] overflow-hidden flex items-center justify-center shrink-0 relative">
                  {user.avatarUrl ? (
                    <Image
                      src={user.avatarUrl}
                      alt={user.name}
                      fill
                      sizes="48px"
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full bg-linear-to-tr from-[#6936F2] to-[#AD3AE7] flex items-center justify-center text-sm font-bold text-white">
                      {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                    </div>
                  )}
                </div>

                <div className="flex flex-col justify-center flex-1 min-w-0">
                  <span className="text-sm font-bold text-[#FDFDFD] tracking-tight truncate">
                    {user.name}
                  </span>
                  <span className="text-xs text-[#A4A7AE] font-normal truncate">
                    @{user.username}
                  </span>
                </div>
              </div>
            ))}

            {bottomPage < totalPages && (
              <div className="w-full flex justify-center pt-2">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="w-full h-10 border border-[#181D27] rounded-full text-xs font-semibold text-[#FDFDFD] bg-[#0A0D12] hover:bg-zinc-950 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loadingMore
                    ? "Loading more..."
                    : `Load More (Page ${bottomPage} of ${totalPages})`}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
