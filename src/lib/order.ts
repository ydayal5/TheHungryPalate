/**
 * Turning a cart into something Priya can actually read on her phone.
 *
 * There is no order database: the site formats the order as plain text and hands
 * it to the customer's own Messages or Mail app, so the order arrives from the
 * customer's real phone number and the reply thread is a normal conversation.
 */

import { menu, site, type SpiceLevel } from "./site";

export type CartLine = {
  /** `${dishId}::${spice}` — one dish at two heat levels is two lines. */
  key: string;
  dishId: string;
  spice: SpiceLevel;
  qty: number;
};

export type OrderDetails = {
  name: string;
  phone: string;
  pickupDay: string;
  pickupDate: string;
  pickupSlot: string;
  payment: string;
  notes: string;
};

export const lineKey = (dishId: string, spice: SpiceLevel) => `${dishId}::${spice}`;

export const dishById = (id: string) => menu.find((d) => d.id === id);

export const totalMeals = (lines: CartLine[]) => lines.reduce((sum, l) => sum + l.qty, 0);

export const totalPrice = (lines: CartLine[]) => totalMeals(lines) * site.price;

export const money = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: site.currency,
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);

/** The message body itself — kept plain so it survives SMS, email, and a paste into Notes. */
export function formatOrder(lines: CartLine[], details: OrderDetails): string {
  const items = lines
    .filter((l) => l.qty > 0)
    .map((l) => `  ${l.qty}x ${dishById(l.dishId)?.name ?? l.dishId} (${l.spice})`)
    .join("\n");

  const meals = totalMeals(lines);
  const paymentLine =
    details.payment === "Venmo"
      ? `Venmo — ${site.payment.venmoHandle}`
      : "Cash at pickup";

  return [
    `THE HUNGRY PALATE — ORDER`,
    ``,
    `Name: ${details.name}`,
    `Phone: ${details.phone}`,
    `Pickup: ${details.pickupDate} · ${details.pickupSlot}`,
    ``,
    `Meals:`,
    items,
    ``,
    `Total: ${meals} ${meals === 1 ? "meal" : "meals"} × ${money(site.price)} = ${money(totalPrice(lines))}`,
    `Paying by: ${paymentLine}`,
    details.notes.trim() ? `\nNotes: ${details.notes.trim()}` : ``,
  ]
    .filter((line) => line !== undefined)
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/**
 * `sms:` deep link. The `?&body=` form is the one that behaves on both
 * iOS and Android — iOS historically wanted `&`, Android wants `?`.
 */
export function smsLink(body: string): string {
  return `sms:${site.contact.phoneE164}?&body=${encodeURIComponent(body)}`;
}

export function mailtoLink(body: string, name: string): string {
  const subject = `Order — ${name || "The Hungry Palate"}`;
  return `mailto:${site.contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/** Venmo's documented pay deep link, pre-filled with the amount and a note. */
export function venmoLink(amount: number, name: string): string {
  const note = `The Hungry Palate — ${name || "meal"} pickup`;
  const params = new URLSearchParams({
    txn: "pay",
    audience: "private",
    recipients: site.payment.venmoUsername,
    amount: amount.toFixed(2),
    note,
  });
  return `https://venmo.com/?${params.toString()}`;
}
