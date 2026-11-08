import { render } from 'preact';

import Counter from './Counter.jsx';
import './visit-counter.css';

const host = document.getElementById('visit-counter-root');
const ENDPOINT = 'https://site-bc52dc6774bc4028a0be827c85de9df2.freebuff.page/api/visits';

if (host) {
  fetch(ENDPOINT, { method: 'POST', cache: 'no-store' })
    .then(response => (response.ok ? response.json() : Promise.reject(new Error(String(response.status)))))
    .then(data => {
      const visits = Number(data?.visits);
      if (!Number.isFinite(visits) || visits < 0) return;
      render(
        <Counter
          value={visits}
          fontSize="inherit"
          fontWeight="inherit"
          textColor="inherit"
          duration={1.1}
          bounce={0.28}
          stagger={0.05}
          intro
        />,
        host
      );
      host.dataset.mounted = 'true';
    })
    .catch(() => {
      host.dataset.failed = 'true';
    });
}
