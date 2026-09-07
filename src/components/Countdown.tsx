"use client";

import { useEffect, useState } from "react";

import { getOrderWindow, splitDuration, type OrderWindow } from "@/lib/cutoff";
import { site } from "@/lib/site";

/**
 * Live clock on the weekly deadline.
 *
 * Rendered empty on the server and filled in after mount — the deadline depends
 * on the current time, and a server-rendered value would be wrong by the time
 * anyone read it.
 */
export function Countdown({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const [window_, setWindow] = useState<OrderWindow | null>(null);

  useEffect(() => {
    const tick = () => setWindow(getOrderWindow());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const fg = tone === "dark" ? "var(--color-ivory)" : "var(--color-indigo-deep)";
  const tile = tone === "dark" ? "rgba(253,243,227,0.10)" : "rgba(13,21,51,0.08)";
  const accent = tone === "dark" ? "var(--color-turmeric)" : "var(--color-chili)";

  const parts = window_ ? splitDuration(window_.msRemaining) : null;
  const units = parts
    ? [
        { value: parts.days, label: parts.days === 1 ? "day" : "days" },
        { value: parts.hours, label: "hrs" },
        { value: parts.minutes, label: "min" },
        { value: parts.seconds, label: "sec" },
      ]
    : [
        { value: 0, label: "days" },
        { value: 0, label: "hrs" },
        { value: 0, label: "min" },
        { value: 0, label: "sec" },
      ];

  return (
    <div className="flex flex-col gap-3" style={{ color: fg }}>
      <p
        className="text-[0.82rem] tracking-[0.2em] uppercase"
        style={{ fontFamily: "var(--font-label)", fontWeight: 600, color: accent }}
      >
        {window_?.pickupHappeningNow
          ? "Pickup is happening right now"
          : `Orders close ${site.schedule.cutoffLabel} in`}
      </p>

      <div className="flex gap-2">
        {units.map((unit) => (
          <div
            key={unit.label}
            className="flex min-w-[4.2rem] flex-col items-center rounded-xl px-3 py-2"
            style={{ background: tile, border: `1.5px solid ${tile}` }}
          >
            <span
              className="text-[1.9rem] leading-none tabular-nums"
              style={{ fontFamily: "var(--font-display)" }}
              suppressHydrationWarning
            >
              {window_ ? String(unit.value).padStart(2, "0") : "--"}
            </span>
            <span
              className="mt-1 text-[0.7rem] tracking-[0.16em] uppercase opacity-70"
              style={{ fontFamily: "var(--font-label)" }}
            >
              {unit.label}
            </span>
          </div>
        ))}
      </div>

      <p className="text-[0.95rem] opacity-85" suppressHydrationWarning>
        {window_
          ? `Cooking for ${window_.pickupDates.map((p) => p.label).join(" and ")}.`
          : `Pickup ${site.schedule.pickupDays.join(" and ")}, ${site.schedule.pickupWindow.label}.`}
      </p>
    </div>
  );
}
