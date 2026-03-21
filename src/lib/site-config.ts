export const siteConfig = {
  name: "John Queenan",
  tagline: "Voice Actor | Improv Performer | Podcaster | Coach",
  description:
    "Multi-hyphenate performer specializing in voice acting, improv comedy, podcasting, and improv coaching.",
  url: "https://johnqperforms.com",
  email: "hello@johnqperforms.com",
  media: {
    // Adjust `position` (x y) to recenter the portrait crop site-wide.
    headshot: {
      src: "/images/headshot.jpg",
      position: "50% 30%",
    },
  },
  socials: {
    instagram: "https://instagram.com/johnqperforms",
    twitter: "https://twitter.com/johnqperforms",
    youtube: "https://youtube.com/@johnqperforms",
    linkedin: "https://linkedin.com/in/johnqperforms",
  },
  podcast: {
    name: "The John Queenan Show",
    description:
      "A comedy podcast exploring the wild world of improv, voice acting, and the creative hustle. New episodes weekly.",
    artwork: "/images/podcast-artwork.jpg",
    patreon: "https://patreon.com/johnqshow",
    platforms: {
      spotify: "https://open.spotify.com/show/example",
      apple: "https://podcasts.apple.com/us/podcast/example",
      youtube: "https://youtube.com/@johnqperforms",
    },
  },
  navLinks: [
    { href: "/", label: "Home" },
    { href: "/voice-over", label: "Voice Over" },
    { href: "/resume", label: "Resume" },
    { href: "/events", label: "Events" },
    { href: "/media", label: "Media" },
    { href: "/gallery", label: "Gallery" },
    { href: "/coaching", label: "Coaching" },
  ],
} as const;
