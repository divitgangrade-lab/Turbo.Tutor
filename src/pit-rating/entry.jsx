import { render } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';

import PeekRating from './PeekRating.jsx';
import './PitRating.css';

const LABELS = ['Rough lap', 'Getting there', 'Solid lap', 'Quick lap', 'Personal best'];

const Car = () => (
  <svg viewBox="0 0 200 70" aria-hidden="true" focusable="false">
    <rect x="16" y="24" width="30" height="5" rx="1.5" fill="#f7f5f0" />
    <rect x="15" y="19" width="4" height="14" rx="1.5" fill="#e10600" />
    <path
      d="M22 46 34 38c12-6 28-8 44-10l16-3c10-1 18 3 24 8l32 9c16 3 26 5 32 7v4l-62 2c-24 1-60 1-86-1l-10-2Z"
      fill="#e10600"
    />
    <path d="M60 50h80l-20 5H60Z" fill="#a80500" />
    <path d="M84 30c4-8 20-9 26-1" fill="none" stroke="#12161a" strokeWidth="3" strokeLinecap="round" />
    <circle cx="97" cy="26" r="7" fill="#ffd400" />
    <path d="M92 24h10" stroke="#12161a" strokeWidth="2.4" strokeLinecap="round" />
    <circle cx="66" cy="44" r="7.5" fill="#f7f5f0" />
    <text x="66" y="47.5" textAnchor="middle" fontSize="8" fontWeight="700" fill="#12161a" fontFamily="'Chakra Petch', sans-serif">
      7
    </text>
    <rect x="168" y="50" width="26" height="5" rx="1.5" fill="#f7f5f0" />
    <rect x="176" y="44" width="16" height="3" rx="1.5" fill="#e10600" />
    <g className="pit-rating__wheel">
      <circle cx="52" cy="53" r="14" fill="#12161a" />
      <circle cx="52" cy="53" r="7" fill="none" stroke="#8f9aa1" strokeWidth="2.5" strokeDasharray="3 4" />
    </g>
    <g className="pit-rating__wheel">
      <circle cx="150" cy="54" r="12" fill="#12161a" />
      <circle cx="150" cy="54" r="6" fill="none" stroke="#8f9aa1" strokeWidth="2.5" strokeDasharray="3 4" />
    </g>
  </svg>
);

function PitRating() {
  const [value, setValue] = useState(0);
  const [state, setState] = useState('idle');
  const [status, setStatus] = useState('');
  const sectionRef = useRef(null);
  const animations = useRef([]);
  const timers = useRef([]);

  const cancelAnimations = () => {
    animations.current.forEach(animation => animation.cancel());
    animations.current = [];
  };

  const clearTimers = () => {
    timers.current.forEach(id => clearTimeout(id));
    timers.current = [];
  };

  useEffect(
    () => () => {
      clearTimers();
      cancelAnimations();
    },
    []
  );

  const dropStars = () => {
    const section = sectionRef.current;
    if (!section || typeof Element === 'undefined' || !Element.prototype.animate) return;
    const car = section.querySelector('.pit-rating__car');
    if (!car) return;
    const carTop = car.getBoundingClientRect().top;
    const stars = Array.from(section.querySelectorAll('.peek-rating__star'));
    stars.forEach((star, index) => {
      const rect = star.getBoundingClientRect();
      const travel = Math.max(48, carTop - rect.top + 10);
      const lean = (index - 2) * 14;
      animations.current.push(
        star.animate(
          [
            { transform: 'translate3d(0, 0, 0) rotate(0deg) scale(1)', opacity: 1, offset: 0 },
            {
              transform: `translate3d(${lean * 0.4}px, ${travel * 0.55}px, 0) rotate(${lean}deg) scale(0.86)`,
              opacity: 1,
              offset: 0.62
            },
            {
              transform: `translate3d(${lean}px, ${travel}px, 0) rotate(${lean * 2.4}deg) scale(0.18)`,
              opacity: 0,
              offset: 1
            }
          ],
          {
            duration: 720 + index * 30,
            delay: index * 55,
            easing: 'cubic-bezier(0.42, 0, 0.86, 0.38)',
            fill: 'forwards'
          }
        )
      );
    });
  };

  const reset = () => {
    cancelAnimations();
    setValue(0);
    setState('idle');
    setStatus('');
  };

  const handleChange = next => {
    setValue(next);
    if (!next) return;
    clearTimers();
    cancelAnimations();
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setState('leaving');
      setStatus('Ok. Thank you.');
      timers.current.push(setTimeout(reset, 5200));
      return;
    }
    setState('ok');
    setStatus('Ok. Bringing the car in.');
    timers.current.push(
      setTimeout(() => {
        setState('falling');
        setStatus('The stars are dropping into the car.');
        dropStars();
      }, 640)
    );
    timers.current.push(
      setTimeout(() => {
        setState('leaving');
        setStatus('');
      }, 1520)
    );
    timers.current.push(setTimeout(reset, 4300));
  };

  return (
    <section className="pit-rating" data-state={state} ref={sectionRef} aria-labelledby="pit-rating-title">
      <div className="pit-rating__copy">
        <p className="pit-rating__kicker">Pit wall</p>
        <h2 className="pit-rating__title" id="pit-rating-title">
          Ok, how was the lap?
        </h2>
      </div>
      <div className="pit-rating__controls">
        <PeekRating
          value={value}
          onChange={handleChange}
          count={5}
          labels={LABELS}
          activeColor="#ffd400"
          idleColor="#4b565e"
          tipColor="#0d1114"
          tipTextColor="#f7f5f0"
          size={34}
          lift={8}
          magnify={1.16}
          popScale={1.25}
          showTip
          allowClear
          ariaLabel="Rate your pit stop out of five"
        />
        <p className="pit-rating__status" role="status" aria-live="polite">
          {status}
        </p>
      </div>
      <div className="pit-rating__stage" aria-hidden="true">
        <span className="pit-rating__road" />
        <div className="pit-rating__car">
          <span className="pit-rating__say">Thank you</span>
          <Car />
        </div>
      </div>
    </section>
  );
}

const host = document.getElementById('pit-rating-mount');

if (host) {
  render(<PitRating />, host);
  host.dataset.mounted = 'true';
}
