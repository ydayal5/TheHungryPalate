"use client";

import { site } from "@/lib/site";
import { useReveal } from "./useReveal";

/**
 * TODO — placeholder voice.
 * Replace the two paragraphs below with Priya's own words when you have them.
 * Everything else on this section (links, spice box, layout) stays as is.
 */
const STORY = [
  "Priya has been cooking this food for her family for as long as her family has existed. The Hungry Palate started the way these things usually start — enough people asked for the recipe that it became easier to just cook for them.",
  "She makes three dishes a week and no more, because three is what one person can cook properly in one morning. The masala is ground for each batch. The chickpeas are soaked the night before. Nothing is cooked on Sunday and reheated on Wednesday.",
];

/** The masala dabba — seven spices, the way every Indian kitchen keeps them. */
const SPICES = [
  { en: "Turmeric", hi: "हल्दी", color: "#E8A800" },
  { en: "Cumin", hi: "जीरा", color: "#8A5A2B" },
  { en: "Mustard seed", hi: "राई", color: "#4A3B1A" },
  { en: "Coriander", hi: "धनिया", color: "#B08D57" },
  { en: "Red chili", hi: "लाल मिर्च", color: "#B32218" },
  { en: "Asafoetida", hi: "हींग", color: "#D9B65A" },
];

const CENTER_SPICE = { en: "Garam masala", hi: "गरम मसाला", color: "#5C3A21" };

export function AboutPriya() {
  const copy = useReveal<HTMLDivElement>();
  const figure = useReveal<HTMLElement>(0.1);
  const links = [
    { label: "Read the blog", href: site.links.blog },
    { label: "Follow on Instagram", href: site.links.instagram },
    { label: "Watch on YouTube", href: site.links.youtube },
  ].filter((link): link is { label: string; href: string } => Boolean(link.href));

  return (
    <section id="priya" className="band band-ivory relative overflow-hidden">
      <div className="shell grid items-center gap-12 lg:grid-cols-[1fr_0.85fr] lg:gap-20">
        <div ref={copy.ref} className={copy.className}>
          <p className="eyebrow" style={{ color: "var(--color-chili)" }}>
            The cook
          </p>
          <h2 className="display-lg mt-4">{site.cook}</h2>

          {STORY.map((paragraph) => (
            <p key={paragraph.slice(0, 24)} className="prose-lead mt-5" style={{ color: "var(--color-ink-soft)" }}>
              {paragraph}
            </p>
          ))}

          {links.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-3">
              {links.map((link, i) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className={`btn btn-sm ${i === 0 ? "" : "btn-ghost"}`}
                  style={i === 0 ? undefined : { color: "var(--color-indigo)" }}
                >
                  {link.label}
                </a>
              ))}
            </div>
          )}
        </div>

        <figure ref={figure.ref} className={`m-0 ${figure.className}`} style={figure.style}>
          <MasalaDabba />
          <figcaption className="mt-6 grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3 lg:grid-cols-2">
            {[CENTER_SPICE, ...SPICES].map((spice) => (
              <span key={spice.en} className="flex items-center gap-2 text-[0.95rem]">
                <span
                  className="inline-block h-3 w-3 shrink-0 rounded-full"
                  style={{ background: spice.color, border: "1px solid rgba(36,27,18,0.35)" }}
                />
                <span style={{ color: "var(--color-ink-soft)" }}>
                  {spice.en}{" "}
                  <span lang="hi" style={{ opacity: 0.7 }}>
                    {spice.hi}
                  </span>
                </span>
              </span>
            ))}
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

function MasalaDabba() {
  const radius = 54;

  return (
    <svg viewBox="0 0 200 200" className="mx-auto w-full max-w-[400px]" role="img" aria-label="A masala dabba holding turmeric, cumin, mustard seed, coriander, red chili, asafoetida, and garam masala">
      <defs>
        <radialGradient id="steel" cx="34%" cy="26%">
          <stop offset="0%" stopColor="#F2F5F7" />
          <stop offset="60%" stopColor="#C6CDD4" />
          <stop offset="100%" stopColor="#8E979F" />
        </radialGradient>
        <radialGradient id="steel-inner" cx="34%" cy="26%">
          <stop offset="0%" stopColor="#E4E9ED" />
          <stop offset="100%" stopColor="#AAB3BB" />
        </radialGradient>
      </defs>

      {/* the tin */}
      <circle cx="100" cy="100" r="94" fill="url(#steel)" />
      <circle cx="100" cy="100" r="94" fill="none" stroke="#7A838B" strokeWidth="2" />
      <circle cx="100" cy="100" r="86" fill="url(#steel-inner)" stroke="#8E979F" strokeWidth="1.5" />

      {/* six bowls around one */}
      {SPICES.map((spice, i) => {
        const angle = (i * 60 - 90) * (Math.PI / 180);
        // Rounded: trig differs at the last bit between Node and the browser,
        // which React reports as a hydration mismatch.
        const cx = Math.round((100 + Math.cos(angle) * radius) * 100) / 100;
        const cy = Math.round((100 + Math.sin(angle) * radius) * 100) / 100;
        return (
          <g key={spice.en}>
            <circle cx={cx} cy={cy} r="26" fill="#B9C1C8" stroke="#7A838B" strokeWidth="1.5" />
            <circle cx={cx} cy={cy} r="22" fill={spice.color} />
            <ellipse cx={cx - 6} cy={cy - 7} rx="7" ry="4" fill="#fff" opacity="0.16" />
          </g>
        );
      })}

      <circle cx="100" cy="100" r="26" fill="#B9C1C8" stroke="#7A838B" strokeWidth="1.5" />
      <circle cx="100" cy="100" r="22" fill={CENTER_SPICE.color} />
      <ellipse cx="94" cy="93" rx="7" ry="4" fill="#fff" opacity="0.16" />

      {/* the little spoon that lives in the turmeric */}
      <g transform="rotate(-24 100 46)">
        <rect x="97" y="20" width="4.5" height="30" rx="2.2" fill="#D5DBE0" stroke="#7A838B" strokeWidth="1" />
        <ellipse cx="99" cy="52" rx="9" ry="6.5" fill="#DFE4E9" stroke="#7A838B" strokeWidth="1" />
      </g>
    </svg>
  );
}
