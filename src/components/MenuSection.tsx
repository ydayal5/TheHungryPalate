"use client";

import { useState } from "react";
import { motion } from "framer-motion";

import { DishPlate } from "./DishPlate";
import { useCart } from "./CartProvider";
import { useReveal } from "./useReveal";
import { included, menu, site, type Dish, type SpiceLevel } from "@/lib/site";
import { money } from "@/lib/order";

export function MenuSection() {
  return (
    <section id="menu" className="band band-ivory relative">
      <div className="shell">
        <header className="max-w-[62ch]">
          <p className="eyebrow" style={{ color: "var(--color-chili)" }}>
            This week&rsquo;s three
          </p>
          <h2 className="display-lg mt-4">Three dishes, each over steamed basmati.</h2>
          <p className="prose-lead mt-5" style={{ color: "var(--color-ink-soft)" }}>
            Every meal is {money(site.price)} and arrives the same way — steamed white basmati
            under the curry, with fresh naan on the side. Pick your heat when you add it.
          </p>

          <ul className="mt-6 flex flex-wrap gap-2 p-0" style={{ listStyle: "none" }}>
            {included.map((item) => (
              <li key={item} className="chip" style={{ color: "var(--color-cardamom)" }}>
                {item}
              </li>
            ))}
          </ul>
        </header>
      </div>

      <div className="shell mt-16 flex flex-col">
        {menu.map((dish, index) => (
          <DishRow key={dish.id} dish={dish} flipped={index % 2 === 1} isLast={index === menu.length - 1} />
        ))}
      </div>
    </section>
  );
}

function DishRow({ dish, flipped, isLast }: { dish: Dish; flipped: boolean; isLast: boolean }) {
  const { add, openCart } = useCart();
  const [spice, setSpice] = useState<SpiceLevel>("Medium");
  const [justAdded, setJustAdded] = useState(false);
  const reveal = useReveal<HTMLElement>();

  const accentVar = `var(--color-${dish.accent})`;

  const handleAdd = () => {
    add(dish.id, spice);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1800);
  };

  return (
    <article
      ref={reveal.ref}
      className={`grid items-center gap-8 py-12 md:grid-cols-2 md:gap-14 ${reveal.className}`}
      style={{
        borderBottom: isLast ? "none" : "2px dotted color-mix(in srgb, var(--color-ink) 25%, transparent)",
      }}
    >
      <motion.div
        whileHover={{ scale: 1.04, rotate: flipped ? -2.5 : 2.5 }}
        transition={{ type: "spring", stiffness: 220, damping: 18 }}
        className={`mx-auto w-full max-w-[340px] ${flipped ? "md:order-2" : ""}`}
      >
        <DishPlate dish={dish} className="h-auto w-full" />
      </motion.div>

      <div className={flipped ? "md:order-1" : ""}>
        <div className="flex items-center gap-3">
          <VegMark vegetarian={dish.vegetarian} />
          <span
            className="text-[0.8rem] tracking-[0.2em] uppercase"
            style={{ fontFamily: "var(--font-label)", fontWeight: 600, color: accentVar }}
          >
            {dish.vegetarian ? "Vegetarian" : "Contains meat"}
          </span>
        </div>

        <h3 className="display-md mt-3">{dish.name}</h3>
        <p
          className="mt-1 text-[1.5rem] leading-tight"
          style={{ fontFamily: "var(--font-display)", color: accentVar }}
          lang="hi"
        >
          {dish.nameHi}
        </p>

        <p className="mt-4 text-[1.05rem]" style={{ color: "var(--color-ink-soft)", maxWidth: "52ch" }}>
          {dish.description}
        </p>

        <ul className="mt-5 flex flex-wrap gap-2 p-0" style={{ listStyle: "none" }}>
          {dish.notes.map((note) => (
            <li key={note} className="chip" style={{ color: "var(--color-ink-soft)" }}>
              {note}
            </li>
          ))}
          {dish.allergens.map((allergen) => (
            <li
              key={allergen}
              className="chip"
              style={{ color: "var(--color-chili)", borderStyle: "dashed" }}
            >
              Contains {allergen.toLowerCase()}
            </li>
          ))}
        </ul>

        <div className="mt-7">
          <span className="field-label">Heat level</span>
          <div className="segment" role="group" aria-label={`Heat level for ${dish.name}`}>
            {site.spiceLevels.map((level) => (
              <button
                key={level}
                type="button"
                className="segment-option"
                aria-pressed={spice === level}
                onClick={() => setSpice(level)}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button type="button" onClick={handleAdd} className="btn" style={{ "--btn-bg": accentVar, "--btn-fg": "var(--color-ivory)" } as React.CSSProperties}>
            Add to order · {money(site.price)}
          </button>

          <motion.button
            type="button"
            onClick={openCart}
            initial={false}
            animate={justAdded ? { opacity: 1, x: 0 } : { opacity: 0, x: -8 }}
            transition={{ duration: 0.25 }}
            className="text-[0.95rem] underline underline-offset-4"
            style={{
              fontFamily: "var(--font-label)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--color-cardamom)",
              pointerEvents: justAdded ? "auto" : "none",
            }}
            aria-hidden={!justAdded}
            tabIndex={justAdded ? 0 : -1}
          >
            Added — review order
          </motion.button>
        </div>
      </div>
    </article>
  );
}

/**
 * The veg / non-veg mark used on every packaged food in India: a filled dot
 * inside a square, green for vegetarian and maroon for everything else.
 */
function VegMark({ vegetarian }: { vegetarian: boolean }) {
  const color = vegetarian ? "#1E7A5F" : "#8A2018";
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
      <rect x="1.5" y="1.5" width="17" height="17" rx="2.5" fill="none" stroke={color} strokeWidth="2" />
      <circle cx="10" cy="10" r="4.6" fill={color} />
    </svg>
  );
}
