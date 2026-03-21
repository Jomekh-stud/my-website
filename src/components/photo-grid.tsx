"use client";

import { useState, useCallback, useEffect } from "react";
import { useRef } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

type Photo = {
  src: string;
  alt: string;
  width: number;
  height: number;
  position?: string;
};

export function PhotoGrid({ photos }: { photos: Photo[] }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const wheelDeltaRef = useRef(0);

  const close = useCallback(() => setLightboxIndex(null), []);

  const prev = useCallback(() => {
    setLightboxIndex((i) => (i !== null ? (i - 1 + photos.length) % photos.length : null));
  }, [photos.length]);

  const next = useCallback(() => {
    setLightboxIndex((i) => (i !== null ? (i + 1) % photos.length : null));
  }, [photos.length]);

  useEffect(() => {
    if (lightboxIndex === null) return;

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [lightboxIndex, close, prev, next]);

  function onTouchStart(e: React.TouchEvent<HTMLDivElement>) {
    const touch = e.touches[0];
    if (!touch) return;

    touchStartXRef.current = touch.clientX;
    touchStartYRef.current = touch.clientY;
  }

  function onTouchEnd(e: React.TouchEvent<HTMLDivElement>) {
    const startX = touchStartXRef.current;
    const startY = touchStartYRef.current;
    const touch = e.changedTouches[0];

    touchStartXRef.current = null;
    touchStartYRef.current = null;

    if (startX === null || startY === null || !touch) return;

    const deltaX = touch.clientX - startX;
    const deltaY = touch.clientY - startY;
    const horizontalThreshold = 45;

    // Prefer horizontal swipes so normal vertical scrolling still works.
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) >= horizontalThreshold) {
      if (deltaX < 0) {
        next();
      } else {
        prev();
      }
    }
  }

  function onWheel(e: React.WheelEvent<HTMLDivElement>) {
    if (lightboxIndex === null) return;

    const axisDelta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    wheelDeltaRef.current += axisDelta;

    const threshold = 70;
    if (wheelDeltaRef.current >= threshold) {
      next();
      wheelDeltaRef.current = 0;
    } else if (wheelDeltaRef.current <= -threshold) {
      prev();
      wheelDeltaRef.current = 0;
    }
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {photos.map((photo, i) => (
          <button
            key={photo.src}
            onClick={() => setLightboxIndex(i)}
            className="group relative aspect-square overflow-hidden rounded-xl bg-foreground/5 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="(max-width: 768px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              style={{ objectPosition: photo.position ?? "50% 50%" }}
            />
          </button>
        ))}
      </div>

      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/90"
          onClick={close}
          onWheel={onWheel}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <button
            onClick={close}
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors z-10"
            aria-label="Close"
          >
            <X size={32} />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-4 text-white/70 hover:text-white transition-colors z-10"
            aria-label="Previous"
          >
            <ChevronLeft size={40} />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-4 text-white/70 hover:text-white transition-colors z-10"
            aria-label="Next"
          >
            <ChevronRight size={40} />
          </button>

          <div
            className="relative max-w-[90vw] max-h-[85vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={photos[lightboxIndex].src}
              alt={photos[lightboxIndex].alt}
              width={photos[lightboxIndex].width}
              height={photos[lightboxIndex].height}
              className="object-contain max-h-[85vh] rounded-lg"
            />
            <p className="text-center text-white/70 text-sm mt-3">
              {photos[lightboxIndex].alt} &middot; {lightboxIndex + 1} / {photos.length}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
