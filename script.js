/* =========================================================
   DEEPAPPRIYA R — PORTFOLIO SCRIPT
   ========================================================= */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

/* ---------------------------------------------------------
   Mobile nav toggle
--------------------------------------------------------- */
const menuBtn = $('#menu-btn');
const navEl = $('#primary-nav');

if (menuBtn && navEl) {
  menuBtn.addEventListener('click', () => {
    const isOpen = navEl.classList.toggle('mobile-open');
    menuBtn.setAttribute('aria-expanded', String(isOpen));
    menuBtn.innerHTML = isOpen ? '<i class="fas fa-xmark"></i>' : '<i class="fas fa-bars"></i>';
  });

  $$('a', navEl).forEach(a => {
    a.addEventListener('click', () => {
      navEl.classList.remove('mobile-open');
      menuBtn.setAttribute('aria-expanded', 'false');
      menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    });
  });

  document.addEventListener('click', (e) => {
    if (window.innerWidth <= 1060 && navEl.classList.contains('mobile-open')) {
      if (!e.target.closest('.nav-wrap')) {
        navEl.classList.remove('mobile-open');
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
      }
    }
  });
}

/* ---------------------------------------------------------
   Smooth scroll for in-page links
--------------------------------------------------------- */
$$('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const href = a.getAttribute('href');
    if (!href || href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ---------------------------------------------------------
   Active nav link on scroll
--------------------------------------------------------- */
const sections = $$('main section[id]');
const navLinks = $$('.nav a[href^="#"]');

const setActiveLink = () => {
  let current = '';
  const scrollPos = window.scrollY + 140;
  sections.forEach(sec => {
    if (scrollPos >= sec.offsetTop) current = sec.id;
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
};
window.addEventListener('scroll', setActiveLink, { passive: true });
window.addEventListener('load', setActiveLink);

/* ---------------------------------------------------------
   Scroll reveal (IntersectionObserver)
--------------------------------------------------------- */
const revealEls = $$('.reveal');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => io.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('show'));
}

/* ---------------------------------------------------------
   Hero typewriter effect
--------------------------------------------------------- */
const typewriterEl = $('#typewriter');
const typewriterStrings = [
  'booting career_objective.exe',
  'role: aspiring full stack developer',
  'stack: java · spring boot · angular',
  'status: open to internships'
];

function typewriter(el, strings, opts = {}) {
  if (!el) return;
  const typeSpeed = opts.typeSpeed || 38;
  const deleteSpeed = opts.deleteSpeed || 22;
  const pause = opts.pause || 1600;
  let strIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function tick() {
    const current = strings[strIndex];
    if (!deleting) {
      charIndex++;
      el.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(tick, pause);
        return;
      }
      setTimeout(tick, typeSpeed);
    } else {
      charIndex--;
      el.textContent = current.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        strIndex = (strIndex + 1) % strings.length;
        setTimeout(tick, 300);
        return;
      }
      setTimeout(tick, deleteSpeed);
    }
  }
  tick();
}

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (typewriterEl) {
  if (prefersReducedMotion) {
    typewriterEl.textContent = typewriterStrings[0];
  } else {
    typewriter(typewriterEl, typewriterStrings);
  }
}

/* ---------------------------------------------------------
   Animated stat counters
--------------------------------------------------------- */
const counters = $$('.counter');

function animateCounter(el) {
  const target = parseFloat(el.getAttribute('data-target'));
  const isDecimal = el.getAttribute('data-decimal') === 'true';
  const duration = 1400;
  const start = performance.now();

  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const value = target * eased;
    el.textContent = isDecimal ? value.toFixed(2) : Math.round(value);
    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      el.textContent = isDecimal ? target.toFixed(2) : target;
    }
  }
  requestAnimationFrame(step);
}

if (counters.length) {
  if ('IntersectionObserver' in window) {
    const counterIO = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => counterIO.observe(c));
  } else {
    counters.forEach(animateCounter);
  }
}

/* ---------------------------------------------------------
   Video modal (local mp4 files)
--------------------------------------------------------- */
const videoModal = $('#videoModal');
const demoVideo = $('#demoVideo');
const videoCloseBtn = videoModal ? $('.video-close', videoModal) : null;
let lastFocusedEl = null;

function openVideoModal(src) {
  if (!videoModal || !demoVideo || !src) return;
  lastFocusedEl = document.activeElement;
  demoVideo.src = src;
  videoModal.classList.add('show');
  videoModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('no-scroll');
  demoVideo.play().catch(() => {});
  if (videoCloseBtn) videoCloseBtn.focus();
}

function closeVideoModal() {
  if (!videoModal || !demoVideo) return;
  videoModal.classList.remove('show');
  videoModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('no-scroll');
  demoVideo.pause();
  demoVideo.src = '';
  if (lastFocusedEl) lastFocusedEl.focus();
}

$$('.video-trigger').forEach(el => {
  el.addEventListener('click', () => openVideoModal(el.getAttribute('data-video')));
});
$$('.video-trigger-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    openVideoModal(btn.getAttribute('data-video'));
  });
});

if (videoCloseBtn) videoCloseBtn.addEventListener('click', closeVideoModal);
if (videoModal) {
  videoModal.addEventListener('click', (e) => {
    if (e.target === videoModal) closeVideoModal();
  });
}
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && videoModal && videoModal.classList.contains('show')) {
    closeVideoModal();
  }
});

/* ---------------------------------------------------------
   Certificate modal (Google Drive preview embeds)
--------------------------------------------------------- */
const certModal = $('#certModal');
const certIframe = $('#certIframe');
const certTitle = $('#certModalTitle');
const certOpenLink = $('#certOpenNewTab');
const certCloseBtn = certModal ? $('.cert-close', certModal) : null;
let lastCertFocusedEl = null;

function openCertModal(url, name) {
  if (!certModal || !certIframe || !url) return;
  lastCertFocusedEl = document.activeElement;
  certIframe.src = url;
  if (certTitle) certTitle.textContent = name || 'Certificate';
  if (certOpenLink) certOpenLink.href = url.replace('/preview', '/view');
  certModal.classList.add('show');
  certModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('no-scroll');
  if (certCloseBtn) certCloseBtn.focus();
}

function closeCertModal() {
  if (!certModal || !certIframe) return;
  certModal.classList.remove('show');
  certModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('no-scroll');
  certIframe.src = '';
  if (lastCertFocusedEl) lastCertFocusedEl.focus();
}

$$('.cert-trigger').forEach(btn => {
  if (btn.disabled) return;
  btn.addEventListener('click', () => {
    const url = btn.getAttribute('data-cert-url');
    const name = btn.getAttribute('data-cert-name');
    openCertModal(url, name);
  });
});

if (certCloseBtn) certCloseBtn.addEventListener('click', closeCertModal);
if (certModal) {
  certModal.addEventListener('click', (e) => {
    if (e.target === certModal) closeCertModal();
  });
}
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && certModal && certModal.classList.contains('show')) {
    closeCertModal();
  }
});

/* ---------------------------------------------------------
   Certification filter (only runs if filter buttons exist)
--------------------------------------------------------- */
const filterBtns = $$('.filter-btn');
if (filterBtns.length) {
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');
      $$('.cert-card').forEach(card => {
        const cat = card.getAttribute('data-category');
        card.style.display = (filter === 'all' || cat === filter) ? '' : 'none';
      });
    });
  });
}

/* ---------------------------------------------------------
   Back to top button
--------------------------------------------------------- */
const backToTop = $('#backToTop');
if (backToTop) {
  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('show', window.scrollY > 500);
  }, { passive: true });
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ---------------------------------------------------------
   Footer year
--------------------------------------------------------- */
const yearEl = $('#year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
