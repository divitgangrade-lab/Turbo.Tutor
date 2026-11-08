import { render } from 'preact';

import Dock from './Dock.jsx';
import './footer-dock.css';

const host = document.getElementById('dock-root');

const glyph = (...paths) => (
  <svg
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    {paths}
  </svg>
);

const go = target => {
  if (target.startsWith('#')) {
    const node = document.getElementById(target.slice(1));
    if (node) {
      node.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(null, '', target);
      return;
    }
  }
  window.location.href = target;
};

const items = [
  {
    icon: glyph(<path d="M5 21V3" />, <path d="M5 4.5c4-2 6 2 10 0v8c-4 2-6-2-10 0" />),
    label: 'Attendance & support',
    onClick: () => go('#policies')
  },
  {
    icon: glyph(
      <circle cx="12" cy="12" r="8.5" />,
      <path d="M9.6 9.4a2.5 2.5 0 1 1 3.4 2.3c-.7.3-1 .8-1 1.5v.4" />,
      <path d="M12 17h.01" />
    ),
    label: 'FAQ',
    onClick: () => go('#faq')
  },
  {
    icon: glyph(
      <path d="M6.5 4h3l1.4 3.5-2 1.4a12 12 0 0 0 5.2 5.2l1.4-2 3.5 1.4v3A2.5 2.5 0 0 1 16.5 19C10.7 18.6 5.4 13.3 5 7.5A2.5 2.5 0 0 1 6.5 4Z" />
    ),
    label: 'Contact the tutor',
    onClick: () => go('#contact')
  },
  {
    icon: glyph(<circle cx="12" cy="8" r="3.2" />, <path d="M5.5 20c.6-3.6 3.2-5.5 6.5-5.5s5.9 1.9 6.5 5.5" />),
    label: 'About the tutor',
    onClick: () => go('about.html')
  },
  {
    icon: glyph(
      <path d="M7 3.5h7l4 4V20a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1Z" />,
      <path d="M14 3.5V8h4" />,
      <path d="M9 12h6M9 15.5h6" />
    ),
    label: 'Terms & conditions',
    onClick: () => go('terms.html')
  },
  {
    icon: glyph(
      <path d="M12 3.5 19 6v5.5c0 4.2-2.9 7.3-7 9-4.1-1.7-7-4.8-7-9V6l7-2.5Z" />,
      <path d="M9.3 11.8l1.9 1.9 3.6-3.7" />
    ),
    label: 'Privacy policy',
    onClick: () => go('privacy.html')
  },
  { separator: true },
  {
    icon: glyph(<circle cx="6" cy="12" r="1.3" />, <circle cx="12" cy="12" r="1.3" />, <circle cx="18" cy="12" r="1.3" />),
    label: 'More details',
    menu: [
      { label: 'Cookie policy', onClick: () => go('cookies.html') },
      { label: 'Refunds', onClick: () => go('refunds.html') },
      { label: 'EULA', onClick: () => go('eula.html') },
      { label: 'DMCA', onClick: () => go('dmca.html') },
      { label: 'License (MIT)', onClick: () => go('LICENSE') },
      { separator: true },
      { label: 'Build a plan', onClick: () => go('#plans') },
      { label: 'Back to top', onClick: () => go('#home') }
    ]
  }
];

if (host) {
  host.dataset.mounted = 'true';
  render(
    <Dock
      items={items}
      position="bottom"
      theme="dark"
      baseItemSize={40}
      magnification={58}
      distance={150}
      panelHeight={54}
      gap={6}
      roundness={0.55}
      accentColor="#e10600"
      badgeColor="#ffd400"
      showBadges={false}
      showIndicators={false}
      style={{
        '--dock-panel': 'rgba(16, 20, 24, 0.84)',
        '--dock-panel-edge': 'rgba(255, 255, 255, 0.09)',
        '--dock-panel-highlight': 'rgba(255, 255, 255, 0.06)',
        '--dock-tile': 'linear-gradient(180deg, #252c33 0%, #12171c 100%)',
        '--dock-label': '#0a0c0f',
        '--dock-label-ink': '#f7f5f0'
      }}
    />,
    host
  );
  host.querySelector('.dock')?.setAttribute('aria-label', 'Footer quick links');
}
