/**
 * Order-window math.
 *
 * The whole business runs on one weekly cycle: order by Sunday 5:00pm Eastern,
 * pick up the following Tuesday or Wednesday, 6–8pm. Everything here is computed
 * in America/New_York regardless of the visitor's own clock, so someone ordering
 * from a laptop set to Pacific still sees the correct deadline.
 */

import { site } from "./site";

const TZ = site.schedule.timeZone;

/** Milliseconds between a UTC instant and the same wall-clock reading in `tz`. */
function zoneOffsetMs(utcMs: number, tz: string): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(new Date(utcMs));

  const read = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? 0);
  // Some engines render midnight as hour "24"; normalise it.
  const asIfUtc = Date.UTC(
    read("year"),
    read("month") - 1,
    read("day"),
    read("hour") % 24,
    read("minute"),
    read("second"),
  );
  return asIfUtc - utcMs;
}

/** Turn a wall-clock time in `tz` into a real UTC timestamp. */
function zonedToUtcMs(
  year: number,
  monthIndex: number,
  day: number,
  hour: number,
  minute: number,
  tz: string,
): number {
  const naive = Date.UTC(year, monthIndex, day, hour, minute, 0);
  // One correction pass, then a second so DST-transition days land right.
  let guess = naive - zoneOffsetMs(naive, tz);
  guess = naive - zoneOffsetMs(guess, tz);
  return guess;
}

type WallClock = {
  year: number;
  monthIndex: number;
  day: number;
  hour: number;
  minute: number;
  /** 0 = Sunday */
  weekday: number;
};

const WEEKDAY_INDEX: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

/** Read a UTC instant as a wall clock in `tz`. */
function wallClockIn(utcMs: number, tz: string): WallClock {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hour12: false,
    weekday: "short",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).formatToParts(new Date(utcMs));

  const read = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? 0);
  const weekdayName = parts.find((p) => p.type === "weekday")?.value ?? "Sun";

  return {
    year: read("year"),
    monthIndex: read("month") - 1,
    day: read("day"),
    hour: read("hour") % 24,
    minute: read("minute"),
    weekday: WEEKDAY_INDEX[weekdayName] ?? 0,
  };
}

export type OrderWindow = {
  /** UTC timestamp of the Sunday 5:00pm this order cycle closes. */
  cutoffMs: number;
  /** Time left until that cutoff. Never negative. */
  msRemaining: number;
  /** Under 24 hours left — the UI leans on this to add urgency. */
  closingSoon: boolean;
  /** Pickup dates for the cycle currently taking orders, keyed by day name. */
  pickupDates: { day: string; date: Date; label: string }[];
  /** True while a pickup window is actually open right now (Tue/Wed 6–8pm). */
  pickupHappeningNow: boolean;
};

/**
 * Which cycle is taking orders, and how long is left to join it.
 * Pass `now` in tests; it defaults to the real clock.
 */
export function getOrderWindow(now: Date = new Date()): OrderWindow {
  const nowMs = now.getTime();
  const wall = wallClockIn(nowMs, TZ);
  const { cutoffWeekday, cutoffHour } = site.schedule;

  // Days forward to the next cutoff weekday (Sunday).
  let daysAhead = (cutoffWeekday - wall.weekday + 7) % 7;
  // If it is already Sunday at or past 5pm, this week's cycle has closed — roll forward.
  if (daysAhead === 0 && wall.hour >= cutoffHour) daysAhead = 7;

  const cutoffMs = zonedToUtcMs(
    wall.year,
    wall.monthIndex,
    wall.day + daysAhead,
    cutoffHour,
    0,
    TZ,
  );

  // Pickup days follow the cutoff Sunday: Tuesday is +2, Wednesday is +3.
  const dayOffsets: Record<string, number> = { Tuesday: 2, Wednesday: 3 };
  const pickupDates = site.schedule.pickupDays.map((day) => {
    const offset = dayOffsets[day] ?? 2;
    const ms = zonedToUtcMs(
      wall.year,
      wall.monthIndex,
      wall.day + daysAhead + offset,
      site.schedule.pickupWindow.startHour,
      0,
      TZ,
    );
    const date = new Date(ms);
    return {
      day,
      date,
      label: new Intl.DateTimeFormat("en-US", {
        timeZone: TZ,
        weekday: "long",
        month: "short",
        day: "numeric",
      }).format(date),
    };
  });

  const { startHour, endHour } = site.schedule.pickupWindow;
  const pickupHappeningNow =
    (wall.weekday === 2 || wall.weekday === 3) && wall.hour >= startHour && wall.hour < endHour;

  return {
    cutoffMs,
    msRemaining: Math.max(0, cutoffMs - nowMs),
    closingSoon: cutoffMs - nowMs < 24 * 60 * 60 * 1000,
    pickupDates,
    pickupHappeningNow,
  };
}

/** Split a duration into whole days / hours / minutes / seconds. */
export function splitDuration(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
}
