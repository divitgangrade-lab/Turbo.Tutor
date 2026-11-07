# TurboTutor

**1:1 tutoring at full throttle.** A fast, F1-inspired marketing site for one-to-one Math, English and Science tutoring for Grades 1–8.

The whole site is a single static page with no build step, no framework, no backend and no online payment. Visitors configure a plan, add it to a **kart**, and send the request by email or text. The tutor confirms everything directly.

- **Live site:** https://divitgangrade-lab.github.io/Turbo.Tutor/
- **License:** [MIT](LICENSE)

---

## What is inside

### The plan builder
- Pick a **grade** (1–8), a **subject** (Science, English, Math) and a **location** (Zoom or Twin Hickory Library).
- Three terms - Weekly, Monthly, Yearly - each with 30, 45 or 60-minute laps.
- Prices recalculate instantly and are announced through an `aria-live` region.
- Every plan is described in plain words before it is added: session length, number of laps, location and suggested price.

### The kart (not a cart)
The cart is a go-kart. The slide-out panel is styled like a grid box with a little kart illustration, numbered entries and an estimated first payment. It:
- adds and removes plans,
- applies the best eligible seasonal or wheel discount (cash discounts never stack),
- builds a complete email or SMS draft with every selection, the discount applied and the estimated total.

No payment is collected anywhere on the site.

### Offers
- A canvas prize wheel with published odds and a 30-day saved result (`localStorage`, with `sessionStorage` fallback).
- Seasonal offers that rotate by date: Season Opener, Back-to-School Grand Prix, Diwali Night Race, Thanksgiving Sprint and Season Finale.

### Paddock Club newsletter
A signup panel under the gear section offers **5% off the first month** (code `PADDOCK5`) and one email every Monday about gear drops and session openings. It is wired in `enhance.js`:

- With `data-endpoint` set on `#club-form`, the form POSTs `{ "email_address": "...", "tags": ["paddock-club"] }` and shows the code on success.
- With it empty, the form opens a pre-filled email to the tutor instead, so no signup is lost.
- The automated Monday send and the welcome email are handled by the newsletter provider. Create a [Buttondown](https://buttondown.com) account, then point `data-endpoint` at a small endpoint that holds the API key (GitHub Pages cannot keep a secret in client code).

### Team gear (under construction)
A deliberate construction site: hazard tape, a blueprint pipeline with animated progress bars, and a hand-drawn little worker holding an **UNDER CONSTRUCTION** sign. Nothing is for sale; the "register interest" button opens a pre-filled email.

### Twin Hickory Library
In-person laps meet at **Twin Hickory Library** in Henrico County. The plan section carries a large bordered card linking to the library's room-booking page (`https://henricolibrary-va.libcal.com/spaces?lid=6277`), and the FAQ and contact panel link there too.

### Everything else
- Sticky header with scroll progress, active-section highlighting and a theme toggle.
- Scroll-reveal animations, animated counters, a looping ticker, magnetic buttons and SVG wheel animations - all disabled automatically under `prefers-reduced-motion`.
- Searchable FAQ, policy cards, contact cards with copy-to-clipboard, and a fully validated request dialog.
- Responsive down to small phones, with a mobile menu and a full-width kart panel.

---

## Pricing

All rates below are for a **45-minute lap on Zoom**, Science (the base subject).

| Grade | Weekly | Monthly (4 laps, −5%) | Yearly (48 laps, −15%) |
| --- | --- | --- | --- |
| 1 | $24 | $91 | $979 |
| 2 | $26 | $99 | $1,061 |
| 3 | $28 | $106 | $1,142 |
| 4 | $30 | $114 | $1,224 |
| 5 | $33 | $125 | $1,346 |
| 6 | $36 | $137 | $1,469 |
| 7 | $39 | $148 | $1,591 |
| 8 | $42 | $160 | $1,714 |

Adjustments:

| Option | Effect on a weekly lap |
| --- | --- |
| Math | +$3 |
| English | +$5 |
| Public library | +$10 (per 45 minutes) |
| 30-minute lap | ×0.7 |
| 60-minute lap | ×1.5 |
| Monthly plan | −5% vs. 4 weekly payments |
| Yearly plan | −15% vs. 48 weekly payments |

Special coaching:

| Program | Price |
| --- | --- |
| Moody IB Prep | $120 per 120-minute Zoom session |
| High School Application Review | $35 per application |
| Optional 90-minute Zoom meeting | +$40 with an application review |

Service terms: $15 missed session, $10 family-requested reschedule, and a 15% credit toward the next request when the tutor reschedules. Fees are arranged directly with the tutor - never on this site.

---

## Project structure

```
.
├── index.html              # Everything: markup, styles and behaviour
├── f1-car.webp             # Hero photo (real Ferrari, CC BY-SA 4.0)
├── f1-helmet.webp          # Pit-wall promise photo (real F1 helmet, CC BY-SA 4.0)
├── go-kart.webp            # Kart panel photo (real kart race, CC BY 2.0)
├── open-wheel-car.svg      # Original hero car drawing (kept as a backup)
├── monaco-harbour.svg      # Harbour scene behind the circuit map
├── go-kart.svg             # Original kart illustration (kept as a backup)
├── helmet.svg              # Original helmet illustration (kept as a backup)
├── race-trophy.svg         # Steps illustration
├── pit-garage.svg          # Contact illustration
├── checkered-flag.svg      # Gear section accent
├── under-construction.svg  # The sign worker in the gear section
├── favicon.svg             # Badge favicon
├── LICENSE                 # MIT
└── README.md
```

No dependencies, no bundler, no package manager, no server code. Google Fonts (Barlow Condensed, Chakra Petch, Titillium Web) is the only external request.

### Photography credits

The site now uses real photographs instead of drawn stand-ins, all from Wikimedia Commons under share-alike licences. Credits are repeated in the site footer.

| Use | File | Author | Licence |
| --- | --- | --- | --- |
| Hero car | Carlos Sainz, 2023 Austrian Grand Prix | Lukas Raich | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) |
| Pit-wall promise | Oscar Piastri helmet, 2024 | Liauzh | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) |
| Kart panel | Go kart racing | Genevieve | [CC BY 2.0](https://creativecommons.org/licenses/by/2.0) |

The 1200x630 social share card (`og-image.png`) is cropped from the hero photograph and carries the same CC BY-SA 4.0 licence. If a photo is replaced, keep the credit line accurate and update the footer, the credits page and this table.

---

## Run it locally

Any static file server works:

```bash
python3 -m http.server 3000
# then open http://localhost:3000
```

There is nothing to install and nothing to build.

---

## Customising

Almost everything lives in the `<script>` block at the bottom of `index.html`:

- **Rates** - `gradeBaseRates`, `subjectPremiums`, `deliveryPremiums`, `durationMultipliers`, `termDetails`.
- **Special programs** - the `data-base-price` attribute on each `[data-specialty]` card, plus the card copy in the Specialty section.
- **Contact details** - `tutorEmail` and `tutorPhone`, and the matching `href`s in the contact section and form drafts.
- **Offers** - the `deals` array (labels and weights) next to `drawDealWheel()`, and `getSeasonSchedule()` for seasonal offers.
- **Gear pipeline** - the inline `--p` progress values on each `.bp-bar span`.

Design tokens (colour, type, spacing) are CSS custom properties at the top of the `<style>` block. Dark mode is a `data-theme="dark"` attribute on `<html>`.

---

## Accessibility and motion

- Keyboard support for the plan tabs, kart panel, menu, dialogs and FAQ.
- Visible focus rings, skip link, semantic landmarks and labelled controls.
- `aria-live` announcements for price changes, kart updates and toast messages.
- All decorative SVG is hidden from assistive technology; illustrative images carry descriptive `alt` text.
- Continuous animation, reveals and counters respect `prefers-reduced-motion`.

## A note on payment

This project intentionally does **not** integrate a payment provider. There are no card fields, no checkout and no third-party payment SDKs. Requests are reviewed and confirmed by the tutor, then paid by cash or Zelle directly.

---

## License

MIT © 2026 Buttergod. See [LICENSE](LICENSE).

## Motion layer and extra pages

The site ships as plain HTML, CSS and JavaScript with no build step. `enhance.css` and
`enhance.js` sit on top of the inline styles and scripts in `index.html`:

- A single reference-counted `requestAnimationFrame` ticker drives every canvas and reveal.
- A damped spring solver runs the text reveals, hero entrance, magnetic controls,
  counters, cursor and the scroll progress bar.
- The hero draws a marching-squares contour backdrop, and the circuit map draws its lap in
  canvas with corner braking, marker flares and a light pointer reticle. The lap animates
  only while the map is on screen, then stops. There is no loading veil.
- The FAQ uses an animated `<details>` body, the header tucks on scroll, and the mobile
  sticky CTA appears after the hero. All of it is disabled under `prefers-reduced-motion`.

Additional pages and assets:

- `privacy.html`: service terms, privacy, browser storage, payment and attendance policy.
- `thanks.html`: what happens after a request is sent (noindex).
- `404.html`: a branded off-circuit page.
- `robots.txt` and `sitemap.xml`.
- `og-image.png`: the 1200x630 social share card, cropped from the hero photograph and
  referenced by the Open Graph and Twitter tags.
- `credits.html`: photograph attribution and licence details.

There is no analytics, advertising pixel or third-party cookie on the site. Web fonts come
from Google Fonts and hosting logs come from GitHub Pages. Reviews and a team photograph are
not published because neither exists yet; the site does not invent them.
