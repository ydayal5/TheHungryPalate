"use client";

import { useEffect, useState } from "react";
import { CornerMark } from "./Ornaments";
import { useReveal } from "./useReveal";
import { getOrderWindow } from "@/lib/cutoff";
import { fullAddress, mapsUrl, site } from "@/lib/site";

export function PickupInfo() {
  const [pickups, setPickups] = useState<string[] | null>(null);
  const left = useReveal<HTMLDivElement>();
  const right = useReveal<HTMLDivElement>(0.1);

  useEffect(() => {
    setPickups(getOrderWindow().pickupDates.map((p) => p.label));
  }, []);

  return (
    <section id="pickup" className="band band-paper relative overflow-hidden">
      <div className="shell grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div ref={left.ref} className={left.className}>
          <p className="eyebrow" style={{ color: "var(--color-chili)" }}>
            Where to come
          </p>
          <h2 className="display-lg mt-4">Pickup only, from the front door.</h2>
          <p className="prose-lead mt-5" style={{ color: "var(--color-ink-soft)" }}>
            There is no delivery and no storefront. Priya cooks at home and hands the bags over
            herself, which is also when she finds out what you thought of last week.
          </p>

          <a href={mapsUrl} target="_blank" rel="noreferrer" className="btn btn-cardamom mt-8">
            Open in maps
          </a>
        </div>

        {/* A printed pickup ticket, corner marks and all. */}
        <div
          ref={right.ref}
          className={`relative p-7 ${right.className}`}
          style={{
            background: "var(--color-ivory)",
            border: "2px solid var(--color-indigo)",
            boxShadow: "8px 8px 0 var(--color-indigo)",
            ...right.style,
          }}
        >
          {[
            "top-3 left-3",
            "top-3 right-3 rotate-90",
            "bottom-3 right-3 rotate-180",
            "bottom-3 left-3 -rotate-90",
          ].map((position) => (
            <CornerMark key={position} className={`absolute h-5 w-5 ${position}`} />
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
                {pickups ? pickups.join(" · ") : site.schedule.pickupDays.join(" · ")}
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
    </section>
  );
}
