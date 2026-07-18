/* ==============================
   Portfolio.js — Sreenivasulu Gattu
   ============================== */

// ================================================================
// THEME TOGGLE  (dark ↔ light)
// ================================================================
const html = document.documentElement;
const themeToggleBtn = document.getElementById('theme-toggle');

// Load saved theme or default to dark
const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
html.setAttribute('data-theme', savedTheme);

themeToggleBtn.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('portfolio-theme', next);
});


// ================================================================
// MOBILE NAV OVERLAY  (visibility-based for smooth transition)
// ================================================================
const hamburger   = document.getElementById('hamburger');
const navOverlay  = document.getElementById('mobile-nav-overlay');
const mobLinks    = document.querySelectorAll('.mob-link');

// Add "Tap to close" hint if not already in HTML
if (!navOverlay.querySelector('.mob-close-hint')) {
  const hint = document.createElement('p');
  hint.className = 'mob-close-hint';
  hint.textContent = 'Tap outside to close';
  navOverlay.appendChild(hint);
}

function openMobileMenu() {
  navOverlay.classList.add('open');
  hamburger.classList.add('active');
  hamburger.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
  navOverlay.classList.remove('open');
  hamburger.classList.remove('active');
  hamburger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

// Toggle on hamburger click
hamburger.addEventListener('click', (e) => {
  e.stopPropagation();
  if (navOverlay.classList.contains('open')) {
    closeMobileMenu();
  } else {
    openMobileMenu();
  }
});

// Close + smooth scroll when mobile nav link tapped
// Ripple plays first (200ms), overlay closes (500ms), then scroll begins
mobLinks.forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = link.getAttribute('href');
    const li = link.parentElement;

    // ---- 1. Ripple burst on the tapped item ----
    const ripple = document.createElement('span');
    ripple.className = 'mob-link-ripple';
    // Position ripple at touch/click point relative to the li
    const rect = li.getBoundingClientRect();
    const cx = (e.clientX || rect.left + rect.width / 2) - rect.left;
    const cy = (e.clientY || rect.top  + rect.height / 2) - rect.top;
    ripple.style.left = cx + 'px';
    ripple.style.top  = cy + 'px';
    li.style.position = 'relative';
    li.style.overflow = 'hidden';
    li.appendChild(ripple);
    // Clean up ripple element after animation
    setTimeout(() => ripple.remove(), 700);

    // ---- 2. Glow the link text ----
    link.style.transition = 'color 0.2s, letter-spacing 0.2s';
    link.style.color = '#fff';
    link.style.letterSpacing = '0.18em';

    // ---- 3. Close overlay (500ms transition) ----
    setTimeout(() => closeMobileMenu(), 200);

    // ---- 4. Smooth scroll after overlay is gone ----
    setTimeout(() => {
      link.style.color = '';
      link.style.letterSpacing = '';
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        const headerH = document.getElementById('header').offsetHeight;
        const top = targetEl.getBoundingClientRect().top + window.scrollY - headerH;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }, 720);
  });
});

// Close overlay when tapping its own background
navOverlay.addEventListener('click', (e) => {
  if (e.target === navOverlay) closeMobileMenu();
});

// Close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && navOverlay.classList.contains('open')) {
    closeMobileMenu();
  }
});


// ================================================================
// HEADER SCROLL EFFECT
// ================================================================
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });


// ================================================================
// TYPED ROLE ANIMATION
// ================================================================
const roles = [
  'Full-Stack Developer',
  'Angular & Ionic Developer',
  'Python & Django Expert',
  'React.js Developer',
  'REST API Specialist',
  'AWS Cloud Enthusiast',
];

let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typedEl = document.getElementById('typed-role');

function typeRole() {
  if (!typedEl) return;
  const current = roles[roleIndex];

  typedEl.textContent = isDeleting
    ? current.substring(0, charIndex - 1)
    : current.substring(0, charIndex + 1);

  isDeleting ? charIndex-- : charIndex++;

  let delay = isDeleting ? 50 : 85;

  if (!isDeleting && charIndex === current.length) {
    delay = 1800;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    delay = 400;
  }

  setTimeout(typeRole, delay);
}
setTimeout(typeRole, 900);


// ================================================================
// SCROLL REVEAL (IntersectionObserver)
// ================================================================
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
);

document.querySelectorAll(
  '.glass-card, .timeline-content, .hero-text, .hero-photo-wrapper, .section-header'
).forEach((el) => {
  el.classList.add('reveal-target');
  revealObserver.observe(el);
});


// ================================================================
// ACTIVE NAV LINK HIGHLIGHT ON SCROLL
// ================================================================
const sections = document.querySelectorAll('section[id]');
const desktopLinks = document.querySelectorAll('#nav-menu .nav-link');

function updateActiveNav() {
  const scrollY = window.scrollY + 90;
  sections.forEach((section) => {
    const top    = section.offsetTop;
    const height = section.offsetHeight;
    const id     = section.getAttribute('id');
    const link   = document.querySelector(`#nav-menu .nav-link[href="#${id}"]`);
    if (link) {
      if (scrollY >= top && scrollY < top + height) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    }
  });
}

window.addEventListener('scroll', updateActiveNav, { passive: true });
updateActiveNav();


// ================================================================
// SMOOTH SCROLL for desktop nav links
// ================================================================
desktopLinks.forEach((link) => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const headerH = header.offsetHeight;
        const top = target.getBoundingClientRect().top + window.scrollY - headerH;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }
  });
});


// ================================================================
// MOBILE PROJECT CARDS — inject always-visible action buttons
// ================================================================
function injectMobileProjectButtons() {
  // Only run on mobile widths
  if (window.innerWidth > 767) return;

  document.querySelectorAll('.project-card').forEach((card) => {
    // Skip if already injected
    if (card.querySelector('.project-mobile-actions')) return;

    // Gather links from the hidden overlay
    const overlayLinks = card.querySelectorAll('.project-links a.proj-btn');
    if (!overlayLinks.length) return;

    // Build the action strip
    const strip = document.createElement('div');
    strip.className = 'project-mobile-actions';

    overlayLinks.forEach((origBtn) => {
      const btn = document.createElement('a');
      btn.href        = origBtn.href;
      btn.target      = origBtn.target || '_blank';
      btn.rel         = 'noopener noreferrer';
      btn.textContent = origBtn.textContent.trim();
      btn.className   = 'mob-proj-btn' + (origBtn.classList.contains('disabled') ? ' disabled' : '');
      if (origBtn.classList.contains('disabled')) {
        btn.removeAttribute('href');
        btn.style.pointerEvents = 'none';
      }
      strip.appendChild(btn);
    });

    // Insert the strip right after the image wrapper
    const imgWrap = card.querySelector('.project-img-wrap');
    if (imgWrap && imgWrap.nextSibling) {
      card.insertBefore(strip, imgWrap.nextSibling);
    } else if (imgWrap) {
      card.appendChild(strip);
    }
  });
}

// Run on load
injectMobileProjectButtons();

// Also re-run if window resizes into mobile range
window.addEventListener('resize', () => {
  if (window.innerWidth <= 767) {
    injectMobileProjectButtons();
  }
}, { passive: true });
