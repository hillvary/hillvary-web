"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const HERO_IMAGE = "/images/gallery/HV_M1.png";

export function Hero() {
  return (
    <section id="home" className="scroll-mt-24 px-6 pb-16 pt-8 md:px-12 md:pt-14">
      <div className="mx-auto grid max-w-[1800px] gap-10 lg:grid-cols-[0.9fr_1.2fr]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="font-display text-5xl leading-[0.95] tracking-tight md:text-6xl">
            HILLVARY
          </h1>
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-muted-foreground">
            A Christian clothing ministry dedicated to empowering Believers through wearable
            truth. God&apos;s first act of grace was clothing Adam and Eve; what we wear should
            reflect that. Each design has been prayerfully created and Biblically tested. When
            you shop with us, you can trust that what you wear is truly Christ inspired.
          </p>
          <Link
            href="/shop"
            className="mt-8 inline-block rounded-full bg-foreground px-6 py-3 text-sm text-background transition-opacity hover:opacity-90"
          >
            Shop the Collection
          </Link>
        </motion.div>

        <motion.div
          className="relative mx-auto aspect-[9/11] w-full max-w-md overflow-hidden rounded-3xl bg-surface"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        >
          <span className="pointer-events-none absolute inset-0 flex items-center justify-center font-display text-[8rem] leading-none text-foreground/5 select-none">
            T-SHIRT
          </span>
          <Image
            src={HERO_IMAGE}
            alt="Hillvary featured product"
            fill
            priority
            className="relative object-cover"
            sizes="(min-width: 1024px) 40vw, 90vw"
          />
        </motion.div>
      </div>
    </section>
  );
}
