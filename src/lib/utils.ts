import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Membaca status privasi akun pengguna secara permanen dari string bio cloud database
 */
export const getIsPrivateFromBio = (
  bio: string | null | undefined,
): boolean => {
  if (!bio) return false;
  return bio.includes("[private:true]");
};

/**
 * Membersihkan metadata tag privasi dari bio agar tidak merusak tampilan antarmuka (UI)
 */
export const getCleanBio = (bio: string | null | undefined): string => {
  if (!bio) return "";
  return bio.replace("[private:true]", "").trim();
};

/**
 * Membersihkan string bio dari kode penanda siber metadata agar visual antarmuka pengguna tetap mulus.
 */
export function cleanBioText(bio: string | null | undefined): string {
  if (!bio) return "";
  return bio.replace(/\[private:true\]/g, "").trim();
}

/**
 * Menyusun string bio baru dengan membubuhi tag privasi untuk disimpan kembali ke cloud database
 */
export const generateBioWithPrivacy = (
  currentBio: string | null | undefined,
  isPrivate: boolean,
): string => {
  const clean = getCleanBio(currentBio);
  if (isPrivate) {
    return `${clean} [private:true]`.trim();
  }
  return clean;
};
