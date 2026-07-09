"use client";

interface ProfileStatsProps {
  stats: any;
}

export default function ProfileStats({ stats }: ProfileStatsProps) {
  const items = [
    { label: "Post", value: stats?.posts ?? 0 },
    { label: "Followers", value: stats?.followers ?? 0 },
    { label: "Following", value: stats?.following ?? 0 },
    { label: "Likes", value: stats?.likes ?? 0 },
  ];

  return (
    <div className="flex items-center gap-4 w-full h-[50px] border-y border-[#181D27] py-2">
      {items.map((item, idx) => (
        <div
          key={idx}
          className="flex-1 flex flex-col items-center justify-center"
        >
          <span className="text-lg font-bold text-[#FDFDFD]">{item.value}</span>
          <span className="text-xs text-[#A4A7AE] font-medium">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}
