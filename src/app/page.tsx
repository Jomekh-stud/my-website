import { Mic, Camera, Headphones, FileText, Theater } from "lucide-react";
import { SectionCard } from "@/components/section-card";
import { siteConfig } from "@/lib/site-config";

const sections = [
  {
    href: "/voice-over",
    icon: Mic,
    title: "Voice Over",
    description: "Commercial, animation, and narration reels & samples.",
    color: "bg-primary/10",
    iconColor: "text-primary",
  },
  {
    href: "/gallery",
    icon: Camera,
    title: "Gallery",
    description: "Performance photos from stages and studios.",
    color: "bg-secondary/10",
    iconColor: "text-secondary",
  },
  {
    href: "/podcast",
    icon: Headphones,
    title: "Podcast",
    description: "Listen to The John Q Show on your favorite platform.",
    color: "bg-accent/20",
    iconColor: "text-accent",
  },
  {
    href: "/resume",
    icon: FileText,
    title: "Resume",
    description: "Training, credits, skills, and contact info.",
    color: "bg-mint/10",
    iconColor: "text-mint",
  },
  {
    href: "/coaching",
    icon: Theater,
    title: "Coaching",
    description: "Private lessons, group classes, and workshops.",
    color: "bg-primary/10",
    iconColor: "text-primary",
  },
];

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <section className="mb-16 text-center">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
          Hey, I&apos;m{" "}
          <span className="text-primary">{siteConfig.name}</span>
          <span className="text-secondary">.</span>
        </h1>
        <p className="text-xl sm:text-2xl text-foreground/60 max-w-2xl mx-auto mb-6">
          {siteConfig.tagline}
        </p>
        <p className="text-base text-foreground/50 max-w-xl mx-auto">
          I bring characters to life behind the mic, make stuff up on stage,
          talk too much into microphones, and teach other people how to do all of
          the above.
        </p>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((section) => (
          <SectionCard key={section.href} {...section} />
        ))}
      </section>
    </div>
  );
}
