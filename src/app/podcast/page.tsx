import type { Metadata } from "next";
import Image from "next/image";
import { Headphones, Heart } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { PlatformLink } from "@/components/platform-link";

export const metadata: Metadata = {
  title: "Podcast",
  description: `Listen to ${siteConfig.podcast.name} — ${siteConfig.podcast.description}`,
};

const platforms = [
  { key: "spotify", label: "Spotify" },
  { key: "apple", label: "Apple Podcasts" },
  { key: "youtube", label: "YouTube" },
] as const;

export default function PodcastPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex flex-col md:flex-row gap-10 items-center md:items-start">
        <div className="shrink-0">
          <div className="w-64 h-64 rounded-2xl bg-primary/10 flex items-center justify-center overflow-hidden shadow-lg">
            <Image
              src={siteConfig.podcast.artwork}
              alt={`${siteConfig.podcast.name} artwork`}
              width={256}
              height={256}
              className="rounded-2xl object-cover"
            />
          </div>
        </div>

        <div className="flex-1 text-center md:text-left">
          <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
            <Headphones size={24} className="text-primary" />
            <span className="text-sm font-medium text-primary uppercase tracking-wide">
              Podcast
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            {siteConfig.podcast.name}
          </h1>

          <p className="text-foreground/60 text-lg mb-8">
            {siteConfig.podcast.description}
          </p>

          <div className="flex flex-wrap gap-3 justify-center md:justify-start mb-6">
            {platforms.map(({ key, label }) => (
              <PlatformLink
                key={key}
                href={
                  siteConfig.podcast.platforms[
                    key as keyof typeof siteConfig.podcast.platforms
                  ]
                }
                label={label}
              />
            ))}
          </div>

          <PlatformLink
            href={siteConfig.podcast.patreon}
            label="Support on Patreon"
            icon={<Heart size={16} />}
            variant="patreon"
          />
        </div>
      </div>
    </div>
  );
}
