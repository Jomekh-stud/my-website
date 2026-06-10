"use client";

import { useEffect, useMemo, useState } from "react";
import { EventList } from "@/components/event-list";
import type { EventItem } from "@/lib/events";

const STORAGE_KEY = "johnq-site-events";

export function EventListWithSaved({ events }: { events: EventItem[] }) {
  const [savedEvents, setSavedEvents] = useState<EventItem[]>([]);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSavedEvents(JSON.parse(stored));
      }
    } catch (error) {
      console.warn("Unable to load saved events", error);
    }
  }, []);

  const mergedEvents = useMemo(() => {
    return [...events, ...savedEvents];
  }, [events, savedEvents]);

  return <EventList events={mergedEvents} />;
}
