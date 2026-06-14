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
  const TOTAL_DURATION = 1900; // ms

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

/* ─── STATS COUNTER ANIMATION ────────────────────────────────────── */
(function initStatsCounter() {
  const statNumbers = $$('.stat-number[data-target]');
  if (!statNumbers.length) return;

  const DURATION = 2200; // ms
  const EASING_FUNC = (t) => 1 - Math.pow(1 - t, 3); // ease-out cubic

  function animateCounter(el) {
    const target = parseFloat(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const divisor = parseFloat(el.dataset.divisor) || 1;
    const isFloat = el.dataset.float === 'true';
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = clamp(elapsed / DURATION, 0, 1);
      const eased = EASING_FUNC(progress);
      const current = target * eased;
      const display = current / divisor;

      if (isFloat) {
        el.textContent = display.toFixed(1) + suffix;
      } else if (divisor >= 1000000) {
        el.textContent = (display).toFixed(1) + suffix;
      } else if (divisor >= 1000) {
        el.textContent = Math.floor(display) + suffix;
      } else {
        el.textContent = Math.floor(current) + suffix;
      }

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        // Ensure final value is exact
        if (isFloat) {
          el.textContent = (target / divisor).toFixed(1) + suffix;
        } else if (divisor >= 1000000) {
          el.textContent = (target / divisor).toFixed(0) + suffix;
        } else if (divisor >= 1000) {
          el.textContent = (target / divisor) + suffix;
        } else {
          el.textContent = target + suffix;
        }
      }
    }

    requestAnimationFrame(update);
  }

  // Trigger counters when stats section is in view
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        statNumbers.forEach(el => animateCounter(el));
        statsObserver.disconnect();
      }
    });
  }, {
    threshold: 0.3
  });

  const statsSection = $('#about');
  if (statsSection) statsObserver.observe(statsSection);
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
/* ─── HERO FULLSCREEN CAROUSEL (Google Flow Style) ───────────────── */
(function initHeroFullscreenCarousel() {
  const heroSection = $('#hero');
  const slides = $$('.hero-fs-slide');
  const sideDots = $$('.hero-fs-dot');
  const bottomDots = $$('.hero-fs-bdot');
  const arrows = $$('.hero-fs-arrow');
  if (!heroSection || !slides.length) return;

  let activeIndex = 0;
  let autoTimer = null;
  const autoDelay = 5500; // 5.5s to match CSS dotFillUp animation duration
  
  function setActiveSlide(nextIndex) {
    // Wrap around index
    activeIndex = (nextIndex + slides.length) % slides.length;

    // Update slides
    slides.forEach((slide, index) => {
      const isActive = index === activeIndex;
      slide.classList.toggle('active', isActive);
      slide.setAttribute('aria-hidden', String(!isActive));
    });

    // Update side dots
    sideDots.forEach((dot, index) => {
      const isActive = index === activeIndex;
      dot.classList.toggle('active', isActive);
      dot.setAttribute('aria-selected', String(isActive));
      
      // Reset progress animation by cloning/reflowing progress bar if needed
      const progress = $('.hero-fs-dot-progress', dot);
      if (progress) {
        progress.style.animation = 'none';
        // Trigger reflow
        progress.offsetHeight;
        progress.style.animation = '';
      }
    });

    // Update bottom dots
    bottomDots.forEach((bdot, index) => {
      const isActive = index === activeIndex;
      bdot.classList.toggle('active', isActive);
      bdot.setAttribute('aria-selected', String(isActive));
    });

    restartAutoSlide();
  }

  function move(direction) {
    setActiveSlide(activeIndex + direction);
  }

  function restartAutoSlide() {
    if (autoTimer) clearInterval(autoTimer);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    autoTimer = setInterval(() => {
      move(1);
    }, autoDelay);
  }

  // Event Listeners: Arrows
  arrows.forEach(arrow => {
    arrow.addEventListener('click', () => {
      const dir = parseInt(arrow.dataset.fsDir, 10) || 1;
      move(dir);
    });
  });

  // Event Listeners: Side Dots
  sideDots.forEach(dot => {
    dot.addEventListener('click', () => {
      const index = parseInt(dot.dataset.fsDot, 10);
      setActiveSlide(index);
    });
  });

  // Event Listeners: Bottom Dots
  bottomDots.forEach(bdot => {
    bdot.addEventListener('click', () => {
      const index = parseInt(bdot.dataset.fsBdot, 10);
      setActiveSlide(index);
    });
  });

  // Keyboard Navigation
  window.addEventListener('keydown', (e) => {
    // Only handle if hero is in viewport
    const rect = heroSection.getBoundingClientRect();
    const inView = rect.top >= -100 && rect.bottom <= window.innerHeight + 100;
    if (!inView) return;

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      move(1);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      move(-1);
    }
  });

  // Wheel / Scroll Navigation
  let lastScrollTime = 0;
  const scrollThrottle = 800; // ms

  window.addEventListener('wheel', (e) => {
    const rect = heroSection.getBoundingClientRect();
    // Only intercept if hero section is fully in viewport (or close to it)
    const isHeroVisible = rect.top === 0;
    if (!isHeroVisible) return;

    // If scrolling down at the last slide, let normal scroll happen
    if (activeIndex === slides.length - 1 && e.deltaY > 0) {
      return;
    }
    // If scrolling up at the first slide, let normal scroll happen
    if (activeIndex === 0 && e.deltaY < 0) {
      return;
    }

    // Otherwise intercept wheel and change slide
    e.preventDefault();

    const now = performance.now();
    if (now - lastScrollTime < scrollThrottle) return;
    lastScrollTime = now;

    if (e.deltaY > 0) {
      move(1);
    } else if (e.deltaY < 0) {
      move(-1);
    }
  }, { passive: false });

  // Swipe Navigation
  let touchStartY = 0;
  let touchStartX = 0;

  heroSection.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  heroSection.addEventListener('touchend', (e) => {
    const rect = heroSection.getBoundingClientRect();
    if (rect.top !== 0) return; // Only swipe when hero is centered

    const touchEndY = e.changedTouches[0].clientY;
    const touchEndX = e.changedTouches[0].clientX;

    const diffY = touchStartY - touchEndY;
    const diffX = touchStartX - touchEndX;

    // Check if vertical or horizontal swipe is dominant
    if (Math.abs(diffY) > 50 || Math.abs(diffX) > 50) {
      if (Math.abs(diffY) > Math.abs(diffX)) {
        // Vertical swipe
        if (diffY > 0) {
          // Swipe up -> Next slide (unless on last slide)
          if (activeIndex < slides.length - 1) {
            e.preventDefault();
            move(1);
          }
        } else {
          // Swipe down -> Prev slide (unless on first slide)
          if (activeIndex > 0) {
            e.preventDefault();
            move(-1);
          }
        }
      } else {
        // Horizontal swipe
        if (diffX > 0) {
          move(1);
        } else {
          move(-1);
        }
      }
    }
  }, { passive: false });

  // Initialize
  setActiveSlide(0);
})();

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

/* ─── PRODUCT CARD MAGNETIC HOVER ────────────────────────────────── */
(function initMagneticCards() {
  const cards = $$('.product-card');
  if (!cards.length) return;

  // Only for non-touch devices
  if (window.matchMedia('(pointer: coarse)').matches) return;

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;

      const rotateX = clamp((y - cy) / cy * -5, -5, 5);
      const rotateY = clamp((x - cx) / cx * 5, -5, 5);

      card.style.transform = `translateY(-6px) scale(1.01) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      card.style.transformStyle = 'preserve-3d';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transformStyle = '';
    });
  });
})();

/* ─── ECOSYSTEM NODES — Interactive hover glow ───────────────────── */
(function initEcoNodes() {
  const nodes = $$('.eco-node');
  nodes.forEach(node => {
    node.addEventListener('mouseenter', () => {
      const color = getComputedStyle(node).getPropertyValue('--node-color').trim();
      node.style.boxShadow = `0 16px 40px rgba(0,0,0,0.35), 0 0 30px ${color}33`;
    });

    node.addEventListener('mouseleave', () => {
      node.style.boxShadow = '';
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

/* ─── ECOSYSTEM ANIMATED LINES — SVG dash animation ─────────────── */
(function initEcoDashAnimation() {
  const ecoLines = $$('.eco-line');
  ecoLines.forEach((line, index) => {
    line.style.animationDelay = `${index * 0.4}s`;
  });
})();

/* ─── PARTICLE AMBIENT EFFECT ────────────────────────────────────── */
(function initAmbientParticles() {
  const hero = $('.hero-fullscreen');
  if (!hero) return;
  if ($('.hero-showcase')) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const canvas = document.createElement('canvas');
  canvas.style.cssText = `
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 1;
    opacity: 0.4;
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
      this.speedX = (Math.random() - 0.5) * 0.35;
      this.speedY = (Math.random() - 0.5) * 0.35;
      this.opacity = Math.random() * 0.4 + 0.1;
      this.maxOpacity = this.opacity;
      this.life = Math.random() * 300 + 200;
      this.age = 0;

      // Random brand color
      const colors = ['99, 102, 241', '139, 92, 246', '168, 85, 247', '192, 132, 252'];
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
    background: 'linear-gradient(90deg, #ffcc34, #43e47f, #5b95f4)',
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

/* ─── PRODUCT CARDS — Dynamic border gradient on hover ──────────── */
(function initCardBorderEffect() {
  const cards = $$('.product-card, .stat-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width * 100).toFixed(1);
      const y = ((e.clientY - rect.top) / rect.height * 100).toFixed(1);

      card.style.setProperty('--mouse-x', `${x}%`);
      card.style.setProperty('--mouse-y', `${y}%`);
    });
  });

  // Add the CSS for the effect dynamically
  const style = document.createElement('style');
  style.textContent = `
    .product-card, .stat-card {
      background-image: radial-gradient(
        400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
        rgba(99, 102, 241, 0.04) 0%,
        transparent 60%
      );
    }
  `;
  document.head.appendChild(style);
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

/* ─── INITIALIZATION COMPLETE ────────────────────────────────────── */
console.log(
  '%c⚡ Zamify Ecosystem%c\nBuild. Create. Grow.',
  'color: #6366f1; font-size: 18px; font-weight: 800; font-family: system-ui;',
  'color: #a5b4fc; font-size: 12px; font-family: system-ui;'
);
