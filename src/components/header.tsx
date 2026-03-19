import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { NavLink } from "./nav-link";
import { MobileNav } from "./mobile-nav";

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 border-b border-foreground/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <Link
          href="/"
          className="text-xl font-bold text-primary hover:text-primary-light transition-colors"
        >
          {siteConfig.name}
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {siteConfig.navLinks.map((link) => (
            <NavLink key={link.href} href={link.href}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <MobileNav />
      </div>
    </header>
  );
}
