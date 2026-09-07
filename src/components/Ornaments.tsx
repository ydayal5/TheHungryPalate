"use client";

import { useId } from "react";

/* ---------------------------------------------------------------------------
   Drawn ornament, not clip art. Every motif here comes out of the same
   block-print vocabulary: the buta (paisley), the dot field, the petal ring.
--------------------------------------------------------------------------- */

/**
 * A printed textile strip. These sit between the colour bands the way a
 * selvedge border sits between fields of an Ajrakh cloth.
 */
export function BlockPrintBand({
  bg,
  fg,
  height = 46,
  className = "",
}: {
  bg: string;
  fg: string;
  height?: number;
  className?: string;
}) {
  const id = useId().replace(/:/g, "");

  return (
    <div
      aria-hidden="true"
      className={`w-full overflow-hidden leading-[0] ${className}`}
      style={{ background: bg }}
    >
      <svg width="100%" height={height} preserveAspectRatio="xMidYMid slice" role="presentation">
        <defs>
          <pattern id={`bp-${id}`} width="72" height={height} patternUnits="userSpaceOnUse">
            {/* buta — the mango-shaped paisley, tip curled inward */}
            <path
              d="M36 7c11 3 15 15 8 22-6 6-17 5-19-3-2-6 4-11 8-8 3 2 2 6-1 6"
              fill="none"
              stroke={fg}
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            <circle cx="36" cy="30" r="2" fill={fg} />
            {/* flanking dot pairs */}
            <circle cx="8" cy="14" r="2.4" fill={fg} />
            <circle cx="8" cy="32" r="2.4" fill={fg} />
            <circle cx="64" cy="14" r="2.4" fill={fg} />
            <circle cx="64" cy="32" r="2.4" fill={fg} />
            {/* baseline rules */}
            <rect x="0" y="0" width="72" height="2" fill={fg} opacity="0.5" />
            <rect x="0" y={height - 2} width="72" height="2" fill={fg} opacity="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height={height} fill={`url(#bp-${id})`} />
      </svg>
    </div>
  );
}

/**
 * Concentric petal ring — the rangoli chalked on a doorstep. Used large and
 * slow-turning behind the hero, and small as a section flourish.
 */
export function Rangoli({
  size = 520,
  color = "currentColor",
  className = "",
  petals = 16,
}: {
  size?: number;
  color?: string;
  className?: string;
  petals?: number;
}) {
  const outer = Array.from({ length: petals }, (_, i) => (i * 360) / petals);
  const inner = Array.from({ length: petals / 2 }, (_, i) => (i * 360) / (petals / 2));

  return (
    <svg
      aria-hidden="true"
      role="presentation"
      width={size}
      height={size}
      viewBox="0 0 200 200"
      className={className}
      style={{ color }}
    >
      <g fill="none" stroke="currentColor" strokeWidth="1.1">
        <circle cx="100" cy="100" r="96" />
        <circle cx="100" cy="100" r="74" strokeDasharray="3 6" />
        <circle cx="100" cy="100" r="40" />
        <circle cx="100" cy="100" r="15" />

        {outer.map((deg) => (
          <path
            key={`o-${deg}`}
            d="M100 26c11 12 11 26 0 38-11-12-11-26 0-38Z"
            transform={`rotate(${deg} 100 100)`}
          />
        ))}

        {inner.map((deg) => (
          <g key={`i-${deg}`} transform={`rotate(${deg} 100 100)`}>
            <path d="M100 46v18" strokeLinecap="round" />
            <circle cx="100" cy="42" r="2.6" fill="currentColor" stroke="none" />
          </g>
        ))}
      </g>
    </svg>
  );
}

/** Rising steam. Three wisps on staggered delays, above a hot plate. */
export function SteamWisps({
  className = "",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      aria-hidden="true"
      role="presentation"
      viewBox="0 0 60 60"
      className={className}
      style={style}
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
    >
      {[
        { d: "M16 52c-5-8 5-12 0-20s4-12 0-18", delay: "0s" },
        { d: "M30 52c-5-9 5-13 0-21s4-13 0-19", delay: "1.1s" },
        { d: "M44 52c-5-8 5-12 0-20s4-12 0-18", delay: "2.2s" },
      ].map((wisp) => (
        <path
          key={wisp.d}
          d={wisp.d}
          className="steam-wisp"
          style={{ animationDelay: wisp.delay, transformOrigin: "center bottom" }}
        />
      ))}
    </svg>
  );
}

/** Corner bracket, borrowed from a printed label's frame. */
export function CornerMark({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      role="presentation"
      viewBox="0 0 40 40"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <path d="M2 14V2h12" strokeLinecap="round" />
      <circle cx="14" cy="14" r="3.2" />
    </svg>
  );
}
