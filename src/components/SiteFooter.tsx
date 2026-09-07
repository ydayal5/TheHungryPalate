import Image from "next/image";

import { BlockPrintBand } from "./Ornaments";
import { fullAddress, mapsUrl, site } from "@/lib/site";

export function SiteFooter() {
  const social = [
    { label: "Blog", href: site.links.blog },
    { label: "Instagram", href: site.links.instagram },
    { label: "YouTube", href: site.links.youtube },
  ].filter((link): link is { label: string; href: string } => Boolean(link.href));

  return (
    <footer>
      <BlockPrintBand bg="var(--color-indigo-deep)" fg="var(--color-marigold)" height={40} />

      <div style={{ background: "var(--color-indigo-deep)", color: "var(--color-ivory)" }}>
        <div className="shell grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            {/* the badge stands in for the name here, so the heading is for structure only */}
            <h2 className="sr-only">{site.name}</h2>
            <Image
              src="/images/logo-mark.png"
              alt={site.name}
              width={220}
              height={220}
              className="h-28 w-28"
            />
            <p className="mt-3 text-[1.1rem]" lang="hi" style={{ color: "var(--color-marigold)" }}>
              {site.nameHi}
            </p>
            <p className="mt-4 text-[0.98rem]" style={{ color: "rgba(253,243,227,0.7)" }}>
              {site.tagline}. Cooked by {site.cook}.
            </p>
          </div>

          <div>
            <h3 className="field-label" style={{ color: "var(--color-turmeric)" }}>
              Pickup
            </h3>
            <p className="m-0 text-[0.98rem]" style={{ color: "rgba(253,243,227,0.82)" }}>
              <a href={mapsUrl} target="_blank" rel="noreferrer" style={{ color: "inherit" }}>
                {fullAddress}
              </a>
            </p>
            <p className="mt-2 text-[0.98rem]" style={{ color: "rgba(253,243,227,0.82)" }}>
              {site.schedule.pickupDays.join(" & ")}, {site.schedule.pickupWindow.label}
            </p>
            <p className="mt-2 text-[0.98rem]" style={{ color: "rgba(253,243,227,0.82)" }}>
              Orders close {site.schedule.cutoffLabel}
            </p>
          </div>

          <div>
            <h3 className="field-label" style={{ color: "var(--color-turmeric)" }}>
              Get in touch
            </h3>
            <p className="m-0 text-[0.98rem]">
              <a href={`tel:${site.contact.phoneE164}`} style={{ color: "rgba(253,243,227,0.82)" }}>
                {site.contact.phone}
              </a>
            </p>
            <p className="mt-2 text-[0.98rem]">
              <a href={`mailto:${site.contact.email}`} style={{ color: "rgba(253,243,227,0.82)" }}>
                {site.contact.email}
              </a>
            </p>
            <p className="mt-2 text-[0.98rem]" style={{ color: "rgba(253,243,227,0.82)" }}>
              Venmo {site.payment.venmoHandle} · or cash
            </p>
          </div>

          <div>
            <h3 className="field-label" style={{ color: "var(--color-turmeric)" }}>
              Follow along
            </h3>
            <ul className="m-0 flex flex-col gap-2 p-0" style={{ listStyle: "none" }}>
              {social.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[0.98rem]"
                    style={{ color: "rgba(253,243,227,0.82)" }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          className="shell flex flex-wrap items-center justify-between gap-3 py-6 text-[0.85rem]"
          style={{
            borderTop: "1px solid rgba(253,243,227,0.15)",
            color: "rgba(253,243,227,0.55)",
          }}
        >
          <span>
            © {new Date().getFullYear()} {site.name}. Home kitchen, {site.contact.address.city},{" "}
            {site.contact.address.state}.
          </span>
          <span>Pickup only · No delivery</span>
        </div>
      </div>
    </footer>
  );
}
