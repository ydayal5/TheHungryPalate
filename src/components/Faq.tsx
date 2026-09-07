"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { site } from "@/lib/site";

const QUESTIONS = [
  {
    q: "What if I miss the Sunday deadline?",
    a: `Text ${site.contact.phone} anyway. If there is room in the batch Priya will fit you in; if not, you go to the top of next week's list.`,
  },
  {
    q: "How much food is one meal?",
    a: "One full bowl of steamed basmati rice with the curry over it, plus naan and a side of kachumbar salad — onion, tomato and cucumber diced with lemon juice and cilantro. It feeds one hungry adult, or stretches to two smaller plates alongside something else.",
  },
  {
    q: "Can I change or cancel an order?",
    a: `Yes, any time before ${site.schedule.cutoffLabel}. After that the shopping and prep are already under way, so it is too late.`,
  },
  {
    q: "Is anything vegetarian?",
    a: "Chhole Masala is fully vegetarian. It is cooked in the same kitchen as the chicken dishes, so it is not suitable if you need a strictly separated kitchen.",
  },
  {
    q: "I have an allergy — what should I know?",
    a: "Chicken Tikka Masala contains dairy from its cream sauce, and the naan contains wheat. Text before you order and Priya will tell you exactly what goes into each dish.",
  },
  {
    q: "Can you cook for a party?",
    a: `For anything over about ten meals, or for a dish that is not on the week's menu, text ${site.contact.phone} and ask. Give her a week or two of notice.`,
  },
  {
    q: "When do I pay?",
    a: `Venmo ${site.payment.venmoHandle} any time between ordering and pickup, or bring cash to the door. Priya confirms every order by text either way.`,
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="band band-paper">
      <div className="shell grid gap-10 lg:grid-cols-[0.6fr_1fr] lg:gap-20">
        <div>
          <p className="eyebrow" style={{ color: "var(--color-chili)" }}>
            Before you order
          </p>
          <h2 className="display-md mt-4">Things people ask.</h2>
          <p className="mt-4" style={{ color: "var(--color-ink-soft)" }}>
            Anything not covered here, just text{" "}
            <a href={`tel:${site.contact.phoneE164}`} style={{ color: "var(--color-indigo)", fontWeight: 600 }}>
              {site.contact.phone}
            </a>
            .
          </p>
        </div>

        <div>
          {QUESTIONS.map((item, i) => {
            const isOpen = open === i;
            return (
              <div
                key={item.q}
                style={{
                  borderTop: "1.5px solid rgba(36,27,18,0.22)",
                  borderBottom: i === QUESTIONS.length - 1 ? "1.5px solid rgba(36,27,18,0.22)" : "none",
                }}
              >
                <h3 className="m-0">
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 bg-transparent py-5 text-left"
                    style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", cursor: "pointer" }}
                  >
                    {item.q}
                    <motion.span
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="shrink-0 text-[1.6rem] leading-none"
                      style={{ color: "var(--color-chili)" }}
                      aria-hidden="true"
                    >
                      +
                    </motion.span>
                  </button>
                </h3>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="pb-5" style={{ color: "var(--color-ink-soft)", maxWidth: "60ch" }}>
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
