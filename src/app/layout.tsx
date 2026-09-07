import type { Metadata, Viewport } from "next";
import { Rozha_One, Khand, Mukta } from "next/font/google";
import "./globals.css";

import { CartProvider } from "@/components/CartProvider";
import { CartDrawer } from "@/components/CartDrawer";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { site, fullAddress } from "@/lib/site";

/**
 * All three faces are drawn by Indian foundries and carry Devanagari alongside
 * Latin, so the Hindi dish names set in the same type as everything else
 * instead of dropping to a system fallback.
 */
const rozha = Rozha_One({
  subsets: ["latin", "devanagari"],
  weight: "400",
  variable: "--font-rozha",
  display: "swap",
});

const khand = Khand({
  subsets: ["latin", "devanagari"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-khand",
  display: "swap",
});

const mukta = Mukta({
  subsets: ["latin", "devanagari"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-mukta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "The Hungry Palate — Home-cooked Indian in Batavia, Ohio",
  description: `Priya Dayal cooks three Indian rice bowls a week from her kitchen in Batavia, Ohio. Order by ${site.schedule.cutoffLabel}, pick up Tuesday or Wednesday, ${site.schedule.pickupWindow.label}. $${site.price} a meal, with naan and kachumbar salad.`,
  keywords: [
    "Indian food Batavia Ohio",
    "home cooked Indian meals",
    "chicken tikka masala pickup",
    "meal prep Cincinnati",
    "The Hungry Palate",
  ],
  openGraph: {
    title: "The Hungry Palate",
    description: `Home-cooked Indian rice bowls, ${fullAddress}. Order by ${site.schedule.cutoffLabel}.`,
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#15224f",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${rozha.variable} ${khand.variable} ${mukta.variable}`}>
      <body>
        <CartProvider>
          <a href="#menu" className="sr-only focus:not-sr-only">
            Skip to the menu
          </a>
          <SiteHeader />
          <main>{children}</main>
          <SiteFooter />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
