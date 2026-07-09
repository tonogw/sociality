"use client";

import { useState, useCallback, useRef } from "react";
import Cropper, { Area } from "react-easy-crop";
import { X, Camera, Loader2, ZoomIn } from "lucide-react";
// import Image from "next/image";

interface ImageCropUploaderProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: () => void;
  baseUrl: string;
}

export default function ImageCropUploader({
  isOpen,
  onClose,
  onUploadSuccess,
  baseUrl,
}: ImageCropUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);

  // State untuk melacak koordinat pemotongan react-easy-crop
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropComplete = useCallback(
    (_croppedArea: Area, accomplishedPixels: Area) => {
      setCroppedAreaPixels(accomplishedPixels);
    },
    [],
  );

  // Handler saat user memilih gambar dari lokal komputer
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImageSrc(reader.result as string);
      });
      reader.readAsDataURL(file);
    }
  };

  // Fungsi Helper: Mengubah koordinat crop menjadi File Blob Persegi murni lewat Canvas HTML5
  const createCroppedImageFile = async (
    imageSrcUrl: string,
    pixelCrop: Area,
  ): Promise<File> => {
    const image = document.createElement("img");
    image.src = imageSrcUrl;

    await new Promise((resolve) => {
      image.onload = resolve;
    });

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) throw new Error("Gagal menginisiasi Canvas context");

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height,
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Canvas kosong"));
            return;
          }
          const file = new File([blob], "cropped-timeline-post.jpg", {
            type: "image/jpeg",
          });
          resolve(file);
        },
        "image/jpeg",
        0.9,
      );
    });
  };

  // Fungsi Kirim ke Backend API Railway
  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageSrc || !croppedAreaPixels) return;

    try {
      setLoading(true);
      const token = localStorage.getItem("token") || "";

      // 1. Eksekusi pemotongan gambar secara presisi di client-side
      const finalCroppedFile = await createCroppedImageFile(
        imageSrc,
        croppedAreaPixels,
      );

      // 2. Bungkus berkas hasil crop ke FormData
      const formData = new FormData();
      formData.append("image", finalCroppedFile);
      formData.append("caption", caption || "Moments captured flawlessly 📸✨");

      const res = await fetch(`${baseUrl}/posts`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) throw new Error("Gagal mengunggah foto.");
      const json = await res.json();

      if (json?.success) {
        setImageSrc(null);
        setCaption("");
        onUploadSuccess();
      }
    } catch (err) {
      console.error(err);
      alert("Proses upload gagal, silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-[380px] bg-black border border-[#181D27] rounded-2xl p-5 flex flex-col gap-4 relative shadow-2xl">
        <button
          onClick={() => {
            setImageSrc(null);
            onClose();
          }}
          className="absolute top-4 right-4 text-zinc-500 hover:text-white z-20 cursor-pointer"
        >
          <X size={20} />
        </button>

        <h3 className="text-sm font-bold text-white tracking-tight text-center border-b border-[#181D27] pb-3">
          {imageSrc ? "Adjust Photo Aspect (1:1)" : "Create New Post"}
        </h3>

        <input
          type="file"
          ref={fileInputRef}
          onChange={onFileChange}
          accept="image/*"
          className="hidden"
        />

        {!imageSrc ? (
          /* TAMPILAN AWAL: JIKA BELUM PILIH GAMBAR */
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-full aspect-square bg-[#0A0D12] border border-dashed border-[#181D27] rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer group hover:bg-[#0A0D12]/60 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-500 border border-zinc-800 group-hover:text-white transition-colors">
              <Camera size={18} />
            </div>
            <span className="text-xs text-zinc-400 font-medium">
              Select Image from Mac
            </span>
          </div>
        ) : (
          /* TAMPILAN EDIT JIKA GAMBAR SUDAH MASUK (INTEGRASI INSTAGRAM CROP) */
          <div className="flex flex-col gap-4 w-full">
            {/* Bingkai Pemotong Persegi Mandiri */}
            <div className="w-full aspect-square relative bg-zinc-950 rounded-xl overflow-hidden border border-[#181D27]">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1 / 1} // Paksa rasio kotak 1:1 ala feed Instagram
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
                objectFit="contain"
              />
            </div>

            {/* Slider Pengatur Pembesaran / Zoom */}
            <div className="flex items-center gap-2 px-1 text-zinc-400">
              <ZoomIn size={14} />
              <input
                type="range"
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                aria-label="Zoom"
                onChange={(e) => setZoom(Number(e.target.value))}
                className="flex-1 accent-[#6936F2] h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-[10px] font-mono">{zoom.toFixed(1)}x</span>
            </div>

            {/* Form Input Caption */}
            <form
              onSubmit={handlePublish}
              className="flex flex-col gap-4 w-full"
            >
              <div className="flex flex-col gap-1 w-full">
                <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                  Caption
                </label>
                <div className="w-full bg-[#0A0D12] border border-[#181D27] rounded-xl p-3 flex">
                  <textarea
                    rows={2}
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="Write an amazing caption for this square photo..."
                    className="w-full bg-transparent text-white text-sm focus:outline-none resize-none placeholder-zinc-700"
                  />
                </div>
              </div>

              {/* Tombol Publikasi Akurat */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-[#6936F2] hover:bg-[#522BC8] disabled:bg-zinc-900 disabled:text-zinc-600 font-bold rounded-full text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  "Publish Square Post 🚀"
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
