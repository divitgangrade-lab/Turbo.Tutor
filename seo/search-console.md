# Search Console and HTTPS checklist

This file is internal. `seo/` is excluded from the published site by `_config.yml`.

The technical prerequisites are already in place: `robots.txt`, `sitemap.xml`, extensionless canonical URLs, unique titles and descriptions, one `h1` per page, structured data, Open Graph images and a working custom domain. Account-level verification and the Pages HTTPS toggle belong to the repository owner and cannot be completed from a coding workspace.

## 1. Verify the property

1. Open <https://search.google.com/search-console>.
2. Add a **URL-prefix** property for `https://turbotutor.dpdns.org/`. A Domain property also works, but it needs a DNS TXT record at the provider that manages `dpdns.org`.
3. Choose one verification method:
   - **HTML tag**: copy the `<meta name="google-site-verification" ...>` tag from Search Console and place it in the `<head>` of `index.html`, immediately after the `<meta name="description">` line. Then deploy. Send the tag to the coding agent if you want it inserted for you.
   - **HTML file**: download the verification file, put it in the repository root, and deploy. It will be served at `https://turbotutor.dpdns.org/google<token>.html`.
   - **DNS TXT**: add the TXT record at the DNS provider for `dpdns.org`. This is the only option that verifies every subdomain and protocol.
4. Keep the verification method in place. Removing the tag or file later can unverify the property.

If the repository is private, the HTML file and tag methods still work because GitHub Pages serves the published site, not the repository.

## 2. Submit the sitemap

1. In Search Console, open **Sitemaps**.
2. Submit `https://turbotutor.dpdns.org/sitemap.xml`.
3. Confirm the status becomes **Success** and that the discovered URL count is 9. The two utility pages, `404.html` and `thanks.html`, are intentionally excluded and marked `noindex,follow`.
4. Do not submit `robots.txt` as a sitemap. It is not one.

The sitemap uses the clean URLs: `/`, `/about`, `/terms`, `/privacy`, `/refunds`, `/eula`, `/dmca`, `/cookies` and `/credits`. Both `/about` and `/about.html` are served by GitHub Pages; the canonical tag tells Google which one to index.

## 3. Request indexing and inspect

1. Use **URL Inspection** on `https://turbotutor.dpdns.org/`.
2. Confirm "URL is available to Google" and that the canonical selected by Google is the clean URL.
3. Click **Request indexing** once. Do not repeatedly request indexing; it does not speed up crawling after the first request.
4. Check the **Pages** report after 48 to 72 hours for excluded URLs. The expected exclusions are the two `noindex` utility pages.

Indexing is not instant. A new site can take days to weeks, and ranking for competitive queries takes longer. Technical SEO makes the site eligible; it does not guarantee a position.

## 4. Enforce HTTPS

The live site already serves a valid HTTPS certificate, but plain HTTP currently returns `200` instead of redirecting. To fix that:

1. Open the repository on GitHub.
2. Go to **Settings → Pages**.
3. Confirm **Custom domain** is `turbotutor.dpdns.org` and that the `CNAME` file is still present.
4. Tick **Enforce HTTPS**. If the option is greyed out, wait for the certificate to finish provisioning, then reload.
5. Verify with:

```bash
curl -sI http://turbotutor.dpdns.org/ | head -5
```

The response should be a `301` or `308` with `Location: https://turbotutor.dpdns.org/`. Until then, HTTPS works but HTTP is also served.

GitHub Pages cannot send HSTS, `X-Frame-Options` or `X-Content-Type-Options` as response headers. That limit is recorded in `SECURITY.md`. A CDN or Cloudflare proxy in front of Pages would be required for those headers.

## 5. Bing and other engines

1. Import the verified property into <https://www.bing.com/webmasters> from Search Console, or verify the site there separately.
2. Submit the same sitemap.
3. Keep the `llms.txt` summary current for AI assistants; it already lists the public pages and key facts.

## 6. After every content change

Run the repository checks before deploying:

```bash
npm run seo
python3 artifacts/audit.py
```

`npm run seo` verifies titles, descriptions, heading order, canonicals, sitemap coverage, image alt attributes, JSON-LD, internal links and anchors. `artifacts/audit.py` is a local audit utility and is not part of the published site.

Then deploy and confirm the live copies:

```bash
curl -s https://turbotutor.dpdns.org/sitemap.xml | head -5
curl -sI https://turbotutor.dpdns.org/about | head -3
```

## 7. What still needs the owner

- The Search Console verification token or DNS TXT value.
- The GitHub Pages **Enforce HTTPS** toggle.
- Google Business Profile verification, which needs the business phone or postcard and cannot be done from the repository.
- Any backlink outreach that requires sending email from the business address.

The backlink and citation plan is in `seo/backlink-strategy.md`.
