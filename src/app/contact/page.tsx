import type { Metadata } from "next";
import { MessageSquareHeart } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { SiteContactForm } from "@/components/site-contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description: `Send a message to ${siteConfig.name} about collaborations, bookings, and projects.`,
};

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="rounded-2xl border border-foreground/10 bg-surface p-6 sm:p-8 shadow-sm shadow-black/5">
        <div className="flex items-center gap-2 mb-2">
          <MessageSquareHeart size={24} className="text-primary" />
          <span className="text-sm font-medium text-primary uppercase tracking-wide">
            Contact
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold mb-4">Say Hello</h1>

        <p className="text-foreground/60 mb-8">
          Need a performer, host, coach, or creative collaborator? Send a note and
          include a few details so I can get back to you quickly.
        </p>

        <SiteContactForm />
      </div>
    </div>
  );
}
