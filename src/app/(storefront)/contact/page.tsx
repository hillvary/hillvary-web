import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "@/components/contact/contact-form";
import { getSettings } from "@/lib/data/settings";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the Hillvary team.",
};

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const settings = await getSettings();

  return (
    <div className="mx-auto max-w-[1800px] px-6 py-12 md:px-12">
      <h1 className="font-display text-4xl tracking-tight">Get in Touch</h1>
      <p className="mt-3 max-w-md text-sm text-muted-foreground">
        Questions about an order, a design, or the ministry? We&apos;d love to hear from you.
      </p>

      <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_1.2fr]">
        <div className="flex flex-col gap-6">
          {settings.contactEmail && (
            <div className="flex items-start gap-3">
              <Mail className="mt-0.5 h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Email</p>
                <a href={`mailto:${settings.contactEmail}`} className="text-sm text-muted-foreground hover:text-foreground">
                  {settings.contactEmail}
                </a>
              </div>
            </div>
          )}
          {settings.contactPhone && (
            <div className="flex items-start gap-3">
              <Phone className="mt-0.5 h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Phone</p>
                <a href={`tel:${settings.contactPhone}`} className="text-sm text-muted-foreground hover:text-foreground">
                  {settings.contactPhone}
                </a>
              </div>
            </div>
          )}
          {settings.storeAddress && (
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Store</p>
                <p className="text-sm text-muted-foreground">{settings.storeAddress}</p>
              </div>
            </div>
          )}
        </div>

        <ContactForm />
      </div>
    </div>
  );
}
