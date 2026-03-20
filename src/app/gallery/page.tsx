import type { Metadata } from "next";
import { Camera } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { PhotoGrid } from "@/components/photo-grid";

export const metadata: Metadata = {
  title: "Gallery",
  description: `Performance photos of ${siteConfig.name} — improv shows, voice acting sessions, and more.`,
};

const photos = [
  { src: "/images/gallery/show-1.jpg", alt: "Improv show performance", width: 800, height: 600 },
  { src: "/images/gallery/show-2.jpg", alt: "Stage performance", width: 800, height: 600 },
  { src: "/images/gallery/show-3.jpg", alt: "Comedy night", width: 600, height: 800 },
  { src: "/images/gallery/studio-1.jpg", alt: "Voice over studio session", width: 800, height: 600 },
  { src: "/images/gallery/studio-2.jpg", alt: "Recording booth", width: 800, height: 600 },
  { src: "/images/gallery/behind-1.jpg", alt: "Behind the scenes", width: 600, height: 800 },
];

export default function GalleryPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex items-center gap-2 mb-2">
        <Camera size={24} className="text-primary" />
        <span className="text-sm font-medium text-primary uppercase tracking-wide">
          Gallery
        </span>
      </div>

      <h1 className="text-3xl sm:text-4xl font-bold mb-4">Photos</h1>

      <p className="text-foreground/60 text-lg mb-10 max-w-xl">
        Moments from the stage, the booth, and everything in between.
      </p>

      <PhotoGrid photos={photos} />
    </div>
  );
}
