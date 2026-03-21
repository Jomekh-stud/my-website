import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { AnimatedBackground } from "@/components/animated-background";
import { siteConfig } from "@/lib/site-config";
import { THEME_STORAGE_KEY } from "@/lib/theme";

const themeScript = `
  (() => {
    try {
      const storedTheme = window.localStorage.getItem("${THEME_STORAGE_KEY}");
      const currentHour = new Date().getHours();
      const fallbackTheme = currentHour >= 7 && currentHour < 19 ? "light" : "dark";
      const theme = storedTheme === "dark" || storedTheme === "light"
        ? storedTheme
        : fallbackTheme;
      const preference = storedTheme === "light" || storedTheme === "dark" || storedTheme === "auto"
        ? storedTheme
        : "auto";

      document.documentElement.dataset.theme = theme;
      document.documentElement.dataset.themePreference = preference;
    } catch {
      document.documentElement.dataset.theme = "light";
      document.documentElement.dataset.themePreference = "auto";
    }
  })();
`;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full flex flex-col relative bg-background text-foreground">
        <AnimatedBackground />
        <div className="relative z-10 flex min-h-full flex-1 flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
