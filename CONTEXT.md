# Project context for Claude

Written 2026-09-10, at the end of the session that built this site from an empty
folder to a deployed, live business site. Read this before changing anything.

Its second purpose is to be a **playbook for the next small local business site**
— see [Reusable playbook](#reusable-playbook) at the end. The owner intends to
build more of these.

---

## 1. The business

**The Hungry Palate** — a one-woman Indian home kitchen run by **Priya Dayal**
out of her house in Batavia, Ohio. Not a restaurant, not a ghost kitchen. She
cooks three rice bowls a week and people collect them from her front door.

| | |
|---|---|
| Cook | Priya Dayal |
| Price | $15 per meal, flat |
| Menu | Three rice bowls, same three each week |
| Order deadline | Sunday 5:00pm Eastern |
| Pickup | Tuesday and Wednesday, 6:00–8:00pm |
| Address | 1220 Traditions Turn, Batavia, Ohio 45103 |
| Phone | (513) 508-8866 |
| Email | thehungrypalate1220@gmail.com |
| Payment | Venmo `@Priya-Dayal`, or cash at the door |
| Blog | https://thehungrypalate.com/ |
| Instagram | https://www.instagram.com/the_hungry_palate_/ |
| YouTube | **not yet supplied** — `site.links.youtube` is `null` |

**The three dishes** (descriptions are Priya's own words, do not rewrite):

1. **Chicken Tikka Masala** — marinated chicken in a spice-infused tomato and
   cream sauce. Contains dairy.
2. **Keema Chicken** — ground chicken sautéed with whole spices, onion, ginger
   and garlic. *Was originally "Keema Masala"; she renamed it, which also
   settled that the meat is chicken.*
3. **Chhole Masala** — chickpeas slow-cooked in onion-tomato gravy. Vegetarian.

Every meal ships with **steamed basmati rice, fresh naan, and kachumbar salad**
(onion, tomato and cucumber diced with lemon juice and cilantro).

**Live:** https://the-hungry-palate.vercel.app
**Repo:** https://github.com/ydayal5/TheHungryPalate (private)

---

## 2. Stack

| | |
|---|---|
| Framework | Next.js **16.3.4**, App Router |
| React | 19.2 |
| Styling | Tailwind **v4** (CSS-first `@theme`, no `tailwind.config.js`) |
| Animation | framer-motion **13.2.0** — interaction only, see §5 |
| Language | TypeScript 5.9, strict |
| Node | 24.16 |
| Dev port | **3002** (`npm run dev`) |
| Hosting | Vercel, auto-deploy from GitHub `main` |

The whole page is statically prerendered. There is **no server, no database, no
API route.** That was a deliberate choice by the owner (see §4).

### Version pins that matter

Two upstream problems were hit and worked around. Do not "upgrade" back past them:

- **`next@15.5.4` has a published CVE** (CVE-2025-66478). Moved to 16.3.4.
- **`framer-motion@12.23.24` is broken.** It declares `motion-dom: ^12.23.23`,
  which resolves to a newer `motion-dom` that dropped the `activeAnimations`
  export. The build fails with *"Export activeAnimations doesn't exist in target
  module"*. `framer-motion@13.2.0` pins `motion-dom: ^13.2.0` and is
  self-consistent. If framer-motion ever fails to build with a missing-export
  error, this is why — check `npm ls framer-motion motion-dom`.

---

## 3. Architecture

```
src/
  app/
    layout.tsx            fonts, metadata, providers, header/footer/drawer
    page.tsx              composes the bands + FoodEstablishment JSON-LD
    globals.css           the entire design system (tokens, components, motion)
    icon.png              favicon
    opengraph-image.png   link-share card
  lib/
    site.ts               ← ALL business data. The one file to edit.
    cutoff.ts             timezone-correct order deadline + pickup dates
    order.ts              cart types, order text, sms/mailto/venmo deep links
  components/
    SiteHeader / SiteFooter
    Hero  Marquee  MenuSection  HowItWorks  PickupInfo  AboutPriya  Faq  OrderCta
    CartProvider          context + localStorage
    CartDrawer            3-step order flow (cart → details → send)
    DishPlate             drawn rice bowl, or the real photo when one exists
    Ornaments             block-print band, rangoli, steam, corner marks
    SpiceCanvas           ambient drifting spice particles
    useReveal.ts          IntersectionObserver → CSS class
public/images/            logo assets + where dish photos go
```

### `src/lib/site.ts` is the contract

Every phone number, price, dish, link and schedule value lives here. **Nothing
else in the codebase hardcodes any of it.** Changing the price, swapping a dish,
or adding the YouTube link is a one-line edit. Keep it that way — it is what
makes the site handable to a non-developer.

Config-driven behaviours worth knowing:

- `site.links.youtube` is `null`. Links render from a `.filter(Boolean)`, so a
  missing link is silently omitted — no dead button. Set the URL and it appears
  in the About section and footer automatically.
- `dish.image` is `null` for all three. When `null`, `DishPlate` **draws** the
  bowl in SVG. Set it to `/images/whatever.jpg` and the photo takes over inside
  the same brass rim. The page looks finished either way.
- `site.features.spiceLevels` is `false` — see §6.

### `src/lib/cutoff.ts` — the only genuinely tricky logic

Computes the next Sunday 5pm deadline and the following Tue/Wed pickup dates,
**always in `America/New_York`**, regardless of the visitor's device clock. It
does this without a date library: `Intl.DateTimeFormat.formatToParts` reads a UTC
instant as wall-clock in a zone, and a two-pass offset correction converts a
wall-clock time back to UTC (the second pass is what makes DST-transition days
land correctly).

This was verified against real dates — both DST boundaries, a Pacific-clock
visitor, and Sunday-before/after-5pm rollover. See §7 for how to re-run that.

The business rule: ordering any time after Sunday 5pm puts you in *next* week's
batch. Ordering Monday Sep 7 → deadline Sunday Sep 13 → pickup Sep 15/16.

### `src/lib/order.ts` — no backend, by design

`formatOrder()` produces plain text, then the drawer hands it to the customer's
own app:

- `smsLink()` → `sms:+15135088866?&body=…` (the `?&` form is the one that
  behaves on both iOS and Android)
- `mailtoLink()` → `mailto:` with subject and body
- `venmoLink()` → `https://venmo.com/?txn=pay&audience=private&recipients=Priya-Dayal&amount=…&note=…`

The order therefore arrives **from the customer's real phone number**, and Priya
replies in a normal text thread. The site states explicitly that nothing is
confirmed until she replies. Cart survives reload via `localStorage`.

---

## 4. Decisions the owner made

Asked up front, and they shape everything:

1. **Ordering: text/email handoff, not a backend.** Rejected both the
   stored-orders-plus-admin-dashboard option and the email-service option. This
   is why there is no database. Do not add one without asking.
2. **Stack: Next.js + Tailwind + Framer Motion.**
3. **GitHub repo: private.** Chosen after being told `site.ts` contains a home
   address and personal mobile in plain text, and that public repos get scraped
   and keep history forever.

---

## 5. Design system

The brief was "very vibrant, lots of cool animations, Indian vibe." The direction
chosen deliberately avoids the default AI-restaurant look (warm cream + serif +
terracotta):

**Indian bazaar poster / Ajrakh block-print.** Full-bleed bands of flat saturated
colour, separated by printed textile divider strips, hard offset shadows on
buttons, decorative borders.

**Palette** (tokens in `globals.css` under `@theme`):

| Token | Hex | Role |
|---|---|---|
| `--color-indigo` | `#15224f` | Ajrakh indigo, primary dark ground |
| `--color-indigo-deep` | `#0d1533` | header, footer |
| `--color-marigold` | `#f5a314` | primary accent, buttons |
| `--color-turmeric` | `#f6c445` | eyebrows on dark |
| `--color-chili` | `#c7332b` | madder red band, accents |
| `--color-cardamom` | `#1e7a5f` | vegetarian, secondary buttons |
| `--color-ivory` | `#fdf3e3` | warm paper ground |
| `--color-ink` | `#241b12` | warm near-black text |

**Type** — all three faces are drawn by Indian foundries and carry Devanagari
alongside Latin, which is why the Hindi dish names (चिकन टिक्का मसाला) set in the
same faces instead of dropping to a system fallback:

- **Rozha One** — display (Indian Type Foundry)
- **Khand** — condensed labels, eyebrows, buttons
- **Mukta** — body (Ek Type)

Loaded via `next/font/google` with `subsets: ["latin", "devanagari"]`, self-hosted.

**Band order:** indigo hero → chili marquee → ivory menu → marigold print divider
→ indigo how-it-works → indigo divider → paper pickup → ivory about → paper FAQ →
paper divider → chili CTA → indigo-deep footer.

**Drawn, not stock.** Everything decorative is hand-authored SVG: the rangoli
petal rings, the buta/paisley print bands, the masala dabba with seven real
spices, the veg/non-veg square-and-dot mark used on Indian packaging, the tiffin
cart icon, and the dish plates.

**This is a single-theme design.** It deliberately commits to one visual world
and does not ship a dark variant. `color-scheme: light` is set.

---

## 6. Feature flags and hidden features

**Heat levels are built but switched off.** `site.features.spiceLevels === false`
hides:

- the Mild/Medium/Spicy chooser on each menu row
- the heat label on cart lines
- the `(Medium)` suffix in the order text

That last one is the important one. Every cart line still defaults to `Medium`
internally and spice is still part of the line key. If you only hid the buttons,
Priya's texts would read `2x Chicken Tikka Masala (Medium)` — telling her a
customer picked a heat they were never offered. Flip the flag to `true` and the
whole feature returns, including same-dish-at-two-heats splitting into two lines.

---

## 7. Verification techniques used (reuse these)

There is no test suite. Correctness was established with these, and they are
worth repeating on the next site.

### Screenshots via the installed browser

No Playwright/Puppeteer needed — Chrome is already on this machine:

```bash
"/c/Program Files/Google/Chrome/Application/chrome.exe" \
  --headless=new --disable-gpu --hide-scrollbars \
  --window-size=1440,900 --virtual-time-budget=12000 \
  --screenshot="$SCRATCH/shot.png" "http://localhost:3002/"
```

**`--force-prefers-reduced-motion` is the trick for capturing the settled page.**
Without it the screenshot lands mid-animation and everything looks broken. With
it, the CSS reduced-motion block collapses all animations to their end state, so
you see the true resting frame *and* you verify the reduced-motion path at once.

### Testing true mobile width

**`--window-size=390,x` does NOT give a 390px layout viewport in headless Chrome.**
It laid out at ~980px and just cropped, which silently hid a real header overflow
bug. The tell: `sm:` styles were active at a supposed 390px width.

The fix is an iframe harness — write a local HTML file with a fixed-width iframe
and screenshot *that*, with the window wider than the iframe so nothing clips:

```html
<style>html,body{margin:0;padding:0;background:#222;overflow:hidden}
iframe{width:390px;height:2400px;border:0;display:block}</style>
<body><iframe src="http://localhost:3002/"></iframe></body>
```

```bash
chrome --headless=new --allow-file-access-from-files \
  --window-size=520,2400 --screenshot=out.png "file:///$SCRATCH/mobile-frame.html"
```

Note the iframe hydrates late, so client-filled values (the countdown) may still
show their placeholder in the capture. That's an artifact, not a bug.

### Running the business logic directly

For the timezone and order-text logic, a one-off script beats reasoning:

```bash
mkdir -p .tmpcheck && cat > .tmpcheck/check.ts <<'EOF'
import { getOrderWindow } from "../src/lib/cutoff";
...
EOF
npx --yes tsx@4.20.6 .tmpcheck/check.ts && rm -rf .tmpcheck
```

`tsx` via `npx --yes` avoids adding a dev dependency to a small marketing site.
Node 24's native type stripping does *not* work here, because the lib files use
extensionless relative imports.

24 assertions were run this way covering DST boundaries, cross-timezone visitors,
deadline rollover, and the exact order text. All passed. Worth re-running after
any change to `cutoff.ts` or `order.ts`.

### Checking the deployed site, not just localhost

After each push, poll the live URL for the new string before declaring victory:

```bash
for i in $(seq 1 24); do
  curl -s "$URL" | grep -q "new string" && { echo "live"; break; }; sleep 10
done
```

Auto-deploy consistently took 20–40 seconds.

---

## 8. Real bugs found and fixed

Every one of these was caught by looking at the rendered page or the served HTML,
not by reading code. Expect them again on the next site.

1. **Hydration mismatch from float drift.** `Math.cos`/`Math.sin` are
   implementation-defined at the last bit and differ between Node and Chrome, so
   SVG coordinates computed with trig produced `cy="136.05067577671724"` on the
   server and `...727` on the client. React reported a mismatch. **Fix: round all
   derived SVG coordinates** (`Math.round(v * 100) / 100`). Hit twice — dish
   plates and the masala dabba.

2. **Content served at `opacity: 0`.** framer-motion's `initial={{opacity:0}}` /
   `whileInView` renders `opacity:0` into the *server HTML*. With JS slow,
   blocked, or a crawler, the hero copy never appears. **Fix: entrance animations
   are now CSS, not JS.** `.enter` plays once on load with `both` fill; `.reveal-in`
   is added by `useReveal` on scroll and has **no fill mode**, so the element is
   fully visible before and after it plays. framer-motion is now used only for
   interaction (drawer, accordion, hover). Verified by grepping the served HTML
   for hard `opacity:0`.

3. **`prefers-reduced-motion` left the page blank.** The reduce block zeroed
   `animation-duration` but not `animation-delay`. The entrance animations fill
   backwards, so a reduced-motion visitor got up to 0.8s of *invisible* content
   that then popped in. **Fix: zero delays too.**

4. **Header invisible on deep links.** The sticky header was transparent with
   ivory text and only turned solid once JS ran. Landing directly on `/#priya`
   (exactly the kind of link you'd send someone) rendered ivory nav on an ivory
   band. **Fix: default to solid; JS only clears it at the very top.** General
   rule — default to the *safe* visual state and let JS remove it, never the
   reverse.

5. **Mobile header overflow at 390px.** Logo + wordmark + cart + menu button
   summed to ~460px. Fixed by shrinking the wordmark at base size, `min-w-0` on
   the logo, `shrink-0` on the actions, and replacing the "Menu"/"Close" text
   button with a hamburger icon.

6. **Oversized hero headline** pushed the price, CTAs and countdown below the
   fold. `clamp(3rem, 10vw, 7.5rem)` → `clamp(2.5rem, 5.2vw, 4.4rem)`.

7. **Illustration contradicting the copy.** The Keema plate drew green peas.
   When Priya's real description arrived it had no peas — a food site showing an
   ingredient that isn't in the dish. Redrawn as whole spices with onion, ginger
   and garlic. **When copy changes, check the art.**

---

## 9. The copy problem — read this one

The site was built before Priya's real words existed, so it was filled with
plausible-sounding detail. When her actual copy arrived, a lot of it turned out
to be **invented and wrong**, and it was already live on a real business site.

Removed in commit `8823e82`:

- "raw onion and a wedge of lemon" included with every meal — not a thing
- "marinated overnight", "ground fresh", "broiler-charred", kasuri methi,
  amchur, anardana, ginger matchsticks
- "cooked the morning you pick them up"
- "nothing is frozen, nothing cooked over the weekend and held"
- the vegetarian dish being cooked "in separate pans"
- the naan containing dairy
- "most families order four to six" (removed later, `635514a`)

None of these were malicious — they're the kind of texture that makes food copy
read well. But on a small business's site they are **claims about someone's
actual operation**, and the owner has to defend them.

**The rule for these projects:** write only what the client has said. Where you
need placeholder copy to make a page work, mark it with a `TODO`, tell the owner
plainly, and strip it the moment real copy arrives. Prefer describing the
*format* ("a bowl of basmati under the curry") over the *process* ("simmered for
four hours"). Never invent hours, sourcing, allergen facts, or customer
behaviour.

There is still **one open tension** worth raising with Priya: her bio says she is
"bringing … straight to local households", which reads as delivery, while the
site states plainly that it is pickup only with no delivery.

---

## 10. What the owner changed, in order

| Commit | Change |
|---|---|
| `0828129` | Initial build — full site, deployed |
| `8823e82` | Priya's real About copy; real dish descriptions; Keema Masala → **Keema Chicken**; stripped invented claims |
| `ccd6b69` | Removed the reheating-instructions section; hid the heat chooser behind a flag; added a feedback note after ordering |
| `3f58109` | Added **kachumbar salad** to every order (replacing the onion-and-lemon side) |
| `0f9d7c1` | Priya's badge logo → header, footer, favicon, OG image |
| `635514a` | Removed "most families order four to six" |
| `e2ba9da` | "basmati" → "basmati rice" everywhere |

Pattern worth noting: **most edits were subtractive.** The owner trimmed
invented detail and unneeded features. Build lean; let them ask for more.

---

## 11. Assets and accounts

- **Vercel:** user `ydayal5`, project `yash-dayal-s-projects/the-hungry-palate`.
  GitHub↔Vercel is linked, so **pushing to `main` auto-deploys** (~20–40s).
- **`.env.local`** holds a `VERCEL_OIDC_TOKEN` created by `vercel link`. It is
  gitignored. Do not commit or paste it.
- **Logo** — Priya supplied a *phone screenshot*, not a file. Three assets were
  derived from it with Pillow: cropped to the badge, masked to the circle (which
  removed the phone's OCR button that was floating near the rim), and thresholded
  to drop the JPEG banding behind "HUNGRY".
  - `public/images/logo-mark.png` — knocked out, ivory artwork, for dark bands
  - `public/images/logo-badge.png` — black disc intact, for light backgrounds
  - `src/app/icon.png`, `src/app/opengraph-image.png`
  - **Still worth asking for the original vector/large PNG** — the current
    version is upscaled and the fine "THE"/"PALATE" lettering is soft.

### Outstanding

- [ ] YouTube channel URL → `site.links.youtube`
- [ ] Food photography → `public/images/`, then set `dish.image`
- [ ] Original logo file, if she has one
- [ ] Ask about the delivery-vs-pickup wording in her bio (§9)
- [ ] Site is indexable. Fine now that copy is real, but it went live to
      *production* with placeholder text — Vercel puts a project's **first**
      deploy on production regardless of flags.

---

## 12. Environment gotchas on this machine

- **Bash heredocs mangle large files.** Writing a ~400-line CSS file via
  `cat > file <<'EOF'` failed with an unmatched-quote parse error. Use the Write
  tool for anything substantial; keep heredocs for short files.
- **`grep -P` is unavailable** ("supports only unibyte and UTF-8 locales"), and
  `grep -P -o` errors with "conflicting matchers". Two verification greps
  silently produced false passes because the `||` fallback `echo` fired. Verify
  with plain `grep` and eyeball the list.
- **Python patch scripts**: escaping `\n` inside a heredoc'd Python string to
  match a literal `\n` in source is error-prone. Line-based surgery is more
  reliable than matching multi-line strings containing escapes.
- **Pillow** was installed (`python -m pip install Pillow`) for the logo work.
- **`CLAUDE.md` is safe to edit.** `next dev` regenerates `AGENTS.md`, and its
  generator explicitly skips `CLAUDE.md` when `AGENTS.md` already hosts the
  managed block (verified in
  `node_modules/next/dist/server/lib/generate-agent-files.js`). Commit both when
  they change — `next dev` re-creates them otherwise and dirties the tree.
- Vercel derives the project name from the folder name; **"Hungry Palate" has a
  space and capitals and is rejected.** Use
  `vercel link --project the-hungry-palate --yes` first.
- `vercel deploy --temporary` creates a deployment with **no login required**,
  claimable later — useful for getting a client a preview link fast.

---

## Reusable playbook

For the next small local business site.

**Ask these before writing code.** They change the architecture, and guessing
wastes a build:

1. How should orders/enquiries actually reach the owner? (backend + dashboard /
   text-and-email handoff / third-party form)
2. Do you have real copy and photos, or should I use marked placeholders?
3. Public or private repo? — say out loud that the source will contain their
   home address and mobile.
4. Contact details, hours, prices, socials.

**Architecture that worked and should be repeated:**

- **One config file** (`src/lib/site.ts`) holding every business fact, with
  nothing else hardcoding any of it. This is the single highest-value decision —
  it is what lets the owner change a price or a dish without you.
- **Nullable fields degrade gracefully.** `youtube: null` hides the link;
  `image: null` draws an illustration. The site is never broken while waiting on
  an asset, and never shows a dead button or grey box.
- **Draw the placeholders properly.** Hand-authored SVG food/product art meant
  the site could ship and be reviewed before any photography existed. This bought
  weeks and looked deliberate rather than unfinished.
- **Feature flags over deletion** when the owner says "maybe later" — and make
  the flag cover the *data output*, not just the UI (see §6).
- **CSS entrances, JS only for interaction.** Small business sites live or die on
  SEO and on phones with bad connections. Never serve content at `opacity: 0`.
- **Structured data** (`schema.org` `LocalBusiness`/`FoodEstablishment`) with real
  address, hours and prices — for a local business this is the point of having a
  site at all.
- **A `README.md` written for the owner**, not for a developer: how to add a
  photo, how to change the price, what's still outstanding.

**Process:**

- Design *against* the default AI look. Pick a direction from the subject's own
  world (here: Ajrakh block-print, Indian foundry type, the masala dabba).
- Look at the rendered page before shipping — most of §8 was invisible in code.
- Verify business-critical logic (deadlines, prices, the exact message the owner
  receives) by running it, not by reading it.
- Deploy early so the client can review, but know the first Vercel deploy is
  production and indexable.
- Write copy only from what the client said. Flag placeholders loudly. Expect to
  delete your own good-sounding prose.
