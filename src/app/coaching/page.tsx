import type { Metadata } from "next";
import { Sprout, Users, GraduationCap } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { ContactForm } from "@/components/contact-form";

export const metadata: Metadata = {
  title: "Coaching",
  description: `Improv coaching with ${siteConfig.name} — private lessons, group classes, and workshops for all levels.`,
};

const offerings = [
  {
    icon: Sprout,
    title: "Private Coaching",
    description:
      "One-on-one sessions tailored to your goals. Whether you're prepping for an audition, building confidence, or sharpening your scene work.",
    color: "text-mint",
    bg: "bg-mint/10",
  },
  {
    icon: Users,
    title: "Group Classes",
    description:
      "Small group classes (6-12 people) covering fundamentals through advanced scene work. A supportive space to play, fail, and grow.",
    color: "text-secondary",
    bg: "bg-secondary/10",
  },
  {
    icon: GraduationCap,
    title: "Workshops",
    description:
      "Intensive half-day or full-day workshops for teams, organizations, or theater groups. Great for team building and creative skills.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
];

export default function CoachingPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex items-center gap-2 mb-2">
        <Sprout size={24} className="text-primary" />
        <span className="text-sm font-medium text-primary uppercase tracking-wide">
          Coaching
        </span>
      </div>

      <h1 className="text-3xl sm:text-4xl font-bold mb-4">Improv Coaching</h1>

      <p className="text-foreground/60 text-lg mb-12 max-w-2xl">
        I believe improv makes everyone better — better communicators, better
        listeners, better humans. My coaching philosophy is simple: create a
        space where it&apos;s safe to take risks, and the magic follows.
      </p>

      <div className="grid gap-6 sm:grid-cols-3 mb-16">
        {offerings.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="rounded-2xl border border-foreground/10 bg-surface p-6 shadow-sm shadow-black/5"
            >
              <div
                className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl ${item.bg}`}
              >
                <Icon size={20} className={item.color} />
              </div>
              <h3 className="font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-foreground/60">{item.description}</p>
            </div>
          );
        })}
      </div>

      <section id="contact-form">
        <h2 className="text-2xl font-bold mb-2">Get in Touch</h2>
        <p className="text-foreground/60 mb-8">
          Interested in coaching? Drop me a line and let&apos;s talk about what
          you&apos;re looking for.
        </p>
        <ContactForm />
      </section>
    </div>
  );
}
