"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Adds the `reveal-in` class the first time an element scrolls into view.
 *
 * The animation it triggers has no fill mode, so the element renders fully
 * visible before and after it plays. Nothing on the page depends on this hook
 * running: with JavaScript blocked, every section is simply already there.
 */
export function useReveal<T extends HTMLElement>(delay = 0) {
  const ref = useRef<T>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || shown) return;

    if (typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShown(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [shown]);

  return {
    ref,
    className: shown ? "reveal-in" : "",
    style: delay ? ({ animationDelay: `${delay}s` } as const) : undefined,
  };
}
