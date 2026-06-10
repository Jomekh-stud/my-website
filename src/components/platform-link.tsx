import { ExternalLink } from "lucide-react";

export function PlatformLink({
  href,
  label,
  icon,
  variant = "default",
  platformIcon,
}: {
  href: string;
  label: string;
  icon?: React.ReactNode;
  variant?: "default" | "patreon";
  platformIcon?: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-all hover:-translate-y-0.5 hover:shadow-md ${
        variant === "patreon"
          ? "bg-purple-600 text-white hover:bg-purple-700"
          : "bg-foreground/5 text-foreground hover:bg-foreground/10"
      }`}
    >
      {platformIcon || icon}
      {label}
      <ExternalLink size={14} />
    </a>
  );
}
