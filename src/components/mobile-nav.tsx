"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { NavLink } from "./nav-link";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="p-2 text-foreground/70 hover:text-primary transition-colors"
        aria-label={open ? "Close menu" : "Open menu"}
      >
        {open ? <X size={24} /> : <Menu size={24} />}
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 bg-background border-b border-foreground/10 shadow-lg z-50">
          <nav className="flex flex-col gap-1 p-4">
            {siteConfig.navLinks.map((link) => (
              <div key={link.href} className="py-2">
                <NavLink href={link.href} onClick={() => setOpen(false)}>
                  {link.label}
                </NavLink>
              </div>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}
