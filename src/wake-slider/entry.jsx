import { render } from 'preact';

import WakeSlider from './WakeSlider.jsx';
import './lap-scrub.css';

const host = document.getElementById('lap-scrub-mount');
const readout = document.getElementById('lap-scrub-readout');
const rows = [...document.querySelectorAll('#walkthrough .lap-timeline li')];

const PHASES = [
  [0, 5],
  [5, 20],
  [20, 40],
  [40, 45]
];

const apply = value => {
  if (!rows.length) return;
  const minute = Math.max(0, Math.min(45, Math.round(value)));
  let index = PHASES.length - 1;
  PHASES.forEach(([from, to], i) => {
    if (minute >= from && minute < to) index = i;
  });
  rows.forEach((row, i) => {
    row.toggleAttribute('data-current', i === index);
  });
  const title = rows[index]?.querySelector('h3')?.textContent?.trim() ?? '';
  if (readout) readout.textContent = `${minute} min · ${title}`;
};

if (host) {
  apply(22);
  render(
    <WakeSlider
      defaultValue={22}
      min={0}
      max={45}
      step={1}
      bars={32}
      height={54}
      restHeight={10}
      gap={4}
      fillColor="#ffd400"
      trackColor="rgba(255, 255, 255, 0.14)"
      crestColor="#e10600"
      sensitivity={1.2}
      reach={6}
      skew={0.6}
      glide={0.3}
      smoothing={100}
      showValue
      formatValue={value => `${value} min`}
      ariaLabel="Minute of the 45-minute lap"
      onChange={apply}
    />,
    host
  );
  host.dataset.mounted = 'true';
}
