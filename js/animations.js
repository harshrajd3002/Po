// ============================================================
// js/animations.js — TextScramble · Typewriter · Scroll Reveal
// ============================================================

// ---- Text Scramble -----------------------------------------
class TextScramble {
  constructor(el) {
    this.el    = el;
    this.chars = '!<>—_\\/[]{}=+*^?#@$%~';
    this.update = this.update.bind(this);
  }

  setText(newText) {
    const len     = Math.max(this.el.innerText.length, newText.length);
    const promise = new Promise(res => (this.resolve = res));

    this.queue = Array.from({ length: len }, (_, i) => ({
      from:  this.el.innerText[i] || '',
      to:    newText[i] || '',
      start: Math.floor(Math.random() * 20),
      end:   Math.floor(Math.random() * 20) + 20 + i,
      char:  '',
    }));

    cancelAnimationFrame(this.frameReq);
    this.frame = 0;
    this.update();
    return promise;
  }

  update() {
    let output   = '';
    let complete = 0;

    for (const item of this.queue) {
      const { from, to, start, end } = item;

      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!item.char || Math.random() < 0.28) {
          item.char = this._rand();
        }
        output += `<span class="scramble-char" aria-hidden="true">${item.char}</span>`;
      } else {
        output += from;
      }
    }

    this.el.innerHTML = output;

    if (complete === this.queue.length) {
      this.resolve();
    } else {
      this.frameReq = requestAnimationFrame(this.update);
      this.frame++;
    }
  }

  _rand() {
    return this.chars[Math.floor(Math.random() * this.chars.length)];
  }
}

// ---- Typewriter / Role Cycler ------------------------------
class Typewriter {
  constructor(el, phrases, opts = {}) {
    this.el      = el;
    this.phrases = phrases;
    this.opts    = {
      typeSpeed:  opts.typeSpeed  ?? 75,
      eraseSpeed: opts.eraseSpeed ?? 40,
      pauseAfter: opts.pauseAfter ?? 1800,
      pauseStart: opts.pauseStart ?? 600,
    };
    this.index   = 0;
    this.running = false;
  }

  start() {
    if (this.running) return;
    this.running = true;
    setTimeout(() => this._cycle(), this.opts.pauseStart);
  }

  stop() {
    this.running = false;
    clearTimeout(this._timer);
  }

  _cycle() {
    if (!this.running) return;
    this._type(this.phrases[this.index], () => {
      this._pause(() => {
        this._erase(() => {
          this.index = (this.index + 1) % this.phrases.length;
          this._cycle();
        });
      });
    });
  }

  _type(text, done) {
    let i = this.el.textContent.length;
    const step = () => {
      if (!this.running) return;
      if (i <= text.length) {
        this.el.textContent = text.slice(0, i);
        i++;
        this._timer = setTimeout(step, this.opts.typeSpeed);
      } else {
        done();
      }
    };
    step();
  }

  _erase(done) {
    const step = () => {
      if (!this.running) return;
      const cur = this.el.textContent;
      if (cur.length > 0) {
        this.el.textContent = cur.slice(0, -1);
        this._timer = setTimeout(step, this.opts.eraseSpeed);
      } else {
        done();
      }
    };
    step();
  }

  _pause(done) {
    this._timer = setTimeout(done, this.opts.pauseAfter);
  }
}

// ---- IntersectionObserver — scroll reveal ------------------
function initScrollReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          // Once revealed, stop observing (one-shot)
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));

  // Apply stagger delays to children of [data-stagger]
  document.querySelectorAll('[data-stagger]').forEach(parent => {
    Array.from(parent.children).forEach((child, i) => {
      child.style.setProperty('--delay', `${i * 0.08}s`);
    });
  });
}

// ---- Timeline progress scroll-driven draw ------------------
function initTimelineDraw() {
  const fill = document.querySelector('.timeline__line-fill');
  if (!fill) return;

  const timeline = document.querySelector('.timeline');
  if (!timeline) return;

  const update = () => {
    const rect   = timeline.getBoundingClientRect();
    const vh     = window.innerHeight;
    const start  = Math.max(0, rect.top);
    const end    = Math.min(vh, rect.bottom);
    const visible = Math.max(0, end - start);
    const progress = Math.min(1, visible / (vh * 0.8));
    fill.style.transform = `scaleY(${progress})`;
    fill.style.height     = '100%';
  };

  window.addEventListener('scroll', update, { passive: true });
  update();
}

// ---- Number counter (for stats) ----------------------------
function animateCount(el, target, duration = 1200) {
  const start     = performance.now();
  const startVal  = 0;

  const step = (now) => {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease-out quad
    const eased    = 1 - (1 - progress) ** 2;
    el.textContent = Math.floor(startVal + (target - startVal) * eased);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  };

  requestAnimationFrame(step);
}
