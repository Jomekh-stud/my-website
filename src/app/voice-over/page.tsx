import type { Metadata } from "next";
import { Mic } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { AudioPlayer } from "@/components/audio-player";

export const metadata: Metadata = {
  title: "Voice Over",
  description: `${siteConfig.name}'s voice over reels and audio samples — commercial, animation, and narration.`,
};

const samples = [
  {
    title: "Commercial Reel",
    category: "Commercial",
    src: "/audio/commercial-reel.mp3",
  },
  {
    title: "Animation Demo",
    category: "Animation",
    src: "/audio/animation-demo.mp3",
  },
  {
    title: "Narration Sample",
    category: "Narration",
    src: "/audio/narration-sample.mp3",
  },
  {
    title: "Character Voices",
    category: "Animation",
    src: "/audio/character-voices.mp3",
  },
];

export default function VoiceOverPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex items-center gap-2 mb-2">
        <Mic size={24} className="text-primary" />
        <span className="text-sm font-medium text-primary uppercase tracking-wide">
          Voice Over
        </span>
      </div>

      <h1 className="text-3xl sm:text-4xl font-bold mb-4">Reels & Samples</h1>

      <p className="text-foreground/60 text-lg mb-10 max-w-xl">
        From upbeat commercials to quirky animated characters to smooth
        narration — here&apos;s a taste of what I do behind the mic.
      </p>

      <div className="space-y-4">
        {samples.map((sample) => (
          <AudioPlayer key={sample.title} {...sample} />
        ))}
      </div>
    </div>
  );
}
