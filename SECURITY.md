# Security

TurboTutor is a static website. There is no application server, database, login, admin panel or payment processing on this domain. That architecture removes whole classes of risk, and it also means some standard controls do not apply. This document records what was checked, what changed, and what remains.

Audit date: 7 November 2026.

## Scope

- `index.html`, `about.html`, `privacy.html`, `terms.html`, `cookies.html`, `refunds.html`, `credits.html`, `thanks.html`, `404.html`
- Authored JavaScript in `enhance.js` and the inline scripts, plus the bundled Preact islands in the root and `island-chunks/`
- Build scripts in `scripts/`, dependency manifests, GitHub Pages configuration and the full Git history
- Public files served from `https://turbotutor.dpdns.org/`

Out of scope: GitHub's own infrastructure, the visitor's browser, the tutor's email and phone providers, and any service reached through an outbound link.

## Architecture and data flow

- Static HTML, CSS, images and ES modules. Hosted by GitHub Pages.
- No accounts, sessions, cookies, admin routes, API routes, database or server-side code.
- Request details are assembled in the browser and handed to the visitor's own email or SMS app through `mailto:` and `sms:` links. Nothing is posted to this site.
- Two `localStorage` keys hold a theme preference and a welcome-offer record. They stay in the visitor's browser.
- No analytics, advertising pixels, third-party fonts, iframes or embeds.

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
| External asset requests | None; fonts, images, scripts and styles are same-origin |
| Publicly served build files | `package.json`, `package-lock.json`, `README.md`, `components.json` and `scripts/` were reachable; now excluded from the published site |
| Form handling | Client-side only; values are never inserted into HTML |
| Course and offer settings | Rates, duration multipliers, plan discounts and wheel weights reviewed for consistency and tampering |

## Fixed in this audit

1. **Stored-offer DOM injection.** A saved welcome offer was read from `localStorage` and its label was written with `innerHTML`. Storage is editable by anyone with access to the browser, so that was a DOM injection sink. The site now rebuilds the offer from the known prize list and trusts only the stored timestamp. The label is rendered with `textContent` and a created `<b>` element.
2. **Dead newsletter request path.** The club form contained an unused `fetch` branch driven by an empty `data-endpoint`. It was removed, so the page makes no network requests at all. The form is email-only.
3. **Content Security Policy.** Every page now carries a meta CSP: same-origin scripts, styles, fonts and images only; no objects, frames, media or cross-origin connections; `base-uri` and `form-action` restricted. Inline script and style blocks are allowed because the pages use them; there are no inline event handlers.
4. **Referrer policy.** Every page sends `strict-origin-when-cross-origin` so full URLs are not leaked to outbound sites.
5. **Published build files.** A `_config.yml` excludes `src/`, `scripts/`, `package.json`, `package-lock.json`, `components.json`, `README.md`, `node_modules` and local audit artifacts from the GitHub Pages build. Source, notices and the licence still ship where they are needed.
6. **Input limits.** The club email field now has the same 120-character limit as the request form email field.

## Controls that do not apply

- **Authentication, sessions, password hashing.** There are no accounts and no passwords. Adding a client-side login would be security theatre, because any check in shipped JavaScript can be bypassed. If accounts are added later, use a server, Argon2id password hashing, secure HttpOnly SameSite cookies, and server-side authorisation on every request.
- **Per-user data isolation.** There is no shared data store. The only stored data is per-browser `localStorage`, scoped by origin.
- **Admin routes.** None exist. There is nothing to protect or hide.
- **Database security.** No database, no SQL, no ORM, no connection string.
- **Rate limiting.** There is no endpoint to limit. GitHub Pages absorbs volumetric traffic, and form submissions never reach this origin. If a newsletter or booking API is added, rate limit it server-side by IP and account, with a cap and backoff. Client-side rate limiting is bypassable and was deliberately not added.
- **API keys.** None exist in the repository, the build or the browser. `components.json` references a `${REACTBITS_LICENSE_KEY}` placeholder for a local design tool, never a value, and is no longer published.

## Residual risks

- **GitHub Pages cannot set response headers.** HSTS, `X-Frame-Options`, `X-Content-Type-Options: nosniff` and `Permissions-Policy` need a host or proxy that supports headers, such as Cloudflare. The meta CSP and referrer policy are the strongest equivalents available here.
- **The CSP allows inline scripts and styles.** This is required by the current single-file page structure. Moving inline scripts to external files would allow `script-src 'self'` without `'unsafe-inline'`. The site still has no user-controlled HTML sink.
- **Prices and offers are computed in the browser.** A visitor can change them with developer tools. No payment is taken online, and the tutor confirms the final amount in writing before anything is charged, so this affects presentation, not billing.
- **Email and SMS are not end-to-end secure.** Requests travel through the visitor's provider and the tutor's inbox. The site tells visitors not to send identity documents, card numbers or medical records.
- **No WAF or bot protection.** GitHub Pages provides platform-level protection, but there is no custom firewall. Spam sent by email is handled by the mail provider's filters.
- **Supply chain.** A small set of build-time dependencies is used. They are current and audit-clean, but future updates should be reviewed and the lockfile kept.
- **Shared devices.** Theme and offer data in `localStorage` are readable by anyone using the same browser profile.
- **No penetration test.** This was a code, configuration and history review, not an adversarial engagement.

## Operating recommendations

- Enable two-factor authentication on the GitHub account and on the email account used for tutoring enquiries.
- Never put a key in a tracked file. If a key is ever exposed, rotate it first, then remove it from history.
- Keep the GitHub Pages source branch limited to the files the site needs; `_config.yml` now does that at publish time.
- If a backend is added, put authentication, authorisation, validation, rate limiting, parameterised queries and password hashing on the server, not in the browser.

## Reporting

Email `divit.gangrade@gmail.com` with the page and a short description. Please do not test against other people's data or run disruptive traffic.
