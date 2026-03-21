"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const AnimatedBackground = dynamic(
  () => import("@/components/animated-background").then((mod) => mod.AnimatedBackground),
  { ssr: false },
);

export function BackgroundLayer() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const reducedData = window.matchMedia("(prefers-reduced-data: reduce)").matches;
    const smallScreen = window.innerWidth < 768;

    setEnabled(!reducedMotion && !reducedData && !smallScreen);
  }, []);

  if (!enabled) {
    return null;
  }

  return <AnimatedBackground />;
}
