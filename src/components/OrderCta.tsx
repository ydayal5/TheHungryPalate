"use client";

import { useCart } from "./CartProvider";
import { Countdown } from "./Countdown";
import { Rangoli } from "./Ornaments";
import { site } from "@/lib/site";
import { useReveal } from "./useReveal";

export function OrderCta() {
  const { openCart, meals } = useCart();
  const copy = useReveal<HTMLDivElement>();
  const clock = useReveal<HTMLDivElement>(0.1);

  return (
    <section id="order" className="band band-chili print-field relative overflow-hidden">
      <div className="pointer-events-none absolute -right-32 -bottom-40 opacity-[0.14]">
        <Rangoli size={540} className="spin-slow" color="var(--color-turmeric)" petals={14} />
      </div>

      <div className="shell relative grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
        <div ref={copy.ref} className={copy.className}>
          <p className="eyebrow" style={{ color: "var(--color-turmeric)" }}>
            Ready when you are
          </p>
          <h2 className="display-lg mt-4 max-w-[16ch]" style={{ color: "var(--color-ivory)" }}>
            Put your week&rsquo;s dinners in one text.
          </h2>
          <p className="prose-lead mt-5" style={{ color: "rgba(253,243,227,0.88)" }}>
            Build the order here and the site writes it out for you — dishes, heat, pickup slot,
            total. Send it from your own phone and Priya texts back to confirm. Pay by Venmo at{" "}
            {site.payment.venmoHandle}, or cash when you collect.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button type="button" onClick={openCart} className="btn btn-ivory">
              {meals > 0 ? `Review your ${meals} ${meals === 1 ? "meal" : "meals"}` : "Build an order"}
            </button>
            <a
              href={`tel:${site.contact.phoneE164}`}
              className="btn btn-ghost"
              style={{ color: "var(--color-ivory)" }}
            >
              Call {site.contact.phone}
            </a>
          </div>
        </div>

        <div
          ref={clock.ref}
          className={`p-7 ${clock.className}`}
          style={{
            background: "var(--color-indigo)",
            border: "2px solid var(--color-indigo-deep)",
            boxShadow: "8px 8px 0 var(--color-indigo-deep)",
            ...clock.style,
          }}
        >
          <Countdown />
        </div>
      </div>
    </section>
  );
}
