"use client";

import Image from "next/image";

interface Post {
  id: number;
  imageUrl: string;
}

interface Props {
  posts: Post[];
}

export default function ProfileSavedGallery({ posts }: Props) {
  if (posts.length === 0) {
    return (
      <div className="w-full text-center py-16 text-sm text-[#A4A7AE]">
        No saved posts yet.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-1 w-full">
      {posts.map((post) => (
        <div
          key={post.id}
          className="w-full aspect-square bg-zinc-900 border border-[#181D27] rounded-sm overflow-hidden relative"
        >
          <Image
            src={post.imageUrl}
            alt="Saved"
            fill
            className="object-cover"
            unoptimized
            sizes="120px"
          />
        </div>
      ))}
    </div>
  );
}
