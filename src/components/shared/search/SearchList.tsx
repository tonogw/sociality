"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import SearchEmpty from "./SearchEmpty";
import SearchLoading from "./SearchLoading";
import SearchUserCard from "./SearchUserCard";

import type { SearchedUser } from "@/types/user";

export default function SearchList() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const query = searchParams.get("q") ?? "";

  const initialPage = Number(searchParams.get("page") ?? "1");

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL!;

  const [users, setUsers] = useState<SearchedUser[]>([]);

  const [topPage, setTopPage] = useState(initialPage);
  const [bottomPage, setBottomPage] = useState(initialPage);

  const loadingPrev = useRef(false);

  // const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    if (!query.trim()) return;

    let cancelled = false;

    async function loadFirstPage() {
      setLoading(true);

      try {
        const res = await fetch(
          `${baseUrl}/users/search?q=${encodeURIComponent(query)}&page=${initialPage}&limit=20`,
          {
            headers: {
              accept: "application/json",
            },
          },
        );

        const json = await res.json();

        if (cancelled) return;

        const firstUsers = json.data.users ?? [];

        setUsers(firstUsers);

        // setPage(initialPage);

        setTopPage(initialPage);

        setBottomPage(initialPage);

        setTotalPages(json.data.pagination.totalPages ?? 1);

        // setUsers(json.data.users ?? []);
        // setPage(1);
        // setTotalPages(json.data.pagination.totalPages ?? 1);
      } catch (err) {
        console.error(err);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadFirstPage();

    return () => {
      cancelled = true;
    };
  }, [baseUrl, query, initialPage]);

  async function handleLoadMore() {
    if (loadingMore) return;

    if (bottomPage >= totalPages) return;

    setLoadingMore(true);

    try {
      const nextPage = bottomPage + 1;

      const res = await fetch(
        `${baseUrl}/users/search?q=${encodeURIComponent(query)}&page=${nextPage}&limit=20`,
        {
          headers: {
            accept: "application/json",
          },
        },
      );

      const json = await res.json();

      const nextUsers: SearchedUser[] = json.data.users ?? [];

      setUsers((prev) => {
        const merged = [...prev, ...nextUsers];

        return merged.filter(
          (user, index, self) =>
            self.findIndex((u) => u.id === user.id) === index,
        );
      });

      // setPage(nextPage);
      setBottomPage(nextPage);

      router.replace(
        `/search?q=${encodeURIComponent(query)}&page=${nextPage}`,
        {
          scroll: false,
        },
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMore(false);
    }
  }

  useEffect(() => {
    async function loadPrevious() {
      if (loadingPrev.current) return;

      if (topPage <= 1) return;

      if (window.scrollY > 60) return;

      loadingPrev.current = true;

      try {
        const prevPage = topPage - 1;

        const res = await fetch(
          `${baseUrl}/users/search?q=${encodeURIComponent(query)}&page=${prevPage}&limit=20`,
          {
            headers: {
              accept: "application/json",
            },
          },
        );

        const json = await res.json();

        const prevUsers: SearchedUser[] = json.data.users ?? [];

        setUsers((current) => [...prevUsers, ...current]);

        setTopPage(prevPage);
      } catch (err) {
        console.error(err);
      } finally {
        loadingPrev.current = false;
      }
    }

    const handleScroll = () => {
      loadPrevious();
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [topPage, query, baseUrl]);

  if (!query.trim()) {
    return <SearchEmpty message="Start typing to search users." />;
  }

  if (loading) {
    return <SearchLoading />;
  }

  if (users.length === 0) {
    return <SearchEmpty message="No users found." />;
  }

  return (
    <div className="mx-auto flex w-full max-w-98.25 flex-col gap-4">
      {users.map((user) => (
        <SearchUserCard
          key={user.id}
          user={user}
          query={query}
          page={bottomPage}
        />
      ))}

      {bottomPage < totalPages && (
        <button
          onClick={handleLoadMore}
          disabled={loadingMore}
          className="h-10 rounded-full border border-[#181D27] bg-[#0A0D12] text-xs text-white transition hover:bg-[#151922]"
        >
          {loadingMore ? "Loading..." : `Load More (${users.length} users)`}
        </button>
      )}
    </div>
  );
}
