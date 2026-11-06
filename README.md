# TurboTutor

**1:1 tutoring at full throttle.** A fast, F1-inspired marketing site for one-to-one Math, English and Science tutoring for Grades 1–8.

The whole site is a single static page with no build step, no framework, no backend and no online payment. Visitors configure a plan, add it to a **kart**, and send the request by email or text. The tutor confirms everything directly.

- **Live site:** https://divitgangrade-lab.github.io/Turbo.Tutor/
- **License:** [MIT](LICENSE)

---

## What is inside

### The plan builder
- Pick a **grade** (1–8), a **subject** (Science, English, Math) and a **location** (Zoom or a public library).
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

### Team gear (under construction)
A deliberate construction site: hazard tape, a blueprint pipeline with animated progress bars, and a hand-drawn little worker holding an **UNDER CONSTRUCTION** sign. Nothing is for sale; the "register interest" button opens a pre-filled email.

### Everything else
- Sticky header with scroll progress, active-section highlighting and a theme toggle.
- Scroll-reveal animations, animated counters, a looping ticker, magnetic buttons and SVG wheel animations - all disabled automatically under `prefers-reduced-motion`.
- Searchable FAQ, policy cards, contact cards with copy-to-clipboard, and a fully validated request dialog.
- Responsive down to small phones, with a mobile menu and a full-width kart panel.

---

## Pricing

All rates below are for a **45-minute lap on Zoom**, Science (the base subject).

| Grade | Weekly | Monthly (4 laps) | Yearly (48 laps, −10%) |
| --- | --- | --- | --- |
| 1 | $30 | $120 | $1,296 |
| 2 | $32 | $128 | $1,382 |
| 3 | $34 | $136 | $1,469 |
| 4 | $37 | $148 | $1,598 |
| 5 | $40 | $160 | $1,728 |
| 6 | $43 | $172 | $1,858 |
| 7 | $46 | $184 | $1,987 |
| 8 | $49 | $196 | $2,117 |

Adjustments:

| Option | Effect on a weekly lap |
| --- | --- |
| Math | +$4 |
| English | +$7 |
| Public library | +$15 (per 45 minutes) |
| 30-minute lap | ×0.7 |
| 60-minute lap | ×1.6 |
| Yearly plan | −10% vs. 48 weekly payments |

Special coaching (60 minutes, suggested starting rates):

| Program | Price |
| --- | --- |
| Moody IB Prep | $150 |
| High School Application Review | $65 |

Service terms: $25 missed session, $15 family-requested reschedule, and a 15% credit toward the next request when the tutor reschedules. Fees are arranged directly with the tutor - never on this site.

---

## Project structure

```
.
├── index.html              # Everything: markup, styles and behaviour
├── open-wheel-car.svg      # Hero racing car
├── monaco-harbour.svg      # Harbour scene behind the circuit map
├── go-kart.svg             # Kart panel illustration
├── helmet.svg              # Pit-wall promise illustration
├── race-trophy.svg         # Steps illustration
├── pit-garage.svg          # Contact illustration
├── checkered-flag.svg      # Gear section accent
├── under-construction.svg  # The sign worker in the gear section
├── favicon.svg             # Badge favicon
├── LICENSE                 # MIT
└── README.md
```

No dependencies, no bundler, no package manager, no server code. Google Fonts (Barlow Condensed, Chakra Petch, Titillium Web) is the only external request.

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
- A damped spring solver runs the text reveals, hero entrance, magnetic controls, parallax,
  counters, cursor and the scroll progress bar.
- `index.html` includes a boot veil (helmet fill and a 4px meter), a marching-squares contour
  backdrop in the hero, chequered dissolve seams, and a circuit map whose lap is drawn in
  canvas with corner braking, marker flares and a cursor reticle with a lit halftone.
- The FAQ uses an animated `<details>` body, the header tucks on scroll, and the mobile
  sticky CTA appears after the hero. All of it is disabled under `prefers-reduced-motion`.

Additional pages and assets:

- `privacy.html`: service terms, privacy, browser storage, payment and attendance policy.
- `thanks.html`: what happens after a request is sent (noindex).
- `404.html`: a branded off-circuit page.
- `robots.txt` and `sitemap.xml`.
- `og-image.png`: the 1200x630 social share card referenced by the Open Graph tags.

There is no analytics, advertising pixel or third-party cookie on the site. Web fonts come
from Google Fonts and hosting logs come from GitHub Pages. Reviews and a team photograph are
not published because neither exists yet; the site does not invent them.
