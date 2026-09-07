"use client";

import { useEffect, useState } from "react";
import { CornerMark } from "./Ornaments";
import { useReveal } from "./useReveal";
import { getOrderWindow } from "@/lib/cutoff";
import { fullAddress, mapsUrl, site } from "@/lib/site";

/** Reheating, per component — the naan line is the one that matters most. */
const REHEAT = [
  {
    part: "Rice",
    how: "Flick a little water over it, cover, microwave 90 seconds. The water is the whole trick.",
  },
  {
    part: "Curry",
    how: "Low heat on the stove for five minutes, stir once. It thickens overnight, so loosen it with a splash of water.",
  },
  {
    part: "Naan",
    how: "Dry pan, thirty seconds a side, until it puffs. Do not microwave it — it goes to leather.",
  },
];

export function PickupInfo() {
  const [pickups, setPickups] = useState<string[] | null>(null);
  const left = useReveal<HTMLDivElement>();
  const right = useReveal<HTMLDivElement>(0.1);

  useEffect(() => {
    setPickups(getOrderWindow().pickupDates.map((p) => p.label));
  }, []);

  return (
    <section id="pickup" className="band band-paper relative overflow-hidden">
      <div className="shell grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
        <div ref={left.ref} className={left.className}>
          <p className="eyebrow" style={{ color: "var(--color-chili)" }}>
            Where to come
          </p>
          <h2 className="display-lg mt-4">Pickup only, from the front door.</h2>
          <p className="prose-lead mt-5" style={{ color: "var(--color-ink-soft)" }}>
            There is no delivery and no storefront. Priya cooks at home and hands the bags over
            herself, which is also when she finds out what you thought of last week.
          </p>

          {/* A printed pickup ticket, corner marks and all. */}
          <div
            className="relative mt-8 p-7"
            style={{
              background: "var(--color-ivory)",
              border: "2px solid var(--color-indigo)",
              boxShadow: "8px 8px 0 var(--color-indigo)",
            }}
          >
            {[
              "top-3 left-3",
              "top-3 right-3 rotate-90",
              "bottom-3 right-3 rotate-180",
              "bottom-3 left-3 -rotate-90",
            ].map((position) => (
              <CornerMark
                key={position}
                className={`absolute h-5 w-5 ${position}`}
                // corner marks sit quiet against the ticket
              />
            ))}

            <dl className="m-0 grid gap-5">
              <div>
                <dt className="field-label">Address</dt>
                <dd className="m-0 text-[1.15rem]">
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: "var(--color-indigo)", textUnderlineOffset: "4px" }}
                  >
                    {fullAddress}
                  </a>
                </dd>
              </div>

              <div>
                <dt className="field-label">Days &amp; time</dt>
                <dd className="m-0 text-[1.15rem]">
                  {site.schedule.pickupDays.join(" and ")}, {site.schedule.pickupWindow.label}
                </dd>
              </div>

              <div>
                <dt className="field-label">Next pickups</dt>
                <dd className="m-0 text-[1.15rem]" suppressHydrationWarning>
                  {pickups ? pickups.join(" · ") : `${site.schedule.pickupDays.join(" · ")}`}
                </dd>
              </div>

              <div>
                <dt className="field-label">Payment</dt>
                <dd className="m-0 text-[1.15rem]">
                  Venmo{" "}
                  <a
                    href={`https://venmo.com/u/${site.payment.venmoUsername}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: "var(--color-cardamom)", fontWeight: 600 }}
                  >
                    {site.payment.venmoHandle}
                  </a>
                  , or cash at the door.
                </dd>
              </div>

              <div>
                <dt className="field-label">Questions</dt>
                <dd className="m-0 text-[1.15rem]">
                  <a href={`tel:${site.contact.phoneE164}`} style={{ color: "var(--color-indigo)" }}>
                    {site.contact.phone}
                  </a>
                  {" · "}
                  <a href={`mailto:${site.contact.email}`} style={{ color: "var(--color-indigo)" }}>
                    {site.contact.email}
                  </a>
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div ref={right.ref} className={right.className} style={right.style}>
          <p className="eyebrow" style={{ color: "var(--color-cardamom)" }}>
            When you get it home
          </p>
          <h2 className="display-md mt-4">Reheat it like she would.</h2>
          <p className="mt-4" style={{ color: "var(--color-ink-soft)", maxWidth: "48ch" }}>
            Everything is packed hot and sealed, and it keeps three days in the fridge. Each part
            wants something slightly different.
          </p>

          <dl className="mt-8 grid gap-0 p-0">
            {REHEAT.map((item, i) => (
              <div
                key={item.part}
                className="grid gap-2 py-5 sm:grid-cols-[7rem_1fr] sm:gap-6"
                style={{
                  borderTop: i === 0 ? "2px solid var(--color-indigo)" : "1px solid rgba(36,27,18,0.2)",
                  borderBottom: i === REHEAT.length - 1 ? "2px solid var(--color-indigo)" : "none",
                }}
              >
                <dt
                  className="text-[1.25rem]"
                  style={{ fontFamily: "var(--font-display)", color: "var(--color-chili)" }}
                >
                  {item.part}
                </dt>
                <dd className="m-0" style={{ color: "var(--color-ink-soft)" }}>
                  {item.how}
                </dd>
              </div>
            ))}
          </dl>

          <a href={mapsUrl} target="_blank" rel="noreferrer" className="btn btn-cardamom mt-8">
            Open in maps
          </a>
        </div>
      </div>
    </section>
  );
}
