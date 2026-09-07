"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { useCart } from "./CartProvider";
import { site } from "@/lib/site";

const NAV = [
  { href: "#menu", label: "This Week" },
  { href: "#how", label: "How It Works" },
  { href: "#pickup", label: "Pickup" },
  { href: "#priya", label: "About Priya" },
];

export function SiteHeader() {
  const { meals, pulse, openCart } = useCart();
  /**
   * Defaults to "not at the top", i.e. a solid bar. The header's text is ivory,
   * so a transparent default would render it invisible over the light bands
   * until hydration — which is exactly what a deep link like /#priya does.
   * Solid-by-default is legible everywhere; JS only clears it at the very top.
   */
  const [atTop, setAtTop] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setAtTop(window.scrollY <= 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="sticky top-0 z-40 transition-colors duration-300"
      style={{
        background: atTop ? "transparent" : "var(--color-indigo-deep)",
        borderBottom: atTop ? "2px solid transparent" : "2px solid var(--color-marigold)",
      }}
    >
      <div className="shell flex items-center justify-between gap-4 py-3">
        <a href="#top" className="flex min-w-0 items-center gap-2 no-underline sm:gap-3">
          <Mark />
          <span className="min-w-0 leading-none">
            <span
              className="block text-[1.05rem] sm:text-[1.6rem]"
              style={{ fontFamily: "var(--font-display)", color: "var(--color-ivory)" }}
            >
              The Hungry Palate
            </span>
            <span
              className="hidden text-[0.72rem] tracking-[0.28em] uppercase sm:block"
              style={{ fontFamily: "var(--font-label)", color: "var(--color-marigold)" }}
            >
              {site.contact.address.city}, {site.contact.address.state}
            </span>
          </span>
        </a>

        <nav className="hidden items-center gap-7 lg:flex">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="relative text-[0.95rem] tracking-[0.13em] uppercase no-underline transition-opacity hover:opacity-100"
              style={{
                fontFamily: "var(--font-label)",
                fontWeight: 600,
                color: "var(--color-ivory)",
                opacity: 0.82,
              }}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <motion.button
            type="button"
            onClick={openCart}
            key={pulse}
            initial={pulse ? { scale: 0.86 } : false}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 520, damping: 14 }}
            className="btn btn-sm"
            aria-label={
              meals > 0 ? `Open your order, ${meals} meals` : "Open your order, currently empty"
            }
          >
            <TiffinIcon />
            <span className="hidden sm:inline">Order</span>
            <span
              className="inline-flex min-w-[1.6rem] items-center justify-center rounded-full px-1.5 text-[0.85rem] tabular-nums"
              style={{
                background: "var(--color-indigo-deep)",
                color: "var(--color-turmeric)",
                fontFamily: "var(--font-label)",
              }}
            >
              {meals}
            </span>
          </motion.button>

          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="btn btn-sm btn-ghost !px-3 lg:hidden"
            style={{ color: "var(--color-ivory)" }}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
          >
            <MenuIcon open={mobileOpen} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden lg:hidden"
            style={{ background: "var(--color-indigo-deep)" }}
          >
            <div className="shell flex flex-col gap-1 py-4">
              {NAV.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="border-b py-3 text-lg tracking-[0.12em] uppercase no-underline"
                  style={{
                    fontFamily: "var(--font-label)",
                    color: "var(--color-ivory)",
                    borderColor: "rgba(253,243,227,0.15)",
                  }}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

/** Hamburger that becomes a cross — the label lives in aria-label, not in pixels. */
function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d={open ? "M5 5l14 14M19 5L5 19" : "M3 6h18M3 12h18M3 18h18"}
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** The logo mark: a thali seen from above, quartered like a real one. */
function Mark() {
  return (
    <svg
      viewBox="0 0 48 48"
      aria-hidden="true"
      className="h-9 w-9 shrink-0 sm:h-[42px] sm:w-[42px]"
    >
      <circle cx="24" cy="24" r="22" fill="var(--color-marigold)" />
      <circle cx="24" cy="24" r="22" fill="none" stroke="var(--color-indigo-deep)" strokeWidth="2.5" />
      <circle cx="24" cy="24" r="9" fill="var(--color-chili)" stroke="var(--color-indigo-deep)" strokeWidth="2" />
      {[0, 90, 180, 270].map((deg) => (
        <circle
          key={deg}
          cx="24"
          cy="8.5"
          r="5"
          fill="var(--color-ivory)"
          stroke="var(--color-indigo-deep)"
          strokeWidth="2"
          transform={`rotate(${deg} 24 24)`}
        />
      ))}
    </svg>
  );
}

/** Stacked tiffin — the cart icon, because that is what the food travels in. */
function TiffinIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7 3h10M12 3v3M5 7h14v4H5zM5 12h14v4H5zM5 17h14v4H5z"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
