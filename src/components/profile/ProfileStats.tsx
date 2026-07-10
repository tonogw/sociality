"use client";

interface ProfileStatsProps {
  postCount: number;
  followersCount: number;
  followingCount: number;
  likesCount: number;
}

export default function ProfileStats({
  postCount,
  followersCount,
  followingCount,
  likesCount,
}: ProfileStatsProps) {
  return (
    <div className="flex items-center gap-4 w-full h-[50px] border-y border-[#181D27] py-2 mt-2">
      <div className="flex-1 flex flex-col items-center">
        <span className="text-lg font-bold text-[#FDFDFD]">{postCount}</span>
        <span className="text-xs text-[#A4A7AE]">Post</span>
      </div>

      <div className="w-[1px] h-6 bg-[#181D27]" />

      <div className="flex-1 flex flex-col items-center">
        <span className="text-lg font-bold text-[#FDFDFD]">
          {followersCount}
        </span>
        <span className="text-xs text-[#A4A7AE]">Followers</span>
      </div>

      <div className="w-[1px] h-6 bg-[#181D27]" />

      <div className="flex-1 flex flex-col items-center">
        <span className="text-lg font-bold text-[#FDFDFD]">
          {followingCount}
        </span>
        <span className="text-xs text-[#A4A7AE]">Following</span>
      </div>

      <div className="w-[1px] h-6 bg-[#181D27]" />

      <div className="flex-1 flex flex-col items-center">
        <span className="text-lg font-bold text-[#FDFDFD]">{likesCount}</span>
        <span className="text-xs text-[#A4A7AE]">Likes</span>
      </div>
    </div>
  );
}
