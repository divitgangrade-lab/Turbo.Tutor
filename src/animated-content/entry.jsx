import { render } from 'preact';

import AnimatedContent from './AnimatedContent.jsx';

const root = document.getElementById('animated-content-root');
const mount = document.getElementById('animated-content-mount');

if (root && mount) {
  render(
    <AnimatedContent
      className="animated-content"
      distance={30}
      direction="vertical"
      duration={0.72}
      ease="power3.out"
      blur={2}
      stagger={0.1}
      staggerFrom="start"
      threshold={0.16}
      trigger="scroll"
      once
    >
      <article className="policy-card">
        <strong>$15</strong>
        <h3>Missed lap</h3>
        <p>A $15 fee applies when a student misses a scheduled session without notice.</p>
      </article>
      <article className="policy-card">
        <strong>$10</strong>
        <h3>Family reschedule</h3>
        <p>A $10 fee applies when the family asks to move a confirmed session to another time.</p>
      </article>
      <article className="policy-card">
        <strong>15% off</strong>
        <h3>Tutor reschedule</h3>
        <p>If the tutor needs to move a session, they confirm a 15% credit toward the next purchase request.</p>
      </article>
    </AnimatedContent>,
    mount
  );

  root.dataset.mounted = 'true';
}
