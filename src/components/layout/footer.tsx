import { ShoppingBag } from "lucide-react";
import { CinematicFooter } from "@/components/ui/motion-footer";
import { TextMarquee } from "./text-marquee";
import { WhatsAppIcon, InstagramIcon, TikTokIcon } from "./social-icons";
import { NewsletterForm } from "./newsletter-form";

const YEAR = new Date().getFullYear();

export function Footer() {
  return (
    <>
      {/* <TextMarquee /> */}
      <CinematicFooter
        giantText="HILLVARY"
        heading="For Christ & Kingdom"
        marqueeItems={[]}
        primaryActions={[
          {
            label: "Shop the Collection",
            href: "/shop",
            icon: <ShoppingBag />,
          },
          {
            label: "WhatsApp Us",
            href: "https://wa.me/",
            icon: <WhatsAppIcon />,
          },
        ]}
        secondaryLinks={[
          { label: "Home", href: "/" },
          { label: "All Products", href: "/shop" },
          { label: "About", href: "/about" },
          { label: "Contact", href: "/contact" },
        ]}
        copyright={`${YEAR} © HILLVARY, All Rights Reserved`}
        creditSlot={
          <div className="footer-glass-pill flex items-center gap-3 rounded-full border-border/50 px-5 py-3">
            <a
              href="https://wa.me/"
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp"
              className="text-muted-foreground hover:text-foreground"
            >
              <WhatsAppIcon className="h-4 w-4" />
            </a>
            <a
              href="https://instagram.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="text-muted-foreground hover:text-foreground"
            >
              <InstagramIcon className="h-4 w-4" />
            </a>
            <a
              href="https://tiktok.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="TikTok"
              className="text-muted-foreground hover:text-foreground"
            >
              <TikTokIcon className="h-4 w-4" />
            </a>
          </div>
        }
      >
        <div className="mt-4 flex flex-col items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground md:text-xs">
            Stay in the Word
          </span>
          <NewsletterForm />
        </div>
      </CinematicFooter>
    </>
  );
}
