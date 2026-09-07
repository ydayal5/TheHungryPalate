"use client";

import { Countdown } from "./Countdown";
import { DishPlate } from "./DishPlate";
import { Rangoli, SteamWisps } from "./Ornaments";
import { SpiceCanvas } from "./SpiceCanvas";
import { useCart } from "./CartProvider";
import { menu, site } from "@/lib/site";
import { money } from "@/lib/order";

const HEADLINE = ["Order", "by", "Sunday.", "Eat", "like", "family", "by", "Tuesday."];

/** Where each bowl sits on the thali, and when it starts bobbing. */
const BOWL_LAYOUT = [
  { top: "-1%", left: "28%", width: "44%", delay: "0s" },
  { top: "47%", left: "3%", width: "41%", delay: "1.8s" },
  { top: "47%", left: "56%", width: "41%", delay: "3.4s" },
];

export function Hero() {
  const { openCart } = useCart();

  return (
    <section
      id="top"
      className="band band-indigo print-field relative overflow-hidden pb-16"
      style={{ marginTop: "-4.6rem", paddingTop: "7rem" }}
    >
      <SpiceCanvas className="pointer-events-none absolute inset-0 h-full w-full" />

      {/* the rangoli, chalked large and turning slowly behind everything */}
      <div className="pointer-events-none absolute -top-24 -right-40 opacity-[0.16] sm:-right-24">
        <Rangoli size={720} className="spin-slow" color="var(--color-turmeric)" />
      </div>
      <div className="pointer-events-none absolute -bottom-56 -left-52 opacity-[0.10]">
        <Rangoli size={560} className="spin-slower" color="var(--color-rose)" petals={12} />
      </div>

      <div className="shell relative grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <p className="eyebrow enter" style={{ color: "var(--color-turmeric)" }}>
            {site.contact.address.city}, {site.contact.address.state} · A one-woman kitchen
          </p>

          <h1 className="display-xl mt-5" style={{ color: "var(--color-ivory)" }}>
            {HEADLINE.map((word, i) => (
              <span
                key={`${word}-${i}`}
                className="enter-word mr-[0.26em]"
                style={{
                  animationDelay: `${0.1 + i * 0.05}s`,
                  ...(word === "family"
                    ? { color: "var(--color-marigold)", fontStyle: "italic" }
                    : {}),
                }}
              >
                {word}
              </span>
            ))}
          </h1>

          <p
            className="prose-lead enter mt-6"
            style={{ color: "rgba(253,243,227,0.86)", animationDelay: "0.55s" }}
          >
            {site.blurb}
          </p>

          <div
            className="enter mt-8 flex flex-wrap items-center gap-3"
            style={{ animationDelay: "0.68s" }}
          >
            <a href="#menu" className="btn">
              See this week&rsquo;s three
            </a>
            <button
              type="button"
              onClick={openCart}
              className="btn btn-ghost"
              style={{ color: "var(--color-ivory)" }}
            >
              Start an order
            </button>
          </div>

          <div
            className="enter mt-9 flex flex-wrap items-end gap-x-10 gap-y-6"
            style={{ animationDelay: "0.8s" }}
          >
            <div>
              <span
                className="foil text-[3.2rem] leading-none"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {money(site.price)}
              </span>
              <span
                className="ml-2 text-[0.85rem] tracking-[0.18em] uppercase"
                style={{
                  fontFamily: "var(--font-label)",
                  color: "var(--color-ivory)",
                  opacity: 0.75,
                }}
              >
                per meal · naan &amp; kachumbar
              </span>
            </div>
            <Countdown />
          </div>
        </div>

        {/* The thali: three bowls set around a rangoli, the way a plate is laid. */}
        <div
          className="enter relative mx-auto aspect-square w-full max-w-[480px]"
          style={{ animationDelay: "0.25s" }}
        >
          <Rangoli
            size={480}
            className="spin-slow absolute inset-0 h-full w-full opacity-40"
            color="var(--color-marigold)"
          />

          {menu.map((dish, i) => {
            const layout = BOWL_LAYOUT[i];
            return (
              <div
                key={dish.id}
                className="bob absolute"
                style={{
                  top: layout.top,
                  left: layout.left,
                  width: layout.width,
                  animationDelay: layout.delay,
                }}
              >
                {i === 0 && (
                  <SteamWisps
                    className="absolute -top-9 left-1/2 h-11 w-12 -translate-x-1/2"
                    style={{ color: "var(--color-turmeric)", opacity: 0.75 }}
                  />
                )}
                <DishPlate dish={dish} className="h-full w-full drop-shadow-2xl" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
