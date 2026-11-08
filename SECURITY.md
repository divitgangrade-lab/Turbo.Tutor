# Security

TurboTutor is a static website. There is no application server, login, admin panel or payment processing on this domain. The public pit wall uses a separate Cloudflare Worker review API and D1 database; that endpoint stores only public star ratings, notes and timestamps. This document records what was checked, what changed, and what remains.

Audit date: 8 November 2026.

## Scope

- `index.html`, `about.html`, `privacy.html`, `terms.html`, `cookies.html`, `refunds.html`, `credits.html`, `thanks.html`, `404.html`
- Authored JavaScript in `enhance.js` and the inline scripts, plus the bundled Preact islands in the root and `island-chunks/`
- Build scripts in `scripts/`, the `reviews-api/` Worker and Sites manifest, dependency manifests, GitHub Pages configuration and the full Git history
- Public files served from `https://turbotutor.dpdns.org/`

Out of scope: GitHub's own infrastructure, the visitor's browser, the tutor's email and phone providers, and any service reached through an outbound link.

## Architecture and data flow

- Static HTML, CSS, images and ES modules. Hosted by GitHub Pages.
- A separate Cloudflare Worker at `reviews-api/` serves the public pit wall: `GET /api/reviews` returns the latest five, and `POST /api/reviews` validates a 1-5 rating and a 1-240 character note before inserting into D1. It is anonymous, public and CORS-enabled by design. The same Worker exposes `GET` and `POST /api/visits`, which store a single D1 counter and return the running total page views; posting is open by design so every visitor's load can be counted.
- No accounts, sessions, cookies, admin panel or payment code. The review API is a public anonymous read/write endpoint for pit-wall notes; it stores no private user data.
- Request details are assembled in the browser and posted to FormSubmit.co, which forwards them to the tutor's inbox. Nothing is posted to this origin.
- Two `localStorage` keys hold a theme preference and a welcome-offer record. They stay in the visitor's browser.
- No analytics, advertising pixels, third-party fonts, iframes or embeds. FormSubmit is contacted only when a visitor submits a form; the review API is contacted when the footer pit wall loads and when a note is posted. The Spline viewer and F1 scene are self-hosted under `vendor/spline/` and requested only when a visitor opens `f1.html`. That page allows `blob:` images and connections, blob workers and WebAssembly for the scene's own in-memory textures and its Draco decoder, while every other page keeps those allowances off. The viewer's CDN decoder, relay and telemetry endpoints are absent from both CSPs, so they cannot be contacted.

## Checks run

| Check | Result |
| --- | --- |
| `npm audit` | 0 critical, 0 high, 0 moderate, 0 low, 0 info |
| `npm outdated` | No outdated direct dependencies |
| Secret patterns across all commits | No AWS, GitHub, Slack, Google, Stripe-style keys, JWTs or private key blocks |
| Sensitive filenames ever committed | No `.env`, `.pem`, `.key`, `.p12`, SSH keys, database dumps or credential files |
| Source maps in the published tree | None |
| Inline event handlers (`onclick` and similar) | None |
| `eval`, `new Function`, workers, `document.write` in authored code | None |
| External asset requests | Fonts, images, scripts and styles are same-origin; outbound calls go only to FormSubmit on submit and the public review API for the pit wall |
| Publicly served build files | `package.json`, `package-lock.json`, `README.md`, `components.json` and `scripts/` were reachable; now excluded from the published site |
| Form handling | Client-side validation; posted to FormSubmit.co; values are never inserted into HTML |
| Review API | Public GET/POST; JSON-only; 4 KB body cap; rating and note validation; prepared D1 statements; no auth or private data |
| Course and offer settings | Rates, duration multipliers, plan discounts and wheel weights reviewed for consistency and tampering |

## Fixed in this audit

1. **Stored-offer DOM injection.** A saved welcome offer was read from `localStorage` and its label was written with `innerHTML`. Storage is editable by anyone with access to the browser, so that was a DOM injection sink. The site now rebuilds the offer from the known prize list and trusts only the stored timestamp. The label is rendered with `textContent` and a created `<b>` element.
2. **Newsletter request path.** The club form's unused `fetch` branch was replaced with a real FormSubmit request when the site moved from draft-only `mailto:` links to direct form delivery. The form now posts only when a visitor submits it, and the honeypot blocks simple bots.
3. **Content Security Policy.** Every page carries a meta CSP: same-origin scripts, styles, fonts and images; no objects, frames or media; `base-uri` and `form-action` restricted. The home page allows the FormSubmit endpoint for its forms. Inline script and style blocks are allowed because the pages use them; there are no inline event handlers.
4. **Referrer policy.** Every page sends `strict-origin-when-cross-origin` so full URLs are not leaked to outbound sites.
5. **Published build files.** A `_config.yml` excludes `src/`, `scripts/`, `package.json`, `package-lock.json`, `components.json`, `README.md`, `node_modules` and local audit artifacts from the GitHub Pages build. Source, notices and the licence still ship where they are needed.
6. **Input limits.** The club email field now has the same 120-character limit as the request form email field.
7. **Pit-wall API boundary.** The shared footer pit wall posts to a separate Worker instead of holding reviews only in page state. The Worker validates the rating and note, collapses whitespace, caps the note at 240 characters, caps the request body at 4 KB and uses bound D1 parameters. Public CORS is intentional because the reviews are public and anonymous.

## Controls that do not apply

- **Authentication, sessions, password hashing.** The review API has no accounts, passwords or sessions; anonymous public notes are intentional. If private accounts are added later, use a server, Argon2id password hashing, secure HttpOnly SameSite cookies, and server-side authorisation on every request.
- **Per-user data isolation.** There are no accounts or private records. Pit-wall reviews are intentionally shared public data; they contain only a star rating, note and timestamp, never an email, IP or user ID. The only private browser data is the theme and welcome-offer `localStorage`, scoped by origin.
- **Admin routes.** None exist. There is nothing to protect or hide.
- **Database security.** The D1 database is reachable only through the review API Worker. Queries use prepared statements and bound parameters; no database credential or direct SQL endpoint reaches the browser. The data is public by design.
- **Rate limiting.** The public review endpoint currently has no application-level rate limit, so it can be spammed; this is a residual risk. GitHub Pages absorbs site traffic, and form submissions go to FormSubmit. Add platform or Worker rate limiting before the pit wall sees abusive volume. Client-side rate limiting is bypassable and was deliberately not added.
- **API keys.** None exist in the repository, the build or the browser. `components.json` references a `${REACTBITS_LICENSE_KEY}` placeholder for a local design tool, never a value, and is no longer published. The review API uses a Cloudflare D1 binding, not a key or connection string in the client.

## Residual risks

- **GitHub Pages cannot set response headers.** HSTS, `X-Frame-Options`, `X-Content-Type-Options: nosniff` and `Permissions-Policy` need a host or proxy that supports headers, such as Cloudflare. The meta CSP and referrer policy are the strongest equivalents available here.
- **The CSP allows inline scripts and styles.** This is required by the current single-file page structure. Moving inline scripts to external files would allow `script-src 'self'` without `'unsafe-inline'`. The site still has no user-controlled HTML sink.
- **Prices and offers are computed in the browser.** A visitor can change them with developer tools. No payment is taken online, and the tutor confirms the final amount in writing before anything is charged, so this affects presentation, not billing.
- **Email and SMS are not end-to-end secure.** Requests travel through FormSubmit, the visitor's email provider and the tutor's inbox. FormSubmit is a third-party processor, and the site tells visitors not to send identity documents, card numbers or medical records.
- **No WAF or bot protection.** GitHub Pages provides platform-level protection, but there is no custom firewall. Spam sent by email is handled by the mail provider's filters.
- **Public pit-wall content.** Anyone can post an anonymous rating and note. There is no moderation queue, account, deletion path or application rate limit, so spam or abusive content is possible; the tutor must moderate the D1 records or add controls.
- **Supply chain.** A small set of build-time dependencies is used. They are current and audit-clean, but future updates should be reviewed and the lockfile kept.
- **Shared devices.** Theme and offer data in `localStorage` are readable by anyone using the same browser profile.
- **No penetration test.** This was a code, configuration and history review, not an adversarial engagement.

## Operating recommendations

- Enable two-factor authentication on the GitHub account and on the email account used for tutoring enquiries.
- Never put a key in a tracked file. If a key is ever exposed, rotate it first, then remove it from history.
- Keep the GitHub Pages source branch limited to the files the site needs; `_config.yml` now does that at publish time.
- If the review API grows beyond a small public wall, add rate limiting, moderation and retention rules, and keep validation and parameterised queries on the Worker.
- If another backend is added, put authentication, authorisation, validation, rate limiting, parameterised queries and password hashing on the server, not in the browser.

## Reporting

Email `divit.gangrade@gmail.com` with the page and a short description. Please do not test against other people's data or run disruptive traffic.
