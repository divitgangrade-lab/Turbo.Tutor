import { existsSync, readFileSync, readdirSync } from 'node:fs';

const ORIGIN = 'https://turbotutor.dpdns.org';
const NON_INDEXABLE = new Set(['404.html', 'thanks.html']);
const pages = readdirSync('.').filter(file => file.endsWith('.html')).sort();
const indexable = pages.filter(page => !NON_INDEXABLE.has(page));
const slugFor = page => (page === 'index.html' ? '' : page.replace(/\.html$/, ''));
const urlFor = page => (slugFor(page) ? `${ORIGIN}/${slugFor(page)}` : `${ORIGIN}/`);

const errors = [];
const warnings = [];
const fail = message => errors.push(message);
const warn = message => warnings.push(message);
const strip = value =>
  value
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z#0-9]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
const attr = (html, pattern) => pattern.exec(html)?.[1]?.trim();

const titles = new Map();
const descriptions = new Map();
const canonicals = new Map();
const ids = new Map();

for (const page of pages) {
  const html = readFileSync(page, 'utf8');
  const title = strip(attr(html, /<title>([\s\S]*?)<\/title>/i) || '');
  const description = attr(html, /<meta[^>]+name="description"[^>]+content="([^"]*)"/i) || '';
  const robots = attr(html, /<meta[^>]+name="robots"[^>]+content="([^"]*)"/i) || '';
  const canonical = attr(html, /<link[^>]+rel="canonical"[^>]+href="([^"]+)"/i) || '';
  const ogImage = attr(html, /<meta[^>]+property="og:image"[^>]+content="([^"]+)"/i) || '';
  const ogWidth = attr(html, /<meta[^>]+property="og:image:width"[^>]+content="([^"]+)"/i) || '';
  const ogHeight = attr(html, /<meta[^>]+property="og:image:height"[^>]+content="([^"]+)"/i) || '';
  const viewport = attr(html, /<meta[^>]+name="viewport"[^>]+content="([^"]*)"/i) || '';
  const lang = attr(html, /<html[^>]+lang="([^"]+)"/i) || '';

  if (!title) fail(`${page}: missing <title>`);
  else {
    if (title.length < 20 || title.length > 65) warn(`${page}: title length ${title.length}`);
    if (titles.has(title)) fail(`${page}: duplicate title also used by ${titles.get(title)}`);
  }
  if (title) titles.set(title, page);

  if (!description) fail(`${page}: missing meta description`);
  else {
    if (!NON_INDEXABLE.has(page) && (description.length < 120 || description.length > 160)) {
      warn(`${page}: description length ${description.length}`);
    }
    if (descriptions.has(description)) fail(`${page}: duplicate description also used by ${descriptions.get(description)}`);
    descriptions.set(description, page);
  }

  if (!lang) fail(`${page}: missing html lang`);
  if (!/width=device-width/i.test(viewport)) fail(`${page}: missing responsive viewport`);

  if (!NON_INDEXABLE.has(page)) {
    if (!robots) fail(`${page}: missing robots meta`);
    if (/noindex/i.test(robots)) fail(`${page}: indexable page marked noindex`);
    if (canonical !== urlFor(page)) fail(`${page}: canonical is "${canonical}", expected "${urlFor(page)}"`);
    if (canonical.endsWith('.html')) fail(`${page}: canonical still uses .html`);
    if (canonicals.has(canonical)) fail(`${page}: duplicate canonical also used by ${canonicals.get(canonical)}`);
    canonicals.set(canonical, page);
  } else if (!/noindex/i.test(robots)) {
    fail(`${page}: utility page should stay noindex`);
  }

  const headings = [...html.matchAll(/<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi)].map(match => ({
    level: Number(match[1]),
    text: strip(match[2])
  }));
  const h1 = headings.filter(heading => heading.level === 1);
  if (h1.length !== 1) fail(`${page}: expected exactly one h1, found ${h1.length}`);
  if (headings[0] && headings[0].level !== 1) fail(`${page}: first heading is h${headings[0].level}`);
  for (let i = 1; i < headings.length; i += 1) {
    if (headings[i].level > headings[i - 1].level + 1) {
      fail(`${page}: heading jumps from h${headings[i - 1].level} to h${headings[i].level}`);
    }
  }

  for (const match of html.matchAll(/<img\b[^>]*>/gi)) {
    const tag = match[0];
    if (!/\balt=/.test(tag)) fail(`${page}: image without alt: ${tag.slice(0, 90)}`);
    else if (/\balt=""/.test(tag)) warn(`${page}: empty alt on image: ${tag.slice(0, 90)}`);
  }

  for (const match of html.matchAll(/\b(?:srcset|imagesrcset)="([^"]+)"/gi)) {
    for (const candidate of match[1].split(',')) {
      const url = candidate.trim().split(/\s+/)[0];
      if (!url) continue;
      if (/^(data:|https?:)/i.test(url)) {
        if (url.startsWith(`${ORIGIN}/`)) {
          const file = url.split('?')[0].replace(`${ORIGIN}/`, '');
          if (!existsSync(file)) fail(`${page}: responsive image missing ${file}`);
        }
        continue;
      }
      if (!existsSync(url.split('?')[0])) fail(`${page}: responsive image missing ${url}`);
    }
  }

  for (const match of html.matchAll(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      JSON.parse(match[1]);
    } catch {
      fail(`${page}: invalid JSON-LD block`);
    }
  }

  if (!ogImage) fail(`${page}: missing og:image`);
  else {
    if (!ogImage.startsWith(`${ORIGIN}/`)) fail(`${page}: og:image is not absolute on ${ORIGIN}`);
    const file = ogImage.split('?')[0].replace(`${ORIGIN}/`, '');
    if (!existsSync(file)) fail(`${page}: og:image file missing: ${file}`);
    if (ogWidth !== '1200' || ogHeight !== '630') warn(`${page}: og:image should be 1200x630`);
  }

  ids.set(page, new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1])));
}

const resolveTarget = (page, rawPath) => {
  const path = rawPath.replace(/^\.\//, '');
  const rel = path.startsWith('/') ? path.slice(1) : path;
  const candidates = rel ? [rel, `${rel}.html`, `${rel}/index.html`] : ['index.html'];
  return candidates.find(candidate => candidate && existsSync(candidate)) || null;
};

for (const page of pages) {
  const html = readFileSync(page, 'utf8');
  for (const match of html.matchAll(/<a\b[^>]*href="([^"]+)"/gi)) {
    const raw = match[1].trim();
    if (/^(https?:|mailto:|tel:|sms:|data:)/i.test(raw) || raw.startsWith('//')) continue;
    if (raw.startsWith('#')) {
      if (raw.length > 1 && !ids.get(page).has(raw.slice(1))) fail(`${page}: missing on-page anchor ${raw}`);
      continue;
    }
    const [pathPart, hash] = raw.split('#');
    const path = pathPart.split('?')[0];
    const target = path ? resolveTarget(page, path) : page;
    if (!target) {
      fail(`${page}: broken internal link ${raw}`);
      continue;
    }
    if (hash && ids.has(target) && !ids.get(target).has(hash)) fail(`${page}: missing anchor ${raw}`);
  }
}

const sitemap = readFileSync('sitemap.xml', 'utf8');
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1].trim());
const expected = indexable.map(urlFor);
if (locs.length !== expected.length) fail(`sitemap: has ${locs.length} URLs, expected ${expected.length}`);
for (const url of expected) if (!locs.includes(url)) fail(`sitemap: missing ${url}`);
for (const url of locs) {
  if (!expected.includes(url)) fail(`sitemap: unexpected URL ${url}`);
  if (url.endsWith('.html')) fail(`sitemap: URL still uses .html: ${url}`);
}
if (!/<urlset[^>]+sitemaps\.org\/schemas\/sitemap\/0\.9/.test(sitemap)) fail('sitemap: missing sitemap namespace');
if (/<lastmod>2026-11-08<\/lastmod>/.test(sitemap) === false) warn('sitemap: lastmod is stale');

const robots = readFileSync('robots.txt', 'utf8');
if (!robots.includes(`Sitemap: ${ORIGIN}/sitemap.xml`)) fail('robots.txt: missing absolute sitemap line');
if (!/User-agent:\s*\*/i.test(robots)) fail('robots.txt: missing wildcard user-agent');
if (!existsSync('llms.txt')) warn('llms.txt: missing');

const listing = readFileSync('llms.txt', 'utf8');
for (const match of listing.matchAll(/https:\/\/turbotutor\.dpdns\.org\/([a-z0-9-]+)\.html/g)) {
  fail(`llms.txt: .html URL ${match[0]}`);
}

console.log(`SEO check: ${pages.length} pages, ${indexable.length} indexable, ${locs.length} sitemap URLs`);
if (warnings.length) {
  console.log(`\nWarnings (${warnings.length})`);
  for (const message of warnings) console.log(`  - ${message}`);
}
if (errors.length) {
  console.log(`\nErrors (${errors.length})`);
  for (const message of errors) console.log(`  - ${message}`);
  process.exit(1);
}
console.log('\nAll SEO checks passed.');
