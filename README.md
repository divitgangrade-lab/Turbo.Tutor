# TurboTutor

The security model, audit results and residual risks are documented in `SECURITY.md`.

**1:1 tutoring at full throttle.** A fast, F1-inspired marketing site for one-to-one Math, English and Science tutoring for Grades 1–8.

The site is a set of static HTML pages with no backend of its own and no online payment. Thirty-nine small Preact islands, ClickSpark, FlyingButton, FluxLines, PatternWaves, TechText, TextLoop, MaskedHeading, ParticleText, SplitFlapText, FluidGlass, ElasticMesh, HalftoneReveal, AnimatedContent, PixelSwap, TargetCursor, Ribbons, AcidSquares, LiquidEther, Silk, Lightfall, DecayCard, Plasma, GridScan, DotField, Iridescence, Waves, GridMotion, FallingText, PaperCrumple, PeekRating, LegalBackground, Topography, SmoothScroll, ShaderAnimation, HeroCar, AnimatedList, ScrollStack, MagicBento and CircularGallery, are bundled locally with esbuild; most load near the viewport, while the hero PixelSwap, the AcidSquares backdrop and the ClickSpark tap layer load after first paint, LiquidEther loads as the plans section approaches, Silk loads as the special coaching section approaches, Lightfall loads as the steps section approaches, DecayCard loads as the promise section approaches, Plasma loads as the optional offer section approaches, GridScan loads as the pit-lane warm-up section approaches, DotField loads as the session walkthrough approaches, Iridescence loads as the attendance and support section approaches, Waves loads as the contact section approaches, GridMotion loads as the FAQ approaches, and FallingText, PaperCrumple and the PeekRating pit wall load as the footer approaches. The seven legal pages load their shared background island once the page is idle. The numbers rail, the statement band, the about page and the thanks page load a lighter Topography landscape as they approach. Their generated files are committed, so the rest of the site still runs without a build. Visitors configure a plan, add it to a **kart**, and send the request by email or text. The tutor confirms everything directly.

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
- builds a complete request with every selection, the discount applied and the estimated total.

No payment is collected anywhere on the site.

### Offers
- A canvas prize wheel with published odds and a 30-day saved result (`localStorage`, with `sessionStorage` fallback).
- Seasonal offers that rotate by date: Season Opener, Back-to-School Grand Prix, Diwali Night Race, Thanksgiving Sprint and Season Finale.

### Paddock Club newsletter
A signup panel below the launch section offers **5% off the first month** (code `PADDOCK5`) and one short email most Mondays about new session openings, study notes and occasional offers. The form is intentionally email-only: `enhance.js` checks the address and the privacy consent, then sends the signup directly to the tutor's inbox through FormSubmit. The address is not stored in the browser.

The code is shown after the signup sends. The tutor adds the address to the list and sends the welcome note; replying to any club email removes the subscriber. If FormSubmit is unavailable or the address has not been activated yet, the form falls back to a prefilled email link and the tutor's text number, so the signup still arrives. The form uses FormSubmit's public endpoint, so no newsletter API key is kept in the repository. FormSubmit requires one activation click from the tutor inbox before the first message can be delivered.

### Pit wall reviews

The footer pit wall posts a star rating and public note to a small review API at `https://site-bc52dc6774bc4028a0be827c85de9df2.freebuff.page/api/reviews`. Its source and Sites manifest are in `reviews-api/`; reviews are stored in Cloudflare D1 and the latest five are shown to every visitor. The endpoint is intentionally public and anonymous, and it validates the rating, note length and JSON shape before writing.

### Twin Hickory Library
In-person laps meet at **Twin Hickory Library** in Henrico County. The plan section carries a large bordered card linking to the library's room-booking page (`https://henricolibrary-va.libcal.com/spaces?lid=6277`), and the FAQ and contact panel link there too.

### Everything else
- Sticky header with scroll progress, active-section highlighting and a theme toggle.
- Scroll-reveal animations, animated counters, a looping ticker, magnetic buttons and SVG wheel animations - all disabled automatically under `prefers-reduced-motion`.
- A contained FlyingButton launch pad between the offers wheel and the Paddock Club. The rounded button is themed in the site red with amber thrust, sits on a light track instead of a dark panel, and tapping it flies the button upward while the page glides to the plans section over two seconds. It loads only as it approaches the viewport, keeps a plain fallback link, and jumps straight to the plans under `prefers-reduced-motion`.
- A FluxLines fluid-line backdrop behind the pit-wall promise. It loads only near the viewport, sits behind the copy, and stays still under `prefers-reduced-motion`.
- A PatternWaves silk-dot surface behind the Paddock Club panel. It loads on approach and stays quiet enough for the signup form.
- A TechText footer wordmark. It lazy-loads near the end of the page and lets visitors reveal dashed letter outlines, drag letters and send a small kick through the wordmark.
- A TextLoop subject ribbon between the plans and special coaching. It lazy-loads near the viewport, scrolls the subject list along a yellow wave, pauses on hover and stays still under `prefers-reduced-motion`.
- A MaskedHeading promise title. It replaces the static "Every lap counts." heading with a helmet-filled lettering treatment when the island loads, keeping the plain heading as the no-JS fallback.
- A ParticleText footer watermark. It fills the footer background with a subtle particle-built "TURBO TUTOR" wordmark, forming when the footer approaches the viewport. It is decorative, kept out of the accessibility tree, and paused when the footer is off screen.
- A SplitFlapText launch board above the launch heading. It cycles through "PLANS READY", "ZOOM ONLINE" and "KART OPEN" with mechanical flap tiles, keeps the static "Pit lane warm-up" kicker as its no-JS fallback, and respects reduced motion.
- Added the React Bits **CircularGallery** to the homepage: a draggable WebGL2 arc of the site's three real photographs, with grayscale-by-default frames that colour on hover or open, keyboard and wheel support, and auto-drift that stops when you interact. The section keeps a plain three-photo grid when WebGL2 is unavailable.
- A FluidGlass statement band before the contact section. A real glass lens floats over "Learning in the fast lane", bending the words as it follows the cursor, and it melts into a drop or a pill when clicked. It keeps a hidden heading and static fallback, and pauses when it is off screen.
- An ElasticMesh 404 visual. The decorative code block on `404.html` becomes a drag-and-poke 404 balloon, with the original code block retained as its no-JS fallback.
- A scattered F1 card band on the 404 page. Five framed photos and illustrations sit below the 404 copy at slight angles, straightening on hover and dropping the smallest card on phones.
- A HalftoneReveal kart print. The go-kart photo in the kart panel becomes an interactive halftone print, loads only when the kart is first opened, and keeps the original photo as its fallback.
- A PixelSwap hero photograph. Hovering or focusing the Formula 1 hero swaps in the kart photo with a pixel wave, while the plain photograph remains as the LCP and no-JS fallback.
- A Three.js hero car. The **3D view** button on the hero photograph opens a stylised low-poly Formula 1 car built from primitives, with drag-to-spin and a slow turntable. It renders only while open, pauses when offscreen or when the tab is hidden, and holds a single frame for reduced-motion visitors. The photograph stays as the LCP and no-JS fallback.
- An AcidSquares hero backdrop. A dark, red-lit WebGL surface of raised tiles moves slowly behind the hero copy and Formula 1 photograph. It loads after first paint, uses a lighter mesh on small screens, and is skipped entirely for reduced-motion visitors or browsers without WebGL2.
- A LiquidEther course-garage backdrop. A slow red and amber ink flow drifts behind the plan builder, follows the pointer gently, and switches between soft ink on light and luminous flow on dark. It loads only near the plans section and is skipped for reduced-motion visitors or browsers without WebGL2 float targets.
- A ShaderAnimation loading overlay. The supplied concentric-ring shader fills the first page load and same-site navigation with slow rings of red, green and blue, drawn at a capped pixel ratio so it stays light. It stays visible long enough to read the motion, then fades; reduced-motion visitors get a single still ring pattern.
- A Lenis smooth-scroll layer. Wheel and trackpad scrolling glides with a short ease, anchor links land below the sticky header, and reduced-motion visitors keep native scrolling.
- A Silk special-coaching backdrop. Pale warm folds drift behind the advanced-program cards in light mode, shifting to a darker amber-sheened fabric in dark mode. It follows the pointer gently, fades at the edges, loads only near the section, and is skipped for reduced-motion visitors or browsers without WebGL2.
- A Lightfall steps backdrop. Thin red and amber light streaks fall through a dark tunnel behind the three-step explanation. The cursor bends the light like a lens and brightens nearby streaks, while the effect fades at the edges, loads only near the section, and is skipped for reduced-motion visitors or browsers without WebGL2.
- A DecayCard promise helmet. The helmet photo tears and settles around the edges as the pointer moves over it, with a slow idle fray. The original photo remains as the no-JS and no-WebGL fallback, and the island loads only near the promise section.
- A Plasma welcome-offer backdrop. Slow amber plasma folds drift behind the optional-offer copy and wheel, softening at the edges and turning gently toward the pointer. It loads only near the offers section and is skipped for reduced-motion visitors or browsers without WebGL2.
- A GridScan pit-lane backdrop. A dim 3D wireframe room sits behind the warm-up copy and launch pad, with a slow scan, small wall points and a click ping. It follows the pointer, switches between warm red and amber with the theme, loads only near the section, and is skipped for reduced-motion visitors or browsers without WebGL2.
- A DotField walkthrough backdrop. A slow grid of red and amber dots drifts behind the 45-minute lap breakdown, with a soft lens around the pointer and a few twinkling points. The run sheet stays on a lightly tinted panel, and the island loads only near the section.
- An Iridescence attendance backdrop. A slow field of cool light folds sits behind the attendance and support terms and deepens into ink at the edges. The section uses a dark glass surface, amber figures and restrained type so the policy cards stay the focus. It loads only near the section and is skipped for reduced-motion visitors or browsers without WebGL2.
- A Waves contact backdrop. Soft teal contour lines drift behind the contact panel, bending gently with the pointer and parting in a quiet ripple on a click. The white contact cards remain above the moving lines, and the island is skipped for reduced-motion visitors or browsers without WebGL2.
- A GridMotion FAQ photo wall. A slow alternating wall of the local F1 car, helmet, kart race, Monaco circuit and pit garage images moves behind the Before the start section under a soft cream veil. The questions and search stay readable above it, and the wall is skipped for reduced-motion visitors.
- An AnimatedContent policy grid. The three attendance cards enter in sequence when the section approaches the viewport, while the plain cards remain as the no-JS fallback.
- A TargetCursor reticle. On fine-pointer devices it follows the pointer, locks onto links, buttons, fields and the hero swap, and shows short labels on key actions. It skips touch and reduced-motion visitors, and the native cursor stays when the island is unavailable.
- A ClickSpark tap layer. A click or tap sends a short amber, red and bone spark burst across the pointer, and keyboard activation sparks from the focused control. Each burst is drawn on a viewport-clipped canvas that is removed when it finishes, the layer never intercepts pointer events, and reduced-motion visitors get no sparks at all.
- A FallingText footer statement. The pit-wall line scatters into a small physics pile when tapped, pieces can be dragged and thrown, and it flies back into place a few seconds after the pointer leaves. It loads only near the footer and is skipped for reduced-motion visitors.
- A PaperCrumple footer pit note. The helmet photograph crumples while held, can be dragged, and keeps soft creases after release; dropping it over the PIT BIN sends it into the bin and regenerates it in place. The original photo is the no-JS and no-WebGL fallback, and the island loads only near the footer.
- A PeekRating pit-wall rating. Five stars preview, lift and pop, and a short note with a round send button posts the lap: the stars break and drop into a small F1 car, the car leaves with a thank-you, and the saved note appears below. Reviews are stored in the shared pit-wall database and shown to every visitor; reduced-motion visitors get a plain confirmation instead of the animation.
- A Ribbons footer trail. Amber, red and bone ribbons trail the pointer across the footer as the footer approaches the viewport. It runs only on fine-pointer devices with motion allowed, and the footer reads the same without it.
- Searchable FAQ, policy cards, contact cards with copy-to-clipboard, and a fully validated request dialog.
- Responsive down to small phones, with a mobile menu and a full-width kart panel.

## Metadata, sharing and discovery

- Every page has one `h1`, a unique title and description, a self-referencing canonical URL where it is indexable, and a complete Open Graph and Twitter card.
- Three 1200x630 JPEG share cards cover the home page, terms and photo credits.
- JSON-LD covers the tutoring business and its offer catalogue, the website, each indexable page, the FAQ and breadcrumbs on the subpages.
- Canonical URLs and the sitemap use extensionless paths such as `/about`, not `/about.html`. Internal navigation keeps the `.html` form so the local preview server resolves it; GitHub Pages serves both and the canonical consolidates the duplicate.
- `sitemap.xml`, `robots.txt` and `llms.txt` describe the public pages. `site.webmanifest` and the PNG/ICO icons cover browser tabs, home screens and installable web apps.
- `thanks.html` and `404.html` are marked `noindex,follow` and are deliberately excluded from the sitemap.
- `npm run seo` validates titles, descriptions, heading order, canonicals, sitemap coverage, image alt attributes, JSON-LD, internal links and anchors.
- `seo/search-console.md` lists the verification, sitemap and HTTPS steps; `seo/backlink-strategy.md` holds the local citation and outreach plan. The `seo/` folder is excluded from the published site.

## Custom domain

The site is served at `https://turbotutor.dpdns.org/`, and the repository's `CNAME` file contains that exact host. GitHub Pages reads it on every deploy. The shared pit wall is a separate deployment at `https://site-bc52dc6774bc4028a0be827c85de9df2.freebuff.page`; it is not the site's custom domain.

To move to another domain:

1. Replace the contents of `CNAME` with the new host, such as `www.example.com`.
2. Point the domain at GitHub Pages using GitHub's published A and AAAA records for an apex domain, or a CNAME to `divitgangrade-lab.github.io` for `www`.
3. Set the same custom domain in the repository's Pages settings and enable HTTPS.
4. Update every absolute URL in `index.html`, `privacy.html`, `terms.html`, `cookies.html`, `refunds.html`, `eula.html`, `dmca.html`, `credits.html`, `404.html`, `thanks.html`, `sitemap.xml`, `robots.txt` and `llms.txt`.
5. Keep `CNAME` in the repository; removing it drops the custom domain.

## Security and privacy

- The static pages have no accounts, no payment code and no server sessions. The pit wall uses a separate review API backed by Cloudflare D1; its public endpoint is intentionally anonymous and contains only public star ratings and notes.
- Every HTML page carries a meta Content Security Policy and a `strict-origin-when-cross-origin` referrer policy. GitHub Pages cannot send HSTS, `X-Frame-Options` or `X-Content-Type-Options` as response headers; `SECURITY.md` records that limit.
- Forms validate locally and then post to FormSubmit.co, which forwards them to the tutor's inbox. Nothing is posted to this origin, and the site stores no form data.
- No analytics, advertising pixels, third-party embeds or cookies. Browser storage is limited to the theme choice and the saved offer.
- `_config.yml` keeps source, build tooling and package files out of the published GitHub Pages site.

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
├── privacy.html            # Privacy policy and data rights
├── terms.html              # Terms, payment and attendance
├── cookies.html            # Cookie-free storage explanation
├── refunds.html            # Cancellation and refund policy
├── eula.html               # Licence for worksheets and session materials
├── dmca.html               # Copyright notices and counter-notices
├── credits.html            # Photo attribution and licences
├── thanks.html             # Post-request confirmation (noindex)
├── 404.html                # Branded not-found page
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
├── fluid-glass.js          # Generated FluidGlass statement-band island
├── fluid-glass.css         # Generated FluidGlass and statement-band styles
├── elastic-mesh.js         # Generated lazy island (Preact + ElasticMesh)
├── elastic-mesh.css        # Generated ElasticMesh styles
├── halftone-reveal.js      # Generated lazy island (Preact + HalftoneReveal)
├── halftone-reveal.css     # Generated HalftoneReveal styles
├── animated-content.js     # Generated lazy island (Preact + AnimatedContent + GSAP)
├── animated-content.css    # Generated AnimatedContent styles
├── pixel-swap.js           # Generated hero island (Preact + PixelSwap)
├── hero-car.js             # Generated hero 3D car island (Three.js)
├── hero-car.css            # Generated hero 3D car styles
├── animated-list.js        # Generated lap-pack list island (Preact + Hugeicons)
├── animated-list.css       # Generated AnimatedList and lap-pack styles
├── scroll-stack.js         # Generated term stack island (Preact + ScrollStack)
├── scroll-stack.css        # Generated ScrollStack and term stack styles
├── magic-bento.js          # Generated standard-kit bento island (Preact + Hugeicons)
├── magic-bento.css         # Generated MagicBento and standard-kit styles
├── circular-gallery.js     # Generated real-photographs gallery island (WebGL2)
├── circular-gallery.css    # Generated CircularGallery and gallery-section styles
├── pixel-swap.css          # Generated PixelSwap styles
├── target-cursor.js        # Generated cursor island (Preact + TargetCursor)
├── ribbons.js              # Generated footer island (Preact + Ribbons)
├── acid-squares.js         # Generated hero backdrop island (Preact + AcidSquares)
├── acid-squares.css        # Generated AcidSquares styles
├── liquid-ether.js         # Generated plans backdrop island (Preact + LiquidEther)
├── liquid-ether.css        # Generated LiquidEther styles
├── silk.js                 # Generated special-coaching backdrop island (Preact + Silk)
├── silk.css                # Generated Silk styles
├── lightfall.js            # Generated steps backdrop island (Preact + Lightfall)
├── lightfall.css           # Generated Lightfall styles
├── decay-card.js           # Generated promise helmet island (Preact + DecayCard)
├── decay-card.css          # Generated DecayCard styles
├── plasma.js               # Generated optional-offer backdrop island (Preact + Plasma)
├── plasma.css              # Generated Plasma styles
├── grid-scan.js            # Generated pit-lane backdrop island (Preact + GridScan)
├── grid-scan.css           # Generated GridScan styles
├── dot-field.js            # Generated walkthrough backdrop island (Preact + DotField)
├── dot-field.css           # Generated DotField styles
├── iridescence.js          # Generated attendance backdrop island (Preact + Iridescence)
├── iridescence.css         # Generated Iridescence styles
├── waves.js                # Generated contact backdrop island (Preact + Waves)
├── waves.css               # Generated Waves styles
├── grid-motion.js          # Generated FAQ photo wall island (Preact + GridMotion)
├── grid-motion.css         # Generated GridMotion styles
├── falling-text.js         # Generated footer statement island (Preact + FallingText)
├── falling-text.css        # Generated FallingText styles
├── paper-crumple.js        # Generated footer pit note island (Preact + PaperCrumple)
├── paper-crumple.css       # Generated PaperCrumple styles
├── pit-rating.js           # Generated footer rating island (Preact + PeekRating)
├── pit-rating.css          # Generated PeekRating and pit-wall styles
├── island-chunks/          # Shared GSAP and Preact code loaded once for all islands
├── target-cursor.css       # Generated TargetCursor styles
├── click-spark.js          # Generated tap-spark island (Preact + ClickSpark)
├── click-spark.css         # Generated ClickSpark styles
├── package.json            # Build script for the islands
├── package-lock.json       # Locked build tool versions
├── CNAME                   # GitHub Pages custom domain
├── reviews-api/            # Shared pit-wall Worker, D1 schema and Sites manifest
├── SECURITY.md             # Security model and audit results
├── _config.yml             # Files GitHub Pages must not publish
├── enhance.js              # Shared motion, forms and UI behaviour
├── enhance.css             # Shared enhancement styles
├── legal.css               # Legal page styles
├── legal-scene.css         # Legal page background, panel and falling-chip styles
├── legal-bg.js             # Generated legal background island (Topography + FallingText)
├── legal-bg.css            # Generated topography and falling text styles
├── fonts.css               # Self-hosted font faces
├── fonts/                  # Self-hosted WOFF2 files and OFL licences
├── scripts/                # esbuild build script for all thirty-nine islands
├── src/flying-button/      # FlyingButton source and mount entry
├── src/flux-lines/         # FluxLines source and mount entry
├── src/pattern-waves/      # PatternWaves source and mount entry
├── src/tech-text/          # TechText source and mount entry
├── src/text-loop/          # TextLoop source and mount entry
├── src/masked-heading/     # MaskedHeading source and mount entry
├── src/particle-text/      # ParticleText source and mount entry
├── src/split-flap-text/    # SplitFlapText source and mount entry
├── src/fluid-glass/        # FluidGlass source, styles and mount entry
├── src/elastic-mesh/       # ElasticMesh source and mount entry
├── src/halftone-reveal/    # HalftoneReveal source and mount entry
├── src/animated-content/   # AnimatedContent source and mount entry
├── src/target-cursor/      # TargetCursor source and mount entry
├── src/click-spark/        # ClickSpark source and mount entry
├── src/shader-animation/   # ShaderAnimation source and loader entry
├── src/pixel-swap/         # PixelSwap source and mount entry
├── src/hero-3d/            # Three.js hero car source and styles
├── src/animated-list/      # AnimatedList source, styles and mount entry
├── src/scroll-stack/       # ScrollStack source, styles and mount entry
├── src/magic-bento/        # MagicBento source, styles and mount entry
├── src/circular-gallery/   # CircularGallery source, styles and mount entry
├── src/ribbons/            # Ribbons source and mount entry
├── src/acid-squares/       # AcidSquares source and mount entry
├── src/liquid-ether/       # LiquidEther source and mount entry
├── src/silk/               # Silk source and mount entry
├── src/lightfall/          # Lightfall source and mount entry
├── src/decay-card/         # DecayCard source and mount entry
├── src/plasma/             # Plasma source and mount entry
├── src/grid-scan/          # GridScan source and mount entry
├── src/dot-field/          # DotField source and mount entry
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

No runtime dependencies for the static site. The separate review API is a small Worker with no third-party runtime dependencies. The thirty-nine optional islands, ClickSpark, FlyingButton, FluxLines, PatternWaves, TechText, TextLoop, MaskedHeading, ParticleText, SplitFlapText, FluidGlass, ElasticMesh, HalftoneReveal, AnimatedContent, PixelSwap, TargetCursor, Ribbons, AcidSquares, LiquidEther, Silk, Lightfall, DecayCard, Plasma, GridScan, DotField, Iridescence, Waves, GridMotion, FallingText, PaperCrumple, PeekRating, ShaderAnimation, HeroCar, AnimatedList, ScrollStack, MagicBento, CircularGallery, LegalBackground, Topography and SmoothScroll, are built with esbuild and Preact, and their generated JS and CSS are committed. GSAP is bundled into the TextLoop, MaskedHeading and AnimatedContent islands, and three.js is bundled into the hero car and the footer islands. Barlow Condensed, Chakra Petch and Titillium Web are self-hosted, so the static pages make no third-party font requests; so the static pages make no third-party font or asset requests; the forms are contacted only when you submit, and the footer pit wall fetches its public review list when it approaches the viewport.

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

The generated islands are already committed, so serving the folder needs no build. Only rebuild them after editing `src/flying-button/`, `src/flux-lines/`, `src/pattern-waves/`, `src/tech-text/`, `src/text-loop/`, `src/masked-heading/`, `src/particle-text/`, `src/split-flap-text/`, `src/fluid-glass/`, `src/elastic-mesh/`, `src/halftone-reveal/`, `src/animated-content/`, `src/pixel-swap/`, `src/target-cursor/`, `src/click-spark/`, `src/ribbons/`, `src/acid-squares/`, `src/liquid-ether/`, `src/shader-animation/`, `src/hero-3d/`, `src/animated-list/`, `src/scroll-stack/`, `src/magic-bento/`, `src/circular-gallery/`, or their props:

```bash
npm ci
npm run build
```

`npm ci` uses the committed lockfile; use `npm install` only when changing dependencies. `package.json` also records esbuild's postinstall in `allowScripts`, because npm blocks dependency install scripts by default and esbuild needs that step to install its platform binary. There is no separate linter or test suite. `npm run build` bundles all thirty-nine islands, and the local server command above checks that the folder serves.

---

## Customising

Almost everything lives in the `<script>` block at the bottom of `index.html`:

- **Rates** - `gradeBaseRates`, `subjectPremiums`, `deliveryPremiums`, `durationMultipliers`, `termDetails`.
- **Special programs** - the `data-base-price` attribute on each `[data-specialty]` card, plus the card copy in the Specialty section.
- **Contact details** - `tutorEmail`, `tutorPhone`, `formEndpoint`, and the matching fallback `href`s in the contact section and request form.
- **Offers** - the `deals` array (labels and weights) next to `drawDealWheel()`, and `getSeasonSchedule()` for seasonal offers.
- **FlyingButton island** - props and the label live in `src/flying-button/entry.jsx`; run `npm run build` after changing them.
- **FluxLines island** - colours and visual props live in `src/flux-lines/entry.jsx`; run `npm run build` after changing them.
- **PatternWaves island** - preset, colour, opacity and interaction props live in `src/pattern-waves/entry.jsx`; run `npm run build` after changing them.
- **TechText island** - wording, font size, colours and interaction props live in `src/tech-text/entry.jsx`; run `npm run build` after changing them.
- **TextLoop island** - wording, shape, ribbon colour and speed live in `src/text-loop/entry.jsx`; run `npm run build` after changing them.
- **MaskedHeading island** - heading copy, media source, reveal and spotlight props live in `src/masked-heading/entry.jsx`; run `npm run build` after changing them.
- **ParticleText island** - watermark wording, particle density, colours and motion props live in `src/particle-text/entry.jsx`; run `npm run build` after changing them.
- **SplitFlapText island** - board phrases, timing, colours and tile styling live in `src/split-flap-text/entry.jsx`; run `npm run build` after changing them.
- **FluidGlass island** - statement copy, lens shape, refraction, dispersion and pointer behaviour live in `src/fluid-glass/entry.jsx`; the band height comes from `index.html`; run `npm run build` after changing them.
- **ElasticMesh island** - the 404 copy, material, inflate and wobble props live in `src/elastic-mesh/entry.jsx`; run `npm run build` after changing them.
- **HalftoneReveal island** - the kart photo, screen mode, ink and paper colours and reveal behaviour live in `src/halftone-reveal/entry.jsx`; run `npm run build` after changing them.
- **PixelSwap island** - the hero photographs, pattern, pixel size, timing and accessible label live in `src/pixel-swap/entry.jsx`; run `npm run build` after changing them.
- **AnimatedContent island** - the policy card copy mirrors the no-JS fallback in `index.html`; the stagger and entrance props live in `src/animated-content/entry.jsx`; run `npm run build` after changing them.
- **TargetCursor island** - reticle size, colour, spin timing and target selector live in `src/target-cursor/entry.jsx`; action labels live on the target elements in `index.html`; run `npm run build` after changing them.
- **ClickSpark island** - spark colours, size, radius, count, duration, easing, randomness and glow live in `src/click-spark/entry.jsx`; run `npm run build` after changing them.
- **Ribbons island** - the footer trail colours, thickness, length, spread, spring, wave and opacity live in `src/ribbons/entry.jsx`; run `npm run build` after changing them.
- **AcidSquares island** - the hero tile colours, lighting, motion, density and opacity live in `src/acid-squares/entry.jsx`; run `npm run build` after changing them.
- **LiquidEther island** - the plan backdrop colours, flow, pointer force, persistence and resolution live in `src/liquid-ether/entry.jsx`; run `npm run build` after changing them.
- **Silk island** - the special-coaching fabric colours, fold depth, sheen, motion, edge fade and resolution live in `src/silk/entry.jsx`; run `npm run build` after changing them.
- **Lightfall island** - the steps backdrop colours, streak count, fall speed, cursor lens, bloom and resolution live in `src/lightfall/entry.jsx`; run `npm run build` after changing them.
- **DecayCard island** - the promise helmet image, tear intensity, grain, idle drift, hover decay, travel, tilt and scope live in `src/decay-card/entry.jsx`; run `npm run build` after changing them.
- **Plasma island** - the optional-offer plasma colour, speed, twist, softness, shine, brightness, quality, fade and opacity live in `src/plasma/entry.jsx`; run `npm run build` after changing them.
- **GridScan island** - the pit-lane room colours, grid density, depth, scan speed, trail, glow, pointer parallax and theme colours live in `src/grid-scan/entry.jsx`; run `npm run build` after changing them.
- **DotField island** - the walkthrough dot colours, spacing, pattern, pointer lens, glow, wave, sparkle, speed and opacity live in `src/dot-field/entry.jsx`; run `npm run build` after changing them.
- **Iridescence island** - the attendance section colour, fold detail, warp, hue, saturation, brightness, pointer response, edge fade and resolution live in `src/iridescence/entry.jsx`; run `npm run build` after changing them.
- **Waves island** - the contact line colour, spacing, width, amplitude, twist, speed, pointer response, edge fade and opacity live in `src/waves/entry.jsx`; run `npm run build` after changing them.
- **GridMotion island** - the FAQ image set, row count, speed, direction, angle, tile shape, spotlight, dim, fade and veil live in `src/grid-motion/entry.jsx`; run `npm run build` after changing them.
- **FallingText island** - the footer statement copy, highlight words, drop order, gravity, bounce, scatter and restore delay live in `src/falling-text/entry.jsx`; run `npm run build` after changing them.
- **PaperCrumple island** - the pit-note image, fold count, sharpness, wrinkle depth, crease strength, lighting and scene height live in `src/paper-crumple/entry.jsx`; run `npm run build` after changing them.
- **PeekRating island** - the footer rating labels, star colours, size and the car timing live in `src/pit-rating/entry.jsx`; run `npm run build` after changing them.

- **AnimatedList island** - the lap-pack rows, icons and status copy live in `src/animated-list/entry.jsx`; the Hugeicons row icons and the site palette overrides live alongside it; run `npm run build` after changing them.
- **ScrollStack island** - the four term checkpoints, stack spacing and card copy live in `src/scroll-stack/entry.jsx`; the palette and section layout live in `src/scroll-stack/term-stack.css`; run `npm run build` after changing them.
- **MagicBento island** - the four standard-kit tiles, icons and glow colour live in `src/magic-bento/entry.jsx`; the palette overrides and fallback cards live in `src/magic-bento/included-bento.css`; run `npm run build` after changing them.
- **CircularGallery island** - the three photographs, titles and captions live in `src/circular-gallery/entry.jsx`; the section palette and static fallback live in `src/circular-gallery/site-gallery.css`; run `npm run build` after changing them.

Design tokens (colour, type, spacing) are CSS custom properties at the top of the `<style>` block. Dark mode is a `data-theme="dark"` attribute on `<html>`.

---

## Accessibility and motion

- Keyboard support for the plan tabs, kart panel, menu, dialogs and FAQ.
- Visible focus rings, skip link, semantic landmarks and labelled controls.
- `aria-live` announcements for price changes, kart updates and toast messages.
- All decorative SVG is hidden from assistive technology; illustrative images carry descriptive `alt` text.
- One skip link, WCAG AA contrast for text on flat surfaces, and underlined inline links in the footer so colour is never the only cue.
- Continuous animation, reveals and counters respect `prefers-reduced-motion`; all thirty-nine islands reduce or stop their continuous motion.

## Changelog

### November 2026 polish pass

- Added the React Bits **MagicBento** standard-kit grid after the plan builder: four tiles — one-to-one, Grades 1–8, Zoom or library, written recap — with cursor-following border glow, a spotlight, staggered intro and a light click wave. It keeps a static four-card grid as the no-JS fallback, lazy-loads near the section, and respects reduced motion.
- Added the React Bits **CircularGallery** to the homepage: a draggable WebGL2 arc of the site's three real photographs, with grayscale-by-default frames that colour on hover or open, keyboard and wheel support, and auto-drift that stops when you interact. The section keeps a plain three-photo grid when WebGL2 is unavailable.
- Added the React Bits **ScrollStack** term section after the three-step explanation: four checkpoint cards — diagnose, build, apply, review — pin and stack as the page scrolls, dimming and scaling the buried cards. It uses window scrolling without its own wheel handling so Lenis stays in charge, keeps a static card list as the no-JS fallback, and lazy-loads near the section.
- Added the React Bits **AnimatedList** lap pack below the 45-minute run sheet: five rows covering the plan, practice set, worked notes, progress note and next-lap plan, with Hugeicons row icons, hover and arrow-key selection, a spring selection ring, scroll-in pop animation, and a plain fallback list for no-JS visitors. It lazy-loads near the section and respects reduced motion.
- Added the React Bits **CircularGallery** to the homepage: a draggable WebGL2 arc of the site's three real photographs, with grayscale-by-default frames that colour on hover or open, keyboard and wheel support, and auto-drift that stops when you interact. The section keeps a plain three-photo grid when WebGL2 is unavailable.
- Added a **Three.js hero car**: a 3D view control opens a stylised low-poly Formula 1 car over the hero photograph, which stays as the LCP and no-JS fallback. The car renders only while open, pauses offscreen, and spins with the pointer.
- Hardened the Paddock Club signup and centred its consent checkbox: a failed FormSubmit call now offers a prefilled email to the tutor plus the text number, instead of only an error, and the privacy checkboxes line up with their notes in the request, contact and club forms.
- Made the pit-note helmet droppable into the **PIT BIN**: the bin slides in while the helmet is held, releasing it over the bin sends it in and regenerates the helmet after the swallow, and the same bin now also animates when a request is sent.
- Removed the duplicate skip link from the home page so keyboard visitors get one clear target.
- Added the React Bits **ClickSpark** tap layer: a short amber, red and bone spark burst on pointer and keyboard activation, drawn on viewport-clipped canvases that remove themselves when finished. The layer is inert to pointer events, hidden from assistive technology, capped at 16 concurrent bursts and disabled under `prefers-reduced-motion`.
- Replaced the polished-metal LiquidChrome loader with the supplied **ShaderAnimation** ring shader, adapted into the existing Preact island build so the loader adds no Three.js payload. It renders at a capped pixel ratio, pauses while the overlay is hidden, and freezes to one frame for reduced-motion visitors. The pit-wall reviews moved onto the shared D1 API in the same pass.
- Gave the kart panel `role="dialog"`, `aria-modal="true"` and `inert` while closed, added a Tab focus loop inside the open panel, fixed the close transition so the panel is visible immediately on open and still animates shut, and restored focus to the kart button when it closes.
- Raised contrast on the walkthrough step numbers, the contact reply promise and the Twin Hickory directions link, and underlined the footer licence and photo-credit links so they no longer rely on colour alone.
- Fixed an ARIA defect on the highlights ticker (`aria-label` on a plain `div`).
- Restored the plans section to the light surface its ink and cards were designed for and removed the inherited 9px white text glow that made the setup picker, prices and plan copy look blurred. Dark mode now also resets the section's muted colour so its small labels stay legible.
- Verified with axe-core (WCAG 2.0/2.1 A and AA): zero violations on the home page and a representative legal page.
- `npm audit` reports zero vulnerabilities; `npm run seo` and the page audit pass across all 11 pages.

### Security review

- No committed secrets, API keys or `.env` files were found. The newsletter posts to FormSubmit's public endpoint and the review API keeps no key in the repository.
- No mixed content: every asset is same-origin HTTPS or an explicit HTTPS link. External `target="_blank"` links carry `rel="noopener"`.
- User-controlled review text is rendered as text, never through `innerHTML`, and the Worker validates the rating, note length and JSON shape before writing to D1.
- Residual risks recorded in `SECURITY.md`: GitHub Pages cannot send HSTS, `X-Frame-Options`, `X-Content-Type-Options` or Permissions-Policy headers and the CSP is meta-only; the public anonymous review endpoint relies on platform limits rather than an application rate limit.

### Known issues and follow-ups

- Automated cross-browser testing was not available in this environment (the Playwright Chromium download did not complete), so interaction checks were run in Chromium only. Re-run the interaction suite in Firefox and WebKit before a major release.
- GitHub Pages cannot set response security headers. Moving to a host with header control, or proxying through Cloudflare, would close that gap.
- The review endpoint is public and anonymous. Add a Worker-level rate limit or Turnstile if spam appears.
- axe reports colour contrast on gradient and canvas-backed surfaces as "incomplete"; those text layers were checked by hand.

## A note on payment

This project intentionally does **not** integrate a payment provider. There are no card fields, no checkout and no third-party payment SDKs. Requests are reviewed and confirmed by the tutor, then paid by cash or Zelle directly.

---

## License

MIT © 2026 Buttergod. See [LICENSE](LICENSE).

The ClickSpark, FlyingButton, FluxLines, PatternWaves, TechText, TextLoop, MaskedHeading, ParticleText, SplitFlapText, FluidGlass, ElasticMesh, HalftoneReveal, AnimatedContent, PixelSwap, TargetCursor, Ribbons, AcidSquares, LiquidEther, Silk, Lightfall, DecayCard, Plasma, GridScan, DotField, Iridescence, Waves, GridMotion, FallingText, PaperCrumple, PeekRating, AnimatedList, ScrollStack, MagicBento and CircularGallery islands are adapted from React Bits by David Haz under the MIT + Commons Clause licence. PatternWaves and FluidGlass also bundle `ogl` 1.0.11 under the Unlicense, and TextLoop, MaskedHeading and AnimatedContent bundle GSAP 3.15.1 under the GSAP Standard "No Charge" License, FallingText bundles Matter.js under the MIT licence, and PaperCrumple bundles three.js under the MIT licence. The full notices are in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

## Motion layer and extra pages

The pages are plain HTML, CSS and JavaScript. The optional ClickSpark, FlyingButton, AnimatedList, ScrollStack, MagicBento, CircularGallery, FluxLines, PatternWaves, TechText, TextLoop, MaskedHeading, ParticleText, SplitFlapText, FluidGlass, ElasticMesh, HalftoneReveal, AnimatedContent, PixelSwap, TargetCursor, Ribbons, AcidSquares, LiquidEther, Silk, Lightfall, DecayCard, Plasma, GridScan, DotField, Iridescence, Waves, GridMotion, FallingText, PaperCrumple and PeekRating islands are built from their folders under `src/` into the generated JS and CSS files committed at the root. The generated files are already present, so serving the site needs no build step; run `npm run build` only after changing an island. `enhance.css` and
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

- A legal console background. Privacy, terms, cookies, refunds, credits, EULA and DMCA share a live contour map with chrome balls rolling over it. Both react to the pointer, and a click sends a pulse through the terrain and a burst through the pit. The document sits on a paper panel, a falling chip banner reuses the footer's physics text, and reduced-motion visitors get a static grid.
- `about.html`: the tutor bio, experience in plain terms, and the Person schema used for authorship.
- `privacy.html`: privacy policy, children's data, retention and privacy rights.
- `terms.html`: terms and conditions, payment, attendance, liability and Virginia law.
- `cookies.html`: no cookies are set; the two functional browser-storage keys.
- `refunds.html`: cancellation, tutor cancellations and how to request a refund.
- `eula.html`: the licence for worksheets, notes and session materials, including what a family may do with them, student ownership and termination.
- `dmca.html`: the copyright policy, the elements of a valid notice, where to send it, counter-notification and the repeat infringement position.
- `thanks.html`: what happens after a request is sent (noindex).
- `404.html`: a branded off-circuit page.
- `robots.txt`, `sitemap.xml` and `llms.txt`.
- `og-image.jpg`, `og-terms.jpg` and `og-credits.jpg`: 1200x630 social share cards,
  cropped from the hero photograph and referenced by the Open Graph and Twitter tags.
- `site.webmanifest`: web app name, colours and installable icons.
- `credits.html`: photograph attribution and licence details.

There is no analytics, advertising pixel or cookie on the site. Web fonts are self-hosted
and hosting logs come from GitHub Pages. A team photograph is not published, and the site does not invent reviews. Pit-wall notes appear when visitors submit them.
