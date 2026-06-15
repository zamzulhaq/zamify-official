/**
 * ═══════════════════════════════════════════════════════════════════
 * ZAMIFY ECOSYSTEM — script.js
 * Vanilla JavaScript — No dependencies
 * ═══════════════════════════════════════════════════════════════════
 */

'use strict';

/* ─── UTILITIES ──────────────────────────────────────────────────── */
const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function lerp(start, end, factor) {
  return start + (end - start) * factor;
}

/* ─── INTRO SCREEN ────────────────────────────────────────────────── */
(function initIntroScreen() {
  const introScreen = $('#intro-screen');
  if (!introScreen) return;

  // Lock scroll during intro
  document.body.style.overflow = 'hidden';

  // Hide intro after animation completes
  const TOTAL_DURATION = 3000; // ms

  setTimeout(() => {
    introScreen.classList.add('intro-hidden');

    setTimeout(() => {
      introScreen.classList.add('intro-gone');
      document.body.style.overflow = '';
    }, 650);
  }, TOTAL_DURATION);
})();

/* ─── NAVBAR ─────────────────────────────────────────────────────── */
(function initNavbar() {
  const navbar = $('#navbar');
  const hamburger = $('#nav-hamburger');
  const mobileMenu = $('#mobile-menu');
  const mobileLinks = $$('.mobile-nav-link');
  if (!navbar) return;

  let lastScrollY = 0;
  let ticking = false;

  function updateNavbar() {
    const scrollY = window.scrollY;

    if (scrollY > 24) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    lastScrollY = scrollY;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateNavbar);
      ticking = true;
    }
  }, { passive: true });

  // Initial check
  updateNavbar();

  // Hamburger toggle
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
      mobileMenu.setAttribute('aria-hidden', String(!isOpen));
    });

    // Close mobile menu on link click
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target) && mobileMenu.classList.contains('open')) {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
      }
    });
  }

  // Active link highlight based on scroll position
  const sections = $$('section[id]');
  const navLinks = $$('.nav-link');

  function updateActiveLink() {
    const scrollMid = window.scrollY + window.innerHeight / 2;

    let activeId = '';
    sections.forEach(section => {
      if (section.offsetTop <= scrollMid) {
        activeId = section.id;
      }
    });

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === `#${activeId}`) {
        link.style.color = '#202124';
      } else {
        link.style.color = '';
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });
})();

/* ─── CURSOR GLOW ────────────────────────────────────────────────── */
(function initCursorGlow() {
  const cursor = $('#cursor-glow');
  if (!cursor) return;

  // Only on non-touch devices
  if (window.matchMedia('(pointer: coarse)').matches) {
    cursor.style.display = 'none';
    return;
  }

  let curX = 0, curY = 0;
  let targetX = 0, targetY = 0;
  let animFrameId = null;

  document.addEventListener('mousemove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
  }, { passive: true });

  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
  });

  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
  });

  function animateCursor() {
    curX = lerp(curX, targetX, 0.08);
    curY = lerp(curY, targetY, 0.08);

    cursor.style.left = `${curX}px`;
    cursor.style.top = `${curY}px`;

    animFrameId = requestAnimationFrame(animateCursor);
  }

  animateCursor();
})();

/* ─── INTERSECTION OBSERVER — REVEAL ANIMATIONS ─────────────────── */
(function initRevealAnimations() {
  const revealElements = $$('.reveal-fade, .reveal-up, .reveal-card');
  if (!revealElements.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Unobserve after revealing for performance
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => observer.observe(el));
})();



/* ─── HERO PRODUCT CARDS — Staggered entrance ────────────────────── */
(function initHeroCards() {
  const heroCards = $$('.hero-mini-card');
  if (!heroCards.length) return;

  heroCards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(16px)';
    card.style.transition = `opacity 0.5s ease, transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)`;
    card.style.transitionDelay = `${0.8 + index * 0.12}s`;

    // Trigger after slight delay
    requestAnimationFrame(() => {
      setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, 200);
    });
  });
})();

/* ─── SMOOTH SCROLL ──────────────────────────────────────────────── */
/* ─── HERO — Static (no carousel) ─────────────────────────── */

(function initSmoothScroll() {
  $$('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      const navHeight = 68;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight;

      window.scrollTo({
        top: targetTop,
        behavior: 'smooth'
      });
    });
  });
})();



/* ─── PARALLAX HERO BLOBS ────────────────────────────────────────── */
(function initParallaxBlobs() {
  const blobs = $$('.blob');
  if (!blobs.length) return;

  // Only on desktop
  if (window.matchMedia('(pointer: coarse)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let rafId = null;
  let targetX = 0;
  let targetY = 0;
  let curX = 0;
  let curY = 0;

  window.addEventListener('mousemove', (e) => {
    // Normalize mouse position to -1 to 1
    targetX = (e.clientX / window.innerWidth - 0.5) * 2;
    targetY = (e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });

  function updateBlobs() {
    curX = lerp(curX, targetX, 0.05);
    curY = lerp(curY, targetY, 0.05);
    const scrollY = window.scrollY;

    blobs.forEach((blob, index) => {
      // Different multiplier for each blob to create depth
      const parallaxFactor = [40, -30, 25, -20][index] || 15;
      const scrollSpeed = [0.15, -0.1, 0.12, -0.08][index] || 0.1;
      
      const x = curX * parallaxFactor;
      const y = curY * parallaxFactor + (scrollY * scrollSpeed);
      
      blob.style.translate = `${x}px ${y}px`;
    });

    rafId = requestAnimationFrame(updateBlobs);
  }

  rafId = requestAnimationFrame(updateBlobs);
})();

/* ─── CTA BUTTON SPARKLE EFFECT ─────────────────────────────────── */
(function initButtonSparkle() {
  const primaryBtns = $$('.btn-primary');

  primaryBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 2;
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      Object.assign(ripple.style, {
        position: 'absolute',
        width: `${size}px`,
        height: `${size}px`,
        left: `${x}px`,
        top: `${y}px`,
        background: 'rgba(255,255,255,0.2)',
        borderRadius: '50%',
        transform: 'scale(0)',
        animation: 'rippleEffect 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        pointerEvents: 'none',
      });

      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
    });
  });

  // Inject ripple keyframe
  const style = document.createElement('style');
  style.textContent = `
    @keyframes rippleEffect {
      to { transform: scale(1); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
})();

/* ─── DYNAMIC TYPING EFFECT for Hero Badge ──────────────────────── */
(function initTypingEffect() {
  const badge = $('.hero-badge');
  if (!badge) return;

  const phrases = [
    'Powered by AI Intelligence',
    'Built for Modern Business',
    'Your Digital Ecosystem',
    'Commerce · Productivity · Creativity',
  ];

  let phraseIndex = 0;
  let charIndex = phrases[0].length;
  let isDeleting = false;
  let isPaused = false;

  const textSpan = badge.childNodes[badge.childNodes.length - 1];
  if (!textSpan || textSpan.nodeType !== 3) return;

  function type() {
    const current = phrases[phraseIndex];

    if (!isDeleting) {
      if (charIndex < current.length) {
        textSpan.textContent = ' ' + current.slice(0, charIndex + 1);
        charIndex++;
        setTimeout(type, 60);
      } else {
        // Pause before deleting
        setTimeout(() => {
          isDeleting = true;
          type();
        }, 2500);
      }
    } else {
      if (charIndex > 1) {
        textSpan.textContent = ' ' + current.slice(0, charIndex - 1);
        charIndex--;
        setTimeout(type, 35);
      } else {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        charIndex = 0;
        setTimeout(type, 400);
      }
    }
  }

  // Start typing after page loads
  setTimeout(type, 3500);
})();



/* ─── PARTICLE AMBIENT EFFECT ────────────────────────────────────── */
(function initAmbientParticles() {
  const hero = $('.hero-fullscreen');
  if (!hero) return;
  // Skip on any hero that isn't the fullscreen one
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const canvas = document.createElement('canvas');
  canvas.style.cssText = `
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 1;
    opacity: 0.7;
  `;
  hero.insertBefore(canvas, hero.firstChild);

  const ctx = canvas.getContext('2d');
  let animId;

  const PARTICLE_COUNT = 45;
  const particles = [];

  function resize() {
    canvas.width = hero.offsetWidth;
    canvas.height = hero.offsetHeight;
  }

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 1.5 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.speedY = (Math.random() - 0.5) * 0.3;
      this.opacity = Math.random() * 0.18 + 0.04;
      this.maxOpacity = this.opacity;
      this.life = Math.random() * 300 + 200;
      this.age = 0;

      // Random brand color
      // Light bg – use soft, low-opacity brand colors
      const colors = ['66, 133, 244', '139, 92, 246', '52, 168, 83', '251, 188, 4'];
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.age++;

      // Fade in/out
      const lifeFraction = this.age / this.life;
      if (lifeFraction < 0.1) {
        this.opacity = this.maxOpacity * (lifeFraction / 0.1);
      } else if (lifeFraction > 0.8) {
        this.opacity = this.maxOpacity * (1 - (lifeFraction - 0.8) / 0.2);
      } else {
        this.opacity = this.maxOpacity;
      }

      if (this.age >= this.life ||
          this.x < -10 || this.x > canvas.width + 10 ||
          this.y < -10 || this.y > canvas.height + 10) {
        this.reset();
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
      ctx.fill();
    }
  }

  function init() {
    particles.length = 0;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p = new Particle();
      p.age = Math.random() * p.life; // randomize age for immediate display
      particles.push(p);
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    animId = requestAnimationFrame(animate);
  }

  const resizeObserver = new ResizeObserver(() => {
    resize();
    init();
  });

  resizeObserver.observe(hero);
  resize();
  init();
  animate();
})();

/* ─── NAVBAR LOGO HOVER EFFECT ───────────────────────────────────── */
(function initLogoHover() {
  const logoMark = $('.nav-logo-mark');
  if (!logoMark) return;

  logoMark.addEventListener('mouseenter', () => {
    logoMark.style.transform = 'rotate(-10deg) scale(1.1)';
    logoMark.style.transition = 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
  });

  logoMark.addEventListener('mouseleave', () => {
    logoMark.style.transform = '';
  });
})();

/* ─── SCROLL PROGRESS INDICATOR ─────────────────────────────────── */
(function initScrollProgress() {
  const progressBar = document.createElement('div');
  Object.assign(progressBar.style, {
    position: 'fixed',
    top: '0',
    left: '0',
    height: '2px',
    background: 'linear-gradient(90deg, #4285f4, #8b5cf6, #34a853)',
    zIndex: '9999',
    transformOrigin: 'left center',
    transform: 'scaleX(0)',
    transition: 'transform 0.1s linear',
    borderRadius: '0 2px 2px 0',
    boxShadow: '0 0 8px rgba(32,33,36,0.22)',
  });
  document.body.appendChild(progressBar);

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? scrollTop / docHeight : 0;
    progressBar.style.transform = `scaleX(${progress})`;
  }, { passive: true });
})();



/* ─── PAGE VISIBILITY — Pause animations when tab is hidden ─────── */
document.addEventListener('visibilitychange', () => {
  const blobs = $$('.blob, .intro-bg-blob');
  const paused = document.hidden ? 'paused' : 'running';
  blobs.forEach(b => b.style.animationPlayState = paused);
});

/* ─── KEYBOARD NAVIGATION SUPPORT ───────────────────────────────── */
(function initKeyboardNav() {
  // Escape closes mobile menu
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const mobileMenu = $('#mobile-menu');
      const hamburger = $('#nav-hamburger');
      if (mobileMenu && mobileMenu.classList.contains('open')) {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
        hamburger.focus();
      }
    }
  });
})();

/* ─── EXPERIMENTS CAROUSEL & FILTER ───────────────────────────────── */
(function initExpCarousel() {
  const track = document.querySelector('.exp-track');
  const wrap = document.querySelector('.exp-track-wrap');
  const prevBtn = document.querySelector('.exp-prev');
  const nextBtn = document.querySelector('.exp-next');
  const filterBar = document.querySelector('.exp-filter-bar');
  if (!track || !wrap) return;

  let scrollPos = 0;
  let isDragging = false;
  let dragStartX = 0;
  let dragStartScroll = 0;

  function getCardWidth() {
    const first = track.querySelector('.exp-card:not(.hidden)');
    if (!first) return 320;
    const style = getComputedStyle(track);
    const gapVal = parseFloat(style.gap) || 20;
    return first.offsetWidth + gapVal;
  }

  function getMaxScroll() {
    const visible = [...track.querySelectorAll('.exp-card:not(.hidden)')];
    const style = getComputedStyle(track);
    const gapVal = parseFloat(style.gap) || 20;
    const total = visible.reduce((s, c) => s + c.offsetWidth + gapVal, 0) - gapVal;
    const containerW = wrap.offsetWidth;
    return Math.max(0, total - containerW);
  }

  function animateTo(target) {
    const start = scrollPos;
    const startTime = performance.now();
    const duration = 400;

    function tick(now) {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      scrollPos = start + (target - start) * ease;
      track.style.transform = `translateX(-${scrollPos}px)`;
      updateCurve();
      if (t < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  function moveCarousel(dir) {
    const step = getCardWidth();
    const target = scrollPos + dir * step;
    const clamped = Math.max(0, Math.min(target, getMaxScroll()));
    if (clamped !== scrollPos) animateTo(clamped);
  }

  function resetCarousel() {
    if (scrollPos !== 0) animateTo(0);
  }

  function updateCurve() {
    const cards = [...track.querySelectorAll('.exp-card:not(.hidden)')];
    if (!cards.length) return;
    const wrapRect = wrap.getBoundingClientRect();
    const centerX = wrapRect.left + wrapRect.width / 2;

    let closestIdx = 0;
    let minDist = Infinity;
    cards.forEach((card, i) => {
      const rect = card.getBoundingClientRect();
      const cardCenter = rect.left + rect.width / 2;
      const d = Math.abs(cardCenter - centerX);
      if (d < minDist) { minDist = d; closestIdx = i; }
    });

    const halfSpan = Math.max(closestIdx, cards.length - 1 - closestIdx) || 1;

    cards.forEach((card, i) => {
      const idxDist = (i - closestIdx) / halfSpan;
      const absDist = Math.min(1, Math.abs(idxDist));
      // Subtle scale only — no vertical translate for clean Labs look
      const scaleAmt = 1 - absDist * 0.03;
      card.style.transform = `scale(${scaleAmt})`;
      card.style.zIndex = Math.round((1 - absDist) * 10);
    });
  }

  // ── Drag ──
  function onDragStart(e) {
    if (e.target.closest('.exp-card-link, .exp-arrow')) return;
    isDragging = true;
    dragStartX = e.clientX || e.touches[0].clientX;
    dragStartScroll = scrollPos;
    wrap.classList.add('dragging');
    track.style.transition = 'none';
  }

  function onDragMove(e) {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.clientX || e.touches[0].clientX;
    const delta = (dragStartX - x) * 1.2;
    scrollPos = Math.max(0, Math.min(dragStartScroll + delta, getMaxScroll()));
    track.style.transform = `translateX(-${scrollPos}px)`;
    updateCurve();
  }

  function onDragEnd() {
    if (!isDragging) return;
    isDragging = false;
    wrap.classList.remove('dragging');
    track.style.transform = `translateX(-${scrollPos}px)`;
    updateCurve();
  }

  // Mouse
  wrap.addEventListener('mousedown', onDragStart);
  document.addEventListener('mousemove', onDragMove);
  document.addEventListener('mouseup', onDragEnd);
  // Touch
  wrap.addEventListener('touchstart', onDragStart, { passive: true });
  document.addEventListener('touchmove', onDragMove, { passive: false });
  document.addEventListener('touchend', onDragEnd);

  // Arrow clicks
  if (prevBtn) prevBtn.addEventListener('click', () => moveCarousel(-1));
  if (nextBtn) nextBtn.addEventListener('click', () => moveCarousel(1));

  // Filter
  if (filterBar) {
    filterBar.addEventListener('click', (e) => {
      const btn = e.target.closest('.exp-filter-btn');
      if (!btn) return;

      const filter = btn.dataset.filter;

      filterBar.querySelectorAll('.exp-filter-btn').forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const cards = track.querySelectorAll('.exp-card');
      cards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });

      resetCarousel();
    });
  }

  // Recalc on resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      scrollPos = Math.min(scrollPos, getMaxScroll());
      track.style.transform = `translateX(-${scrollPos}px)`;
      updateCurve();
    }, 150);
  });

  // Initial curve
  requestAnimationFrame(updateCurve);
})();

/* ─── INITIALIZATION COMPLETE ────────────────────────────────────── */
console.log(
  '%c⚡ Zamify Ecosystem%c\nBuild. Create. Grow.',
  'color: #6366f1; font-size: 18px; font-weight: 800; font-family: system-ui;',
  'color: #a5b4fc; font-size: 12px; font-family: system-ui;'
);

/* ─── PLATFORM MODAL ─────────────────────────────────────────────── */
(function initPlatformModal() {
  const modal = $('#platform-modal');
  const closeBtn = $('#modal-close');
  if (!modal || !closeBtn) return;

  function openModal(e) {
    e.preventDefault();
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
  }
  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
  }

  // All triggers that open the platform picker
  const modalTriggers = [
    ...$$('#nav-signin-btn'),
    ...$$('.btn-ghost').filter(b => b.textContent.trim() === 'Masuk'),
    ...$$('#nav-getstarted-btn'),
    ...$$('.mobile-nav-actions .btn-primary'),
    ...$$('.btn-pill-yellow').filter(b => b.textContent.trim() === 'Mulai Gratis'),
  ];
  modalTriggers.forEach(btn => btn.addEventListener('click', openModal));

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  // Platform buttons → toast under construction
  $$('.modal-platform-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      showToast(' ' + btn.dataset.platform + ' masih dalam masa pembangunan');
      closeModal();
    });
  });
})();

/* ─── TOAST ───────────────────────────────────────────────────────── */
let toastTimer = null;
function showToast(msg) {
  const toast = $('#toast');
  if (!toast) return;
  const icon = toast.querySelector('.toast-icon');
  const text = toast.querySelector('.toast-msg');
  if (icon) icon.textContent = msg.includes('') ? '' : 'ℹ️';
  if (text) text.textContent = msg.replace(' ', '');
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
}

/* ─── SEMUA TOMBOL href="#" → TOAST ────────────────────────────── */
(function initRemainingButtons() {
  // Coba Sekarang (product cards)
  $$('.exp-card-link').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      showToast(' Masih dalam masa pembangunan');
    });
  });

  // Ikuti Pembaruan (connect section)
  $$('.btn-pill-yellow').filter(b => b.textContent.trim() === 'Ikuti Pembaruan').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      showToast(' Masih dalam masa pembangunan');
    });
  });

  // Lihat semua koleksi (experiments header)
  const viewAll = $('.labs-view-all');
  if (viewAll) {
    viewAll.addEventListener('click', e => {
      e.preventDefault();
      showToast(' Masih dalam masa pembangunan');
    });
  }

  // Semua link di footer (produk, perusahaan, sumber daya, hukum)
  $$('.footer-links-group a[href="#"]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      showToast(' Masih dalam masa pembangunan');
    });
  });

  // Social icons footer
  $$('.footer-socials .social-link').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      showToast(' Masih dalam masa pembangunan');
    });
  });
})();
