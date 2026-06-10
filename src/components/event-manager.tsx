"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Ticket, Plus, Trash2 } from "lucide-react";
import { EventList } from "@/components/event-list";
import type { EventItem } from "@/lib/events";

type EventManagerProps = {
  initialEvents: EventItem[];
};

const STORAGE_KEY = "johnq-site-events";
const ADMIN_STORAGE_KEY = "johnq-admin-token";

const defaultFormState: EventItem = {
  title: "",
  dateISO: getLocalDateTime(new Date()),
  venue: "",
  city: "",
  ticketUrl: "",
  venueUrl: "",
  notes: "",
  logo: "",
  description: "",
  address: "",
  bannerColor: "#1E5FCF",
  textColor: "#ffffff",
};

function getLocalDateTime(date: Date) {
  const offsetMs = date.getTimezoneOffset() * 60000;
  const localDate = new Date(date.getTime() - offsetMs);
  return localDate.toISOString().slice(0, 16);
}

export default function EventManager({ initialEvents }: EventManagerProps) {
  const [savedEvents, setSavedEvents] = useState<EventItem[]>([]);
  const [formValues, setFormValues] = useState<EventItem>(defaultFormState);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminCode, setAdminCode] = useState("");
  const [unlockError, setUnlockError] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSavedEvents(JSON.parse(stored));
      }
    } catch (error) {
      console.warn("Unable to load saved events", error);
    }

    const verifyAdminToken = async () => {
      try {
        const token = window.localStorage.getItem(ADMIN_STORAGE_KEY);
        if (!token) {
          return;
        }

        const response = await fetch("/api/admin/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        if (response.ok) {
          setIsAdmin(true);
        } else {
          window.localStorage.removeItem(ADMIN_STORAGE_KEY);
        }
      } catch (error) {
        console.warn("Unable to verify admin token", error);
      }
    };

    verifyAdminToken();
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(savedEvents));
    } catch (error) {
      console.warn("Unable to save events", error);
    }
  }, [savedEvents]);

  const eventCards = useMemo(() => {
    const now = Date.now();
    return [...initialEvents, ...savedEvents]
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
  }, [initialEvents, savedEvents]);

  const hasUpcoming = eventCards.some((event) => !event.isPast);

  const updateField = (field: keyof EventItem, value: string) => {
    setFormValues((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setSavedEvents((current) => [
      ...current,
      {
        ...formValues,
        dateISO: new Date(formValues.dateISO).toISOString(),
      },
    ]);
    setFormValues({
      ...defaultFormState,
      dateISO: getLocalDateTime(new Date()),
    });
  };

  const handleClearSaved = () => {
    setSavedEvents([]);
  };

  const handleRemoveSaved = (index: number) => {
    setSavedEvents((current) => current.filter((_, i) => i !== index));
  };

  const handleUnlock = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: adminCode }),
      });

      if (!response.ok) {
        setUnlockError(true);
        return;
      }

      const data = await response.json();
      if (data?.success && data?.token) {
        window.localStorage.setItem(ADMIN_STORAGE_KEY, data.token);
        setIsAdmin(true);
        setUnlockError(false);
        setAdminCode("");
        return;
      }

      setUnlockError(true);
    } catch (error) {
      console.warn("Admin unlock failed", error);
      setUnlockError(true);
    }
  };

  if (!isAdmin) {
    return (
      <section className="rounded-2xl border border-foreground/10 bg-surface p-8 shadow-sm shadow-black/5">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Event Admin Access</p>
          <h2 className="mt-2 text-2xl font-bold">Authorized users only</h2>
        </div>

        <p className="text-foreground/70 mb-6">
          This page is reserved for site administrators. Enter the admin code to unlock the event manager.
        </p>

        <form onSubmit={handleUnlock} className="space-y-4 max-w-md">
          <label className="block text-sm font-medium text-foreground/80">
            Admin code
            <input
              type="password"
              value={adminCode}
              onChange={(event) => setAdminCode(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-foreground/10 bg-white/90 px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </label>

          {unlockError && (
            <p className="text-sm text-rose-500">The admin code is incorrect. Please try again.</p>
          )}

          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-primary-light transition-colors"
          >
            Unlock Manager
          </button>
        </form>
      </section>
    );
  }

  return (
    <div className="space-y-10">
      <section className="rounded-2xl border border-foreground/10 bg-surface p-8 shadow-sm shadow-black/5">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              Event Manager
            </p>
            <h2 className="mt-2 text-2xl font-bold">Add shows to the Events page</h2>
          </div>
          {savedEvents.length > 0 && (
            <button
              type="button"
              onClick={handleClearSaved}
              className="inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-foreground/5 px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-foreground/10"
            >
              <Trash2 size={16} />
              Clear added events
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="grid gap-4 lg:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-medium">Event title</span>
            <input
              value={formValues.title}
              onChange={(event) => updateField("title", event.target.value)}
              type="text"
              className="w-full rounded-2xl border border-foreground/10 bg-white/90 px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              required
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium">Date & time</span>
            <input
              value={formValues.dateISO}
              onChange={(event) => updateField("dateISO", event.target.value)}
              type="datetime-local"
              className="w-full rounded-2xl border border-foreground/10 bg-white/90 px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              required
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium">Venue</span>
            <input
              value={formValues.venue}
              onChange={(event) => updateField("venue", event.target.value)}
              type="text"
              className="w-full rounded-2xl border border-foreground/10 bg-white/90 px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              required
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium">City</span>
            <input
              value={formValues.city}
              onChange={(event) => updateField("city", event.target.value)}
              type="text"
              className="w-full rounded-2xl border border-foreground/10 bg-white/90 px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              required
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium">Ticket URL</span>
            <input
              value={formValues.ticketUrl}
              onChange={(event) => updateField("ticketUrl", event.target.value)}
              type="url"
              className="w-full rounded-2xl border border-foreground/10 bg-white/90 px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium">Venue URL</span>
            <input
              value={formValues.venueUrl}
              onChange={(event) => updateField("venueUrl", event.target.value)}
              type="url"
              className="w-full rounded-2xl border border-foreground/10 bg-white/90 px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </label>

          <label className="space-y-2 lg:col-span-2">
            <span className="text-sm font-medium">Address</span>
            <input
              value={formValues.address}
              onChange={(event) => updateField("address", event.target.value)}
              type="text"
              className="w-full rounded-2xl border border-foreground/10 bg-white/90 px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </label>

          <label className="space-y-2 lg:col-span-2">
            <span className="text-sm font-medium">Logo URL</span>
            <input
              value={formValues.logo}
              onChange={(event) => updateField("logo", event.target.value)}
              type="url"
              className="w-full rounded-2xl border border-foreground/10 bg-white/90 px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </label>

          <label className="space-y-2 lg:col-span-2">
            <span className="text-sm font-medium">Description</span>
            <textarea
              value={formValues.description}
              onChange={(event) => updateField("description", event.target.value)}
              rows={4}
              className="w-full rounded-2xl border border-foreground/10 bg-white/90 px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </label>

          <label className="space-y-2 lg:col-span-2">
            <span className="text-sm font-medium">Notes</span>
            <textarea
              value={formValues.notes}
              onChange={(event) => updateField("notes", event.target.value)}
              rows={2}
              className="w-full rounded-2xl border border-foreground/10 bg-white/90 px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium">Banner color</span>
            <input
              value={formValues.bannerColor}
              onChange={(event) => updateField("bannerColor", event.target.value)}
              type="color"
              className="w-full h-12 rounded-2xl border border-foreground/10 bg-white/90 px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium">Text color</span>
            <input
              value={formValues.textColor}
              onChange={(event) => updateField("textColor", event.target.value)}
              type="color"
              className="w-full h-12 rounded-2xl border border-foreground/10 bg-white/90 px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </label>

          <div className="lg:col-span-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-foreground/60">
              Add new events to this page. Saved events are stored in your browser and shown immediately.
            </div>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-primary-light transition-colors"
            >
              <Plus size={16} />
              Add Event
            </button>
          </div>
        </form>
      </section>

      {savedEvents.length > 0 && (
        <section className="rounded-2xl border border-foreground/10 bg-surface p-6 shadow-sm shadow-black/5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-primary">
                Saved Events
              </p>
              <p className="text-sm text-foreground/65">Remove individual saved items here.</p>
            </div>
            <button
              type="button"
              onClick={handleClearSaved}
              className="inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-foreground/5 px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-foreground/10"
            >
              <Trash2 size={16} />
              Clear all
            </button>
          </div>

          <div className="space-y-3">
            {savedEvents.map((event, index) => (
              <div
                key={`${event.title}-${event.dateISO}-${index}`}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl border border-foreground/10 bg-white/90 p-4"
              >
                <div>
                  <p className="font-medium">{event.title}</p>
                  <p className="text-sm text-foreground/60">
                    {new Date(event.dateISO).toLocaleString()}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveSaved(index)}
                  className="inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-foreground/5 px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-foreground/10"
                >
                  <Trash2 size={16} />
                  Remove
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      <section>
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
      </section>

      <EventList events={eventCards} />
    </div>
  );
}
