"use client";

interface SearchEmptyProps {
  message: string;
}

export default function SearchEmpty({ message }: SearchEmptyProps) {
  return (
    <div className="flex h-40 w-full items-center justify-center">
      <p className="text-sm text-[#717680]">{message}</p>
    </div>
  );
}
