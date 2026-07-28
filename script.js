/* =========================================================
   Pearls Creation — Interactions
   - Hero typewriter / pop-in title
   - Scroll-triggered typewriter for the Inspire section
   - Scroll reveal animations
   - Mobile nav + active link tracking
   - Craft card click/touch pop animation
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.getElementById('navToggle');
  const siteNav = document.getElementById('siteNav');
  if (navToggle && siteNav) {
    navToggle.addEventListener('click', () => {
      const open = siteNav.classList.toggle('open');
      navToggle.classList.toggle('open', open);
      navToggle.setAttribute('aria-expanded', String(open));
    });
    siteNav.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        siteNav.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Active nav link while scrolling ---------- */
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  if ('IntersectionObserver' in window && sections.length) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            navLinks.forEach((l) => l.classList.remove('active'));
            const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
            if (active) active.classList.add('active');
          }
        });
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    );
    sections.forEach((s) => navObserver.observe(s));
  }

  /* ---------- Generic scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach((el, i) => {
      el.style.transitionDelay = reducedMotion ? '0ms' : `${(i % 6) * 70}ms`;
      revealObserver.observe(el);
    });
  } else {
    revealEls.forEach((el) => el.classList.add('in-view'));
  }

  /* ---------- Hero title: pop-in typewriter ---------- */
  const heroTitle = document.getElementById('heroTitle');
  if (heroTitle) {
    const text = heroTitle.textContent.trim();
    if (!reducedMotion) {
      heroTitle.textContent = '';
      heroTitle.setAttribute('aria-label', text);

      const frag = document.createDocumentFragment();
      [...text].forEach((ch, i) => {
        const span = document.createElement('span');
        span.className = 'char';
        span.setAttribute('aria-hidden', 'true');
        span.style.animationDelay = `${i * 60}ms`;
        span.textContent = ch === ' ' ? '\u00A0' : ch;
        frag.appendChild(span);
      });

      const cursor = document.createElement('span');
      cursor.className = 'cursor';
      cursor.setAttribute('aria-hidden', 'true');
      frag.appendChild(cursor);

      window.setTimeout(() => heroTitle.appendChild(frag), 300);
      window.setTimeout(() => cursor.classList.add('fade'), 300 + text.length * 60 + 1600);
    }
  }

  /* ---------- Inspire section: scroll-triggered typewriter ---------- */
  const inspireSection = document.getElementById('inspire');
  const line1El = document.getElementById('inspireLine1');
  const line2El = document.getElementById('inspireLine2');
  const line1Text = 'Learn. Explore. Get.';
  const line2Text = 'What Inspires Your Crafty Mind';

  function typeLine(el, text, duration) {
    return new Promise((resolve) => {
      if (!el) return resolve();
      if (reducedMotion) {
        el.textContent = text;
        return resolve();
      }
      const cursor = document.createElement('span');
      cursor.className = 'type-cursor';
      el.textContent = '';
      el.appendChild(cursor);

      const interval = Math.max(duration / text.length, 16);
      let i = 0;
      (function step() {
        i += 1;
        el.textContent = text.slice(0, i);
        el.appendChild(cursor);
        if (i < text.length) {
          window.setTimeout(step, interval);
        } else {
          resolve();
        }
      })();
    });
  }

  function runInspireAnimation() {
    if (!line1El || !line2El) return;
    if (reducedMotion) {
      line1El.textContent = line1Text;
      line2El.textContent = line2Text;
      return;
    }
    typeLine(line1El, line1Text, 1100)
      .then(() => new Promise((r) => window.setTimeout(r, 150)))
      .then(() => typeLine(line2El, line2Text, 1750))
      .then(() => {
        inspireSection.querySelectorAll('.type-cursor').forEach((c) => c.classList.add('fade'));
      });
  }

  if (inspireSection) {
    if ('IntersectionObserver' in window) {
      const inspireObserver = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              runInspireAnimation();
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.45 }
      );
      inspireObserver.observe(inspireSection);
    } else {
      runInspireAnimation();
    }
  }

  /* ---------- Craft cards: pop animation on click / touch ---------- */
  const craftCards = document.querySelectorAll('.craft-card');
  craftCards.forEach((card) => {
    card.addEventListener('click', () => {
      card.classList.remove('pop');
      void card.offsetWidth; /* restart animation */
      card.classList.add('pop');
    });
    card.addEventListener('animationend', (e) => {
      if (e.animationName === 'cardPop') card.classList.remove('pop');
    });
  });
});
