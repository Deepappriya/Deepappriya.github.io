// Small helper utilities
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

/* Mobile menu toggle */
const menuBtn = document.getElementById('menu-btn');
const nav = document.querySelector('.nav ul');

if(menuBtn){
  menuBtn.addEventListener('click', () => {
    const expanded = menuBtn.getAttribute('aria-expanded') === 'true';
    menuBtn.setAttribute('aria-expanded', String(!expanded));
    nav.style.display = expanded ? 'none' : 'flex';
  });
}

/* Smooth scroll for internal links */
$$('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const href = a.getAttribute('href');
    if(!href || href === '#') return;
    if(href.startsWith('#')){
      e.preventDefault();
      const el = document.querySelector(href);
      if(el) el.scrollIntoView({behavior:'smooth', block:'start'});
      // close mobile nav if open
      if(window.innerWidth <= 1060 && nav) nav.style.display = 'none';
    }
  });
});

/* Reveal on scroll */
const reveals = $$('.reveal');
const revealOnScroll = () => {
  const viewport = window.innerHeight;
  reveals.forEach(el => {
    const rect = el.getBoundingClientRect();
    if(rect.top < viewport - 60){
      el.classList.add('show');
    }
  });
};
window.addEventListener('scroll', revealOnScroll, {passive:true});
window.addEventListener('load', revealOnScroll);

/* Animate skill bars (they are already width-set inline; just ensure they animate when shown) */
const skillBars = $$('.skill .bar > div');
const animateBars = () => {
  skillBars.forEach(b => {
    const parent = b.closest('.reveal');
    if(parent && parent.classList.contains('show')){
      b.style.transform = 'none';
    }
  });
};
window.addEventListener('scroll', animateBars);
window.addEventListener('load', () => {
  setTimeout(()=> {
    revealOnScroll();
    animateBars();
  }, 300);
});

/* Set current year */
const yearSpan = document.getElementById('year');
if(yearSpan) yearSpan.textContent = new Date().getFullYear();

/* Accessibility: Close mobile nav when clicking outside */
document.addEventListener('click', (e) => {
  if(window.innerWidth <= 1060){
    if(!e.target.closest('.nav-wrap') && nav && nav.style.display === 'flex'){
      nav.style.display = 'none';
      if(menuBtn) menuBtn.setAttribute('aria-expanded', 'false');
    }
  }
});
// Animate skill bars when visible
const skillFills = document.querySelectorAll('.fill');

function animateSkills() {
  skillFills.forEach(fill => {
    const rect = fill.getBoundingClientRect();
    const inView = rect.top < window.innerHeight - 80;
    if (inView && fill.style.width === "0px") {
      fill.style.width = fill.getAttribute('data-width');
    }
  });
}

window.addEventListener('scroll', animateSkills);
window.addEventListener('load', animateSkills);

/* Video modal logic */
// Elements
const modal = document.getElementById('videoModal');
const iframe = document.getElementById('demoVideo');
const closeBtn = modal ? modal.querySelector('.video-close') : null;
let lastFocusedElement = null;

// Open modal when any .video-btn clicked
document.querySelectorAll('.video-btn').forEach(btn => {
  btn.addEventListener('click', function(e){
    e.preventDefault();
    const videoUrl = this.getAttribute('data-video');
    if(!videoUrl) return;

    // store last focused element so we can restore focus after closing
    lastFocusedElement = document.activeElement;

    // set iframe src with autoplay param (YouTube supports ?autoplay=1)
    // If URL already has query params, append with &
    const autoplayUrl = videoUrl + (videoUrl.includes('?') ? '&' : '?') + 'autoplay=1&rel=0&modestbranding=1';
    iframe.src = autoplayUrl;

    // show modal
    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');

    // move focus to close button for accessibility
    if (closeBtn) closeBtn.focus();
  });
});

// Close helper
function closeVideoModal() {
  modal.classList.remove('show');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('no-scroll');

  // stop video — remove src to fully stop playback and free resources
  iframe.src = '';

  // restore focus
  if (lastFocusedElement) lastFocusedElement.focus();
}

// Close on close button
if(closeBtn){
  closeBtn.addEventListener('click', (e) => { e.preventDefault(); closeVideoModal(); });
}

// Close when clicking outside the video frame
window.addEventListener('click', (e) => {
  if(!modal.classList.contains('show')) return;
  // if clicked on modal background, not on content
  if(e.target === modal) closeVideoModal();
});

// Close on Escape key
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.classList.contains('show')) {
    closeVideoModal();
  }
});
