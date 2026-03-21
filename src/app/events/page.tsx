import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, ExternalLink, Ticket } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Events",
  description: `Upcoming live events and performances featuring ${siteConfig.name}.`,
};

export const revalidate = 3600;

type EventItem = {
  title: string;
  dateISO: string;
  venue: string;
  city: string;
  ticketUrl?: string;
  venueUrl?: string;
  notes?: string;
};

// Add events here. Keep past entries in this list as your running log.
const events: EventItem[] = [
  {
    title: "Improv Night: House Team Showcase",
    dateISO: "2026-04-12T20:00:00-05:00",
    venue: "The Playground Theater",
    city: "Chicago, IL",
    ticketUrl: "https://example.com/tickets/improv-night",
    venueUrl: "https://example.com/venues/playground-theater",
    notes: "One-night-only set with a stacked lineup of guest improvisers.",
  },
  {
    title: "Character Comedy Hour",
    dateISO: "2026-05-03T19:30:00-05:00",
    venue: "The Annoyance Theatre",
    city: "Chicago, IL",
    ticketUrl: "https://example.com/tickets/character-comedy-hour",
    venueUrl: "https://example.com/venues/annoyance-theatre",
    notes: "Original character work, audience chaos, and avoidable confidence.",
  },
  {
    title: "Late Mic Variety Show",
    dateISO: "2026-01-18T21:00:00-06:00",
    venue: "The Den Theatre",
    city: "Chicago, IL",
    ticketUrl: "https://example.com/tickets/late-mic-variety-show",
    venueUrl: "https://example.com/venues/the-den-theatre",
    notes: "Hosted set featuring stand-up, improv, and voice character bits.",
  },
];

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

export default function EventsPage() {
  const now = Date.now();
  const eventCards = events
    .map((event) => {
      const date = new Date(event.dateISO);
      return {
        ...event,
        date,
        isPast: date.getTime() < now,
      };
    })
    .sort((a, b) => {
      if (a.isPast !== b.isPast) {
        return a.isPast ? 1 : -1;
      }

      if (a.isPast) {
        return b.date.getTime() - a.date.getTime();
      }

      return a.date.getTime() - b.date.getTime();
    });

  const hasUpcoming = eventCards.some((event) => !event.isPast);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex items-center gap-2 mb-2">
        <CalendarDays size={24} className="text-primary" />
        <span className="text-sm font-medium text-primary uppercase tracking-wide">
          Events
        </span>
      </div>

      <h1 className="text-3xl sm:text-4xl font-bold mb-4">Live Shows & Appearances</h1>

      <p className="text-foreground/60 text-lg mb-10 max-w-2xl">
        I perform at different theaters and venues throughout the year. This page
        tracks upcoming shows and keeps a running log of past events.
      </p>

      {!hasUpcoming && (
        <div className="rounded-2xl border border-foreground/10 bg-surface p-8 shadow-sm shadow-black/5 mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary mb-5">
            <Ticket size={16} />
            Next Dates TBA
          </div>
          <p className="text-foreground/65 mb-6">
            No upcoming performances are posted right now. Check back soon for
            new dates.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center rounded-full bg-foreground/6 px-5 py-2.5 text-sm font-medium hover:bg-foreground/10 transition-colors"
          >
            Ask About Upcoming Dates
          </Link>
        </div>
      )}

      {eventCards.length > 0 && (
        <div className="space-y-4">
          {eventCards.map((event) => (
            <article
              key={`${event.title}-${event.dateISO}-${event.venue}`}
              className={`relative rounded-2xl border p-5 sm:p-6 shadow-sm shadow-black/5 transition-colors ${
                event.isPast
                  ? "border-foreground/10 bg-surface/70 text-foreground/70"
                  : "border-foreground/12 bg-surface"
              }`}
            >
              {event.isPast && (
                <span className="absolute top-4 right-4 inline-flex items-center rounded-full bg-foreground/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-foreground/60">
                  Past
                </span>
              )}

              <p className={`text-sm mb-1 ${event.isPast ? "text-foreground/45" : "text-primary"}`}>
                {formatEventDate(event.date)}
              </p>
              <h2 className="text-xl font-semibold mb-2">{event.title}</h2>
              <p className={`text-sm mb-4 ${event.isPast ? "text-foreground/55" : "text-foreground/65"}`}>
                {event.venue} - {event.city}
              </p>

              {event.notes && (
                <p className={`text-sm mb-4 ${event.isPast ? "text-foreground/55" : "text-foreground/65"}`}>
                  {event.notes}
                </p>
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
      )}
    </div>
  );
}
