"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { useCart } from "./CartProvider";
import { getOrderWindow } from "@/lib/cutoff";
import { site } from "@/lib/site";
import {
  dishById,
  formatOrder,
  mailtoLink,
  money,
  smsLink,
  venmoLink,
  type OrderDetails,
} from "@/lib/order";

type Step = "cart" | "details" | "send";

const EMPTY_DETAILS: OrderDetails = {
  name: "",
  phone: "",
  pickupDay: "",
  pickupDate: "",
  pickupSlot: site.schedule.pickupSlots[0],
  payment: "Venmo",
  notes: "",
};

/**
 * The order drawer.
 *
 * There is no server here on purpose: the drawer builds the order, then hands
 * the finished text to the customer's own Messages or Mail app. The order
 * therefore arrives from a real phone number Priya can reply to.
 */
export function CartDrawer() {
  const { lines, meals, price, isOpen, closeCart, setQty, remove, clear } = useCart();
  const [step, setStep] = useState<Step>("cart");
  const [details, setDetails] = useState<OrderDetails>(EMPTY_DETAILS);
  const [errors, setErrors] = useState<Partial<Record<keyof OrderDetails, string>>>({});
  const [copied, setCopied] = useState(false);
  const [pickupOptions, setPickupOptions] = useState<{ day: string; label: string }[]>([]);
  const panelRef = useRef<HTMLDivElement>(null);

  // Real dates for this cycle, resolved on the client where the clock is.
  useEffect(() => {
    const options = getOrderWindow().pickupDates.map((p) => ({ day: p.day, label: p.label }));
    setPickupOptions(options);
    setDetails((d) =>
      d.pickupDay
        ? d
        : { ...d, pickupDay: options[0]?.day ?? "", pickupDate: options[0]?.label ?? "" },
    );
  }, []);

  // Reset to the cart whenever the drawer is reopened.
  useEffect(() => {
    if (isOpen) {
      setStep("cart");
      setCopied(false);
      panelRef.current?.focus();
    }
  }, [isOpen]);

  const orderText = useMemo(() => formatOrder(lines, details), [lines, details]);

  const validate = () => {
    const next: Partial<Record<keyof OrderDetails, string>> = {};
    if (!details.name.trim()) next.name = "We need a name for the bag.";
    const digits = details.phone.replace(/\D/g, "");
    if (digits.length < 10) next.phone = "Enter a 10-digit phone number so Priya can confirm.";
    if (!details.pickupDay) next.pickupDay = "Pick a day.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(orderText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  };

  const startOver = () => {
    clear();
    setDetails((d) => ({ ...EMPTY_DETAILS, pickupDay: d.pickupDay, pickupDate: d.pickupDate }));
    setStep("cart");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        // Keyed motion element so AnimatePresence tracks it and the nested
        // backdrop/panel exit animations propagate before unmount.
        <motion.div key="order-drawer" className="fixed inset-0 z-50">
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            aria-label="Close order"
            className="absolute inset-0 h-full w-full cursor-default"
            style={{ background: "rgba(13,21,51,0.6)", backdropFilter: "blur(3px)" }}
          />

          <motion.div
            ref={panelRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label="Your order"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            className="absolute top-0 right-0 flex h-full w-full max-w-[34rem] flex-col outline-none"
            style={{ background: "var(--color-ivory)" }}
          >
            {/* header */}
            <div
              className="flex shrink-0 items-center justify-between gap-4 px-6 py-5"
              style={{ background: "var(--color-indigo)", color: "var(--color-ivory)" }}
            >
              <div>
                <p
                  className="m-0 text-[0.75rem] tracking-[0.22em] uppercase"
                  style={{ fontFamily: "var(--font-label)", color: "var(--color-turmeric)" }}
                >
                  {step === "cart" ? "Your order" : step === "details" ? "Pickup details" : "Send it"}
                </p>
                <p className="m-0 text-[1.6rem] leading-tight" style={{ fontFamily: "var(--font-display)" }}>
                  {meals} {meals === 1 ? "meal" : "meals"} · {money(price)}
                </p>
              </div>
              <button
                type="button"
                onClick={closeCart}
                className="btn btn-sm btn-ghost"
                style={{ color: "var(--color-ivory)" }}
              >
                Close
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6">
              {step === "cart" && (
                <CartStep lines={lines} setQty={setQty} remove={remove} onClose={closeCart} />
              )}

              {step === "details" && (
                <DetailsStep
                  details={details}
                  setDetails={setDetails}
                  errors={errors}
                  pickupOptions={pickupOptions}
                />
              )}

              {step === "send" && (
                <SendStep
                  orderText={orderText}
                  details={details}
                  price={price}
                  copied={copied}
                  onCopy={handleCopy}
                  onStartOver={startOver}
                />
              )}
            </div>

            {/* footer actions */}
            {step !== "send" && (
              <div
                className="shrink-0 px-6 py-5"
                style={{ borderTop: "2px solid var(--color-indigo)", background: "var(--color-ivory-deep)" }}
              >
                {step === "cart" ? (
                  <button
                    type="button"
                    className="btn w-full"
                    disabled={meals === 0}
                    onClick={() => setStep("details")}
                  >
                    Add pickup details
                  </button>
                ) : (
                  <div className="flex gap-3">
                    <button type="button" className="btn btn-ghost" onClick={() => setStep("cart")}>
                      Back
                    </button>
                    <button
                      type="button"
                      className="btn flex-1"
                      onClick={() => {
                        if (validate()) setStep("send");
                      }}
                    >
                      Review &amp; send
                    </button>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ------------------------------------------------------------------------- */

function CartStep({
  lines,
  setQty,
  remove,
  onClose,
}: {
  lines: ReturnType<typeof useCart>["lines"];
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  onClose: () => void;
}) {
  if (lines.length === 0) {
    return (
      <div className="py-10 text-center">
        <p className="display-md m-0">Nothing in the bag yet.</p>
        <p className="mx-auto mt-3 max-w-[36ch]" style={{ color: "var(--color-ink-soft)" }}>
          Three dishes are cooking this week, all {money(site.price)} with naan.
        </p>
        <a href="#menu" onClick={onClose} className="btn mt-6">
          See the menu
        </a>
      </div>
    );
  }

  return (
    <ul className="m-0 flex flex-col gap-4 p-0" style={{ listStyle: "none" }}>
      <AnimatePresence initial={false}>
        {lines.map((line) => {
          const dish = dishById(line.dishId);
          return (
            <motion.li
              key={line.key}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.22 }}
              className="flex items-start justify-between gap-4 pb-4"
              style={{ borderBottom: "1.5px solid rgba(36,27,18,0.18)" }}
            >
              <div className="min-w-0">
                <p className="m-0 text-[1.2rem] leading-tight" style={{ fontFamily: "var(--font-display)" }}>
                  {dish?.name ?? line.dishId}
                </p>
                <p
                  className="m-0 mt-1 text-[0.85rem] tracking-[0.14em] uppercase"
                  style={{ fontFamily: "var(--font-label)", color: "var(--color-ink-soft)" }}
                >
                  {line.spice} · {money(site.price)} each
                </p>
                <button
                  type="button"
                  onClick={() => remove(line.key)}
                  className="mt-2 bg-transparent text-[0.82rem] underline underline-offset-2"
                  style={{ color: "var(--color-chili)", cursor: "pointer" }}
                >
                  Remove
                </button>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <QtyButton label={`Fewer ${dish?.name ?? ""}`} onClick={() => setQty(line.key, line.qty - 1)}>
                  −
                </QtyButton>
                <span
                  className="w-7 text-center text-[1.2rem] tabular-nums"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {line.qty}
                </span>
                <QtyButton label={`More ${dish?.name ?? ""}`} onClick={() => setQty(line.key, line.qty + 1)}>
                  +
                </QtyButton>
              </div>
            </motion.li>
          );
        })}
      </AnimatePresence>
    </ul>
  );
}

function QtyButton({
  children,
  onClick,
  label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-full text-[1.2rem] leading-none"
      style={{
        border: "2px solid var(--color-indigo)",
        color: "var(--color-indigo)",
        background: "transparent",
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
}

/* ------------------------------------------------------------------------- */

function DetailsStep({
  details,
  setDetails,
  errors,
  pickupOptions,
}: {
  details: OrderDetails;
  setDetails: React.Dispatch<React.SetStateAction<OrderDetails>>;
  errors: Partial<Record<keyof OrderDetails, string>>;
  pickupOptions: { day: string; label: string }[];
}) {
  const update = (patch: Partial<OrderDetails>) => setDetails((d) => ({ ...d, ...patch }));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <label className="field-label" htmlFor="order-name">
          Name
        </label>
        <input
          id="order-name"
          className="field"
          value={details.name}
          onChange={(e) => update({ name: e.target.value })}
          placeholder="Who is picking up"
          autoComplete="name"
        />
        {errors.name && <FieldError>{errors.name}</FieldError>}
      </div>

      <div>
        <label className="field-label" htmlFor="order-phone">
          Phone
        </label>
        <input
          id="order-phone"
          className="field"
          type="tel"
          inputMode="tel"
          value={details.phone}
          onChange={(e) => update({ phone: e.target.value })}
          placeholder="(513) 555-0148"
          autoComplete="tel"
        />
        {errors.phone && <FieldError>{errors.phone}</FieldError>}
      </div>

      <div>
        <span className="field-label">Pickup day</span>
        <div className="segment" role="group" aria-label="Pickup day">
          {(pickupOptions.length > 0
            ? pickupOptions
            : site.schedule.pickupDays.map((day) => ({ day, label: day }))
          ).map((option) => (
            <button
              key={option.day}
              type="button"
              className="segment-option"
              aria-pressed={details.pickupDay === option.day}
              onClick={() => update({ pickupDay: option.day, pickupDate: option.label })}
            >
              {option.label}
            </button>
          ))}
        </div>
        {errors.pickupDay && <FieldError>{errors.pickupDay}</FieldError>}
      </div>

      <div>
        <span className="field-label">Time ({site.schedule.pickupWindow.label})</span>
        <div className="segment" role="group" aria-label="Pickup time">
          {site.schedule.pickupSlots.map((slot) => (
            <button
              key={slot}
              type="button"
              className="segment-option"
              aria-pressed={details.pickupSlot === slot}
              onClick={() => update({ pickupSlot: slot })}
            >
              {slot}
            </button>
          ))}
        </div>
      </div>

      <div>
        <span className="field-label">Paying by</span>
        <div className="segment" role="group" aria-label="Payment method">
          {site.payment.methods.map((method) => (
            <button
              key={method}
              type="button"
              className="segment-option"
              aria-pressed={details.payment === method}
              onClick={() => update({ payment: method })}
            >
              {method}
            </button>
          ))}
        </div>
        <p className="mt-2 text-[0.9rem]" style={{ color: "var(--color-ink-soft)" }}>
          {details.payment === "Venmo"
            ? `You will get a Venmo button on the next step, pre-filled to ${site.payment.venmoHandle}.`
            : "Bring it to the door — exact change is appreciated but not required."}
        </p>
      </div>

      <div>
        <label className="field-label" htmlFor="order-notes">
          Anything else
        </label>
        <textarea
          id="order-notes"
          className="field"
          rows={3}
          value={details.notes}
          onChange={(e) => update({ notes: e.target.value })}
          placeholder="Allergies, no cilantro, extra naan…"
        />
      </div>
    </div>
  );
}

function FieldError({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-1.5 mb-0 text-[0.88rem]" style={{ color: "var(--color-chili)" }} role="alert">
      {children}
    </p>
  );
}

/* ------------------------------------------------------------------------- */

function SendStep({
  orderText,
  details,
  price,
  copied,
  onCopy,
  onStartOver,
}: {
  orderText: string;
  details: OrderDetails;
  price: number;
  copied: boolean;
  onCopy: () => void;
  onStartOver: () => void;
}) {
  return (
    <div className="relative flex flex-col gap-5">
      <PetalBurst />

      <div>
        <h3 className="m-0 text-[1.7rem]">Almost there.</h3>
        <p className="mt-2 mb-0" style={{ color: "var(--color-ink-soft)" }}>
          Send this to Priya and she will text you back to confirm. Nothing is booked until you
          send it.
        </p>
      </div>

      <pre
        className="m-0 overflow-x-auto p-4 text-[0.9rem] whitespace-pre-wrap"
        style={{
          background: "#fff",
          border: "2px solid var(--color-indigo)",
          borderRadius: "10px",
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
          color: "var(--color-ink)",
        }}
      >
        {orderText}
      </pre>

      <div className="flex flex-col gap-3">
        <a href={smsLink(orderText)} className="btn w-full">
          Send as a text
        </a>
        <a href={mailtoLink(orderText, details.name)} className="btn btn-ghost w-full" style={{ color: "var(--color-indigo)" }}>
          Send as an email
        </a>
        <button type="button" onClick={onCopy} className="btn btn-ghost w-full" style={{ color: "var(--color-indigo)" }}>
          {copied ? "Copied to clipboard" : "Copy the order"}
        </button>
      </div>

      {details.payment === "Venmo" && (
        <div
          className="p-5"
          style={{
            background: "var(--color-ivory-deep)",
            border: "2px dashed var(--color-cardamom)",
            borderRadius: "12px",
          }}
        >
          <p className="m-0 text-[1.05rem]" style={{ fontWeight: 600 }}>
            Paying {money(price)} by Venmo
          </p>
          <p className="mt-1 mb-3 text-[0.92rem]" style={{ color: "var(--color-ink-soft)" }}>
            Send it any time before pickup to {site.payment.venmoHandle}.
          </p>
          <a
            href={venmoLink(price, details.name)}
            target="_blank"
            rel="noreferrer"
            className="btn btn-cardamom btn-sm"
          >
            Open Venmo for {money(price)}
          </a>
        </div>
      )}

      <button
        type="button"
        onClick={onStartOver}
        className="mt-2 bg-transparent text-[0.9rem] underline underline-offset-4"
        style={{ color: "var(--color-ink-soft)", cursor: "pointer" }}
      >
        Clear and start a new order
      </button>
    </div>
  );
}

/** A handful of marigold petals thrown when the order is ready to send. */
function PetalBurst() {
  const petals = Array.from({ length: 14 }, (_, i) => i);

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-0">
      {petals.map((i) => {
        const angle = (i / petals.length) * Math.PI * 2;
        return (
          <motion.span
            key={i}
            initial={{ opacity: 1, x: 0, y: 0, scale: 0.4, rotate: 0 }}
            animate={{
              opacity: 0,
              x: Math.cos(angle) * (90 + (i % 4) * 26),
              y: Math.sin(angle) * (70 + (i % 3) * 24) + 40,
              scale: 1,
              rotate: (i % 2 ? 1 : -1) * 180,
            }}
            transition={{ duration: 1.15, delay: i * 0.015, ease: "easeOut" }}
            className="absolute top-0 left-1/2 block h-2.5 w-2.5 rounded-full"
            style={{
              background: ["#F5A314", "#F6C445", "#C7332B", "#E4557A"][i % 4],
            }}
          />
        );
      })}
    </div>
  );
}
