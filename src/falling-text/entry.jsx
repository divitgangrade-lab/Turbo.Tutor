import { render } from 'preact';

import FallingText from './FallingText.jsx';

const host = document.getElementById('falling-text-mount');
const compact = window.matchMedia('(max-width: 860px)').matches;

if (host) {
  host.replaceChildren();
  render(
    <FallingText
      text="Every lap is a lesson. Every lesson sticks."
      highlightWords={['lesson', 'sticks']}
      trigger="click"
      split="words"
      order="random"
      stagger={0.05}
      gravity={1}
      bounciness={0.16}
      scatter={0.22}
      restoreDelay={3.2}
      cursorPush={0.35}
      fontSize={compact ? '1.45rem' : '1.9rem'}
      accentColor="#ffd400"
      theme="dark"
      draggable
    />,
    host
  );
  host.dataset.mounted = 'true';
}
