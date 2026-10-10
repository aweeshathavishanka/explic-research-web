"use client";

import dynamic from "next/dynamic";
import { useState, useSyncExternalStore } from "react";

// WebGL is client-only and decorative: load it in its own chunk after hydration.
const MicroSlats = dynamic(() => import("./MicroSlats"), { ssr: false });

const DARK_QUERY = "(prefers-color-scheme: dark)";

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(DARK_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

// Purple Heart palette. Light: soft lavender slats with deeper crests.
// Dark: brand purple slats with pale crests.
const slatColors = {
  light: { color: "#bb67ff", glintColor: "#9506ff" },
  dark: { color: "#9506ff", glintColor: "#e6cbff" },
};

/**
 * Decorative hero background (layer 2). Sits behind the hero content, never
 * receives pointer events, and is hidden from assistive technology. Without
 * WebGL2 it renders nothing and the plain hero surface shows through.
 */
export function HeroBackground() {
  const dark = useSyncExternalStore(
    subscribe,
    () => window.matchMedia(DARK_QUERY).matches,
    () => false,
  );
  const [unsupported, setUnsupported] = useState(false);
  if (unsupported) return null;

  return (
    <div aria-hidden className="hero-slats pointer-events-none absolute inset-0 opacity-50 dark:opacity-70">
      <MicroSlats
        preset="swell"
        {...slatColors[dark ? "dark" : "light"]}
        backgroundColor="transparent"
        slatWidth={6}
        slatHeight={18}
        gap={4}
        roundness={1}
        speed={0.4}
        fog={0.25}
        introDuration={1.8}
        onUnsupported={() => setUnsupported(true)}
      />
    </div>
  );
}
