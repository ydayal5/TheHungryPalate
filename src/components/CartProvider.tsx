"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { lineKey, totalMeals, totalPrice, type CartLine } from "@/lib/order";
import type { SpiceLevel } from "@/lib/site";

const STORAGE_KEY = "hungry-palate-cart-v1";

type CartContextValue = {
  lines: CartLine[];
  meals: number;
  price: number;
  /** Bumped on every add, so the header badge can react to it. */
  pulse: number;
  isOpen: boolean;
  add: (dishId: string, spice: SpiceLevel, qty?: number) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  openCart: () => void;
  closeCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

/** Only accept shapes we actually wrote — a stale or hand-edited value is dropped. */
function parseStoredLines(raw: string): CartLine[] {
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (l): l is CartLine =>
        !!l &&
        typeof l === "object" &&
        typeof (l as CartLine).dishId === "string" &&
        typeof (l as CartLine).spice === "string" &&
        typeof (l as CartLine).qty === "number" &&
        (l as CartLine).qty > 0,
    );
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [pulse, setPulse] = useState(0);
  const [hydrated, setHydrated] = useState(false);

  // Read after mount so the server and first client render agree.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setLines(parseStoredLines(raw));
    } catch {
      // Private browsing or blocked storage — an empty cart is a fine outcome.
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      // Nothing to do; the cart still works for this visit.
    }
  }, [lines, hydrated]);

  const add = useCallback((dishId: string, spice: SpiceLevel, qty = 1) => {
    const key = lineKey(dishId, spice);
    setLines((current) => {
      const existing = current.find((l) => l.key === key);
      if (existing) {
        return current.map((l) => (l.key === key ? { ...l, qty: l.qty + qty } : l));
      }
      return [...current, { key, dishId, spice, qty }];
    });
    setPulse((n) => n + 1);
  }, []);

  const setQty = useCallback((key: string, qty: number) => {
    setLines((current) =>
      qty <= 0
        ? current.filter((l) => l.key !== key)
        : current.map((l) => (l.key === key ? { ...l, qty } : l)),
    );
  }, []);

  const remove = useCallback((key: string) => {
    setLines((current) => current.filter((l) => l.key !== key));
  }, []);

  const clear = useCallback(() => setLines([]), []);
  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  // Lock the page behind the drawer while it is open.
  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen]);

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      meals: totalMeals(lines),
      price: totalPrice(lines),
      pulse,
      isOpen,
      add,
      setQty,
      remove,
      clear,
      openCart,
      closeCart,
    }),
    [lines, pulse, isOpen, add, setQty, remove, clear, openCart, closeCart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside a CartProvider");
  return ctx;
}
