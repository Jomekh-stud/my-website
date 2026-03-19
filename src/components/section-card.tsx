import Link from "next/link";
import type { LucideIcon } from "lucide-react";

export function SectionCard({
  href,
  icon: Icon,
  title,
  description,
  color,
  iconColor,
}: {
  href: string;
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
  iconColor: string;
}) {
  return (
    <Link
      href={href}
      className="group block rounded-2xl border border-foreground/10 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-1"
    >
      <div
        className={`mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl ${color}`}
      >
        <Icon size={24} className={iconColor} />
      </div>
      <h3 className="mb-1 text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
        {title}
      </h3>
      <p className="text-sm text-foreground/60">{description}</p>
    </Link>
  );
}
