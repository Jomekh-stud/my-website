import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Ticket } from "lucide-react";
import type { EventItem } from "@/lib/events";

const DEFAULT_BANNER = "#1E5FCF";
const DEFAULT_TEXT = "#ffffff";

function formatEventDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function hexToRgba(hex: string, alpha: number) {
  let normalized = hex.replace("#", "");
  if (normalized.length === 3) {
    normalized = normalized
      .split("")
      .map((char) => char + char)
      .join("");
  }

  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function getHeaderStyle(event: EventItem & { isPast: boolean }) {
  if (event.isPast) {
    return {
      backgroundColor: "#E2E8F0",
      color: "#475569",
    };
  }

  return {
    backgroundColor: event.bannerColor ?? (event.title.includes("Get Me Ready") ? "#D9875F" : DEFAULT_BANNER),
    color: event.textColor ?? DEFAULT_TEXT,
  };
}

function getBannerColor(event: EventItem) {
  return event.bannerColor ?? (event.title.includes("Get Me Ready") ? "#D9875F" : DEFAULT_BANNER);
}

function getPastBadgeBackground() {
  return hexToRgba("#E2E8F0", 0.9);
}

export function EventList({ events }: { events: EventItem[] }) {
  const now = Date.now();
  const eventCards = [...events]
    .map((event) => ({
      ...event,
      date: new Date(event.dateISO),
      isPast: new Date(event.dateISO).getTime() < now,
    }))
    .sort((a, b) => {
      if (a.isPast !== b.isPast) {
        return a.isPast ? 1 : -1;
      }

      if (a.isPast) {
        return b.date.getTime() - a.date.getTime();
      }

      return a.date.getTime() - b.date.getTime();
    });

  return (
    <div className="space-y-4">
      {eventCards.map((event, index) => (
        <article
          key={`${event.title}-${event.dateISO}-${event.venue}-${index}`}
          className={`relative rounded-2xl border p-5 sm:p-6 shadow-sm shadow-black/5 transition-colors ${
            event.isPast
              ? "border-foreground/10 bg-surface/70 text-foreground/70"
              : "border-foreground/12 bg-surface"
          }`}
        >
          <div className="flex items-start gap-4 mb-4">
            <div className="flex-1 min-w-0">
              <p className={`text-sm mb-1 ${event.isPast ? "text-foreground/55" : "text-primary"}`}>
                {formatEventDate(event.date)}
              </p>
              <div className="rounded-lg p-3 mb-3" style={getHeaderStyle(event)}>
                <h2 className="text-xl font-semibold">{event.title}</h2>
              </div>
              <p className={`text-sm mb-4 ${event.isPast ? "text-foreground/55" : "text-foreground/65"}`}>
                {event.venue} - {event.city}
              </p>
              {event.address && (
                <p className={`text-sm mb-4 ${event.isPast ? "text-foreground/55" : "text-foreground/65"}`}>
                  {event.address}
                </p>
              )}
            </div>
            {event.logo ? (
              <div className="relative w-24 h-24 flex-shrink-0 overflow-hidden rounded-lg">
                <Image
                  src={event.logo}
                  alt={event.title}
                  width={96}
                  height={96}
                  className="w-full h-full object-cover object-center"
                />
                {event.isPast && (
                  <span
                    className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-center px-4 py-2 text-xs font-semibold uppercase tracking-wide"
                    style={{
                      backgroundColor: getPastBadgeBackground(),
                      color: "#475569",
                    }}
                  >
                    Past
                  </span>
                )}
              </div>
            ) : (
              event.isPast && (
                <span
                  className="absolute top-4 right-4 inline-flex items-center rounded-full border border-foreground/25 px-4 py-2 text-xs font-semibold uppercase tracking-wide shadow-sm shadow-black/10"
                  style={{
                    backgroundColor: getPastBadgeBackground(),
                    color: "#475569",
                  }}
                >
                  Past
                </span>
              )
            )}
          </div>

          {event.notes && (
            <p className={`text-sm mb-4 ${event.isPast ? "text-foreground/55" : "text-foreground/65"}`}>
              {event.notes}
            </p>
          )}

          {event.description && (
            <div className={`text-sm mb-4 space-y-3 ${event.isPast ? "text-foreground/55" : "text-foreground/65"}`}>
              {event.description.split("\n\n").map((paragraph, paragraphIndex) => (
                <p key={paragraphIndex}>{paragraph}</p>
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            {event.ticketUrl && (
              <a
                href={event.ticketUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  event.isPast
                    ? "bg-foreground/6 text-foreground/70 hover:bg-foreground/10"
                    : "bg-primary text-white hover:bg-primary-light"
                }`}
              >
                Tickets
                <ExternalLink size={14} />
              </a>
            )}

            {event.venueUrl && (
              <a
                href={event.venueUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-foreground/6 px-4 py-2 text-sm font-medium text-foreground/75 hover:bg-foreground/10 transition-colors"
              >
                Venue
                <ExternalLink size={14} />
              </a>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
