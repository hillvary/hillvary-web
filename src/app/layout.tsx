import type { Metadata } from "next";
import { Archivo, Archivo_Black } from "next/font/google";
import { SiteLoader } from "@/components/layout/site-loader";
import "./globals.css";

const bodyFallback = Archivo({
  variable: "--font-body-fallback",
  subsets: ["latin"],
  display: "swap",
});

const displayFallback = Archivo_Black({
  variable: "--font-display-fallback",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Hillvary — Wearable Truth",
    template: "%s | Hillvary",
  },
  description:
    "Hillvary is a Christian clothing ministry dedicated to empowering Believers through wearable truth. Prayerfully created, Biblically tested apparel.",
  openGraph: {
    title: "Hillvary — Wearable Truth",
    description:
      "A Christian clothing ministry dedicated to empowering Believers through wearable truth.",
    siteName: "Hillvary",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hillvary — Wearable Truth",
    description:
      "A Christian clothing ministry dedicated to empowering Believers through wearable truth.",
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
      className={`${bodyFallback.variable} ${displayFallback.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <SiteLoader />
        {children}
      </body>
    </html>
  );
}
