"use client";

import { useState, useCallback, useRef } from "react";
import Cropper, { Point, Area } from "react-easy-crop";
import { X, Camera, ZoomIn, RefreshCw, Trash2, Send } from "lucide-react";
import { toast } from "sonner";

interface ImageCropUploaderProps {
  isOpen: boolean;
  onClose: () => void;
  // 🟢 SEKARANG MENERIMA CALLBACK: Mengirim file dan caption ke luar, bukan nembak API sendiri
  onUpload: (croppedFile: File, caption: string) => Promise<void>;
  isUploading: boolean;

  // Combined
  title?: string;
  submitLabel?: string;
  showCaption?: boolean;
}

export default function ImageCropUploader({
  isOpen,
  onClose,
  onUpload,
  isUploading,
  // Combined
  title = "Add Post",
  submitLabel = "Share",
  showCaption = true,
}: ImageCropUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [caption, setCaption] = useState("");

  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropComplete = useCallback(
    (_croppedArea: Area, accomplishedPixels: Area) => {
      setCroppedAreaPixels(accomplishedPixels);
    },
    [],
  );

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.addEventListener("load", () =>
        setImageSrc(reader.result as string),
      );
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteImageState = () => {
    setImageSrc(null);
    setCroppedAreaPixels(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    toast.message("Photo removed from draft");
  };

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
          resolve(new File([blob], "cropped-post.jpg", { type: "image/jpeg" }));
        },
        "image/jpeg",
        0.9,
      );
    });
  };

  const handleSubmitAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageSrc || !croppedAreaPixels) return;

    try {
      const finalCroppedFile = await createCroppedImageFile(
        imageSrc,
        croppedAreaPixels,
      );
      // Lempar data ke halaman utama yang bertanggung jawab penuh atas mutasi data
      // await onUpload(finalCroppedFile, caption);
      await onUpload(finalCroppedFile, showCaption ? caption : "");

      // Reset state form setelah berhasil
      setImageSrc(null);
      setCaption("");
    } catch (err) {
      console.error(err);
      toast.error("Gagal memproses pemotongan gambar.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-95 lg:max-w-150 bg-[#0A0D12] border border-[#181D27] rounded-3xl p-5 flex flex-col gap-4 relative shadow-2xl">
        <button
          onClick={() => {
            setImageSrc(null);
            onClose();
          }}
          className="absolute top-4 right-4 text-zinc-500 hover:text-white cursor-pointer"
        >
          <X size={20} />
        </button>

        <h3 className="text-sm font-bold text-white tracking-tight text-center border-b border-[#181D27] pb-3 font-sans">
          {title}
        </h3>

        <input
          id="image-file"
          type="file"
          ref={fileInputRef}
          onChange={onFileChange}
          accept="image/*"
          className="hidden"
        />

        {!imageSrc ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-full aspect-square bg-black border border-dashed border-[#181D27] rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer group hover:bg-zinc-950/40"
          >
            <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-500 border border-zinc-800 group-hover:text-white">
              <Camera size={18} />
            </div>
            <span className="text-xs text-zinc-400 font-semibold">
              Click to upload image
            </span>
          </div>
        ) : (
          <div className="flex flex-col gap-4 w-full">
            <div className="w-full aspect-square relative bg-black rounded-2xl overflow-hidden border border-[#181D27]">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1 / 1}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
                objectFit="contain"
              />
            </div>

            <div className="flex items-center gap-2 text-zinc-500">
              <ZoomIn size={14} />
              <input
                id="range"
                type="range"
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                aria-label="Zoom"
                onChange={(e) => setZoom(Number(e.target.value))}
                className="flex-1 accent-[#6936F2] h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="h-9 border border-[#181D27] bg-[#0A0D12] rounded-xl flex items-center justify-center gap-1.5 text-xs text-zinc-300 font-bold cursor-pointer"
              >
                <RefreshCw size={14} /> Change Image
              </button>
              <button
                type="button"
                onClick={handleDeleteImageState}
                className="h-9 border border-red-950/50 bg-red-950/10 rounded-xl flex items-center justify-center gap-1.5 text-xs text-red-400 font-bold cursor-pointer"
              >
                <Trash2 size={14} /> Delete Image
              </button>
            </div>

            <form
              onSubmit={handleSubmitAction}
              className="flex flex-col gap-4 w-full"
            >
              {showCaption && (
                <div className="flex flex-col gap-1 w-full">
                  <label className="text-xs font-bold text-zinc-400">
                    Caption
                  </label>
                  <div className="w-full bg-black border border-[#181D27] rounded-xl p-3 flex">
                    <textarea
                      rows={3}
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                      placeholder="Create your caption"
                      className="w-full bg-transparent text-white text-sm focus:outline-none resize-none placeholder-zinc-600"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isUploading}
                className="w-full h-11 bg-[#6936F2] hover:bg-[#522BC8] disabled:bg-zinc-900 disabled:text-zinc-600 font-bold rounded-full text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <Send size={14} />{" "}
                <span>{isUploading ? "Uploading..." : submitLabel}</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
