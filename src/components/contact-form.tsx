"use client";

import { useActionState } from "react";
import { Send } from "lucide-react";
import { submitContactForm, type ContactState } from "@/app/coaching/actions";

const inquiryTypes = [
  "Private Coaching",
  "Group Class",
  "Workshop",
  "Other",
] as const;

export function ContactForm() {
  const [state, action, pending] = useActionState<ContactState, FormData>(
    submitContactForm,
    null,
  );

  return (
    <form action={action} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            maxLength={100}
            className="w-full rounded-lg border border-foreground/15 bg-white px-4 py-2.5 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="w-full rounded-lg border border-foreground/15 bg-white px-4 py-2.5 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors"
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="phone" className="block text-sm font-medium mb-1">
            Phone{" "}
            <span className="text-foreground/40 font-normal">(optional)</span>
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            maxLength={20}
            className="w-full rounded-lg border border-foreground/15 bg-white px-4 py-2.5 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors"
          />
        </div>

        <div>
          <label
            htmlFor="inquiryType"
            className="block text-sm font-medium mb-1"
          >
            Inquiry Type *
          </label>
          <select
            id="inquiryType"
            name="inquiryType"
            required
            defaultValue=""
            className="w-full rounded-lg border border-foreground/15 bg-white px-4 py-2.5 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors"
          >
            <option value="" disabled>
              Select one...
            </option>
            {inquiryTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium mb-1">
          Message *
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          minLength={10}
          maxLength={2000}
          className="w-full rounded-lg border border-foreground/15 bg-white px-4 py-2.5 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors resize-y"
        />
      </div>

      {state && (
        <div
          className={`rounded-lg px-4 py-3 text-sm ${
            state.success
              ? "bg-mint/10 text-green-800"
              : "bg-secondary/10 text-red-800"
          }`}
        >
          {state.message}
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center gap-2 rounded-full bg-primary text-white px-6 py-3 text-sm font-medium hover:bg-primary-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Send size={16} />
        {pending ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
