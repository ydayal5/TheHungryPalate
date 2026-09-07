"use client";

import { site, fullAddress } from "@/lib/site";
import { Rangoli } from "./Ornaments";
import { useReveal } from "./useReveal";

/**
 * The week, in the order it actually happens. The numbering earns its place
 * here because this is a real sequence with real deadlines in it — not four
 * features arranged in a row.
 */
const STEPS = [
  {
    day: "Any day",
    title: "Pick your bowls",
    body: "Three dishes to choose from. Add as many meals as you need — most families order four to six.",
  },
  {
    day: `By ${site.schedule.cutoffLabel}`,
    title: "Send the order",
    body: "The site writes your order out and hands it to your own Messages or Mail app. Send it and Priya replies to confirm.",
  },
  {
    day: "Tue & Wed",
    title: "Priya cooks",
    body: "She cooks the week's three dishes for pickup — marinated chicken, keema, and chhole, each over a bed of steamed basmati.",
  },
  {
    day: `${site.schedule.pickupDays.join(" or ")}, ${site.schedule.pickupWindow.label}`,
    title: "Come and collect",
    body: `Pull up at ${fullAddress}. Pay cash at the door, or send Venmo to ${site.payment.venmoHandle} any time before.`,
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="band band-indigo print-field relative overflow-hidden">
      <div className="pointer-events-none absolute top-1/2 -left-40 -translate-y-1/2 opacity-[0.08]">
        <Rangoli size={620} className="spin-slower" color="var(--color-turmeric)" petals={20} />
      </div>

      <div className="shell relative">
        <p className="eyebrow" style={{ color: "var(--color-turmeric)" }}>
          One week, start to finish
        </p>
        <h2 className="display-lg mt-4 max-w-[18ch]" style={{ color: "var(--color-ivory)" }}>
          It runs on a single deadline.
        </h2>

        <ol className="mt-14 grid gap-10 p-0 md:grid-cols-2 lg:grid-cols-4" style={{ listStyle: "none" }}>
          {STEPS.map((step, i) => (
            <Step key={step.title} step={step} index={i} />
          ))}
        </ol>
      </div>
    </section>
  );
}

function Step({ step, index }: { step: (typeof STEPS)[number]; index: number }) {
  const reveal = useReveal<HTMLLIElement>(index * 0.09);

  return (
    <li ref={reveal.ref} className={`relative ${reveal.className}`} style={reveal.style}>
      {/* the thread running between steps */}
      {index < STEPS.length - 1 && (
        <span
          aria-hidden="true"
          className="absolute top-[1.35rem] left-[3.6rem] hidden h-[2px] w-[calc(100%-2rem)] lg:block"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, var(--color-marigold) 0 7px, transparent 7px 14px)",
            opacity: 0.5,
          }}
        />
      )}

      <span
        className="relative flex h-[2.7rem] w-[2.7rem] items-center justify-center rounded-full text-[1.4rem] tabular-nums"
        style={{
          background: "var(--color-marigold)",
          color: "var(--color-indigo-deep)",
          fontFamily: "var(--font-display)",
          border: "2px solid var(--color-indigo-deep)",
          boxShadow: "3px 3px 0 var(--color-indigo-deep)",
        }}
      >
        {index + 1}
      </span>

      <p
        className="mt-5 text-[0.8rem] tracking-[0.18em] uppercase"
        style={{ fontFamily: "var(--font-label)", fontWeight: 600, color: "var(--color-turmeric)" }}
      >
        {step.day}
      </p>
      <h3 className="mt-2 text-[1.6rem]" style={{ color: "var(--color-ivory)" }}>
        {step.title}
      </h3>
      <p className="mt-2 text-[1rem]" style={{ color: "rgba(253,243,227,0.78)" }}>
        {step.body}
      </p>
    </li>
  );
}
