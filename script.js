const body = document.body;
const header = document.getElementById('siteHeader');
const menuToggle = document.getElementById('menuToggle');
const siteNav = document.getElementById('siteNav');
const heroSlides = [...document.querySelectorAll('.hero__slide')];
const revealEls = document.querySelectorAll('.reveal');
const scopeItems = document.querySelectorAll('[data-scope-item]');
const faqItems = document.querySelectorAll('[data-faq-item]');
const contactForm = document.getElementById('contactForm');
const formNote = document.getElementById('formNote');

function updateHeader() {
  header.classList.toggle('is-scrolled', window.scrollY > 24);
}
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!expanded));
    body.classList.toggle('menu-open');
  });

  siteNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      body.classList.remove('menu-open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

let currentSlide = 0;
if (heroSlides.length > 1) {
  setInterval(() => {
    heroSlides[currentSlide].classList.remove('is-active');
    currentSlide = (currentSlide + 1) % heroSlides.length;
    heroSlides[currentSlide].classList.add('is-active');
  }, 4800);
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => observer.observe(el));

function toggleAccordion(items, itemToOpen) {
  items.forEach(item => {
    const isTarget = item === itemToOpen;
    const panel = item.querySelector('.scope-item__panel, .faq-item__answer');
    const trigger = item.querySelector('button');
    item.classList.toggle('is-open', isTarget);
    trigger?.setAttribute('aria-expanded', String(isTarget));
    if (panel) {
      panel.style.maxHeight = isTarget ? panel.scrollHeight + 'px' : '0px';
    }
  });
}

scopeItems.forEach(item => {
  const panel = item.querySelector('.scope-item__panel');
  if (item.classList.contains('is-open') && panel) {
    panel.style.maxHeight = panel.scrollHeight + 'px';
  }
  item.querySelector('.scope-item__trigger')?.addEventListener('click', () => {
    const isOpen = item.classList.contains('is-open');
    if (isOpen) {
      item.classList.remove('is-open');
      item.querySelector('.scope-item__trigger')?.setAttribute('aria-expanded', 'false');
      panel.style.maxHeight = '0px';
      return;
    }
    toggleAccordion(scopeItems, item);
  });
});

faqItems.forEach(item => {
  const panel = item.querySelector('.faq-item__answer');
  if (item.classList.contains('is-open') && panel) {
    panel.style.maxHeight = panel.scrollHeight + 'px';
  }
  item.querySelector('.faq-item__trigger')?.addEventListener('click', () => {
    const isOpen = item.classList.contains('is-open');
    if (isOpen) {
      item.classList.remove('is-open');
      item.querySelector('.faq-item__trigger')?.setAttribute('aria-expanded', 'false');
      panel.style.maxHeight = '0px';
      return;
    }
    toggleAccordion(faqItems, item);
  });
});

if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    formNote.textContent = 'Gotowe — to jest wersja frontowa. Po podpięciu skrzynki albo integracji formularz będzie wysyłał wiadomości normalnie.';
    formNote.classList.add('is-success');
    contactForm.reset();
  });
}

// V6 — subtle changing statement in the About section.
const aboutRotatingText = document.getElementById('aboutRotatingText');
if (aboutRotatingText) {
  const phrases = ['uspokajają.', 'porządkują.', 'zostają.', 'działają.'];
  let phraseIndex = 0;

  window.setInterval(() => {
    aboutRotatingText.classList.add('is-changing');
    window.setTimeout(() => {
      phraseIndex = (phraseIndex + 1) % phrases.length;
      aboutRotatingText.textContent = phrases[phraseIndex];
      aboutRotatingText.classList.remove('is-changing');
    }, 240);
  }, 2600);
}

// V12: scope starts closed; social devices and responsive layout refined.


// V17 premium motion refinements
const motionCardsV17 = document.querySelectorAll('.project-showcase, .scope-item');
if (motionCardsV17.length) {
  motionCardsV17.forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const rect = card.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - 0.5).toFixed(3);
      const y = ((event.clientY - rect.top) / rect.height - 0.5).toFixed(3);
      card.style.setProperty('--mx', x);
      card.style.setProperty('--my', y);
    }, { passive: true });

    card.addEventListener('pointerleave', () => {
      card.style.setProperty('--mx', 0);
      card.style.setProperty('--my', 0);
    }, { passive: true });
  });
}

const updatePremiumScrollV17 = () => {
  const y = window.scrollY || 0;
  document.documentElement.style.setProperty('--scroll-soft', Math.min(y / 900, 1).toFixed(3));
};
updatePremiumScrollV17();
window.addEventListener('scroll', updatePremiumScrollV17, { passive: true });


// ============================================================
// V9 premium motion layer — interactions only, no content/layout changes
// ============================================================
(() => {
  const root = document.documentElement;
  const body = document.body;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  body.classList.add('motion-v9');
  if (prefersReduced) {
    body.classList.add('motion-v9-ready');
    return;
  }

  // Entry sequence
  requestAnimationFrame(() => {
    body.classList.add('motion-v9-enter');
    setTimeout(() => body.classList.add('motion-v9-ready'), 1050);
  });

  // Better stagger reveals for all key sections, even elements without .reveal
  const revealItems = [
    ...document.querySelectorAll('.reveal, .project-showcase, .scope-item, .about__media, .about__content, .contact__content, .contact-form, .faq-item, .contact__step')
  ];

  revealItems.forEach((el, index) => {
    if (!el.dataset.motionDelay) {
      el.style.setProperty('--motion-delay', `${Math.min((index % 8) * 70, 420)}ms`);
    }
    el.classList.add('motion-reveal-v9');
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible-v9');
      revealObserver.unobserve(entry.target);
    });
  }, {
    threshold: 0.14,
    rootMargin: '0px 0px -8% 0px'
  });

  revealItems.forEach((el) => revealObserver.observe(el));

  // Hero progress and soft parallax
  const hero = document.querySelector('.hero');
  let scrollTicking = false;

  const updateScrollMotion = () => {
    const y = window.scrollY || 0;
    const vh = Math.max(window.innerHeight, 1);
    root.style.setProperty('--v9-scroll', Math.min(y / vh, 1).toFixed(4));
    if (hero) {
      hero.style.setProperty('--hero-y', `${Math.min(y * 0.16, 140).toFixed(1)}px`);
      hero.style.setProperty('--hero-scale', `${1 + Math.min(y / 9000, 0.035)}`);
    }
    scrollTicking = false;
  };

  const onScroll = () => {
    if (scrollTicking) return;
    scrollTicking = true;
    requestAnimationFrame(updateScrollMotion);
  };

  updateScrollMotion();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Magnetic / reactive buttons
  const magnetic = document.querySelectorAll('.button, .hero-link, .header-cta, .social-links a, .menu-toggle, .scope-item__plus, .faq-item__icon');

  magnetic.forEach((el) => {
    el.classList.add('magnetic-v9');

    el.addEventListener('pointermove', (event) => {
      const rect = el.getBoundingClientRect();
      const mx = (event.clientX - rect.left) / rect.width - 0.5;
      const my = (event.clientY - rect.top) / rect.height - 0.5;
      el.style.setProperty('--mag-x', `${mx * 10}px`);
      el.style.setProperty('--mag-y', `${my * 8}px`);
      el.style.setProperty('--mag-rx', `${my * -2.4}deg`);
      el.style.setProperty('--mag-ry', `${mx * 3.2}deg`);
      el.classList.add('is-magnetic');
    }, { passive: true });

    el.addEventListener('pointerleave', () => {
      el.classList.remove('is-magnetic');
      el.style.setProperty('--mag-x', '0px');
      el.style.setProperty('--mag-y', '0px');
      el.style.setProperty('--mag-rx', '0deg');
      el.style.setProperty('--mag-ry', '0deg');
    }, { passive: true });
  });

  // Premium tilt / light tracking on large cards
  const reactiveCards = document.querySelectorAll('.project-showcase, .scope-item, .social-showcase, .faq, .contact-form, .about__media');

  reactiveCards.forEach((card) => {
    card.classList.add('reactive-card-v9');

    card.addEventListener('pointermove', (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      card.style.setProperty('--rx', `${(0.5 - y) * 2.2}deg`);
      card.style.setProperty('--ry', `${(x - 0.5) * 2.8}deg`);
      card.style.setProperty('--spot-x', `${x * 100}%`);
      card.style.setProperty('--spot-y', `${y * 100}%`);
      card.classList.add('is-reactive');
    }, { passive: true });

    card.addEventListener('pointerleave', () => {
      card.classList.remove('is-reactive');
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
      card.style.setProperty('--spot-x', '50%');
      card.style.setProperty('--spot-y', '50%');
    }, { passive: true });
  });

  // Smooth image parallax inside project cards
  const projectCards = [...document.querySelectorAll('.project-showcase')];

  const updateProjectDepth = () => {
    const vh = window.innerHeight || 1;
    projectCards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const progress = (center - vh / 2) / vh;
      card.style.setProperty('--depth-y', `${Math.max(-1, Math.min(1, progress)) * -24}px`);
    });
  };

  updateProjectDepth();
  window.addEventListener('scroll', () => requestAnimationFrame(updateProjectDepth), { passive: true });

  // Character split for selected huge headings — subtle, not destructive
  const splitTargets = document.querySelectorAll('.projects__intro h2, .scope__heading h2, .contact__content h2, .manifest__content h2');
  splitTargets.forEach((heading) => {
    if (heading.dataset.splitV9) return;
    heading.dataset.splitV9 = 'true';
    const text = heading.textContent.trim();
    heading.setAttribute('aria-label', text);
    heading.innerHTML = text.split(' ').map((word, wi) => (
      `<span class="word-v9" style="--word-delay:${wi * 55}ms">${word}</span>`
    )).join(' ');
  });

  // Watch split headings after rewrite
  const wordHeadings = document.querySelectorAll('[data-split-v9="true"]');
  const wordObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('words-in-v9');
      wordObserver.unobserve(entry.target);
    });
  }, { threshold: 0.22 });
  wordHeadings.forEach((h) => wordObserver.observe(h));

  // Soft loading state when navigating same-page anchors
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', () => {
      body.classList.add('motion-v9-anchor');
      setTimeout(() => body.classList.remove('motion-v9-anchor'), 620);
    });
  });
})();


// ============================================================
// V11 intro + scope readability lock
// ============================================================
(() => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isHome = document.querySelector('.hero') && !document.body.classList.contains('subpage');

  document.querySelectorAll('.scope-item').forEach((item) => {
    const lockReadable = () => {
      if (item.classList.contains('is-open')) {
        item.classList.add('scope-readable-v11');
      } else {
        item.classList.remove('scope-readable-v11');
      }
    };

    lockReadable();
    item.querySelector('.scope-item__trigger')?.addEventListener('click', () => {
      requestAnimationFrame(lockReadable);
      setTimeout(lockReadable, 80);
    });
  });
  // V12: intro removed by request — page loads directly into hero.
})();
