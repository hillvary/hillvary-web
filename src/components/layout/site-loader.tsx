"use client";

import { useEffect, useState } from "react";
import VaporizeTextCycle, { Tag } from "@/components/ui/vapour-text-effect";

// How long a single vaporize -> fade-in -> wait cycle takes, in ms. Keep in
// sync with the `animation` prop below — once one full cycle has played the
// splash fades out and the real site underneath becomes visible/interactive.
const VAPORIZE_MS = 5000;
const FADE_IN_MS = 1000;
const WAIT_MS = 0;
const CYCLE_MS = VAPORIZE_MS + FADE_IN_MS + WAIT_MS; // 10s total

// Large by default, but scaled down on narrow viewports so "Hillvary" never
// overflows the screen width.
function useSplashFontSize() {
  const [fontSize, setFontSize] = useState(160);

  useEffect(() => {
    const compute = () => {
      const width = window.innerWidth;
      setFontSize(Math.round(Math.min(160, Math.max(56, width / 6))));
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  return fontSize;
}

/**
 * One-time full-screen loading splash shown while the site boots. Renders
 * "Hillvary" with the vapour text effect, then fades itself out and
 * unmounts, revealing the page underneath.
 */
export function SiteLoader() {
  const [visible, setVisible] = useState(true);
  const [fadingOut, setFadingOut] = useState(false);
  const fontSize = useSplashFontSize();

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFadingOut(true), CYCLE_MS);
    const removeTimer = setTimeout(() => setVisible(false), CYCLE_MS + 500);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-100 flex items-center justify-center bg-black transition-opacity duration-500 ease-out ${
        fadingOut ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <VaporizeTextCycle
        texts={["Hillvary"]}
        font={{
          // Canvas's 2D `ctx.font` can't resolve CSS custom properties
          // (var(...)) — it silently ignores the whole string and falls
          // back to the browser default (10px), so the real resolved
          // family name must be used here instead of the CSS variable.
          fontFamily: "helvetica, sans-serif",
          fontSize: `${fontSize}px`,
          fontWeight: 700,
        }}
        color="rgb(255, 255, 255)"
        spread={5}
        density={2}
        animation={{
          vaporizeDuration: VAPORIZE_MS / 1000,
          fadeInDuration: FADE_IN_MS / 1000,
          waitDuration: WAIT_MS / 0,
        }}
        direction="left-to-right"
        alignment="center"
        tag={Tag.H1}
      />
    </div>
  );
}
