"use client";

import Image from "next/image";

import type { Dish } from "@/lib/site";

/**
 * The plate that fronts each menu card.
 *
 * When a real photo is dropped into /public/images and named in `site.ts`, it
 * fills the brass rim. Until then the bowl is drawn top-down — a bed of basmati
 * with the curry ladled into the middle, garnished with what is genuinely in
 * that dish. The page never shows a grey box waiting for an asset.
 */

type PlateArt = {
  curry: string;
  curryDark: string;
  garnish: "cream" | "spices" | "ginger";
};

const ART: Record<string, PlateArt> = {
  "chicken-tikka-masala": { curry: "#C2402F", curryDark: "#93261C", garnish: "cream" },
  "keema-chicken": { curry: "#A85E1C", curryDark: "#7A400F", garnish: "spices" },
  "chhole-masala": { curry: "#6B3D1E", curryDark: "#432312", garnish: "ginger" },
};

const FALLBACK: PlateArt = { curry: "#A85E1C", curryDark: "#7A400F", garnish: "spices" };

/**
 * Rice grains scattered through the ring between the curry and the rim.
 *
 * Every value is rounded to two decimals: trig is implementation-defined at the
 * last bit, so unrounded coordinates render differently in Node and in the
 * browser and React reports a hydration mismatch.
 */
function riceGrains(count: number, seed: number) {
  const grains: { x: number; y: number; rx: number; ry: number; angle: number }[] = [];
  let value = seed;
  const next = () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };

  for (let i = 0; i < count; i += 1) {
    const angle = next() * Math.PI * 2;
    // Keep grains in the annulus so none land on top of the curry.
    const radius = 52 + next() * 26;
    const size = 1.6 + next() * 1.1;
    grains.push({
      x: Math.round((100 + Math.cos(angle) * radius) * 100) / 100,
      y: Math.round((100 + Math.sin(angle) * radius) * 100) / 100,
      rx: Math.round(size * 100) / 100,
      ry: Math.round(size * 45) / 100,
      angle: Math.round((angle * 180) / Math.PI),
    });
  }
  return grains;
}

/** The pool of curry: an off-round blob, the way it sits when it is ladled in. */
const CURRY_POOL =
  "M100 50c26 0 48 19 48 45 0 27-20 51-48 51-27 0-49-22-49-49 0-27 22-47 49-47Z";

export function DishPlate({ dish, className = "" }: { dish: Dish; className?: string }) {
  const art = ART[dish.id] ?? FALLBACK;

  if (dish.image) {
    return (
      <div
        className={`relative aspect-square overflow-hidden rounded-full ${className}`}
        style={{ border: "8px solid #E0A93C", boxShadow: "inset 0 0 0 4px #A9761A" }}
      >
        <Image
          src={dish.image}
          alt={`${dish.name} — a rice bowl from The Hungry Palate`}
          fill
          sizes="(max-width: 768px) 80vw, 340px"
          className="object-cover"
        />
      </div>
    );
  }

  const grains = riceGrains(34, dish.id.length * 977 + 13);
  const uid = dish.id;

  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      role="img"
      aria-label={`Illustration of ${dish.name}: basmati rice with ${dish.tagline.toLowerCase()}, naan and a bowl of kachumbar salad on the side`}
    >
      <defs>
        <radialGradient id={`rim-${uid}`} cx="34%" cy="24%">
          <stop offset="0%" stopColor="#F7DA95" />
          <stop offset="55%" stopColor="#DFA83B" />
          <stop offset="100%" stopColor="#A2701A" />
        </radialGradient>
        <radialGradient id={`rice-${uid}`} cx="38%" cy="30%">
          <stop offset="0%" stopColor="#FBF2DF" />
          <stop offset="100%" stopColor="#EBD9B6" />
        </radialGradient>
      </defs>

      {/* brass rim */}
      <circle cx="100" cy="100" r="95" fill={`url(#rim-${uid})`} />
      <circle cx="100" cy="100" r="86" fill="none" stroke="#8A5E12" strokeWidth="2" opacity="0.55" />

      {/* bed of basmati */}
      <circle cx="100" cy="100" r="84" fill={`url(#rice-${uid})`} />
      {grains.map((grain, i) => (
        <ellipse
          key={`grain-${i}`}
          cx={grain.x}
          cy={grain.y}
          rx={grain.rx}
          ry={grain.ry}
          fill="#DFCBA4"
          transform={`rotate(${grain.angle} ${grain.x} ${grain.y})`}
        />
      ))}

      {/* the curry, ladled into the middle */}
      <path d={CURRY_POOL} fill={art.curry} />
      <path
        d="M100 50c-20 1-37 13-44 30 12-9 28-13 44-11 15 2 29 9 38 20-3-22-19-38-38-39Z"
        fill={art.curryDark}
        opacity="0.5"
      />
      <ellipse cx="84" cy="78" rx="16" ry="9" fill="#fff" opacity="0.08" />

      {art.garnish === "cream" && (
        <>
          {/* cream, dropped in three spoonfuls */}
          {[
            [88, 112],
            [110, 124],
            [120, 96],
          ].map(([x, y]) => (
            <circle key={`cream-${x}`} cx={x} cy={y} r="7" fill="#FBEBD6" opacity="0.92" />
          ))}
          {/* edges that caught under the broiler */}
          {[
            [112, 70],
            [78, 92],
            [128, 118],
          ].map(([x, y]) => (
            <circle key={`char-${x}`} cx={x} cy={y} r="6.5" fill="#5E1C13" opacity="0.55" />
          ))}
        </>
      )}

      {art.garnish === "spices" && (
        <>
          {/* the whole spices, left in the way they are cooked */}
          {[
            [88, 84, 25],
            [116, 76, -15],
            [98, 118, 55],
            [126, 106, -40],
          ].map(([x, y, rot]) => (
            <ellipse
              key={`spice-${x}-${y}`}
              cx={x}
              cy={y}
              rx="7"
              ry="3.4"
              fill="#3F2410"
              transform={`rotate(${rot} ${x} ${y})`}
            />
          ))}
          {/* onion, ginger and garlic cooked down into it */}
          {[
            [80, 104],
            [110, 136],
            [134, 90],
          ].map(([x, y]) => (
            <circle key={`allium-${x}-${y}`} cx={x} cy={y} r="4.5" fill="#EBD9B0" opacity="0.85" />
          ))}
        </>
      )}

      {art.garnish === "ginger" && (
        <>
          {[
            [88, 82],
            [114, 78],
            [96, 110],
            [124, 108],
            [104, 134],
          ].map(([x, y]) => (
            <circle key={`chana-${x}-${y}`} cx={x} cy={y} r="8.5" fill="#C6A469" />
          ))}
          {[
            [76, 122, -18],
            [104, 60, 12],
            [128, 126, 38],
          ].map(([x, y, rot]) => (
            <rect
              key={`ginger-${x}-${y}`}
              x={x}
              y={y}
              width="19"
              height="3.4"
              rx="1.7"
              fill="#F4E6B4"
              transform={`rotate(${rot} ${x} ${y})`}
            />
          ))}
        </>
      )}

      {/* cilantro — on all three, because it is on all three */}
      {[
        [72, 66, 20],
        [134, 84, 140],
        [110, 142, 260],
      ].map(([x, y, rot]) => (
        <path
          key={`herb-${x}`}
          d="M0 0c5-6.5 12-6.5 15 0-3 6.5-10 6.5-15 0Z"
          fill="#3E7A31"
          transform={`translate(${x} ${y}) rotate(${rot})`}
        />
      ))}

      {/* kachumbar, the other thing in every bag: onion, tomato, cucumber */}
      <g transform="translate(146 148)">
        <circle cx="24" cy="24" r="25" fill="#F6EEDE" stroke="#B4823F" strokeWidth="2.5" />
        {[
          { x: 14, y: 15, fill: "#C6392C" },
          { x: 30, y: 13, fill: "#7FB069" },
          { x: 21, y: 25, fill: "#D8C3DA" },
          { x: 34, y: 26, fill: "#C6392C" },
          { x: 14, y: 32, fill: "#7FB069" },
          { x: 28, y: 36, fill: "#D8C3DA" },
        ].map((dice, i) => (
          <rect
            key={`kachumbar-${i}`}
            x={dice.x}
            y={dice.y}
            width="7.5"
            height="7.5"
            rx="1.6"
            fill={dice.fill}
            transform={`rotate(${i * 23} ${dice.x + 3.75} ${dice.y + 3.75})`}
          />
        ))}
        {/* cilantro through it */}
        <circle cx="24" cy="19" r="1.8" fill="#3E7A31" />
        <circle cx="33" cy="33" r="1.8" fill="#3E7A31" />
      </g>

      {/* naan, tucked under the rim — it comes with every meal */}
      <g transform="translate(2 6)">
        <path
          d="M20 148c-13 11-12 30 4 37 19 8 43-1 52-18 6-12-2-24-17-26-15-2-30 1-39 7Z"
          fill="#E9C98E"
          stroke="#B4823F"
          strokeWidth="2.5"
        />
        {[
          [40, 166],
          [55, 158],
          [63, 172],
          [30, 176],
          [48, 180],
        ].map(([x, y]) => (
          <ellipse key={`blister-${x}`} cx={x} cy={y} rx="4.2" ry="2.9" fill="#B4763A" opacity="0.6" />
        ))}
      </g>
    </svg>
  );
}
