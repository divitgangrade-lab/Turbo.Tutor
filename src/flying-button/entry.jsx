import { render } from 'preact';

import FlyingButton from './FlyingButton.jsx';

const pad = document.getElementById('flying-button-root');

const reducedMotion = () =>
  !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

const slowScrollTo = (target, duration = 2000) => {
  const start = window.scrollY;
  const delta = target - start;
  if (reducedMotion() || Math.abs(delta) < 4) {
    window.scrollTo(0, target);
    return Promise.resolve();
  }
  const root = document.documentElement;
  const previous = root.style.scrollBehavior;
  root.style.scrollBehavior = 'auto';
  const began = performance.now();
  return new Promise(resolve => {
    const step = now => {
      const progress = Math.min(1, (now - began) / duration);
      const eased = progress < 0.5 ? 4 * progress ** 3 : 1 - (-2 * progress + 2) ** 3 / 2;
      window.scrollTo(0, Math.round(start + delta * eased));
      if (progress < 1) {
        requestAnimationFrame(step);
        return;
      }
      root.style.scrollBehavior = previous;
      resolve();
    };
    requestAnimationFrame(step);
  });
};

const flyToPlans = () => {
  const plans = document.getElementById('plans');
  if (!plans || !pad) return;
  const top = Math.max(0, plans.getBoundingClientRect().top + window.scrollY - 92);
  pad.setAttribute('data-launching', '');
  slowScrollTo(top).then(() => pad.removeAttribute('data-launching'));
};

if (pad) {
  pad.dataset.mounted = 'true';
  pad.querySelector('.launch-fallback')?.remove();
  render(
    <FlyingButton
      theme="light"
      size="large"
      radius={18}
      altitude={170}
      hoverTime={2.4}
      jets={2}
      thrusters
      trigger="hover"
      carryCursor
      smoke={1}
      turbulence={1}
      wobble={1}
      ramp={false}
      buttonColor="#e10600"
      textColor="#ffffff"
      thrustColor="#ffd400"
      smokeColor="#f4ead6"
      onClick={flyToPlans}
    >
      Build your lap plan
    </FlyingButton>,
    pad
  );
}
