import type { Metadata } from "next";
import { CalendarDays } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { events } from "@/lib/events";
import EventManager from "@/components/event-manager";

export const metadata: Metadata = {
  title: "Manage Events",
  description: `Authorized event management for ${siteConfig.name}.`,
};

export default function EventsManagePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex items-center gap-2 mb-2">
        <CalendarDays size={24} className="text-primary" />
        <span className="text-sm font-medium text-primary uppercase tracking-wide">
          Event Management
        </span>
      </div>

      <h1 className="text-3xl sm:text-4xl font-bold mb-4">Manage Events</h1>

      <p className="text-foreground/60 text-lg mb-10 max-w-2xl">
        Add and style upcoming shows from a private admin page. Only authorized users should access this route.
      </p>

      <EventManager initialEvents={events} />
    </div>
  );
}
