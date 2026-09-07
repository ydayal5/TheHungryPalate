/**
 * The Hungry Palate — single source of truth.
 *
 * Everything a non-developer might need to change lives in this file:
 * contact details, social links, menu, price, and the weekly schedule.
 * Nothing else in the codebase hardcodes a phone number, price, or dish.
 */

export type SpiceLevel = "Mild" | "Medium" | "Spicy";

export type Dish = {
  id: string;
  name: string;
  /** Devanagari name, shown as a second line on the menu card. */
  nameHi: string;
  /** One-line hook used on the card. */
  tagline: string;
  /** The real description: what is actually in it and how it is cooked. */
  description: string;
  /** Shown as small chips on the card. */
  notes: string[];
  /** true = no meat. Drives the "Veg" badge. */
  vegetarian: boolean;
  /** Allergens worth calling out for a pickup meal. */
  allergens: string[];
  /**
   * Photo for this dish, dropped into /public/images.
   * Leave as null and an illustrated plate is drawn instead — the page
   * looks finished either way. Set to e.g. "/images/tikka-masala.jpg".
   */
  image: string | null;
  /** Palette key used by the illustrated plate + card accents. */
  accent: "chili" | "marigold" | "cardamom";
};

export const site = {
  name: "The Hungry Palate",
  nameHi: "द हंग्री पैलेट",
  cook: "Priya Dayal",
  tagline: "Home-cooked Indian, one week at a time",
  blurb:
    "A small weekly kitchen in Batavia, Ohio. Priya cooks three rice bowls a week, " +
    "the same way she cooks them for her own family — marinated overnight, " +
    "ground fresh, simmered slow. You order by Sunday, you pick up hot on Tuesday or Wednesday.",

  price: 15,
  currency: "USD",

  contact: {
    phone: "(513) 508-8866",
    /** E.164, used for the sms: link. */
    phoneE164: "+15135088866",
    email: "thehungrypalate1220@gmail.com",
    address: {
      street: "1220 Traditions Turn",
      city: "Batavia",
      state: "Ohio",
      zip: "45103",
    },
  },

  payment: {
    venmoHandle: "@Priya-Dayal",
    /** Handle without the @, for the Venmo deep link. */
    venmoUsername: "Priya-Dayal",
    methods: ["Venmo", "Cash"] as const,
  },

  schedule: {
    /** 0 = Sunday. Orders close Sunday at 5:00pm. */
    cutoffWeekday: 0,
    cutoffHour: 17,
    cutoffLabel: "Sunday 5:00pm",
    /** Pickup days, in the order they should be offered. */
    pickupDays: ["Tuesday", "Wednesday"] as const,
    pickupWindow: { startHour: 18, endHour: 20, label: "6:00 – 8:00pm" },
    /** Half-hour slots offered at checkout. */
    pickupSlots: ["6:00 – 6:30pm", "6:30 – 7:00pm", "7:00 – 7:30pm", "7:30 – 8:00pm"],
    /** IANA zone everything above is stated in. */
    timeZone: "America/New_York",
  },

  links: {
    blog: "https://thehungrypalate.com/",
    instagram: "https://www.instagram.com/the_hungry_palate_/",
    /** TODO: paste the YouTube channel URL here — the link appears everywhere automatically. */
    youtube: null as string | null,
  },

  spiceLevels: ["Mild", "Medium", "Spicy"] as SpiceLevel[],
} as const;

export const menu: Dish[] = [
  {
    id: "chicken-tikka-masala",
    name: "Chicken Tikka Masala",
    nameHi: "चिकन टिक्का मसाला",
    tagline: "Charred, then simmered in tomato and cream",
    description:
      "Thigh meat sits overnight in yogurt, ginger, garlic and garam masala, then goes " +
      "under the broiler until the edges catch. The char comes back into a tomato gravy " +
      "finished with cream and crushed kasuri methi.",
    notes: ["Marinated overnight", "Broiler-charred", "Mild by default"],
    vegetarian: false,
    allergens: ["Dairy"],
    image: null,
    accent: "chili",
  },
  {
    id: "keema-masala",
    name: "Keema Masala",
    nameHi: "कीमा मसाला",
    // TODO: confirm which meat Priya uses so this reads exactly right.
    tagline: "Minced meat, peas, and whole spice",
    description:
      "Minced meat browned hard in a kadhai with onion, tomato and green chili, then " +
      "cooked down low with peas until the fat separates and the whole spices — clove, " +
      "black cardamom, bay — have given everything up.",
    notes: ["Slow-cooked", "Sweet green peas", "Medium heat"],
    vegetarian: false,
    allergens: [],
    image: null,
    accent: "marigold",
  },
  {
    id: "chhole-masala",
    name: "Chhole Masala",
    nameHi: "छोले मसाला",
    tagline: "Chickpeas, tamarind-dark and tangy",
    description:
      "Chickpeas soaked from dry and simmered into an onion-tomato masala with amchur " +
      "and anardana for sourness. Dark, thick, and finished with ginger cut into matchsticks.",
    notes: ["Vegetarian", "Soaked from dry", "Tangy, not sweet"],
    vegetarian: true,
    allergens: [],
    image: null,
    accent: "cardamom",
  },
];

/** Every meal ships the same way — stated once, used in several places. */
export const included = [
  "Basmati rice",
  "Fresh naan",
  "Onion & lemon",
];

export const fullAddress = `${site.contact.address.street}, ${site.contact.address.city}, ${site.contact.address.state} ${site.contact.address.zip}`;

export const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;
