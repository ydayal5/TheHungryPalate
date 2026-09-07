"use client";

import { site } from "@/lib/site";
import { money } from "@/lib/order";

/**
 * The painted banner strung over a market stall: the same few claims, repeated,
 * in both the languages this kitchen actually cooks in.
 */
const PHRASES = [
  "Naan included",
  "गरम मसाला",
  `${money(site.price)} a meal`,
  "टिक्का मसाला",
  "Aromatic whole spices",
  "कीमा चिकन",
  `Order by ${site.schedule.cutoffLabel}`,
  "छोले मसाला",
  "Cash or Venmo",
  "घर का खाना",
];

export function Marquee() {
  return (
    <div
      className="marquee relative overflow-hidden py-3"
      style={{
        background: "var(--color-chili)",
        color: "var(--color-ivory)",
        borderBlock: "2px solid var(--color-indigo-deep)",
      }}
    >
      <div className="marquee-track">
        {/* two identical runs so the -50% loop is seamless */}
        {[0, 1].map((run) => (
          <div key={run} className="flex shrink-0 items-center" aria-hidden={run === 1}>
            {PHRASES.map((phrase, i) => (
              <span key={`${run}-${i}`} className="flex items-center">
                <span
                  className="px-6 text-[1.15rem] whitespace-nowrap"
                  style={{ fontFamily: "var(--font-label)", fontWeight: 500, letterSpacing: "0.06em" }}
                >
                  {phrase}
                </span>
                <Diamond />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function Diamond() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" className="shrink-0">
      <path d="M6 0 12 6 6 12 0 6Z" fill="var(--color-turmeric)" />
    </svg>
  );
}
