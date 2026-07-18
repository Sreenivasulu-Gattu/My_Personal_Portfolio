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
// Delay scroll by 520ms so the overlay fully closes first (matches 500ms CSS transition)
mobLinks.forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = link.getAttribute('href');

    // Flash the tapped link so user sees the selection
    link.style.transition = 'background 0.2s, color 0.2s';
    link.style.background  = 'rgba(220,20,60,0.25)';
    link.style.color        = '#ffffff';

    closeMobileMenu();

    // Navigate after overlay closes
    setTimeout(() => {
      link.style.background = '';
      link.style.color      = '';
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        const headerH = document.getElementById('header').offsetHeight;
        const top = targetEl.getBoundingClientRect().top + window.scrollY - headerH;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }, 520);
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
// SMOOTH SCROLL for desktop nav links (fallback polyfill)
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
