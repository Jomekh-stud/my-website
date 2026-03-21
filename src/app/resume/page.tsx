import type { Metadata } from "next";
import Image from "next/image";
import { FileText, Mail, Download } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Resume",
  description: `${siteConfig.name}'s performance resume — training, credits, and special skills.`,
};

const training = [
  { institution: "The Second City", program: "Conservatory" },
  { institution: "Upright Citizens Brigade", program: "Improv 101-401" },
  { institution: "Voice One", program: "VO Mastery Program" },
];

const credits = [
  { role: "Lead (V/O)", project: "Character Animation Series", venue: "Studio" },
  { role: "Ensemble", project: "Main Stage Revue", venue: "The Second City" },
  { role: "Host", project: "The John Queenan Show", venue: "Podcast" },
  { role: "Featured", project: "Commercial Campaign", venue: "National" },
];

const skills = [
  "Character Voices",
  "Accents & Dialects",
  "Improv (Long & Short Form)",
  "Sketch Comedy",
  "Hosting & Emceeing",
  "Podcast Production",
  "Audio Editing",
  "Stage Combat",
  "Singing (Baritone)",
];

export default function ResumePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex flex-col md:flex-row gap-10 mb-12">
        <div className="shrink-0 mx-auto md:mx-0">
          <div className="w-48 h-60 rounded-2xl bg-primary/10 overflow-hidden shadow-lg">
            <Image
              src={siteConfig.media.headshot.src}
              alt={`${siteConfig.name} headshot`}
              width={192}
              height={240}
              className="object-cover w-full h-full"
              style={{ objectPosition: siteConfig.media.headshot.position }}
            />
          </div>
        </div>

        <div className="flex-1 text-center md:text-left">
          <div className="flex items-center gap-2 mb-2 justify-center md:justify-start">
            <FileText size={24} className="text-primary" />
            <span className="text-sm font-medium text-primary uppercase tracking-wide">
              Resume
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold mb-2">
            {siteConfig.name}
          </h1>
          <p className="text-foreground/60 text-lg mb-4">
            {siteConfig.tagline}
          </p>

          <div className="flex flex-wrap gap-3 justify-center md:justify-start">
            <a
              href={`mailto:${siteConfig.email}`}
              className="inline-flex items-center gap-2 rounded-full bg-primary text-white px-5 py-2 text-sm font-medium hover:bg-primary-light transition-colors"
            >
              <Mail size={16} />
              Contact
            </a>
            <a
              href="/resume.pdf"
              className="inline-flex items-center gap-2 rounded-full bg-foreground/5 px-5 py-2 text-sm font-medium hover:bg-foreground/10 transition-colors"
            >
              <Download size={16} />
              Download PDF
            </a>
          </div>
        </div>
      </div>

      <div className="grid gap-10 md:grid-cols-2">
        <section>
          <h2 className="text-xl font-bold mb-4 text-primary">Training</h2>
          <div className="space-y-3">
            {training.map((item) => (
              <div key={item.institution} className="border-l-2 border-primary/20 pl-4">
                <p className="font-medium">{item.institution}</p>
                <p className="text-sm text-foreground/60">{item.program}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4 text-secondary">
            Credits & Experience
          </h2>
          <div className="space-y-3">
            {credits.map((item) => (
              <div key={item.project} className="border-l-2 border-secondary/20 pl-4">
                <p className="font-medium">{item.project}</p>
                <p className="text-sm text-foreground/60">
                  {item.role} &middot; {item.venue}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="md:col-span-2">
          <h2 className="text-xl font-bold mb-4 text-mint">
            Skills & Special Abilities
          </h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-mint/10 text-foreground/70 px-4 py-1.5 text-sm font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
