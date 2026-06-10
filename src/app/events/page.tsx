import type { Metadata } from "next";
import { CalendarDays } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { events } from "@/lib/events";
import { EventListWithSaved } from "@/components/event-list-with-saved";

export const metadata: Metadata = {
  title: "Events",
  description: `Upcoming live events and performances featuring ${siteConfig.name}.`,
};

export const revalidate = 3600;

export default function EventsPage() {
  const now = Date.now();
  const hasUpcoming = events.some((event) => new Date(event.dateISO).getTime() >= now);

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
            <span className="inline-flex items-center gap-2">
              <CalendarDays size={16} />
              Next Dates TBA
            </span>
          </div>
          <p className="text-foreground/65 mb-6">
            No upcoming performances are posted right now. Check back soon for
            new dates.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center rounded-full bg-foreground/6 px-5 py-2.5 text-sm font-medium hover:bg-foreground/10 transition-colors"
          >
            Ask About Upcoming Dates
          </a>
        </div>
      )}

      <EventListWithSaved events={events} />
    </div>
  );
}
