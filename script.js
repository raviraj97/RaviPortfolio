document.documentElement.classList.add('js');

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealItems = document.querySelectorAll('.reveal');

if (!reduceMotion && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries, currentObserver) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        currentObserver.unobserve(entry.target);
      }
    }
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
  revealItems.forEach(item => observer.observe(item));
} else {
  revealItems.forEach(item => item.classList.add('is-visible'));
}

const impactStrip = document.querySelector('.impact-strip');
if (impactStrip && !reduceMotion && 'IntersectionObserver' in window) {
  impactStrip.querySelectorAll('[data-count-to]').forEach(number => {
    number.textContent = number.dataset.countFrom;
  });
  const impactObserver = new IntersectionObserver((entries, observer) => {
    if (!entries[0].isIntersecting) return;
    observer.disconnect();
    impactStrip.querySelectorAll('[data-count-to]').forEach((number, index) => {
      const start = Number(number.dataset.countFrom);
      const end = Number(number.dataset.countTo);
      const duration = 1100;
      const delay = index * 140;
      const began = performance.now() + delay;
      number.closest('.impact').classList.add('is-counting');
      function step(now) {
        const progress = Math.max(0, Math.min(1, (now - began) / duration));
        const eased = 1 - Math.pow(1 - progress, 3);
        number.textContent = Math.round(start + (end - start) * eased);
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }, { threshold: 0.25 });
  impactObserver.observe(impactStrip);
}

const pageProgress = document.querySelector('.page-progress span');
const journeyLine = document.querySelector('.journey-line');
const journeyFill = document.querySelector('.journey-line__fill');
let scrollTicking = false;

function updateScrollMotion() {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  pageProgress.style.width = maxScroll > 0 ? `${Math.min(100, window.scrollY / maxScroll * 100)}%` : '0%';

  const lineTop = journeyLine.getBoundingClientRect().top + window.scrollY;
  const lineHeight = journeyLine.offsetHeight;
  const reached = window.scrollY + window.innerHeight * 0.56 - lineTop;
  journeyFill.style.height = `${Math.max(0, Math.min(lineHeight, reached))}px`;
  scrollTicking = false;
}

window.addEventListener('scroll', () => {
  if (!scrollTicking) {
    window.requestAnimationFrame(updateScrollMotion);
    scrollTicking = true;
  }
}, { passive: true });
window.addEventListener('resize', updateScrollMotion, { passive: true });
updateScrollMotion();

if (!reduceMotion && window.matchMedia('(pointer: fine)').matches) {
  const hero = document.querySelector('.hero');
  const sculpture = document.querySelector('.hero__sculpture');
  hero.addEventListener('pointermove', event => {
    const rect = hero.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - .5;
    const y = (event.clientY - rect.top) / rect.height - .5;
    sculpture.style.setProperty('--pointer-x', `${x * 18}px`);
    sculpture.style.setProperty('--pointer-y', `${y * 18}px`);
  });
  hero.addEventListener('pointerleave', () => {
    sculpture.style.setProperty('--pointer-x', '0px');
    sculpture.style.setProperty('--pointer-y', '0px');
  });
}

document.querySelector('#year').textContent = new Date().getFullYear();
