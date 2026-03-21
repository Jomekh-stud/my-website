import type { Metadata } from "next";
import Link from "next/link";
import { Headphones, Dices, ArrowRight } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Media",
  description: `Explore ${siteConfig.name}'s podcast and game design projects in one place.`,
};

const mediaSections = [
  {
    href: "/podcast",
    title: "Podcast",
    description: "Episodes, platform links, and support for The John Queenan Show.",
    icon: Headphones,
    accent: "text-primary",
    bg: "bg-primary/10",
  },
  {
    href: "/games",
    title: "Games",
    description: "Original tabletop and board game projects and releases.",
    icon: Dices,
    accent: "text-secondary",
    bg: "bg-secondary/10",
  },
] as const;

export default function MediaPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl sm:text-4xl font-bold mb-4">Media</h1>
      <p className="text-foreground/60 text-lg mb-10 max-w-2xl">
        Everything audio and game-related in one place.
      </p>

      <div className="grid gap-5 sm:grid-cols-2">
        {mediaSections.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="group rounded-2xl border border-foreground/10 bg-surface p-6 shadow-sm shadow-black/5 hover:-translate-y-0.5 hover:shadow-md transition-all"
            >
              <div
                className={`mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl ${item.bg}`}
              >
                <Icon size={22} className={item.accent} />
              </div>
              <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
              <p className="text-sm text-foreground/60 mb-4">{item.description}</p>
              <span className="inline-flex items-center gap-2 text-sm font-medium text-primary group-hover:text-primary-light transition-colors">
                Explore {item.title}
                <ArrowRight size={16} />
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
