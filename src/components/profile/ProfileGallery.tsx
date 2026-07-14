"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import TimelineCard from "@/components/shared/TimelineCard";
import { PostItem } from "@/types";

// interface Post {
//   id: number;
//   imageUrl: string;
//   caption?: string;
//   createdAt: string;
//   author?: {
//     id: number;
//     username: string;
//     name: string;
//     avatarUrl: string | null;
//   };
// }

interface Props {
  posts: PostItem[];
  viewMode: "grid" | "list";
  username?: string;
  canDelete?: boolean;
}

export default function ProfileGallery({
  posts,
  viewMode,
  username,
  canDelete = false,
}: Props) {
  const router = useRouter();

  // MODE TAMPILAN 1: GRID VIEW (FOTO DIKLIK AKAN MENGARAHKAN KE TIMELINE AUTHOR)
  if (viewMode === "grid") {
    return (
      <div className="grid grid-cols-3 gap-1 w-full animate-fade-in">
        {posts.map((post) => (
          <button
            key={post.id}
            onClick={() =>
              router.push(
                `/${username || post.author?.username}?postId=${post.id}`,
              )
            }
            className="w-full aspect-square bg-zinc-900 border border-[#181D27] rounded-sm overflow-hidden relative cursor-pointer hover:opacity-90 active:scale-95 transition-all text-left"
          >
            <Image
              src={post.imageUrl || "/placeholder.png"}
              alt="Post"
              fill
              unoptimized
              sizes="120px"
              className="object-cover"
            />
          </button>
        ))}
      </div>
    );
  }

  // MODE TAMPILAN 2: LIST VIEW (TERBUNGKUS DI DALAM TIMELINECARD ASLI PROYEK ANDA)
  return (
    <div className="flex flex-col gap-6 w-full items-center">
      {posts.map((post) => (
        <TimelineCard
          key={post.id}
          post={post}
          canDelete={canDelete}
          currentUsername={username}
        />
      ))}
    </div>
  );
}
