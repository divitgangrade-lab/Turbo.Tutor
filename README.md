# TurboTutor

The security model, audit results and residual risks are documented in `SECURITY.md`.

**1:1 tutoring at full throttle.** A fast, F1-inspired marketing site for one-to-one Math, English and Science tutoring for Grades 1–8.

The site is a set of static HTML pages with no backend and no online payment. Sixteen small Preact islands, FlyingButton, FluxLines, PatternWaves, TechText, TextLoop, MaskedHeading, ParticleText, SplitFlapText, WarpText, ElasticMesh, HalftoneReveal, AnimatedContent, PixelSwap, TargetCursor, MetallicPaint and Ribbons, are bundled locally with esbuild; most load near the viewport, while the hero PixelSwap loads after first paint. Their generated files are committed, so the rest of the site still runs without a build. Visitors configure a plan, add it to a **kart**, and send the request by email or text. The tutor confirms everything directly.

- **Live site:** https://turbotutor.dpdns.org/
- **License:** [MIT](LICENSE)

---

## What is inside

### The plan builder
- Pick a **grade** (1–8), a **subject** (Science, English, Math) and a **location** (Zoom or Twin Hickory Library).
- Three terms - Weekly, Monthly, Yearly - each with 30, 45 or 60-minute laps.
- Prices recalculate instantly and are announced through an `aria-live` region.
- Every plan is described in plain words before it is added: session length, number of laps, location and suggested price.

### The kart (not a cart)
The kart is a go-kart. The slide-out panel is styled like a grid box with a little kart illustration, numbered entries and an estimated first payment. It:
- adds and removes plans,
- applies the best eligible seasonal or wheel discount (cash discounts never stack),
- builds a complete email or SMS draft with every selection, the discount applied and the estimated total.

No payment is collected anywhere on the site.

### Offers
- A canvas prize wheel with published odds and a 30-day saved result (`localStorage`, with `sessionStorage` fallback).
- Seasonal offers that rotate by date: Season Opener, Back-to-School Grand Prix, Diwali Night Race, Thanksgiving Sprint and Season Finale.

### Paddock Club newsletter
A signup panel below the launch section offers **5% off the first month** (code `PADDOCK5`) and one email every Monday about new session openings, study notes and occasional offers. It is wired in `enhance.js`:

- With `data-endpoint` set on `#club-form`, the form POSTs `{ "email_address": "...", "tags": ["paddock-club"] }` and shows the code on success.
- With it empty, the form opens a pre-filled email to the tutor instead, so no signup is lost.
- The automated Monday send and the welcome email are handled by the newsletter provider. Create a [Buttondown](https://buttondown.com) account, then point `data-endpoint` at a small endpoint that holds the API key (GitHub Pages cannot keep a secret in client code).

### Twin Hickory Library
In-person laps meet at **Twin Hickory Library** in Henrico County. The plan section carries a large bordered card linking to the library's room-booking page (`https://henricolibrary-va.libcal.com/spaces?lid=6277`), and the FAQ and contact panel link there too.

### Everything else
- Sticky header with scroll progress, active-section highlighting and a theme toggle.
- Scroll-reveal animations, animated counters, a looping ticker, magnetic buttons and SVG wheel animations - all disabled automatically under `prefers-reduced-motion`.
- A contained FlyingButton launch pad between the offers wheel and the Paddock Club. It loads only as it approaches the viewport, keeps a plain fallback link, and stays still under `prefers-reduced-motion`.
- A FluxLines fluid-line backdrop behind the pit-wall promise. It loads only near the viewport, sits behind the copy, and stays still under `prefers-reduced-motion`.
- A PatternWaves silk-dot surface behind the Paddock Club panel. It loads on approach and stays quiet enough for the signup form.
- A TechText footer wordmark. It lazy-loads near the end of the page and lets visitors reveal dashed letter outlines, drag letters and send a small kick through the wordmark.
- A TextLoop subject ribbon between the plans and special coaching. It lazy-loads near the viewport, scrolls the subject list along a yellow wave, pauses on hover and stays still under `prefers-reduced-motion`.
- A MaskedHeading promise title. It replaces the static "Every lap counts." heading with a helmet-filled lettering treatment when the island loads, keeping the plain heading as the no-JS fallback.
- A ParticleText footer watermark. It fills the footer background with a subtle particle-built "TURBO TUTOR" wordmark, forming when the footer approaches the viewport. It is decorative, kept out of the accessibility tree, and paused when the footer is off screen.
- A SplitFlapText launch board above the launch heading. It cycles through "PLANS READY", "ZOOM ONLINE" and "KART OPEN" with mechanical flap tiles, keeps the static "Pit lane warm-up" kicker as its no-JS fallback, and respects reduced motion.
- A WarpText statement band before the contact section. It turns "Learning in the fast lane" into a glass-warped display, keeps a hidden heading and static fallback, and pauses when it is off screen.
- An ElasticMesh 404 visual. The decorative code block on `404.html` becomes a drag-and-poke 404 balloon, with the original code block retained as its no-JS fallback.
- A scattered F1 card band on the 404 page. Five framed photos and illustrations sit below the 404 copy at slight angles, straightening on hover and dropping the smallest card on phones.
- A HalftoneReveal kart print. The go-kart photo in the kart panel becomes an interactive halftone print, loads only when the kart is first opened, and keeps the original photo as its fallback.
- A PixelSwap hero photograph. Hovering or focusing the Formula 1 hero swaps in the kart photo with a pixel wave, while the plain photograph remains as the LCP and no-JS fallback.
- An AnimatedContent policy grid. The three attendance cards enter in sequence when the section approaches the viewport, while the plain cards remain as the no-JS fallback.
- A TargetCursor reticle. On fine-pointer devices it follows the pointer, locks onto links, buttons, fields and the hero swap, and shows short labels on key actions. It skips touch and reduced-motion visitors, and the native cursor stays when the island is unavailable.
- A MetallicPaint footer monogram. A liquid-metal TT crest loads as the footer approaches the viewport, tilts with the pointer and stays still under `prefers-reduced-motion`. The plain TT stays visible when WebGL2 or the island is unavailable.
- A Ribbons footer trail. Amber, red and bone ribbons trail the pointer across the footer as the footer approaches the viewport. It runs only on fine-pointer devices with motion allowed, and the footer reads the same without it.
- Searchable FAQ, policy cards, contact cards with copy-to-clipboard, and a fully validated request dialog.
- Responsive down to small phones, with a mobile menu and a full-width kart panel.

## Metadata, sharing and discovery

- Every page has one `h1`, a unique title and description, a self-referencing canonical URL where it is indexable, and a complete Open Graph and Twitter card.
- Three 1200x630 JPEG share cards cover the home page, terms and photo credits.
- JSON-LD covers the tutoring business and its offer catalogue, the website, each indexable page, the FAQ and breadcrumbs on the subpages.
- `sitemap.xml`, `robots.txt` and `llms.txt` describe the public pages. `site.webmanifest` and the PNG/ICO icons cover browser tabs, home screens and installable web apps.
- `thanks.html` and `404.html` are marked `noindex,follow` and are deliberately excluded from the sitemap.

## Custom domain

The site currently uses the GitHub Pages address above. No `CNAME` file is committed, because a CNAME for a domain that is not registered would take the site offline.

When a domain is registered:

1. Add a `CNAME` file at the repository root containing only the exact host, such as `www.example.com`.
2. Point the domain at GitHub Pages using GitHub's published A and AAAA records for an apex domain, or a CNAME to `divitgangrade-lab.github.io` for `www`.
3. Set the custom domain in the repository's Pages settings and enable HTTPS.
4. Update every absolute URL in `index.html`, `privacy.html`, `terms.html`, `cookies.html`, `refunds.html`, `credits.html`, `404.html`, `thanks.html`, `sitemap.xml`, `robots.txt` and `llms.txt`.

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
├── index.html              # Main page: markup, styles and behaviour
├── about.html              # Tutor bio and about page
├── flying-button.js        # Generated lazy island (Preact + FlyingButton)
├── flying-button.css       # Generated FlyingButton styles
├── flux-lines.js           # Generated lazy island (Preact + FluxLines)
├── flux-lines.css          # Generated FluxLines styles
├── pattern-waves.js        # Generated lazy island (Preact + PatternWaves)
├── pattern-waves.css       # Generated PatternWaves styles
├── tech-text.js            # Generated lazy island (Preact + TechText)
├── tech-text.css           # Generated TechText styles
├── text-loop.js            # Generated lazy island (Preact + TextLoop + GSAP)
├── text-loop.css           # Generated TextLoop styles
├── masked-heading.js       # Generated lazy island (Preact + MaskedHeading + GSAP)
├── masked-heading.css      # Generated MaskedHeading styles
├── particle-text.js        # Generated lazy island (Preact + ParticleText)
├── particle-text.css       # Generated ParticleText styles
├── split-flap-text.js      # Generated lazy island (Preact + SplitFlapText)
├── split-flap-text.css     # Generated SplitFlapText styles
├── warp-text.js            # Generated lazy island (Preact + WarpText + ogl)
├── warp-text.css           # Generated WarpText styles
├── elastic-mesh.js         # Generated lazy island (Preact + ElasticMesh)
├── elastic-mesh.css        # Generated ElasticMesh styles
├── halftone-reveal.js      # Generated lazy island (Preact + HalftoneReveal)
├── halftone-reveal.css     # Generated HalftoneReveal styles
├── animated-content.js     # Generated lazy island (Preact + AnimatedContent + GSAP)
├── animated-content.css    # Generated AnimatedContent styles
├── pixel-swap.js           # Generated hero island (Preact + PixelSwap)
├── pixel-swap.css          # Generated PixelSwap styles
├── target-cursor.js        # Generated cursor island (Preact + TargetCursor)
├── metallic-paint.js       # Generated footer island (Preact + MetallicPaint)
├── ribbons.js              # Generated footer island (Preact + Ribbons)
├── island-chunks/          # Shared GSAP and Preact code loaded once for all islands
├── target-cursor.css       # Generated TargetCursor styles
├── package.json            # Build script for the islands
├── package-lock.json       # Locked build tool versions
├── scripts/                # esbuild build script for all sixteen islands
├── src/flying-button/      # FlyingButton source and mount entry
├── src/flux-lines/         # FluxLines source and mount entry
├── src/pattern-waves/      # PatternWaves source and mount entry
├── src/tech-text/          # TechText source and mount entry
├── src/text-loop/          # TextLoop source and mount entry
├── src/masked-heading/     # MaskedHeading source and mount entry
├── src/particle-text/      # ParticleText source and mount entry
├── src/split-flap-text/    # SplitFlapText source and mount entry
├── src/warp-text/          # WarpText source and mount entry
├── src/elastic-mesh/       # ElasticMesh source and mount entry
├── src/halftone-reveal/    # HalftoneReveal source and mount entry
├── src/animated-content/   # AnimatedContent source and mount entry
├── src/target-cursor/      # TargetCursor source and mount entry
├── src/pixel-swap/         # PixelSwap source and mount entry
├── f1-car.webp             # Hero photo (real Ferrari, CC BY-SA 4.0)
├── f1-helmet.webp          # Pit-wall promise photo (real F1 helmet, CC BY-SA 4.0)
├── go-kart.webp            # Kart panel photo (real kart race, CC BY 2.0)
├── monaco-harbour.svg      # Harbour scene behind the circuit map
├── pit-garage.svg          # Contact illustration
├── favicon.svg             # Scalable browser icon
├── favicon.ico             # 16/32/48px browser icon
├── favicon-32.png          # Browser icon
├── favicon-192.png         # Web app icon
├── favicon-512.png         # Web app icon
├── apple-touch-icon.png    # iOS home screen icon
├── site.webmanifest        # Web app name, colours and icons
├── og-image.jpg            # Home social share card
├── og-terms.jpg            # Terms social share card
├── og-credits.jpg          # Credits social share card
├── robots.txt              # Crawler rules
├── sitemap.xml             # Public page index
├── llms.txt                # Plain-text summary for AI assistants
├── THIRD_PARTY_NOTICES.md  # React Bits licences
├── LICENSE                 # MIT
└── README.md
```

No runtime dependencies and no server code. The sixteen optional islands, FlyingButton, FluxLines, PatternWaves, TechText, TextLoop, MaskedHeading, ParticleText, SplitFlapText, WarpText, ElasticMesh, HalftoneReveal, AnimatedContent, PixelSwap, TargetCursor, MetallicPaint and Ribbons, are built with esbuild and Preact, and their generated JS and CSS are committed. GSAP is bundled into the TextLoop, MaskedHeading and AnimatedContent islands. Barlow Condensed, Chakra Petch and Titillium Web are self-hosted, so the site makes no third-party requests.

### Photography credits

The site now uses real photographs instead of drawn stand-ins, all from Wikimedia Commons under share-alike licences. Credits are repeated in the site footer.

| Use | File | Author | Licence |
| --- | --- | --- | --- |
| Hero car | Carlos Sainz, 2023 Austrian Grand Prix | Lukas Raich | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) |
| Pit-wall promise | Oscar Piastri helmet, 2024 | Liauzh | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) |
| Kart panel | Go kart racing | Genevieve | [CC BY 2.0](https://creativecommons.org/licenses/by/2.0) |

The three 1200x630 social share cards (`og-image.jpg`, `og-terms.jpg` and `og-credits.jpg`) are cropped from the hero photograph and carry the same CC BY-SA 4.0 licence. If a photo is replaced, keep the credit line accurate and update the footer, the credits page and this table.

---

## Run it locally

Any static file server works:

```bash
python3 -m http.server 3000
# then open http://localhost:3000
```

The generated islands are already committed. Only rebuild them after editing `src/flying-button/`, `src/flux-lines/`, `src/pattern-waves/`, `src/tech-text/`, `src/text-loop/`, `src/masked-heading/`, `src/particle-text/`, `src/split-flap-text/`, `src/warp-text/`, `src/elastic-mesh/`, `src/halftone-reveal/`, `src/animated-content/`, `src/pixel-swap/`, `src/target-cursor/`, `src/metallic-paint/`, `src/ribbons/`, or their props:

```bash
npm install
npm run build
```

---

## Customising

Almost everything lives in the `<script>` block at the bottom of `index.html`:

- **Rates** - `gradeBaseRates`, `subjectPremiums`, `deliveryPremiums`, `durationMultipliers`, `termDetails`.
- **Special programs** - the `data-base-price` attribute on each `[data-specialty]` card, plus the card copy in the Specialty section.
- **Contact details** - `tutorEmail` and `tutorPhone`, and the matching `href`s in the contact section and form drafts.
- **Offers** - the `deals` array (labels and weights) next to `drawDealWheel()`, and `getSeasonSchedule()` for seasonal offers.
- **FlyingButton island** - props and the label live in `src/flying-button/entry.jsx`; run `npm run build` after changing them.
- **FluxLines island** - colours and visual props live in `src/flux-lines/entry.jsx`; run `npm run build` after changing them.
- **PatternWaves island** - preset, colour, opacity and interaction props live in `src/pattern-waves/entry.jsx`; run `npm run build` after changing them.
- **TechText island** - wording, font size, colours and interaction props live in `src/tech-text/entry.jsx`; run `npm run build` after changing them.
- **TextLoop island** - wording, shape, ribbon colour and speed live in `src/text-loop/entry.jsx`; run `npm run build` after changing them.
- **MaskedHeading island** - heading copy, media source, reveal and spotlight props live in `src/masked-heading/entry.jsx`; run `npm run build` after changing them.
- **ParticleText island** - watermark wording, particle density, colours and motion props live in `src/particle-text/entry.jsx`; run `npm run build` after changing them.
- **SplitFlapText island** - board phrases, timing, colours and tile styling live in `src/split-flap-text/entry.jsx`; run `npm run build` after changing them.
- **WarpText island** - statement copy, lens mode, warp colours and pointer behaviour live in `src/warp-text/entry.jsx`; run `npm run build` after changing them.
- **ElasticMesh island** - the 404 copy, material, inflate and wobble props live in `src/elastic-mesh/entry.jsx`; run `npm run build` after changing them.
- **HalftoneReveal island** - the kart photo, screen mode, ink and paper colours and reveal behaviour live in `src/halftone-reveal/entry.jsx`; run `npm run build` after changing them.
- **PixelSwap island** - the hero photographs, pattern, pixel size, timing and accessible label live in `src/pixel-swap/entry.jsx`; run `npm run build` after changing them.
- **AnimatedContent island** - the policy card copy mirrors the no-JS fallback in `index.html`; the stagger and entrance props live in `src/animated-content/entry.jsx`; run `npm run build` after changing them.
- **TargetCursor island** - reticle size, colour, spin timing and target selector live in `src/target-cursor/entry.jsx`; action labels live on the target elements in `index.html`; run `npm run build` after changing them.
- **MetallicPaint island** - the footer monogram text, font, metal tint, density, dispersion, edge bend and tilt live in `src/metallic-paint/entry.jsx`; run `npm run build` after changing them.
- **Ribbons island** - the footer trail colours, thickness, length, spread, spring, wave and opacity live in `src/ribbons/entry.jsx`; run `npm run build` after changing them.

Design tokens (colour, type, spacing) are CSS custom properties at the top of the `<style>` block. Dark mode is a `data-theme="dark"` attribute on `<html>`.

---

## Accessibility and motion

- Keyboard support for the plan tabs, kart panel, menu, dialogs and FAQ.
- Visible focus rings, skip link, semantic landmarks and labelled controls.
- `aria-live` announcements for price changes, kart updates and toast messages.
- All decorative SVG is hidden from assistive technology; illustrative images carry descriptive `alt` text.
- Continuous animation, reveals and counters respect `prefers-reduced-motion`; all sixteen islands reduce or stop their continuous motion.

## A note on payment

This project intentionally does **not** integrate a payment provider. There are no card fields, no checkout and no third-party payment SDKs. Requests are reviewed and confirmed by the tutor, then paid by cash or Zelle directly.

---

## License

MIT © 2026 Buttergod. See [LICENSE](LICENSE).

The FlyingButton, FluxLines, PatternWaves, TechText, TextLoop, MaskedHeading, ParticleText, SplitFlapText, WarpText, ElasticMesh, HalftoneReveal, AnimatedContent, PixelSwap, TargetCursor and MetallicPaint islands are adapted from React Bits by David Haz under the MIT + Commons Clause licence. PatternWaves and WarpText also bundle `ogl` 1.0.11 under the Unlicense, and TextLoop, MaskedHeading and AnimatedContent bundle GSAP 3.15.1 under the GSAP Standard "No Charge" License. The full notices are in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

## Motion layer and extra pages

The main site ships as plain HTML, CSS and JavaScript with no build step. The exceptions are the optional FlyingButton, FluxLines, PatternWaves, TechText, TextLoop, MaskedHeading, ParticleText, SplitFlapText, WarpText, ElasticMesh, HalftoneReveal, AnimatedContent, PixelSwap, TargetCursor and MetallicPaint islands, built from `src/flying-button/`, `src/flux-lines/`, `src/pattern-waves/`, `src/tech-text/`, `src/text-loop/`, `src/masked-heading/`, `src/particle-text/`, `src/split-flap-text/`, `src/warp-text/`, `src/elastic-mesh/`, `src/halftone-reveal/`, `src/animated-content/`, `src/pixel-swap/` and `src/target-cursor/` into their generated JS and CSS files. `enhance.css` and
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

- `about.html`: the tutor bio, experience in plain terms, and the Person schema used for authorship.
- `privacy.html`: privacy policy, children's data, retention and privacy rights.
- `terms.html`: terms and conditions, payment, attendance, liability and Virginia law.
- `cookies.html`: no cookies are set; the two functional browser-storage keys.
- `refunds.html`: cancellation, tutor cancellations and how to request a refund.
- `thanks.html`: what happens after a request is sent (noindex).
- `404.html`: a branded off-circuit page.
- `robots.txt`, `sitemap.xml` and `llms.txt`.
- `og-image.jpg`, `og-terms.jpg` and `og-credits.jpg`: 1200x630 social share cards,
  cropped from the hero photograph and referenced by the Open Graph and Twitter tags.
- `site.webmanifest`: web app name, colours and installable icons.
- `credits.html`: photograph attribution and licence details.

There is no analytics, advertising pixel or cookie on the site. Web fonts are self-hosted
and hosting logs come from GitHub Pages. Reviews and a team photograph are
not published because neither exists yet; the site does not invent them.
