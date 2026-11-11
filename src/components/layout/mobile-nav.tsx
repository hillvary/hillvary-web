"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { X } from "lucide-react";
import { Logo } from "./logo";

const LINKS = [
  { number: "01", label: "Home", href: "/" },
  { number: "02", label: "All Products", href: "/shop" },
  { number: "03", label: "Gallery", href: "/#gallery" },
  { number: "04", label: "About", href: "/about" },
  { number: "05", label: "Contact", href: "/contact" },
];

export function MobileNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-background px-8 py-6 shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center justify-between">
              <Logo />
              <button type="button" onClick={onClose} aria-label="Close menu">
                <X className="h-6 w-6" strokeWidth={1.5} />
              </button>
            </div>

            <nav className="mt-16 flex flex-col gap-6">
              {LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  className="group flex items-baseline gap-4"
                >
                  <span className="text-xs text-muted">{link.number}</span>
                  <span className="font-display text-3xl tracking-tight transition-colors group-hover:text-accent">
                    {link.label}
                  </span>
                </Link>
              ))}
            </nav>

            <div className="mt-auto flex items-center gap-4 text-sm text-muted">
              <a href="mailto:hello@hillvary.com">hello@hillvary.com</a>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
