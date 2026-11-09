/* TurboTutor motion layer: hand-written springs, ticker, scroll work and canvas set pieces. */
(() => {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const showsMotion = () => !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasPointer = () => window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ---------- shared ticker: one rAF, reference counted ---------- */
  const subscribers = new Set();
  let frame = 0;
  function tick(now) {
    if (document.hidden) {
      frame = requestAnimationFrame(tick);
      return;
    }
    for (const sub of Array.from(subscribers)) {
      if (sub.fps && now - sub.last < sub.fps) continue;
      sub.last = now;
      try {
        if (sub.fn(now) === false) subscribers.delete(sub);
      } catch (error) {
        console.error("[TurboTutor motion]", error);
        subscribers.delete(sub);
      }
    }
    frame = subscribers.size ? requestAnimationFrame(tick) : 0;
  }
  function every(fn, fps = 0) {
    const sub = { fn, fps, last: 0 };
    subscribers.add(sub);
    if (!frame) frame = requestAnimationFrame(tick);
    return () => {
      subscribers.delete(sub);
      if (!subscribers.size && frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    };
  }

  /* ---------- spring (tension/friction, mass 1, 1ms substeps) ---------- */
  class Spring {
    constructor(value, { tension = 170, friction = 26, precision = 0.01 } = {}) {
      this.value = value;
      this.target = value;
      this.velocity = 0;
      this.tension = tension;
      this.friction = friction;
      this.precision = precision;
    }
    to(value) {
      this.target = value;
      return this;
    }
    jump(value) {
      this.value = value;
      this.target = value;
      this.velocity = 0;
      return this;
    }
    step(dt) {
      let remaining = Math.min(Math.max(dt, 0), 64);
      while (remaining > 0) {
        const h = Math.min(1, remaining);
        remaining -= h;
        const force = -this.tension * (this.value - this.target) - this.friction * this.velocity;
        this.velocity += (force * h) / 1000;
        this.value += (this.velocity * h) / 1000;
      }
      if (Math.abs(this.value - this.target) < this.precision && Math.abs(this.velocity) < 0.01) {
        this.value = this.target;
        this.velocity = 0;
      }
      return this.value;
    }
    get done() {
      return this.value === this.target && this.velocity === 0;
    }
  }

  const easeOutQuad = (t) => 1 - (1 - t) * (1 - t);
  const easeInOutSine = (t) => -(Math.cos(Math.PI * t) - 1) / 2;

  /* ---------- text engine ---------- */
  function splitWords(element) {
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    for (const node of nodes) {
      if (!node.nodeValue || !node.nodeValue.trim()) continue;
      const fragment = document.createDocumentFragment();
      node.nodeValue.split(/(\s+)/).forEach((part) => {
        if (!part) return;
        if (/^\s+$/.test(part)) {
          fragment.appendChild(document.createTextNode(" "));
          return;
        }
        const span = document.createElement("span");
        span.className = "w";
        span.textContent = part;
        fragment.appendChild(span);
      });
      node.replaceWith(fragment);
    }
    element.classList.add("split");
    return $$(".w", element);
  }

  const groups = [];
  function revealWords(words, { base = 0, stagger = 28 } = {}) {
    if (!words.length) return;
    if (!showsMotion()) {
      words.forEach((word) => {
        word.style.opacity = "1";
        word.style.transform = "none";
      });
      return;
    }
    const starts = words.map((_, index) => performance.now() + base + index * stagger);
    words.forEach((word) => {
      word.style.opacity = "0";
      word.style.transform = "translateY(0.38em)";
    });
    const springs = words.map(() => new Spring(0, { tension: 190, friction: 26, precision: 0.001 }));
    let last = performance.now();
    every((now) => {
      const dt = now - last;
      last = now;
      let active = false;
      springs.forEach((spring, index) => {
        if (now < starts[index]) {
          active = true;
          return;
        }
        spring.to(1);
        spring.step(dt);
        const value = spring.value;
        words[index].style.opacity = String(value);
        words[index].style.transform = `translateY(${(1 - value) * 0.38}em)`;
        if (!spring.done) active = true;
      });
      if (!active) {
        words.forEach((word) => {
          word.style.opacity = "";
          word.style.transform = "";
        });
        return false;
      }
      return true;
    });
  }

  const splitGroups = [];
  function prepareSplits() {
    for (const element of $$(".hero h1, .h2")) {
      const words = splitWords(element);
      splitGroups.push({ element, words, hero: Boolean(element.closest(".hero")) });
    }
  }

  function watchSplits() {
    if (!("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const group = splitGroups.find((item) => item.element === entry.target);
          if (group && group.hero) {
            observer.unobserve(entry.target);
            continue;
          }
          if (group && !group.done) {
            group.done = true;
            revealWords(group.words, { base: 0, stagger: 24 });
          }
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0% 0% -12% 0%", threshold: 0.2 }
    );
    splitGroups.forEach((group) => observer.observe(group.element));
  }

  /* ---------- hero entrance ---------- */
  let handover = false;

  function startHeroEntrance() {
    if (handover) return;
    handover = true;
    document.body.classList.add("is-ready");
    const heroWords = splitGroups.find((group) => group.element.closest(".hero"));
    if (heroWords) {
      heroWords.done = true;
      revealWords(heroWords.words, { base: 60, stagger: 80 });
    }
    enterHeroBits();
  }

  const heroBits = [];
  function prepareHeroBits() {
    if (!showsMotion()) return;
    for (const element of $$(".hero .eyebrow, .hero .hero-lede, .hero .hero-actions, .hero .hero-chips, .hero .hero-visual, .hero .hero-plate")) {
      element.style.opacity = "0";
      element.style.transform = "translateY(18px)";
      heroBits.push({ element, spring: new Spring(0, { tension: 150, friction: 26 }) });
    }
  }

  function enterHeroBits() {
    if (!heroBits.length) return;
    if (!showsMotion()) {
      heroBits.forEach(({ element }) => {
        element.style.opacity = "";
        element.style.transform = "";
      });
      return;
    }
    const starts = heroBits.map((_, index) => performance.now() + 120 + index * 110);
    let last = performance.now();
    every((now) => {
      const dt = now - last;
      last = now;
      let active = false;
      heroBits.forEach((bit, index) => {
        if (now < starts[index]) {
          active = true;
          return;
        }
        bit.spring.to(1);
        bit.spring.step(dt);
        bit.element.style.opacity = String(clamp(bit.spring.value, 0, 1));
        bit.element.style.transform = `translateY(${(1 - bit.spring.value) * 18}px)`;
        if (!bit.spring.done) active = true;
      });
      if (!active) {
        heroBits.forEach(({ element }) => {
          element.style.opacity = "";
          element.style.transform = "";
        });
        return false;
      }
      return true;
    });
  }

  prepareSplits();
  prepareHeroBits();
  watchSplits();

  startHeroEntrance();

  /* ---------- page wipe ---------- */
  (function wipe() {
    const node = $("#page-wipe");
    if (!node) return;
    requestAnimationFrame(() => node.classList.add("is-out"));
    document.addEventListener("click", (event) => {
      const link = event.target.closest("a[href]");
      if (!link) return;
      if (link.target || link.hasAttribute("download")) return;
      const href = link.getAttribute("href");
      if (!href || !/\.html(?:$|[?#])/.test(href)) return;
      if (link.origin !== window.location.origin) return;
      event.preventDefault();
      node.classList.remove("is-out");
      node.classList.add("is-in");
      const go = () => {
        window.location.href = href;
      };
      if (showsMotion()) {
        window.setTimeout(go, 420);
      } else {
        go();
      }
    });
  })();

  /* ---------- scroll: progress, header, hero recede, mobile CTA ---------- */
  const scrollBar = $("#scroll-bar");
  const scrollSpring = new Spring(0, { tension: 140, friction: 28, precision: 0.001 });
  const header = $("#site-header");
  const mobileCta = $("#mobile-cta");
  const floatContact = $("#float-contact");
  const hero = $(".hero");
  const heroShade = $(".hero-shade");
  const ticker = $(".hero + .ticker") || $(".ticker");
  const promiseSection = $(".promise");
  let lastY = window.scrollY;
  let lastStamp = performance.now();

  every((now) => {
    const dt = now - lastStamp;
    lastStamp = now;
    scrollSpring.step(dt);
    if (scrollBar) scrollBar.style.transform = `scaleX(${clamp(scrollSpring.value, 0, 1)})`;

    const y = window.scrollY;
    const height = document.documentElement.scrollHeight - window.innerHeight;
    scrollSpring.to(height > 0 ? clamp(y / height, 0, 1) : 0);

    const down = y > lastY + 2;
    const up = y < lastY - 2;
    if (header) {
      if (down && y > 240) header.classList.add("is-tucked");
      else if (up || y < 120) header.classList.remove("is-tucked");
      if (document.body.classList.contains("no-scroll")) header.classList.remove("is-tucked");
    }
    if (mobileCta) mobileCta.classList.toggle("is-on", y > 380);
    if (floatContact) floatContact.classList.toggle("is-on", y > window.innerHeight * 0.7);

    if (hero && ticker && showsMotion() && y < window.innerHeight * 1.1) {
      const rect = ticker.getBoundingClientRect();
      const p = clamp(1 - rect.top / window.innerHeight, 0, 1);
      hero.style.transform = p > 0 ? `scale(${1 - 0.055 * p})` : "";
      if (heroShade) heroShade.style.opacity = String(0.5 * p);
    }
    lastY = y;
  }, 33);

  window.TTMotion = {
    setProgress(value) {
      scrollSpring.to(clamp(value, 0, 1));
    }
  };

  /* ---------- magnetic controls ---------- */
  (function magnetic() {
    if (!hasPointer() || !showsMotion()) return;
    const targets = $$(".btn, .kart-btn, .menu-btn");
    const items = targets.slice(0, 14).map((element) => ({
      element,
      springX: new Spring(0, { tension: 220, friction: 22, precision: 0.01 }),
      springY: new Spring(0, { tension: 220, friction: 22, precision: 0.01 }),
      pull: 0.14
    }));
    let last = performance.now();
    window.addEventListener(
      "pointermove",
      (event) => {
        for (const item of items) {
          const rect = item.element.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          const distance = Math.hypot(event.clientX - cx, event.clientY - cy);
          const near = distance < Math.max(rect.width, rect.height) * 0.9;
          item.springX.to(near ? (event.clientX - cx) * item.pull : 0);
          item.springY.to(near ? (event.clientY - cy) * item.pull : 0);
        }
      },
      { passive: true }
    );
    let running = false;
    const loop = (now) => {
      const dt = now - last;
      last = now;
      let active = false;
      for (const item of items) {
        item.springX.step(dt);
        item.springY.step(dt);
        if (item.springX.value || item.springY.value) {
          item.element.style.transform = `translate(${item.springX.value}px, ${item.springY.value}px)`;
          active = true;
        }
      }
      if (!active) {
        running = false;
        return false;
      }
      return true;
    };
    const kick = () => {
      if (running) return;
      running = true;
      last = performance.now();
      every(loop);
    };
    window.addEventListener("pointermove", kick, { passive: true });
  })();

  /* ---------- hero pointer parallax ---------- */
  (function heroParallax() {
    if (!hasPointer() || !showsMotion()) return;
    const visual = $(".hero-visual");
    const plate = $(".hero-panels") || $(".hero-plate");
    if (!visual) return;
    const px = new Spring(0, { tension: 90, friction: 22, precision: 0.001 });
    const py = new Spring(0, { tension: 90, friction: 22, precision: 0.001 });
    let heroVisible = true;
    if ("IntersectionObserver" in window) {
      new IntersectionObserver((entries) => { heroVisible = entries[0].isIntersecting; }).observe(visual);
    }
    let last = performance.now();
    window.addEventListener(
      "pointermove",
      (event) => {
        const nx = (event.clientX / window.innerWidth) * 2 - 1;
        const ny = (event.clientY / window.innerHeight) * 2 - 1;
        px.to(nx);
        py.to(ny);
      },
      { passive: true }
    );
    every((now) => {
      if (!heroVisible) { last = now; return; }
      const dt = now - last;
      last = now;
      px.step(dt);
      py.step(dt);
      visual.style.transform = `translate3d(${px.value * -12}px, ${py.value * -8}px, 0)`;
      if (plate) plate.style.transform = `translate3d(${px.value * 6}px, ${py.value * 5}px, 0)`;
    }, 33);
  })();

  /* ---------- scroll parallax on framed artwork ---------- */
  (function parallaxPlates() {
    if (!showsMotion()) return;
    const targets = $$(".promise-art, .contact-aside, .gear-art").slice(0, 4);
    if (!targets.length) return;
    every(() => {
      for (const element of targets) {
        const rect = element.getBoundingClientRect();
        if (rect.bottom < -200 || rect.top > window.innerHeight + 200) continue;
        const p = (rect.top + rect.height / 2 - window.innerHeight / 2) / window.innerHeight;
        element.style.transform = `translate3d(0, ${p * 34}px, 0)`;
      }
    }, 100);
  })();

  /* ---------- contour backdrop (marching squares) ---------- */
  (function contours() {
    const canvases = $$(".contours, [data-sonar]");
    if (!canvases.length) return;
    const reduced = !showsMotion();
    const setups = [];
    const start = performance.now();

    const field = (x, y, t) =>
      (Math.sin(x * 0.0052 + t * 0.00021) * 0.5 +
        Math.sin(y * 0.0061 - t * 0.00017) * 0.45 +
        Math.sin((x + y) * 0.0038 + t * 0.00012) * 0.35 +
        Math.sin((x - y) * 0.0047 - t * 0.00019) * 0.25) *
        0.5 +
      0.5;

    const palette = (setup) => {
      const dark = document.documentElement.dataset.theme === "dark";
      if (setup.tone === "plans") {
        if (dark) {
          return [
            { level: 0.3, color: "rgba(239, 244, 242, 0.11)", width: 1 },
            { level: 0.5, color: "rgba(255, 212, 0, 0.14)", width: 1 },
            { level: 0.7, color: "rgba(255, 255, 255, 0.1)", width: 1.1 }
          ];
        }
        return [
          { level: 0.3, color: "rgba(18, 26, 31, 0.1)", width: 1 },
          { level: 0.5, color: "rgba(18, 26, 31, 0.16)", width: 1 },
          { level: 0.7, color: "rgba(225, 6, 0, 0.12)", width: 1.1 }
        ];
      }
      return [
        { level: 0.28, color: "rgba(255, 241, 197, 0.13)", width: 1 },
        { level: 0.42, color: "rgba(255, 255, 255, 0.18)", width: 1 },
        { level: 0.56, color: "rgba(255, 212, 0, 0.22)", width: 1.1 },
        { level: 0.7, color: "rgba(255, 255, 255, 0.15)", width: 1 },
        { level: 0.84, color: "rgba(225, 6, 0, 0.17)", width: 1.2 }
      ];
    };

    function resize(setup) {
      const rect = setup.canvas.getBoundingClientRect();
      setup.dpr = Math.min(window.devicePixelRatio || 1, setup.tone === "plans" ? 1 : 1.35);
      setup.width = Math.max(1, rect.width);
      setup.height = Math.max(1, rect.height);
      setup.canvas.width = Math.round(setup.width * setup.dpr);
      setup.canvas.height = Math.round(setup.height * setup.dpr);
      setup.ctx.setTransform(setup.dpr, 0, 0, setup.dpr, 0, 0);
      draw(setup, performance.now() - start);
    }

    function draw(setup, time) {
      const { ctx, width, height, step } = setup;
      if (!width || !height) return;
      ctx.clearRect(0, 0, width, height);
      const cols = Math.ceil(width / step);
      const rows = Math.ceil(height / step);
      const values = new Float32Array((cols + 1) * (rows + 1));
      for (let j = 0; j <= rows; j++) {
        for (let i = 0; i <= cols; i++) {
          values[j * (cols + 1) + i] = field(i * step, j * step, time);
        }
      }
      const at = (i, j) => values[j * (cols + 1) + i] || 0;
      ctx.lineJoin = "round";
      for (const tone of palette(setup)) {
        const level = tone.level;
        ctx.strokeStyle = tone.color;
        ctx.lineWidth = tone.width;
        ctx.beginPath();
        for (let j = 0; j < rows; j++) {
          for (let i = 0; i < cols; i++) {
            const a = at(i, j);
            const b = at(i + 1, j);
            const c = at(i + 1, j + 1);
            const d = at(i, j + 1);
            let index = 0;
            if (a > level) index |= 8;
            if (b > level) index |= 4;
            if (c > level) index |= 2;
            if (d > level) index |= 1;
            if (index === 0 || index === 15) continue;
            const x = i * step;
            const y = j * step;
            const top = [x + step * ((level - a) / (b - a || 1e-9)), y];
            const right = [x + step, y + step * ((level - b) / (c - b || 1e-9))];
            const bottom = [x + step * ((level - d) / (c - d || 1e-9)), y + step];
            const left = [x, y + step * ((level - a) / (d - a || 1e-9))];
            const seg = (p, q) => {
              ctx.moveTo(p[0], p[1]);
              ctx.lineTo(q[0], q[1]);
            };
            switch (index) {
              case 1:
              case 14:
                seg(left, bottom);
                break;
              case 2:
              case 13:
                seg(bottom, right);
                break;
              case 3:
              case 12:
                seg(left, right);
                break;
              case 4:
              case 11:
                seg(top, right);
                break;
              case 5:
                seg(left, top);
                seg(bottom, right);
                break;
              case 6:
              case 9:
                seg(top, bottom);
                break;
              case 7:
              case 8:
                seg(left, top);
                break;
              case 10:
                seg(left, bottom);
                seg(top, right);
                break;
              default:
                break;
            }
          }
        }
        ctx.stroke();
      }
    }

    for (const canvas of canvases) {
      const ctx = canvas.getContext("2d");
      if (!ctx) continue;
      const setup = {
        canvas,
        ctx,
        width: 0,
        height: 0,
        dpr: 1,
        visible: true,
        tone: canvas.dataset.sonar || "hero",
        step: canvas.dataset.sonar === "plans" ? 52 : 34
      };
      setups.push(setup);
      resize(setup);
      if ("IntersectionObserver" in window) {
        new IntersectionObserver((entries) => {
          setup.visible = entries[0].isIntersecting;
          if (setup.visible) draw(setup, performance.now() - start);
        }).observe(canvas);
      }
      if ("ResizeObserver" in window) {
        new ResizeObserver(() => resize(setup)).observe(canvas);
      } else {
        window.addEventListener("resize", () => resize(setup));
      }
    }

    if (!reduced) {
      every((now) => {
        for (const setup of setups) {
          if (setup.visible) draw(setup, now - start);
        }
      }, 42);
    }
  })();

  /* ---------- chequered seams ---------- */
  (function seams() {
    const hash = (x, y) => {
      let h = Math.imul(x, 374761393) + Math.imul(y, 668265263);
      h = Math.imul(h ^ (h >>> 13), 1274126177);
      return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
    };
    for (const canvas of $$(".flag-seam")) {
      const section = canvas.closest("section");
      if (!section) continue;
      const ctx = canvas.getContext("2d");
      if (!ctx) continue;
      const light = canvas.dataset.carry === "light";
      let width = 0;
      let height = 0;
      let dpr = 1;
      let progress = 0;
      const cell = 22;

      const surface = light ? "#f5f3ee" : "#0b0e11";
      const accent = "#ffd400";

      function resize() {
        const rect = canvas.getBoundingClientRect();
        dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        width = Math.max(1, rect.width);
        height = Math.max(1, rect.height);
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        draw();
      }

      function draw() {
        ctx.clearRect(0, 0, width, height);
        const columns = Math.ceil(width / cell) + 1;
        const rows = Math.ceil(height / cell) + 1;
        const lift = progress * 2;
        for (let y = 0; y < rows; y++) {
          const depth = y / Math.max(1, rows - 1) + lift;
          if (depth > 1) break;
          const solid = depth <= 0.16;
          const fade = clamp(1 - (depth - 0.16) / (1 - 0.16), 0, 1);
          if (!solid && fade <= 0) break;
          for (let x = 0; x < columns; x++) {
            if (!solid) {
              if ((x + y) % 2 !== 0) continue;
              if (hash(x, y) > fade) continue;
            }
            const alternate = !solid && hash(x + 101, y + 57) < 0.06;
            ctx.fillStyle = alternate ? accent : surface;
            ctx.fillRect(x * cell, y * cell, cell, cell);
          }
        }
      }

      if ("ResizeObserver" in window) new ResizeObserver(resize).observe(canvas);
      else window.addEventListener("resize", resize);
      resize();


    }
  })();

  /* ---------- circuit panel: halftone, lap trace, reticle ---------- */
  (function circuit() {
    const panel = $(".track-panel");
    const dotsCanvas = $("[data-map-dots]");
    const traceCanvas = $("[data-map-trace]");
    const path = $("#track-path");
    if (!panel || !dotsCanvas || !traceCanvas || !path) return;
    const dotsCtx = dotsCanvas.getContext("2d");
    const traceCtx = traceCanvas.getContext("2d");
    if (!dotsCtx || !traceCtx) return;
    const dotsVisible = getComputedStyle(dotsCanvas).visibility !== "hidden";

    const W = 760;
    const H = 470;
    const ACCENT = [255, 212, 0];
    const BRIGHT = [255, 241, 168];
    const WHITE = [255, 255, 255];
    const rgba = (color, alpha) => `rgb(${color[0]} ${color[1]} ${color[2]} / ${alpha})`;

    /* dots on a lattice, thinned by a smooth hash so the field looks surveyed */
    const PITCH = 9;
    const dots = [];
    for (let y = 7; y < H; y += PITCH) {
      for (let x = 7; x < W; x += PITCH) {
        const noise = Math.sin(x * 0.021 + y * 0.013) * Math.sin(x * 0.008 - y * 0.017);
        if (noise < -0.62) continue;
        dots.push([x, y]);
      }
    }

    let width = 0;
    let height = 0;
    let scale = 1;
    let dpr = 1;
    let baked = null;
    let pointer = { x: -999, y: -999, on: false };
    let visible = false;
    let armed = false;
    let running = false;

    function resize() {
      const rect = dotsCanvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      scale = width / W;
      dotsCanvas.width = Math.round(width * dpr);
      dotsCanvas.height = Math.round(height * dpr);
      traceCanvas.width = Math.round(width * dpr);
      traceCanvas.height = Math.round(height * dpr);
      dotsCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      traceCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      bake();
      drawDots();
      drawTrace(lapProgress, heat);
    }

    function bake() {
      if (!dotsVisible) return;
      baked = document.createElement("canvas");
      baked.width = dotsCanvas.width;
      baked.height = dotsCanvas.height;
      const ctx = baked.getContext("2d");
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = "rgba(255,255,255,0.2)";
      for (const [x, y] of dots) {
        ctx.beginPath();
        ctx.arc(x * scale, y * scale, Math.max(0.8, 1.45 * scale), 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function drawDots(litHead) {
      if (!dotsVisible || !baked) return;
      dotsCtx.clearRect(0, 0, width, height);
      dotsCtx.drawImage(baked, 0, 0, width, height);
      const lights = [];
      if (pointer.on) lights.push({ x: pointer.x, y: pointer.y, radius: 86, strength: 1 });
      if (litHead) lights.push({ x: litHead[0], y: litHead[1], radius: 52, strength: heat });

      if (armed && pointer.on) {
        dotsCtx.strokeStyle = "rgba(255,212,0,0.22)";
        dotsCtx.lineWidth = 1;
        dotsCtx.beginPath();
        dotsCtx.moveTo(0, pointer.y * scale);
        dotsCtx.lineTo(width, pointer.y * scale);
        dotsCtx.moveTo(pointer.x * scale, 0);
        dotsCtx.lineTo(pointer.x * scale, height);
        dotsCtx.stroke();
      }

      if (!lights.length) return;
      for (const [x, y] of dots) {
        for (const light of lights) {
          const dx = x - light.x;
          const dy = y - light.y;
          const distance = Math.hypot(dx, dy);
          if (distance > light.radius) continue;
          const near = 1 - distance / light.radius;
          const strength = near * light.strength;
          if (strength < 0.22) continue;
          const size = PITCH * (0.7 + 0.3 * Math.min(1, strength)) * 0.72 * scale;
          const checker = (Math.round(x / PITCH) + Math.round(y / PITCH)) % 2 === 0;
          dotsCtx.fillStyle = checker ? rgba(ACCENT, 0.14 + 0.5 * strength) : rgba(ACCENT, 0.05 + 0.18 * strength);
          dotsCtx.fillRect(x * scale - size / 2, y * scale - size / 2, size, size);
          break;
        }
      }
    }

    /* lap path sampling and corner-aware timing */
    const total = path.getTotalLength();
    const COUNT = 420;
    const points = [];
    for (let i = 0; i <= COUNT; i++) {
      const p = path.getPointAtLength((total * i) / COUNT);
      points.push([p.x, p.y]);
    }
    const cumulative = [0];
    for (let i = 1; i < points.length; i++) {
      cumulative.push(cumulative[i - 1] + Math.hypot(points[i][0] - points[i - 1][0], points[i][1] - points[i - 1][1]));
    }
    const length = cumulative[cumulative.length - 1];
    const turn = new Array(points.length).fill(0);
    for (let i = 1; i < points.length - 1; i++) {
      const ax = points[i - 1][0];
      const ay = points[i - 1][1];
      const bx = points[i][0];
      const by = points[i][1];
      const cx = points[i + 1][0];
      const cy = points[i + 1][1];
      const ux = bx - ax;
      const uy = by - ay;
      const vx = cx - bx;
      const vy = cy - by;
      const denominator = (Math.hypot(ux, uy) || 1) * (Math.hypot(vx, vy) || 1);
      turn[i] = Math.acos(clamp((ux * vx + uy * vy) / denominator, -1, 1));
    }
    const smoothed = turn.map((_, index) => {
      let sum = 0;
      let n = 0;
      for (let j = Math.max(0, index - 6); j <= Math.min(turn.length - 1, index + 6); j++) {
        sum += turn[j];
        n += 1;
      }
      return sum / n;
    });
    const timeAt = [0];
    for (let i = 1; i < points.length; i++) {
      const span = cumulative[i] - cumulative[i - 1];
      const speed = 1 / (1 + 9 * smoothed[i]);
      timeAt.push(timeAt[i - 1] + span / speed);
    }
    const timeTotal = timeAt[timeAt.length - 1] || 1;
    for (let i = 0; i < timeAt.length; i++) timeAt[i] /= timeTotal;

    function distanceAtTime(t) {
      if (t <= 0) return 0;
      if (t >= 1) return length;
      let low = 0;
      let high = timeAt.length - 1;
      while (low < high - 1) {
        const mid = (low + high) >> 1;
        if (timeAt[mid] <= t) low = mid;
        else high = mid;
      }
      const span = timeAt[high] - timeAt[low] || 1;
      const ratio = (t - timeAt[low]) / span;
      return cumulative[low] + (cumulative[high] - cumulative[low]) * ratio;
    }

    function trailUpTo(distance) {
      const out = [];
      for (let i = 0; i < points.length; i++) {
        if (cumulative[i] <= distance) {
          out.push(points[i]);
          continue;
        }
        const a = points[i - 1];
        const b = points[i];
        const ratio = (distance - cumulative[i - 1]) / (cumulative[i] - cumulative[i - 1] || 1);
        out.push([a[0] + (b[0] - a[0]) * ratio, a[1] + (b[1] - a[1]) * ratio]);
        break;
      }
      return out;
    }

    /* markers */
    const markerCount = 4;
    const markers = [];
    const pinGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    const svg = $(".map-svg", panel);
    if (svg) svg.appendChild(pinGroup);
    for (let i = 0; i < markerCount; i++) {
      const distance = length * (0.06 + (i / markerCount) * 0.92);
      let nearest = 0;
      for (let j = 0; j < cumulative.length; j++) {
        if (cumulative[j] <= distance) nearest = j;
      }
      const p = points[nearest];
      const triangle = document.createElementNS("http://www.w3.org/2000/svg", "path");
      triangle.setAttribute("d", "M0 -7 L6.2 5 L-6.2 5 Z");
      triangle.setAttribute("class", "map-pin");
      triangle.setAttribute("transform", `translate(${p[0]} ${p[1]})`);
      pinGroup.appendChild(triangle);
      markers.push({ el: triangle, d: distance, x: p[0], y: p[1] });
    }

    let lapProgress = 0;
    let heat = 0;
    let lapStart = 0;
    let cooling = false;
    let coolStart = 0;

    function stroke(ctx, pts, from = 0) {
      ctx.beginPath();
      ctx.moveTo(pts[from][0] * scale, pts[from][1] * scale);
      for (let i = from + 1; i < pts.length; i++) ctx.lineTo(pts[i][0] * scale, pts[i][1] * scale);
      ctx.stroke();
    }

    function drawTrace(progress, hot) {
      traceCtx.clearRect(0, 0, width, height);
      if (progress <= 0.001) {
        drawDots(null);
        return;
      }
      const distance = distanceAtTime(progress);
      const pts = trailUpTo(distance);
      if (pts.length < 2) {
        drawDots(null);
        return;
      }
      const lineWidth = Math.max(2.4, 5.4 * scale);
      traceCtx.lineCap = "round";
      traceCtx.lineJoin = "round";

      traceCtx.save();
      traceCtx.globalCompositeOperation = "lighter";
      traceCtx.strokeStyle = rgba(ACCENT, 0.06);
      traceCtx.lineWidth = 16 * scale;
      stroke(traceCtx, pts);
      traceCtx.strokeStyle = rgba(ACCENT, 0.11);
      traceCtx.lineWidth = 7.4 * scale;
      stroke(traceCtx, pts);
      traceCtx.restore();

      const head = Math.max(2, Math.round(190 / 3.2));
      const from = Math.max(0, pts.length - head);
      const tip = pts[pts.length - 1];
      const gradient = traceCtx.createLinearGradient(
        pts[from][0] * scale,
        pts[from][1] * scale,
        tip[0] * scale,
        tip[1] * scale
      );
      gradient.addColorStop(0, rgba(ACCENT, 0));
      gradient.addColorStop(0.45, rgba(ACCENT, 0.9));
      gradient.addColorStop(1, rgba(hot > 0.5 ? BRIGHT : ACCENT, 1));
      traceCtx.strokeStyle = gradient;
      traceCtx.lineWidth = lineWidth;
      stroke(traceCtx, pts, from);

      const coreFrom = Math.max(0, pts.length - Math.round(head * 0.42));
      if (pts.length - coreFrom > 1) {
        const core = traceCtx.createLinearGradient(
          pts[coreFrom][0] * scale,
          pts[coreFrom][1] * scale,
          tip[0] * scale,
          tip[1] * scale
        );
        core.addColorStop(0, rgba(BRIGHT, 0));
        core.addColorStop(1, rgba(WHITE, 0.92 * hot));
        traceCtx.strokeStyle = core;
        traceCtx.lineWidth = Math.max(lineWidth * 0.34, 1);
        stroke(traceCtx, pts, coreFrom);
      }

      if (hot > 0.02) {
        traceCtx.save();
        traceCtx.globalCompositeOperation = "lighter";
        const spark = traceCtx.createRadialGradient(
          tip[0] * scale,
          tip[1] * scale,
          0,
          tip[0] * scale,
          tip[1] * scale,
          lineWidth * 3
        );
        spark.addColorStop(0, rgba(WHITE, 0.8 * hot));
        spark.addColorStop(0.35, rgba(BRIGHT, 0.36 * hot));
        spark.addColorStop(1, rgba(ACCENT, 0));
        traceCtx.fillStyle = spark;
        traceCtx.beginPath();
        traceCtx.arc(tip[0] * scale, tip[1] * scale, lineWidth * 3, 0, Math.PI * 2);
        traceCtx.fill();
        traceCtx.restore();
      }

      for (const marker of markers) {
        if (distance < marker.d) continue;
        const age = clamp((distance - marker.d) / 60, 0, 1);
        const radius = (12 + (1 - age) * 12) * scale;
        const glow = traceCtx.createRadialGradient(
          marker.x * scale,
          marker.y * scale,
          0,
          marker.x * scale,
          marker.y * scale,
          radius
        );
        glow.addColorStop(0, rgba(BRIGHT, 0.5 + 0.4 * (1 - age)));
        glow.addColorStop(0.5, rgba(ACCENT, 0.22));
        glow.addColorStop(1, rgba(ACCENT, 0));
        traceCtx.save();
        traceCtx.globalCompositeOperation = "lighter";
        traceCtx.fillStyle = glow;
        traceCtx.beginPath();
        traceCtx.arc(marker.x * scale, marker.y * scale, radius, 0, Math.PI * 2);
        traceCtx.fill();
        traceCtx.restore();
      }

      drawDots([tip[0], tip[1]]);
    }

    function lightMarkers(progress) {
      const distance = distanceAtTime(progress);
      for (const marker of markers) marker.el.classList.toggle("is-lit", distance >= marker.d);
    }

    function startLap() {
      if (running || lapProgress > 0) return;
      running = true;
      lapStart = performance.now();
      const hint = $("#map-hint");
      if (hint) hint.innerHTML = "Lap in progress · <b>turn markers live</b>";
    }

    function frameLap(now) {
      if (!running) return;
      const elapsed = now - lapStart;
      if (elapsed < 6000) {
        lapProgress = easeInOutSine(clamp(elapsed / 6000, 0, 1));
        heat = 1;
      } else if (!cooling) {
        cooling = true;
        heat = 1;
        lapProgress = 1;
        coolStart = now;
        const hint = $("#map-hint");
        if (hint) hint.innerHTML = "Lap complete · <b>move your cursor over the map</b>";
      }
      if (cooling) {
        const p = clamp((now - coolStart) / 800, 0, 1);
        heat = 1 - easeOutQuad(p);
        if (p >= 1) {
          running = false;
          armed = true;
          drawDots();
          return;
        }
      }
      lightMarkers(lapProgress);
      drawTrace(lapProgress, heat);
    }

    /* pointer */
    function toMap(event) {
      const rect = dotsCanvas.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * W;
      const y = ((event.clientY - rect.top) / rect.height) * H;
      return { x, y };
    }
    if (hasPointer()) {
      panel.addEventListener("pointermove", (event) => {
        const p = toMap(event);
        pointer.x = p.x;
        pointer.y = p.y;
        pointer.on = true;
        if (armed) drawDots();
      });
      panel.addEventListener("pointerleave", () => {
        pointer.on = false;
        drawDots();
      });
    }

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(
        (entries) => {
          visible = entries[0].isIntersecting;
          if (visible && entries[0].intersectionRatio > 0.35) startLap();
        },
        { threshold: [0.2, 0.36, 0.6] }
      ).observe(panel);
    } else {
      visible = true;
      startLap();
    }
    if ("ResizeObserver" in window) new ResizeObserver(resize).observe(dotsCanvas);
    else window.addEventListener("resize", resize);
    resize();

    every((now) => {
      if (!visible) return;
      frameLap(now);
      if (pointer.on && armed && dotsVisible) drawDots();
    }, 33);
  })();

  /* ---------- Paddock Club signup ---------- */
  (function paddockClub() {
    const form = $("#club-form");
    if (!form) return;
    const status = $("#club-status");
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (form.dataset.sending === "true") return;
      const input = form.querySelector("input[type=email]");
      const consent = form.querySelector("input[name=privacyAccepted]");
      const honey = form.querySelector('input[name="_honey"]');
      const button = form.querySelector('button[type=submit]');
      const email = (input.value || "").trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
        status.hidden = false;
        status.textContent = "That email does not look right. Check it and try again.";
        input.focus();
        return;
      }
      if (consent && !consent.checked) {
        status.hidden = false;
        status.textContent = "Please agree to the Privacy Policy and Terms before joining.";
        consent.focus();
        return;
      }
      if (honey && honey.value) {
        form.reset();
        status.hidden = false;
        status.innerHTML = "<b>You're in.</b> Your 5% code is <b>PADDOCK5</b>. Replying to any club email removes you from the list.";
        return;
      }
      const original = button.textContent;
      form.dataset.sending = "true";
      button.disabled = true;
      button.textContent = "Sending...";
      status.hidden = false;
      status.textContent = "Adding you to the list...";
      try {
        const response = await fetch("https://formsubmit.co/ajax/9fb3f65146a600790d7010d2c522571e", {
          method: "POST",
          credentials: "omit",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({
            email,
            privacyAccepted: "Yes",
            form: "Paddock Club signup",
            message: `Please add ${email} to the Paddock Club list for the 5% first-month discount and the Monday email.\n\nCode: PADDOCK5`,
            _subject: "Paddock Club signup: 5% off",
            _template: "table",
            _captcha: "false"
          })
        });
        let data = null;
        try {
          data = await response.json();
        } catch {
          throw new Error("The form service returned an unreadable response.");
        }
        if (!response.ok || !data || data.success === false || data.success === "false") {
          throw new Error(data?.message || "The form service refused the signup.");
        }
        form.reset();
        form.dataset.sending = "false";
        button.disabled = false;
        button.textContent = original;
        status.hidden = false;
        status.innerHTML = "<b>You're in.</b> Your 5% code is <b>PADDOCK5</b>. The tutor will send the welcome note; replying to any club email removes you from the list.";
      } catch {
        form.dataset.sending = "false";
        button.disabled = false;
        button.textContent = original;
        status.hidden = false;
        status.textContent = 'The list could not be reached just now. Send the tutor the note instead and the 5% code still applies: ';
        const mail = document.createElement("a");
        mail.href = `mailto:divit.gangrade@gmail.com?subject=${encodeURIComponent("Paddock Club signup")}&body=${encodeURIComponent(
          `Please add ${email} to the Paddock Club list for the 5% first-month discount and the Monday email.\n\nCode: PADDOCK5`
        )}`;
        mail.textContent = "email the tutor to join";
        const sms = document.createElement("a");
        sms.href = "sms:+18048473236";
        sms.textContent = "text +1 804 847 3236";
        status.append(mail, document.createTextNode(", or "), sms, document.createTextNode("."));
      }
    });
  })();

  /* ---------- FAQ accordion height animation ---------- */
  (function faq() {
    const items = $$("#faq-list details");
    if (!items.length) return;
    for (const item of items) {
      const paragraph = item.querySelector("p");
      if (!paragraph || paragraph.parentElement.classList.contains("faq-body")) continue;
      const body = document.createElement("div");
      body.className = "faq-body";
      paragraph.replaceWith(body);
      body.appendChild(paragraph);
      body.style.height = item.open ? "auto" : "0px";
      item.addEventListener("toggle", () => {
        if (!showsMotion() || item.hidden) {
          body.style.height = item.open ? "auto" : "0px";
          return;
        }
        if (item.open) {
          body.style.height = "0px";
          const target = paragraph.offsetHeight;
          body.animate(
            [
              { height: "0px", opacity: 0 },
              { height: `${target}px`, opacity: 1 }
            ],
            { duration: 380, easing: "cubic-bezier(0.2, 0.8, 0.2, 1)" }
          ).onfinish = () => {
            body.style.height = "auto";
          };
        } else {
          const from = paragraph.offsetHeight;
          body.style.height = "auto";
          body.animate(
            [
              { height: `${from}px`, opacity: 1 },
              { height: "0px", opacity: 0 }
            ],
            { duration: 300, easing: "cubic-bezier(0.4, 0, 0.6, 1)" }
          ).onfinish = () => {
            body.style.height = "0px";
          };
        }
      });
    }
  })();

})();
