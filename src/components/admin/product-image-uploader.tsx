"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { X, GripVertical, UploadCloud } from "lucide-react";

export interface UploadedImage {
  url: string;
  publicId: string;
  alt?: string;
}

export function ProductImageUploader({
  images,
  onChange,
}: {
  images: UploadedImage[];
  onChange: (images: UploadedImage[]) => void;
}) {
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      for (const file of acceptedFiles) {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
        if (res.ok) {
          const data = await res.json();
          onChange([...images, { url: data.url, publicId: data.publicId }]);
        }
      }
    },
    [images, onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
  });

  function removeAt(index: number) {
    onChange(images.filter((_, i) => i !== index));
  }

  function move(index: number, direction: -1 | 1) {
    const next = [...images];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  return (
    <div>
      <div
        {...getRootProps()}
        className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed p-8 text-center text-sm transition-colors ${
          isDragActive ? "border-accent bg-accent/5" : "border-border text-muted-foreground"
        }`}
      >
        <input {...getInputProps()} />
        <UploadCloud className="h-6 w-6" />
        <p>Drag & drop images here, or click to select</p>
      </div>

      {images.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
          {images.map((img, i) => (
            <div key={img.publicId + i} className="group relative aspect-square overflow-hidden rounded-xl bg-surface">
              <Image src={img.url} alt={img.alt ?? ""} fill className="object-cover" sizes="150px" />
              <button
                type="button"
                onClick={() => removeAt(i)}
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white"
                aria-label="Remove image"
              >
                <X className="h-3 w-3" />
              </button>
              <div className="absolute bottom-1 left-1 right-1 flex items-center justify-between rounded-full bg-black/50 px-1.5 py-0.5 text-white opacity-0 transition-opacity group-hover:opacity-100">
                <button type="button" onClick={() => move(i, -1)} aria-label="Move left">
                  <GripVertical className="h-3 w-3 rotate-90" />
                </button>
                <span className="text-[10px]">{i + 1}</span>
                <button type="button" onClick={() => move(i, 1)} aria-label="Move right">
                  <GripVertical className="h-3 w-3 -rotate-90" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
