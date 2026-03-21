import { Mic, Camera, Headphones, FileText, Sprout, CalendarDays } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
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
    href: "/resume",
    icon: FileText,
    title: "Resume",
    description: "Training, credits, skills, and contact info.",
    color: "bg-mint/10",
    iconColor: "text-mint",
  },
  {
    href: "/events",
    icon: CalendarDays,
    title: "Events",
    description: "Upcoming performances, shows, and appearances.",
    color: "bg-secondary/10",
    iconColor: "text-secondary",
  },
  {
    href: "/media",
    icon: Headphones,
    title: "Media",
    description: "Podcast episodes and game projects in one place.",
    color: "bg-accent/20",
    iconColor: "text-accent",
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
    href: "/coaching",
    icon: Sprout,
    title: "Coaching",
    description: "Private lessons, group classes, and workshops.",
    color: "bg-primary/10",
    iconColor: "text-primary",
  },
];

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <section className="mb-16">
        <div className="flex flex-col lg:flex-row-reverse gap-8 lg:gap-12 items-center">
          {/* Headshot Image */}
          <div className="w-full lg:w-1/3 flex justify-center shrink-0">
            <div className="relative w-48 h-60 sm:w-56 sm:h-72 lg:w-64 lg:h-80 rounded-2xl overflow-hidden shadow-lg bg-primary/10">
              <Image
                src={siteConfig.media.headshot.src}
                alt={`${siteConfig.name} headshot`}
                fill
                sizes="(max-width: 1024px) 224px, 256px"
                className="object-cover"
                style={{ objectPosition: siteConfig.media.headshot.position }}
                priority
              />
            </div>
          </div>

          {/* Text Content */}
          <div className="w-full lg:w-2/3 text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
              Hey, I&apos;m{" "}
              <span className="text-primary">{siteConfig.name}</span>
              <span className="text-secondary">.</span>
            </h1>
            <p className="text-xl sm:text-2xl text-foreground/60 mb-6">
              {siteConfig.tagline}
            </p>
            <p className="text-base text-foreground/50 max-w-xl mx-auto lg:mx-0 mb-6">
              I bring characters to life behind the mic, make stuff up on stage,
              talk too much into microphones, and teach other people how to do all of
              the above.
            </p>
            <Link
              href="/coaching#contact-form"
              className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors font-semibold"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((section) => (
          <SectionCard key={section.href} {...section} />
        ))}
      </section>
    </div>
  );
}
