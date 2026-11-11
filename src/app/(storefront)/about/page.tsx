import type { Metadata } from "next";
import Image from "next/image";
import { getSettings } from "@/lib/data/settings";

export const metadata: Metadata = {
  title: "About",
  description: "Hillvary is a Christian clothing ministry dedicated to empowering Believers through wearable truth.",
};

export const dynamic = "force-dynamic";

const TIMELINE = [
  {
    year: "Genesis",
    title: "The First Garment",
    text: "God's first act of grace toward humanity was clothing Adam and Eve. Hillvary begins from that same posture — clothing as covering, as care, as calling.",
  },
  {
    year: "Prayer",
    title: "Prayerfully Created",
    text: "Every design starts on our knees before it starts on a sketchpad. Each collection is prayed over before it's produced.",
  },
  {
    year: "Scripture",
    title: "Biblically Tested",
    text: "Every message we print is weighed against Scripture — nothing ships that we wouldn't stand behind in truth.",
  },
  {
    year: "Today",
    title: "Wearable Truth",
    text: "We make performance and everyday apparel that lets Believers carry their faith visibly, without compromise on quality.",
  },
];

export default async function AboutPage() {
  const settings = await getSettings();

  return (
    <div className="mx-auto max-w-[1800px] px-6 py-12 md:px-12">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <h1 className="font-display text-5xl leading-[0.95] tracking-tight md:text-6xl">
            HILLVARY
          </h1>
          <p className="mt-6 max-w-lg text-sm leading-relaxed text-muted-foreground">
            {settings.aboutText ??
              "A Christian clothing ministry dedicated to empowering Believers through wearable truth."}{" "}
            God&apos;s first act of grace was clothing Adam and Eve; what we wear should reflect
            that. Each design has been prayerfully created and Biblically tested. When you shop
            with us, you can trust that what you wear is truly Christ inspired.
          </p>
        </div>
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl bg-surface">
          <Image
            src="https://placehold.co/1000x750/1c1b17/f2efe8?text=Our+Story"
            alt="Hillvary brand story"
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 45vw, 90vw"
          />
        </div>
      </div>

      <section className="mt-20">
        <h2 className="mb-8 text-base font-medium">Our Mission</h2>
        <div className="grid gap-8 md:grid-cols-2">
          <p className="text-sm leading-relaxed text-muted-foreground">
            To equip Believers with apparel that speaks before they do — clothing that carries
            conviction into gyms, classrooms, streets, and sanctuaries alike.
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            To build a ministry, not just a brand — one that gives generously, disciples
            faithfully, and designs with excellence as an act of worship.
          </p>
        </div>
      </section>

      <section className="mt-20">
        <h2 className="mb-8 text-base font-medium">Our Journey</h2>
        <ol className="grid gap-8 border-t border-border pt-8 sm:grid-cols-2 lg:grid-cols-4">
          {TIMELINE.map((step) => (
            <li key={step.title}>
              <span className="text-xs uppercase tracking-wide text-accent">{step.year}</span>
              <h3 className="mt-2 font-display text-lg">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.text}</p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
