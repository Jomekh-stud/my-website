import type { Metadata } from "next";
import { Dices, ExternalLink } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Games",
  description: `Tabletop and board games by ${siteConfig.name} on itch.io.`,
};

export default function GamesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex items-center gap-2 mb-2">
        <Dices size={24} className="text-primary" />
        <span className="text-sm font-medium text-primary uppercase tracking-wide">
          Games
        </span>
      </div>

      <h1 className="text-3xl sm:text-4xl font-bold mb-4">Tabletop & Board Games</h1>

      <p className="text-foreground/60 text-lg mb-12 max-w-2xl">
        When I'm not voice acting or performing improv, I design and publish original tabletop and board games. Check out my creations on itch.io, where you can discover new games and game design experiments.
      </p>

      <div className="flex flex-col gap-4">
        <a
          href="https://jdquinn.itch.io"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 px-6 py-4 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors w-fit font-semibold"
        >
          <span>Visit My itch.io Page</span>
          <ExternalLink size={20} />
        </a>
      </div>

      <section className="mt-16">
        <h2 className="text-2xl font-bold mb-6">Why Board Games?</h2>
        <p className="text-foreground/60 text-base leading-relaxed max-w-2xl">
          Game design shares a lot with improvisation and performance — it's about creating experiences, 
          building interesting constraints, and watching people have fun within the rules you set. 
          Whether you're looking for quick party games, strategic deep dives, or experimental mechanics, 
          you'll find something interesting on my itch.io profile.
        </p>
      </section>
    </div>
  );
}
