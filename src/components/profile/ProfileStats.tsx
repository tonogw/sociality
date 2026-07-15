"use client";

interface ProfileStatsProps {
  postCount: number;
  followersCount: number;
  followingCount: number;
  likesCount: number;
  onPostsClick?: () => void;
  onFollowersClick?: () => void;
  onFollowingClick?: () => void;
  onLikesClick?: () => void;
}

export default function ProfileStats({
  postCount,
  followersCount,
  followingCount,
  likesCount,
  onPostsClick,
  onFollowersClick,
  onFollowingClick,
  onLikesClick,
}: ProfileStatsProps) {
  return (
    <div className="flex items-center gap-4 w-full h-[50px] border-y border-[#181D27] py-2 mt-2 select-none">
      {/* 1. POSTS */}
      <button
        onClick={onPostsClick}
        type="button"
        className="flex-1 flex flex-col items-center hover:bg-zinc-900/35 py-1 rounded-lg transition-colors cursor-pointer active:scale-95"
      >
        <span className="text-sm font-bold text-[#FDFDFD]">{postCount}</span>
        <span className="text-[9px] text-[#A4A7AE] uppercase font-mono tracking-wider">
          Post
        </span>
      </button>

      <div className="w-[1px] h-5 bg-[#181D27]" />

      {/* 2. FOLLOWERS */}
      <button
        onClick={onFollowersClick}
        type="button"
        className="flex-1 flex flex-col items-center hover:bg-zinc-900/35 py-1 rounded-lg transition-colors cursor-pointer active:scale-95"
      >
        <span className="text-sm font-bold text-[#FDFDFD]">
          {followersCount}
        </span>
        <span className="text-[9px] text-[#A4A7AE] uppercase font-mono tracking-wider">
          Followers
        </span>
      </button>

      <div className="w-[1px] h-5 bg-[#181D27]" />

      {/* 3. FOLLOWING */}
      <button
        onClick={onFollowingClick}
        type="button"
        className="flex-1 flex flex-col items-center hover:bg-zinc-900/35 py-1 rounded-lg transition-colors cursor-pointer active:scale-95"
      >
        <span className="text-sm font-bold text-[#FDFDFD]">
          {followingCount}
        </span>
        <span className="text-[9px] text-[#A4A7AE] uppercase font-mono tracking-wider">
          Following
        </span>
      </button>

      <div className="w-[1px] h-5 bg-[#181D27]" />

      {/* 4. LIKES */}
      <button
        onClick={onLikesClick}
        type="button"
        className="flex-1 flex flex-col items-center hover:bg-zinc-900/35 py-1 rounded-lg transition-colors cursor-pointer active:scale-95"
      >
        <span className="text-sm font-bold text-[#FDFDFD]">{likesCount}</span>
        <span className="text-[9px] text-[#A4A7AE] uppercase font-mono tracking-wider">
          Likes
        </span>
      </button>
    </div>
  );
}
