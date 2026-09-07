import { AboutPriya } from "@/components/AboutPriya";
import { Faq } from "@/components/Faq";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { Marquee } from "@/components/Marquee";
import { MenuSection } from "@/components/MenuSection";
import { BlockPrintBand } from "@/components/Ornaments";
import { OrderCta } from "@/components/OrderCta";
import { PickupInfo } from "@/components/PickupInfo";
import { fullAddress, menu, site } from "@/lib/site";

/**
 * Structured data so the kitchen shows up correctly in search and maps —
 * pickup only, the real hours, the real menu.
 */
const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "FoodEstablishment",
  name: site.name,
  description: site.blurb,
  servesCuisine: "Indian",
  priceRange: "$",
  telephone: site.contact.phoneE164,
  email: site.contact.email,
  founder: { "@type": "Person", name: site.cook },
  address: {
    "@type": "PostalAddress",
    streetAddress: site.contact.address.street,
    addressLocality: site.contact.address.city,
    addressRegion: site.contact.address.state,
    postalCode: site.contact.address.zip,
    addressCountry: "US",
  },
  openingHoursSpecification: site.schedule.pickupDays.map((day) => ({
    "@type": "OpeningHoursSpecification",
    dayOfWeek: `https://schema.org/${day}`,
    opens: "18:00",
    closes: "20:00",
  })),
  sameAs: [site.links.blog, site.links.instagram, site.links.youtube].filter(Boolean),
  hasMenu: {
    "@type": "Menu",
    hasMenuSection: {
      "@type": "MenuSection",
      name: "Rice bowls",
      hasMenuItem: menu.map((dish) => ({
        "@type": "MenuItem",
        name: dish.name,
        description: dish.description,
        offers: { "@type": "Offer", price: site.price, priceCurrency: site.currency },
        suitableForDiet: dish.vegetarian ? "https://schema.org/VegetarianDiet" : undefined,
      })),
    },
  },
  areaServed: fullAddress,
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
      />

      <Hero />
      <Marquee />

      <MenuSection />
      <BlockPrintBand bg="var(--color-marigold)" fg="var(--color-indigo-deep)" />

      <HowItWorks />
      <BlockPrintBand bg="var(--color-indigo)" fg="var(--color-turmeric)" />

      <PickupInfo />
      <AboutPriya />
      <Faq />

      <BlockPrintBand bg="var(--color-ivory-deep)" fg="var(--color-chili)" />
      <OrderCta />
    </>
  );
}
