# The Hungry Palate

Website for Priya Dayal's weekly Indian home kitchen in Batavia, Ohio.

Next.js 16 · React 19 · Tailwind v4 · Framer Motion. TypeScript throughout.

## Running it

```bash
npm install
npm run dev      # http://localhost:3002
```

Other scripts:

```bash
npm run build    # production build
npm run start    # serve the production build on :3002
```

## The one file you will actually edit

**`src/lib/site.ts`** holds every business detail — phone, email, address, price,
the weekly schedule, the Venmo handle, the social links, and the three dishes.
Nothing else in the codebase hardcodes any of it, so changing the price or
swapping a dish is a one-line edit there.

### Adding the YouTube link

In `src/lib/site.ts`:

```ts
youtube: "https://www.youtube.com/@whatever",   // was: null
```

The link then appears automatically in the About section and the footer. While
it is `null` it is simply left out — no dead button.

### Adding the food photos

1. Drop the images into `public/images/`.
2. Point each dish at its file in `src/lib/site.ts`:

```ts
image: "/images/chicken-tikka-masala.jpg",      // was: null
```

Shoot straight down onto the bowl — each photo is cropped to a circle inside a
brass rim, so a centred, square-ish composition works best. At least 800×800.

Until a photo is set, the site **draws** that dish — a bed of basmati with the
curry ladled in, garnished with what is actually in it. The page looks finished
either way, so there is no rush.

## How ordering works

There is no order database and no server. The drawer builds the order, then
hands the finished text to the customer's own Messages or Mail app:

1. Customer adds bowls and picks a heat level for each.
2. They enter name, phone, pickup day, time slot and payment method.
3. The site formats the order and offers **Send as a text** (`sms:` to
   513-508-8866), **Send as an email** (`mailto:`), or **Copy the order**.
4. If they chose Venmo, they also get a button that opens Venmo pre-filled with
   the right amount and `@Priya-Dayal` as the recipient.

The order therefore arrives from the customer's real phone number, and Priya
replies in a normal text thread. Nothing is confirmed until she replies — the
site says so explicitly.

The cart survives a page reload (`localStorage`), so nobody loses a half-built
order.

## The weekly cycle

`src/lib/cutoff.ts` computes the live deadline. Orders close Sunday 5:00pm and
pickup is the following Tuesday and Wednesday, 6–8pm. All of it is computed in
`America/New_York` no matter what clock the visitor's device is on, and it
handles both daylight-saving transitions. The countdown in the hero and the
"next pickups" dates come from this.

To change the schedule, edit `site.schedule` — the countdown, the pickup-day
buttons at checkout, the FAQ and the structured data all follow.

## Notes on the build

- **Entrance animations are CSS, not JavaScript.** Scroll reveals add a class
  whose animation has no fill mode, so every section is fully visible before and
  after it plays. With JS blocked or slow, the page still reads completely —
  which also means search engines see all the copy.
- `prefers-reduced-motion` is honoured: durations *and* delays are zeroed, so a
  reduced-motion visitor gets the finished page immediately, not a blank one.
- The page ships `FoodEstablishment` structured data (address, hours, menu,
  prices) so it can show up properly in search and maps.
- One visual world, deliberately: Ajrakh indigo, marigold, madder chili and warm
  ivory, in full-bleed bands separated by printed textile dividers. Type is
  Rozha One / Khand / Mukta — all drawn by Indian foundries, all carrying
  Devanagari, which is why the Hindi dish names set in the same faces.

## Still to do

- [ ] **Priya's own words** — the two paragraphs in `src/components/AboutPriya.tsx`
      are placeholder voice, marked with a `TODO`. Replace with her real story.
- [ ] **Confirm the meat in Keema Masala** — described as "minced meat" in
      `src/lib/site.ts` (marked with a `TODO`) because we did not know whether
      she uses lamb, goat, chicken or turkey.
- [ ] YouTube channel link (see above).
- [ ] Food photography (see above).

## Deploying

The site is fully static — `npm run build` prerenders it. It deploys to Vercel
with no configuration, or to any static host via the `.next` output. Point a
domain at it when Priya is ready.
