"use client";

import { Camera, Loader2, User, X } from "lucide-react";
import Image from "next/image";
import {
  UseFormHandleSubmit,
  UseFormRegister,
  FieldErrors,
} from "react-hook-form";

import type { UpdateUserInput } from "@/validations/auth";

interface Props {
  isOpen: boolean;
  onClose: () => void;

  previewUrl: string | null;
  avatarUrl?: string | null;

  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;

  register: UseFormRegister<UpdateUserInput>;
  handleSubmit: UseFormHandleSubmit<UpdateUserInput>;
  onSubmit: (data: UpdateUserInput) => void;

  errors: FieldErrors<UpdateUserInput>;

  isSaving: boolean;
}

export default function ProfileEditModal({
  isOpen,
  onClose,
  previewUrl,
  avatarUrl,
  handleFileChange,
  register,
  handleSubmit,
  onSubmit,
  errors,
  isSaving,
}: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-[380px] bg-black border border-[#181D27] rounded-2xl p-6 flex flex-col items-center gap-5 relative max-h-[90vh] overflow-y-auto shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-500 hover:text-white"
        >
          <X size={20} />
        </button>

        <h3 className="text-lg font-bold text-white">Edit Profile</h3>

        <div className="flex flex-col items-center gap-2">
          <label className="relative group cursor-pointer w-20 h-20 rounded-full bg-zinc-900 border border-[#181D27] overflow-hidden">
            {previewUrl || avatarUrl ? (
              <Image
                src={previewUrl || avatarUrl || "/placeholder.png"}
                alt="avatar"
                fill
                className="object-cover"
                unoptimized
                sizes="80px"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User size={32} className="text-zinc-600" />
              </div>
            )}

            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
              <Camera size={18} />
            </div>

            <input
              hidden
              type="file"
              accept="image/png,image/jpeg,image/jpg"
              onChange={handleFileChange}
            />
          </label>

          <span className="text-xs text-zinc-400">Tap avatar to change</span>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full flex flex-col gap-4"
        >
          <div>
            <label className="text-xs font-bold">Name</label>

            <input
              {...register("name")}
              className="w-full mt-1 h-11 rounded-xl border border-[#181D27] bg-[#0A0D12] px-4"
            />

            {errors.name && (
              <p className="text-xs text-red-400 mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="text-xs font-bold">Username</label>

            <input
              {...register("username")}
              className="w-full mt-1 h-11 rounded-xl border border-[#181D27] bg-[#0A0D12] px-4"
            />

            {errors.username && (
              <p className="text-xs text-red-400 mt-1">
                {errors.username.message}
              </p>
            )}
          </div>

          <div>
            <label className="text-xs font-bold">Phone</label>

            <input
              {...register("phone")}
              className="w-full mt-1 h-11 rounded-xl border border-[#181D27] bg-[#0A0D12] px-4"
            />

            {errors.phone && (
              <p className="text-xs text-red-400 mt-1">
                {errors.phone.message}
              </p>
            )}
          </div>

          <div>
            <label className="text-xs font-bold">Bio</label>

            <textarea
              rows={3}
              {...register("bio")}
              className="w-full mt-1 rounded-xl border border-[#181D27] bg-[#0A0D12] p-3 resize-none"
            />

            {errors.bio && (
              <p className="text-xs text-red-400 mt-1">{errors.bio.message}</p>
            )}
          </div>

          <button
            disabled={isSaving}
            className="h-11 rounded-full bg-[#6936F2] font-bold flex items-center justify-center gap-2"
          >
            {isSaving && <Loader2 size={16} className="animate-spin" />}

            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
