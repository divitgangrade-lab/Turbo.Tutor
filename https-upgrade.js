/* GitHub Pages answers plain HTTP until "Enforce HTTPS" is enabled, and a static
   site cannot send a 301. Move custom-domain visitors onto HTTPS before the page
   renders. Local previews and the *.style.dev / *.freebuff.page hosts are left
   alone because they never match the custom domain. */
(() => {
  "use strict";

  const host = location.hostname;
  const onCustomDomain = host === "turbotutor.dpdns.org" || host.endsWith(".turbotutor.dpdns.org");
  if (location.protocol !== "http:" || !onCustomDomain) return;

  location.replace(`https://${host}${location.pathname}${location.search}${location.hash}`);
})();
