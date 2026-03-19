import { Instagram, Twitter, Youtube, Linkedin } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

const socialIcons = {
  instagram: Instagram,
  twitter: Twitter,
  youtube: Youtube,
  linkedin: Linkedin,
} as const;

export function Footer() {
  return (
    <footer className="border-t border-foreground/10 bg-foreground/2">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-foreground/50">
          &copy; {new Date().getFullYear()} {siteConfig.name}. All rights
          reserved.
        </p>

        <div className="flex items-center gap-4">
          {Object.entries(siteConfig.socials).map(([platform, url]) => {
            const Icon = socialIcons[platform as keyof typeof socialIcons];
            return (
              <a
                key={platform}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/40 hover:text-primary transition-colors"
                aria-label={platform}
              >
                <Icon size={20} />
              </a>
            );
          })}
        </div>
      </div>
    </footer>
  );
}
