import { render } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';

import PeekRating from './PeekRating.jsx';
import './PitRating.css';

const LABELS = ['Rough lap', 'Getting there', 'Solid lap', 'Quick lap', 'Personal best'];
const MAX_NOTE = 240;
const MAX_REVIEWS = 5;

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

const Arrow = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M4 12h14M12 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function PitRating() {
  const [value, setValue] = useState(0);
  const [state, setState] = useState('idle');
  const [status, setStatus] = useState('');
  const [note, setNote] = useState('');
  const [reviews, setReviews] = useState([]);
  const sectionRef = useRef(null);
  const animations = useRef([]);
  const timers = useRef([]);
  const dropCleanup = useRef(null);

  const cancelAnimations = () => {
    animations.current.forEach(animation => animation.cancel());
    animations.current = [];
  };

  const clearDrop = () => {
    if (!dropCleanup.current) return;
    dropCleanup.current();
    dropCleanup.current = null;
  };

  const clearTimers = () => {
    timers.current.forEach(id => clearTimeout(id));
    timers.current = [];
  };

  useEffect(
    () => () => {
      clearTimers();
      clearDrop();
      cancelAnimations();
    },
    []
  );

  const dropStars = selected => {
    const section = sectionRef.current;
    if (!section || typeof Element === 'undefined' || !Element.prototype.animate) return;
    const car = section.querySelector('.pit-rating__car');
    const row = section.querySelector('.peek-rating__row');
    const rating = section.querySelector('.peek-rating');
    if (!car || !row || !rating) return;

    clearDrop();
    const stars = Array.from(section.querySelectorAll('.peek-rating__star'));
    const falling = stars.slice(0, selected);
    const loose = stars.slice(selected);
    const carTop = car.getBoundingClientRect().top;
    rating.setAttribute('data-dropping', 'true');

    falling.forEach((star, index) => {
      const rect = star.getBoundingClientRect();
      const travel = Math.max(48, carTop - rect.top + 10);
      const lean = (index - (falling.length - 1) / 2) * 12;
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
            duration: 620 + index * 35,
            delay: index * 45,
            easing: 'cubic-bezier(0.42, 0, 0.86, 0.38)',
            fill: 'forwards'
          }
        )
      );
    });

    loose.forEach(star => {
      star.style.opacity = '0';
      star.style.pointerEvents = 'none';
    });

    let orbit = null;
    let raf = 0;
    let cancelLoop = null;
    dropCleanup.current = () => {
      if (cancelLoop) cancelLoop();
      if (orbit) orbit.remove();
      rating.removeAttribute('data-dropping');
      stars.forEach(star => {
        star.style.opacity = '';
        star.style.pointerEvents = '';
      });
      cancelAnimations();
    };

    if (!loose.length) return;

    orbit = document.createElement('div');
    orbit.className = 'pit-rating__gravity';
    orbit.setAttribute('aria-hidden', 'true');
    const canvas = document.createElement('canvas');
    canvas.className = 'pit-rating__gravity-burst';
    orbit.appendChild(canvas);
    section.appendChild(orbit);

    const sectionRect = section.getBoundingClientRect();
    const rowRect = row.getBoundingClientRect();
    const width = Math.max(160, Math.round(rowRect.width));
    const height = 120;
    orbit.style.left = `${Math.round(rowRect.left - sectionRect.left)}px`;
    orbit.style.top = `${Math.round(rowRect.top - sectionRect.top)}px`;
    orbit.style.width = `${width}px`;
    orbit.style.height = `${height}px`;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    const context = canvas.getContext('2d');
    if (context) context.setTransform(dpr, 0, 0, dpr, 0, 0);

    const size = 34;
    const particles = [];
    const rings = [];
    const colors = ['#ffd400', '#ffe98a', '#ff8a1f', '#f7f5f0', '#e10600'];

    const burst = body => {
      if (body.dead) return;
      body.dead = true;
      body.node.remove();
      for (let i = 0; i < 44; i += 1) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 70 + Math.random() * 340;
        particles.push({
          x: body.x,
          y: body.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 40,
          life: 0,
          max: 0.45 + Math.random() * 0.65,
          size: 1.2 + Math.random() * 2.8,
          color: colors[Math.floor(Math.random() * colors.length)]
        });
      }
      rings.push({ x: body.x, y: body.y, life: 0, max: 0.46 });
    };

    const bodies = loose.map((star, index) => {
      const rect = star.getBoundingClientRect();
      const glyph = star.querySelector('.peek-rating__glyph svg');
      const node = document.createElement('button');
      node.type = 'button';
      node.tabIndex = -1;
      node.className = 'pit-rating__gravity-star';
      if (glyph) node.innerHTML = glyph.outerHTML;
      const body = {
        x: rect.left + rect.width / 2 - rowRect.left,
        y: rect.top + rect.height / 2 - rowRect.top,
        vx: (index - (loose.length - 1) / 2) * 55 + (Math.random() * 80 - 40),
        vy: -180 - Math.random() * 90,
        rot: Math.random() * 50 - 25,
        vr: Math.random() * 160 - 80,
        node,
        dead: false
      };
      node.style.transform = `translate3d(${body.x - size / 2}px, ${body.y - size / 2}px, 0) rotate(${body.rot}deg)`;
      node.addEventListener('click', event => {
        event.preventDefault();
        event.stopPropagation();
        burst(body);
      });
      orbit.appendChild(node);
      return body;
    });

    let last = performance.now();
    const draw = now => {
      const dt = Math.min(0.032, Math.max(0.001, (now - last) / 1000));
      last = now;

      bodies.forEach(body => {
        if (body.dead) return;
        body.vy += 1450 * dt;
        body.x += body.vx * dt;
        body.y += body.vy * dt;
        body.rot += body.vr * dt;
        const half = size / 2;
        if (body.x < half) {
          body.x = half;
          body.vx = Math.abs(body.vx) * 0.62;
        } else if (body.x > width - half) {
          body.x = width - half;
          body.vx = -Math.abs(body.vx) * 0.62;
        }
        if (body.y < half) {
          body.y = half;
          body.vy = Math.abs(body.vy) * 0.5;
        } else if (body.y > height - half - 4) {
          body.y = height - half - 4;
          body.vy = Math.abs(body.vy) > 140 ? -Math.abs(body.vy) * 0.56 : 0;
          body.vx *= 0.95;
        }
        body.node.style.transform = `translate3d(${body.x - half}px, ${body.y - half}px, 0) rotate(${body.rot}deg)`;
      });

      for (let i = particles.length - 1; i >= 0; i -= 1) {
        const particle = particles[i];
        particle.life += dt;
        if (particle.life >= particle.max) {
          particles.splice(i, 1);
          continue;
        }
        particle.vy += 360 * dt;
        particle.x += particle.vx * dt;
        particle.y += particle.vy * dt;
        particle.vx *= 0.992;
      }
      for (let i = rings.length - 1; i >= 0; i -= 1) {
        rings[i].life += dt;
        if (rings[i].life >= rings[i].max) rings.splice(i, 1);
      }

      if (context) {
        context.clearRect(0, 0, width, height);
        context.globalCompositeOperation = 'lighter';
        particles.forEach(particle => {
          const alpha = 1 - particle.life / particle.max;
          context.globalAlpha = Math.max(0, alpha);
          context.fillStyle = particle.color;
          context.beginPath();
          context.arc(particle.x, particle.y, particle.size * (0.6 + alpha * 0.6), 0, Math.PI * 2);
          context.fill();
        });
        rings.forEach(ring => {
          const progress = ring.life / ring.max;
          context.globalAlpha = (1 - progress) * 0.8;
          context.strokeStyle = '#ffd400';
          context.lineWidth = 0.8 + (1 - progress) * 2.6;
          context.beginPath();
          context.arc(ring.x, ring.y, 6 + progress * 62, 0, Math.PI * 2);
          context.stroke();
        });
        context.globalAlpha = 1;
        context.globalCompositeOperation = 'source-over';
      }
      raf = requestAnimationFrame(draw);
    };
    cancelLoop = () => cancelAnimationFrame(raf);
    raf = requestAnimationFrame(draw);
  };

  const reset = () => {
    clearDrop();
    cancelAnimations();
    setValue(0);
    setState('idle');
    setStatus('');
  };

  const handleChange = next => {
    setValue(next);
    if (next) setStatus('');
  };

  const postReview = event => {
    event.preventDefault();
    if (state !== 'idle') return;
    const text = note.trim();
    if (!value) {
      setStatus('Pick a star rating first.');
      return;
    }
    if (!text) {
      setStatus('Add a line about the lap.');
      return;
    }
    const rating = value;
    setReviews(previous => [{ id: `${Date.now()}-${previous.length}`, stars: value, text: text.slice(0, MAX_NOTE) }, ...previous].slice(0, MAX_REVIEWS));
    setNote('');
    setValue(0);
    clearTimers();
    clearDrop();
    cancelAnimations();

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setState('idle');
      setStatus('Review posted below.');
      timers.current.push(setTimeout(() => setStatus(''), 4200));
      return;
    }

    setState('ok');
    setStatus('Sending your lap to the pit wall.');
    timers.current.push(
      setTimeout(() => {
        setState('falling');
        setStatus('Posting it below. Tap a spare star.');
        dropStars(rating);
      }, 640)
    );
    timers.current.push(
      setTimeout(() => {
        setState('leaving');
        setStatus('');
      }, 1520)
    );
    timers.current.push(
      setTimeout(() => {
        setState('idle');
        setStatus('Review posted below.');
        clearDrop();
      }, 9000)
    );
    timers.current.push(setTimeout(() => setStatus(''), 12000));
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

      <form className="pit-rating__form" onSubmit={postReview}>
        <label className="pit-rating__field">
          <span>Leave a note</span>
          <textarea
            id="pit-review-note"
            name="reviewNote"
            rows={2}
            maxLength={MAX_NOTE}
            value={note}
            onInput={event => setNote(event.currentTarget.value)}
            placeholder="What did the lap feel like?"
          />
        </label>
        <button className="pit-rating__send" type="submit" disabled={state !== 'idle'} aria-label="Post review and send the car">
          <span className="back" aria-hidden="true" />
          <span className="front" aria-hidden="true">
            <Arrow />
          </span>
        </button>
      </form>

      <div className="pit-rating__stage" aria-hidden="true">
        <span className="pit-rating__road" />
        <div className="pit-rating__car">
          <span className="pit-rating__say">Thank you</span>
          <Car />
        </div>
      </div>

      <div className="pit-rating__log">
        <p className="pit-rating__log-head">
          Pit wall notes <span>{reviews.length ? `${reviews.length} logged this visit` : 'waiting for the first lap'}</span>
        </p>
        {reviews.length ? (
          <ol className="pit-rating__log-list">
            {reviews.map(review => (
              <li key={review.id}>
                <span className="sr-only">{review.stars} out of 5. </span>
                <p className="pit-rating__log-stars" aria-hidden="true">
                  {'★'.repeat(review.stars)}
                  <span>{'★'.repeat(5 - review.stars)}</span>
                </p>
                <p className="pit-rating__log-text">{review.text}</p>
                <span className="pit-rating__log-meta">
                  {LABELS[review.stars - 1]} · just now
                </span>
              </li>
            ))}
          </ol>
        ) : (
          <p className="pit-rating__log-empty">No notes yet. Rate the lap, leave a line, and send it down.</p>
        )}
      </div>
    </section>
  );
}

const host = document.getElementById('pit-rating-mount');

if (host) {
  render(<PitRating />, host);
  host.dataset.mounted = 'true';
}
