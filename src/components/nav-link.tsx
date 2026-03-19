"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavLink({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`text-sm font-medium transition-colors hover:text-primary ${
        isActive
          ? "text-primary border-b-2 border-primary"
          : "text-foreground/70"
      }`}
    >
      {children}
    </Link>
  );
}
