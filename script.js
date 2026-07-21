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
