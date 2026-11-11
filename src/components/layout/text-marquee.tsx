import { Fragment } from "react";

const ITEMS = [
  "Wearable Truth",
  "Prayerfully Designed",
  "Biblically Tested",
  "For Christ & Kingdom",
  "Kigali, Rwanda",
];

function MarqueeLine() {
  return (
    <div className="flex items-center space-x-12 px-6">
      {ITEMS.map((item, i) => (
        <Fragment key={item}>
          <span>{item}</span>
          {i < ITEMS.length - 1 && <span className="text-accent/60">✦</span>}
        </Fragment>
      ))}
    </div>
  );
}

/**
 * Diagonal scrolling text strip. Shared copy of the home page's marquee,
 * used here to overlap the seam above the footer.
 */
export function TextMarquee() {
  return (
    <div className="relative z-10 -mt-14 w-full -rotate-2 scale-110 overflow-hidden border-y border-border/50 bg-background/60 py-4 shadow-2xl backdrop-blur-md md:-mt-20">
      <div className="flex w-max animate-marquee text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground md:text-sm">
        <MarqueeLine />
        <MarqueeLine />
      </div>
    </div>
  );
}
