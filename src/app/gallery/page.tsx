import type { Metadata } from "next";
import { Camera } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { PhotoGrid } from "@/components/photo-grid";

export const metadata: Metadata = {
  title: "Gallery",
  description: `Performance photos of ${siteConfig.name} — improv shows, voice acting sessions, and more.`,
};

const photos = [
  // Tweak `position` to reframe each image in the square gallery cards.
  { src: "/images/gallery/improv show 1 (binx).jpg", alt: "Improv show performance", width: 800, height: 600, position: "50% 35%" },
  { src: "/images/gallery/improv show 2 (binx).jpg", alt: "Stage performance", width: 800, height: 600, position: "50% 38%" },
  { src: "/images/gallery/imprv show 3 (binx).jpg", alt: "Comedy night", width: 600, height: 800, position: "50% 40%" },
  { src: "/images/gallery/clown 1 (old lady).jpg", alt: "Character performance", width: 600, height: 800, position: "50% 30%" },
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
